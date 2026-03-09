import { db } from './config';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';

const newsRef = collection(db, 'news');
const metadataRef = doc(db, 'system', 'news_metadata');

/**
 * Syncs an array of news items from Steam API to Firestore.
 * Uses the Steam 'gid' as the document ID to prevent duplicates.
 * @param {Array} newsItems Array of news objects from Steam API
 */
export const syncNewsWithFirestore = async (newsItems) => {
    try {
        const promises = newsItems.map(item => {
            const docRef = doc(db, 'news', item.id);
            return setDoc(docRef, {
                ...item,
                syncedAt: serverTimestamp(),
            }, { merge: true });
        });

        await Promise.all(promises);

        // Update global sync metadata
        await setDoc(metadataRef, {
            lastSyncTime: serverTimestamp()
        }, { merge: true });

        console.log(`Successfully synced ${newsItems.length} news items to Firestore.`);
    } catch (error) {
        console.error("Error syncing news to Firestore: ", error);
        throw error;
    }
};

/**
 * Gets the last sync time from metadata.
 * @returns {Promise<number>} Timestamp in milliseconds
 */
export const getLastSyncTime = async () => {
    try {
        const snap = await getDoc(metadataRef);
        if (snap.exists()) {
            return snap.data().lastSyncTime?.toMillis() || 0;
        }
        return 0;
    } catch (error) {
        console.error("Error getting last sync time: ", error);
        return 0;
    }
};

/**
 * Fetches news from Firestore 'news' collection.
 * @param {number} count Number of items to fetch
 * @returns {Promise<Array>} Array of news items
 */
export const getNewsFromFirestore = async (count = 10) => {
    try {
        const q = query(newsRef, orderBy('date', 'desc'), limit(count));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (error) {
        console.error("Error fetching news from Firestore: ", error);
        return [];
    }
};

/**
 * Subscribes to real-time news updates from Firestore.
 * @param {Function} callback Callback with news array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNews = (callback, count = 10) => {
    const q = query(newsRef, orderBy('date', 'desc'), limit(count));

    return onSnapshot(q, (snapshot) => {
        const news = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        callback(news);
    }, (error) => {
        console.error("Error subscribing to news: ", error);
    });
};
