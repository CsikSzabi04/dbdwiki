import { useState, useEffect } from 'react';
import {
    subscribeToNews,
    getLastSyncTime,
    syncNewsWithFirestore
} from '../firebase/news';

/**
 * Hook to fetch Dead by Daylight news with Firebase global persistence and LocalStorage caching.
 */
export const useNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Use real-time subscription for Firestore news
        const unsubscribe = subscribeToNews((firestoreNews) => {
            if (firestoreNews.length > 0) {
                setNews(firestoreNews);
                setLoading(false);

                // Update local storage as secondary backup
                localStorage.setItem('dbd_news_cache', JSON.stringify(firestoreNews));
                localStorage.setItem('dbd_news_cache_time', Date.now().toString());
            }
        });

        const syncCheck = async () => {
            try {
                // 1. Check if we need to fetch from Steam (Global Sync TTL)
                const GLOBAL_SYNC_TTL = 6 * 60 * 60 * 1000; // 6 hours
                const lastSync = await getLastSyncTime();
                const now = Date.now();

                if (now - lastSync > GLOBAL_SYNC_TTL) {
                    console.log("Global sync expired or missing, fetching fresh data from Steam API...");

                    const targetUrl = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=381210&count=10&maxlength=5000&format=json';
                    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error('Steam API fetch failed');

                    const data = await response.json();
                    if (!data.appnews?.newsitems) throw new Error('Invalid Steam data');

                    const newsItems = data.appnews.newsitems.map(item => ({
                        id: item.gid,
                        title: item.title,
                        content: item.contents,
                        url: item.url,
                        author: item.author || 'DBD Official',
                        date: new Date(item.date * 1000).toISOString(),
                        feedlabel: item.feedlabel || 'News'
                    }));

                    // Sync items to global Firestore collection
                    // This will trigger the subscribeToNews listener above
                    await syncNewsWithFirestore(newsItems);
                }
            } catch (err) {
                // Ignore permission errors in the console for guests
                if (err.code !== 'permission-denied') {
                    console.error('News sync error:', err);
                }

                // If everything fails and no news, set error
                if (news.length === 0) {
                    const localCache = localStorage.getItem('dbd_news_cache');
                    if (localCache) {
                        setNews(JSON.parse(localCache));
                    } else {
                        setError(err.message);
                    }
                }
            } finally {
                // Subscription handles loading state usually, but ensure it's off if sync finishes
                setLoading(false);
            }
        };

        syncCheck();

        return () => unsubscribe();
    }, [news.length]);

    return { news, loading, error };
};
