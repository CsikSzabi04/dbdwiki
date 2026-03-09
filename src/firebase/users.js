import { db } from './config'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
    followers: 0,
    admin: false
  })
}

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId)
  const pfpRef = doc(db, 'pfp', userId)

  // Fetch both user profile and pfp in parallel
  const [userSnap, pfpSnap] = await Promise.all([
    getDoc(userRef),
    getDoc(pfpRef)
  ])

  if (userSnap.exists()) {
    const userData = { id: userSnap.id, ...userSnap.data() }

    // Override photoURL with the one from pfp collection if it exists
    if (pfpSnap.exists() && pfpSnap.data().pfps) {
      userData.photoURL = pfpSnap.data().pfps
    }

    return userData
  } else {
    return null
  }
}

export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, updates, { merge: true })
}

export const updateUserAvatar = async (userId, photoURL, email = null) => {
  // Save to the custom 'pfp' collection with email field
  const pfpRef = doc(db, 'pfp', userId)
  const pfpData = { pfps: photoURL }
  if (email) {
    pfpData.email = email
  }
  await setDoc(pfpRef, pfpData, { merge: true })

  // Also try to update the 'users' collection for fallback, but ignore errors if rules block it
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, { photoURL }, { merge: true })
  } catch (err) {
    console.debug("Users collection update skipped/failed:", err.message)
  }
}

export const getUserByUsername = async (username) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('username', '==', username))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  } else {
    return null
  }
}