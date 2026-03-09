import { db } from './config';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';

// References
const postsRef = collection(db, 'posts');

/**
 * Creates a new post in Firestore.
 * @param {Object} postData { text: string, imageUrl: string, authorId: string, authorName: string, authorAvatar: string }
 */
export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

/**
 * Subscribes to real-time updates for posts.
 * @param {Function} callback Function to call with updated posts array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToPosts = (callback) => {
  const q = query(postsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, async (snapshot) => {
    const postsPromises = snapshot.docs.map(async (postDoc) => {
      const data = postDoc.data();
      let currentAvatar = data.authorAvatar;
      let currentName = data.authorName;

      // Ensure we get the latest avatar/name for the author if they updated it
      if (data.authorId) {
        try {
          const userRef = doc(db, 'users', data.authorId);
          const pfpRef = doc(db, 'pfp', data.authorId);
          const [userSnap, pfpSnap] = await Promise.all([getDoc(userRef), getDoc(pfpRef)]);

          if (userSnap.exists() && userSnap.data().displayName) {
            currentName = userSnap.data().displayName;
          }
          if (pfpSnap.exists() && pfpSnap.data().pfps) {
            currentAvatar = pfpSnap.data().pfps;
          }
        } catch (err) {
          console.error("Error fetching latest user details for post:", err);
        }
      }

      return {
        id: postDoc.id,
        ...data,
        authorName: currentName,
        authorAvatar: currentAvatar,
        // Convert Firestore timestamp to serializable format
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    const posts = await Promise.all(postsPromises);
    callback(posts);
  }, (error) => {
    console.error("Error subscribing to posts: ", error);
  });
};

/**
 * Toggles a like on a post for a specific user.
 */
export const toggleLikePost = async (postId, userId, isCurrentlyLiked) => {
  const postRef = doc(db, 'posts', postId);

  try {
    if (isCurrentlyLiked) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(userId),
        likes: increment(-1)
      });
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(userId),
        likes: increment(1)
      });
    }
  } catch (error) {
    console.error("Error toggling like: ", error);
    throw error;
  }
};

/**
 * Adds a comment to a specific post.
 */
export const addComment = async (postId, commentData) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp()
    });

    // Increment the comments counter on the post document
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: increment(1)
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

/**
 * Subscribes to comments for a specific post.
 */
export const subscribeToComments = (postId, callback) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, async (snapshot) => {
    const commentsPromises = snapshot.docs.map(async (commentDoc) => {
      const data = commentDoc.data();
      let currentAvatar = data.authorAvatar;
      let currentName = data.authorName;

      // Ensure latest user details
      if (data.authorId) {
        try {
          const userRef = doc(db, 'users', data.authorId);
          const pfpRef = doc(db, 'pfp', data.authorId);
          const [userSnap, pfpSnap] = await Promise.all([getDoc(userRef), getDoc(pfpRef)]);

          if (userSnap.exists() && userSnap.data().displayName) {
            currentName = userSnap.data().displayName;
          }
          if (pfpSnap.exists() && pfpSnap.data().pfps) {
            currentAvatar = pfpSnap.data().pfps;
          }
        } catch (err) {
          // Skip if error
        }
      }

      return {
        id: commentDoc.id,
        ...data,
        authorName: currentName,
        authorAvatar: currentAvatar,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    const comments = await Promise.all(commentsPromises);
    callback(comments);
  }, (error) => {
    console.error("Error subscribing to comments: ", error);
  });
};