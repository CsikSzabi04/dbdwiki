import { useState, useEffect } from 'react';
import { subscribeToNews } from '../firebase/news';

/**
 * Hook to fetch Dead by Daylight news from Firestore.
 * Automated sync is now handled server-side via Vercel Cron.
 */
export const useNews = () => {
    const [news, setNews] = useState(() => {
        // Initial load from local storage if available
        const cached = localStorage.getItem('dbd_news_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        // Subscribe to real-time news updates from Firestore
        const unsubscribe = subscribeToNews((firestoreNews) => {
            if (!isMounted) return;

            if (firestoreNews.length > 0) {
                setNews(firestoreNews);
                setLoading(false);

                // Update local storage as secondary backup
                localStorage.setItem('dbd_news_cache', JSON.stringify(firestoreNews));
                localStorage.setItem('dbd_news_cache_time', Date.now().toString());
            }
        }, 15);

        // Fallback timeout for loading state if no data arrives
        const timer = setTimeout(() => {
            if (isMounted && news.length === 0) {
                setLoading(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            unsubscribe();
            clearTimeout(timer);
        };
    }, [news.length]);

    return { news, loading, error };
};
