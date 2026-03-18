import { db } from './config';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    getCountFromServer
} from 'firebase/firestore';

/**
 * Toggles the follow status (Follow / Unfollow).
 * 
 * @param {string} followerId - UID of the current user
 * @param {string} followingId - UID of the user being targeted
 * @returns {boolean} - Returns true if the user is now following, false if unfollowed
 */
export const toggleFollow = async (followerId, followingId) => {
    if (!followerId || !followingId || followerId === followingId) {
        throw new Error("Invalid follow operation");
    }

    const followDocId = `${followerId}_${followingId}`;
    const followRef = doc(db, 'follows', followDocId);

    // Check if currently following
    const q = query(collection(db, 'follows'), where('followerId', '==', followerId), where('followingId', '==', followingId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Follow
        await setDoc(followRef, {
            followerId,
            followingId,
            createdAt: new Date().toISOString()
        });
        return true; // Now following
    } else {
        // Unfollow
        await deleteDoc(followRef);
        return false; // Not following anymore
    }
};

/**
 * Checks if the current user is following the target user.
 */
export const checkIfFollowing = async (followerId, followingId) => {
    if (!followerId || !followingId) return false;

    // Using string matching for docId is faster than querying, 
    // but the fallback query is safer if docId wasn't deterministic in the past.
    const followDocId = `${followerId}_${followingId}`;
    const q = query(collection(db, 'follows'), where('followerId', '==', followerId), where('followingId', '==', followingId));

    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

/**
 * Get follower and following counts for a specific user.
 */
export const getFollowStats = async (userId) => {
    if (!userId) return { followersCount: 0, followingCount: 0 };

    try {
        const followsColl = collection(db, 'follows');

        // Count how many people follow this user
        const followersQuery = query(followsColl, where('followingId', '==', userId));
        const followersSnapshot = await getCountFromServer(followersQuery);
        const followersCount = followersSnapshot.data().count;

        // Count how many people this user is following
        const followingQuery = query(followsColl, where('followerId', '==', userId));
        const followingSnapshot = await getCountFromServer(followingQuery);
        const followingCount = followingSnapshot.data().count;

        return {
            followersCount,
            followingCount
        };
    } catch (error) {
        console.error("Error getting follow stats:", error);
        return { followersCount: 0, followingCount: 0 };
    }
};
