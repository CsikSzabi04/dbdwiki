import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp, addDoc } from 'firebase/firestore';

// Initialize Firebase for the serverless function environment
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
    // Only allow GET requests (standard for Cron)
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Starting automated news sync...');

        // 1. Fetch news from Steam API
        const STEAM_APP_ID = '381210'; // Dead by Daylight
        const steamUrl = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${STEAM_APP_ID}&count=15&maxlength=1000&format=json`;
        
        const response = await fetch(steamUrl);
        if (!response.ok) throw new Error(`Steam API error: ${response.statusText}`);
        
        const data = await response.json();
        const rawItems = data.appnews?.newsitems || [];

        if (rawItems.length === 0) {
            return res.status(200).json({ status: 'done', message: 'No news found on Steam' });
        }

        // 2. Format items
        const newsItems = rawItems.map(item => ({
            id: item.gid,
            title: item.title,
            url: item.url,
            author: item.author,
            contents: item.contents,
            feedlabel: item.feedlabel,
            date: item.date, // Unix timestamp from Steam
            external: true
        }));

        // 3. Sync with Firestore
        let newCount = 0;
        const newsRef = collection(db, 'news');
        const metadataRef = doc(db, 'system', 'news_metadata');

        for (const item of newsItems) {
            const docRef = doc(db, 'news', item.id);
            const snap = await getDoc(docRef);
            
            if (!snap.exists()) {
                newCount++;
                await setDoc(docRef, {
                    ...item,
                    syncedAt: serverTimestamp()
                });
            } else {
                // Update existing item just in case contents changed
                await setDoc(docRef, {
                    ...item,
                    syncedAt: serverTimestamp()
                }, { merge: true });
            }
        }

        // 4. Create Broadcast Notification if new items found
        if (newCount > 0) {
            console.log(`New news detected: ${newCount}. Creating broadcast notification.`);
            const notificationsRef = collection(db, 'notifications');
            await addDoc(notificationsRef, {
                recipientId: 'all',
                senderId: 'system',
                senderName: 'The Fog',
                senderAvatar: '/logo.png',
                type: 'news',
                text: `${newCount} new transmission${newCount > 1 ? 's' : ''} from the Entity. Check the News section.`,
                read: false,
                createdAt: new Date().toISOString()
            });
        }

        // 5. Update global sync metadata
        await setDoc(metadataRef, {
            lastSyncTime: serverTimestamp()
        }, { merge: true });

        console.log(`Sync complete. Items: ${newsItems.length}, New: ${newCount}`);

        return res.status(200).json({
            status: 'success',
            syncedItems: newsItems.length,
            newItems: newCount,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('CRON SYNC ERROR:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
