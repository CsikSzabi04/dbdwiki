import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';

const roomsRef = collection(db, 'rooms');

// Create a new room
export const createRoom = async (user, userProfile, roomName, password) => {
  try {
    const hostData = {
      uid: user.uid,
      displayName: userProfile?.displayName || user.email.split('@')[0],
      photoURL: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
    };

    const isPrivate = !!password;
    const inviteCode = Math.random().toString(36).substring(2, 10); // Generates a random alphanumeric string

    const docRef = await addDoc(roomsRef, {
      hostId: user.uid,
      hostData: hostData,
      name: roomName || `${hostData.displayName}'s Session`,
      players: [hostData], // host is the first player
      playerCount: 1,
      createdAt: serverTimestamp(),
      status: 'open',
      isPrivate: isPrivate,
      password: isPrivate ? password : null,
      inviteCode: inviteCode
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

// Join a room (with password parsing)
export const joinRoom = async (roomId, user, userProfile, inputPassword = null, inputInviteCode = null) => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomDocRef);
    
    if (!roomSnap.exists()) throw new Error("Room does not exist.");
    
    const roomData = roomSnap.data();
    
    // Check if the user is ALREADY in the room
    const isAlreadyIn = roomData.players.some(p => p.uid === user.uid);
    if (isAlreadyIn) return; // Silent success if already in

    // Verify Password or Invite Code if Private
    if (roomData.isPrivate && roomData.hostId !== user.uid) {
        // If it's private, we need either the correct password OR the correct invite code
        const isPasswordCorrect = inputPassword === roomData.password;
        const isInviteCorrect = inputInviteCode === roomData.inviteCode;
        
        if (!isPasswordCorrect && !isInviteCorrect) {
            throw new Error("INVALID_PASSWORD");
        }
    }

    const maxPlayers = roomData.isPrivate ? 5 : 4;
    if (roomData.playerCount >= maxPlayers) throw new Error("Room is full.");

    const playerData = {
      uid: user.uid,
      displayName: userProfile?.displayName || user.email.split('@')[0],
      photoURL: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
    };

    const newPlayerCount = roomData.playerCount + 1;
    const newStatus = newPlayerCount >= 5 ? 'full' : 'open';

    await updateDoc(roomDocRef, {
      players: arrayUnion(playerData),
      playerCount: newPlayerCount,
      status: newStatus
    });
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

// Leave a room
export const leaveRoom = async (roomId, user) => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomDocRef);
    
    if (!roomSnap.exists()) return;
    
    const roomData = roomSnap.data();
    const playerToRemove = roomData.players.find(p => p.uid === user.uid);
    
    if (!playerToRemove) return;

    // Simply remove the user from players, regardless if they are host. The room persists.
    const newPlayerCount = roomData.playerCount - 1;
    await updateDoc(roomDocRef, {
      players: arrayRemove(playerToRemove),
      playerCount: newPlayerCount,
      status: 'open' // re-open if it was full
    });
  } catch (error) {
    console.error("Error leaving room:", error);
    throw error;
  }
};

// Update Room Password
export const updateRoomPassword = async (roomId, hostUid, newPassword) => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomDocRef);
    if (!roomSnap.exists()) throw new Error("Room missing.");
    if (roomSnap.data().hostId !== hostUid) throw new Error("Unauthorized.");

        const isPrivate = !!newPassword;
        await updateDoc(roomDocRef, {
            isPrivate: isPrivate,
            password: isPrivate ? newPassword : null
        });
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Completely Delete a Room (Host Action)
export const deleteRoom = async (roomId, hostUid) => {
    try {
        const roomDocRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomDocRef);
        if (roomSnap.exists() && roomSnap.data().hostId === hostUid) {
            await deleteDoc(roomDocRef);
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        throw error;
    }
};

// Subscribe to active rooms
export const subscribeToRooms = (callback) => {
  const q = query(
    roomsRef,
    where('status', 'in', ['open', 'full']),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rooms);
  }, (error) => {
    console.error("Error fetching rooms:", error);
  });
};

// Subscribe to a single room
export const subscribeToRoom = (roomId, callback) => {
  const roomDocRef = doc(db, 'rooms', roomId);
  return onSnapshot(roomDocRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error fetching single room:", error);
  });
};

// Send a message in a room
export const sendRoomMessage = async (roomId, user, userProfile, text) => {
  try {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    
    // basic sanitize
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (!safeText.trim()) return;

    await addDoc(messagesRef, {
      uid: user.uid,
      displayName: userProfile?.displayName || user.email.split('@')[0],
      photoURL: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      text: safeText,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending room message:", error);
    throw error;
  }
};

// Subscribe to room messages
export const subscribeToRoomMessages = (roomId, callback) => {
  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    callback(messages);
  }, (error) => {
    console.error("Error fetching room messages:", error);
  });
};
