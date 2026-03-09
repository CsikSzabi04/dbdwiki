import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Hook to fetch Dead by Daylight news from Firebase cache or Steam News API
 */
export const useNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // 1. Check LocalStorage Cache First (1 hour TTL)
                const CACHE_KEY = 'dbd_news_cache';
                const CACHE_TIME_KEY = 'dbd_news_cache_time';
                const LOCAL_TTL = 60 * 60 * 1000; // 1 hour

                const cachedNews = localStorage.getItem(CACHE_KEY);
                const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

                if (cachedNews && cacheTime) {
                    const now = new Date().getTime();
                    if (now - parseInt(cacheTime, 10) < LOCAL_TTL) {
                        setNews(JSON.parse(cachedNews));
                        setLoading(false);
                        return; // Use local cache, skip network completely
                    }
                }

                setLoading(true);

                // 2. Check Firebase Global Cache (6 hours TTL)
                const FIREBASE_TTL = 6 * 60 * 60 * 1000; // 6 hours
                const newsDocRef = doc(db, 'system', 'news_cache');

                let firebaseNews = null;
                let needsSteamFetch = true;

                try {
                    const newsSnap = await getDoc(newsDocRef);
                    if (newsSnap.exists()) {
                        const data = newsSnap.data();
                        firebaseNews = data.items;
                        const lastUpdated = data.lastUpdated?.toMillis() || 0;
                        const now = Date.now();

                        if (now - lastUpdated < FIREBASE_TTL && data.items && data.items.length > 0) {
                            needsSteamFetch = false; // Firebase cache is fresh enough
                        }
                    }
                } catch (fbError) {
                    console.error("Firebase read error, proceeding to Steam API:", fbError);
                    // If permissions fail or DB fails, we just try to fetch from Steam
                }

                // If Firebase has fresh data, use it and update local storage
                if (!needsSteamFetch && firebaseNews) {
                    setNews(firebaseNews);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(firebaseNews));
                    localStorage.setItem(CACHE_TIME_KEY, new Date().getTime().toString());
                    setLoading(false);
                    return;
                }

                // 3. Fetch from Steam API (Slow, only done if Firebase is stale/empty)
                // Fallback to corsproxy.io as it tends to be faster than allorigins
                const targetUrl = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=381210&count=10&maxlength=5000&format=json';
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

                let response = await fetch(proxyUrl);

                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }

                const data = await response.json();

                // Check if we have valid data
                if (!data.appnews || !data.appnews.newsitems) {
                    throw new Error('Invalid news data received');
                }

                const newsItems = data.appnews.newsitems.map(item => ({
                    id: item.gid,
                    title: item.title,
                    content: item.contents, // Keep full content, we'll process in the component
                    url: item.url,
                    author: item.author || 'DBD Official',
                    date: new Date(item.date * 1000).toISOString(), // Store as ISO string for consistent formatting
                    feedlabel: item.feedlabel || 'News'
                }));

                // 4. Save to Firebase so other users get it fast
                try {
                    await setDoc(newsDocRef, {
                        items: newsItems,
                        lastUpdated: serverTimestamp()
                    });
                } catch (fbWriteError) {
                    console.error("Failed to update global Firebase news cache:", fbWriteError);
                }

                // 5. Save to Local Cache
                localStorage.setItem(CACHE_KEY, JSON.stringify(newsItems));
                localStorage.setItem(CACHE_TIME_KEY, new Date().getTime().toString());

                setNews(newsItems);
            } catch (err) {
                console.error('Error fetching DBD news, trying fallback:', err);

                // If API fails, fallback to stale Firebase data, then stale LocalStorage data
                if (firebaseNews) {
                    setNews(firebaseNews);
                    setError(null);
                } else {
                    const staleLocal = localStorage.getItem('dbd_news_cache');
                    if (staleLocal) {
                        setNews(JSON.parse(staleLocal));
                        setError(null);
                    } else {
                        setError(err.message);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return { news, loading, error };
};