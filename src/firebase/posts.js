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
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where,
  limit
} from 'firebase/firestore';
import { sanitizeInput } from '../utils/sanitize';

// References
const postsRef = collection(db, 'posts');

// Local cache for user data to avoid redundant Firestore calls (N+1 problem)
const userCache = new Map();

/**
 * Helper to fetch latest user data with caching
 */
const getLatestAuthorData = async (authorId) => {
  if (!authorId || authorId.startsWith('guest_') || authorId === 'anonymous') return null;

  // Return from cache if available
  if (userCache.has(authorId)) {
    return userCache.get(authorId);
  }

  try {
    const userRef = doc(db, 'users', authorId);
    const pfpRef = doc(db, 'pfp', authorId);
    const [userSnap, pfpSnap] = await Promise.all([getDoc(userRef), getDoc(pfpRef)]);

    const result = {
      name: userSnap.exists() ? userSnap.data().displayName : null,
      avatar: pfpSnap.exists() ? pfpSnap.data().pfps : null
    };

    // Store in cache
    userCache.set(authorId, result);
    return result;
  } catch (err) {
    console.warn("Author data fetch error:", err);
    return null;
  }
};

/**
 * Creates a new post in Firestore.
 */
export const createPost = async (postData) => {
  try {
    const safeContent = sanitizeInput(postData.content);

    const docRef = await addDoc(postsRef, {
      ...postData,
      content: safeContent,
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
 */
export const subscribeToPosts = (callback) => {
  // Limit to 8 posts for fastest LCP - fewer base64 strings for React to process
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(8));

  return onSnapshot(q, async (snapshot) => {
    // Phase 1: Immediate callback with raw data for instant render
    const initialPosts = snapshot.docs.map(postDoc => {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    // Provide initial data immediately to stop LCP clock
    callback(initialPosts);

    // Phase 2: Background hydration of author details (cached)
    const hydratedPostsPromises = snapshot.docs.map(async (postDoc) => {
      const data = postDoc.data();
      const authorInfo = await getLatestAuthorData(data.authorId);

      return {
        id: postDoc.id,
        ...data,
        authorName: authorInfo?.name || data.authorName,
        authorAvatar: authorInfo?.avatar || data.authorAvatar,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    const hydratedPosts = await Promise.all(hydratedPostsPromises);
    callback(hydratedPosts);
  }, (error) => {
    if (error.code !== 'permission-denied') {
      console.error("Error subscribing to posts: ", error);
    }
  });
};

/**
 * Subscribes to posts created by a specific user.
 */
export const subscribeToUserPosts = (userId, callback) => {
  const q = query(
    postsRef,
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(15)
  );

  return onSnapshot(q, async (snapshot) => {
    // Immediate render with raw data
    const initialPosts = snapshot.docs.map(postDoc => {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
    callback(initialPosts);

    // Hydrate author details in background
    const hydratedPostsPromises = snapshot.docs.map(async (postDoc) => {
      const data = postDoc.data();
      const authorInfo = await getLatestAuthorData(data.authorId);

      return {
        id: postDoc.id,
        ...data,
        authorName: authorInfo?.name || data.authorName,
        authorAvatar: authorInfo?.avatar || data.authorAvatar,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    const hydratedPosts = await Promise.all(hydratedPostsPromises);
    callback(hydratedPosts);
  }, (error) => {
    if (error.code !== 'permission-denied') {
      console.error("Error subscribing to user posts: ", error);
    }
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
    const safeText = sanitizeInput(commentData.text);
    const commentsRef = collection(db, 'posts', postId, 'comments');

    await addDoc(commentsRef, {
      ...commentData,
      text: safeText,
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
      // Skip for anonymous bots
      if (data.authorId && !data.authorId.startsWith('guest_') && data.authorId !== 'anonymous') {
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
    if (error.code !== 'permission-denied') {
      console.error("Error subscribing to comments: ", error);
    }
  });
};

/**
 * Deletes a post from Firestore.
 */
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};

/**
 * Updates a post's content in Firestore.
 */
export const updatePost = async (postId, newContent) => {
  try {
    const safeContent = sanitizeInput(newContent);
    const postRef = doc(db, 'posts', postId);

    await updateDoc(postRef, {
      content: safeContent,
      updatedAt: serverTimestamp(),
      isEdited: true
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
};