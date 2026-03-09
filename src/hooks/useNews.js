import { useState, useEffect } from 'react';

/**
 * Hook to fetch Dead by Daylight news from Steam News API
 */
export const useNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // 1. Check Cache First (1 hour TTL)
                const CACHE_KEY = 'dbd_news_cache';
                const CACHE_TIME_KEY = 'dbd_news_cache_time';
                const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

                const cachedNews = localStorage.getItem(CACHE_KEY);
                const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

                if (cachedNews && cacheTime) {
                    const now = new Date().getTime();
                    if (now - parseInt(cacheTime, 10) < CACHE_TTL) {
                        // Use valid cache and skip slow fetch
                        setNews(JSON.parse(cachedNews));
                        setLoading(false);
                        return;
                    }
                }

                setLoading(true);
                // 2. Fetch from Steam News API through a faster CORS proxy if possible
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

                // 3. Save to Cache
                localStorage.setItem('dbd_news_cache', JSON.stringify(newsItems));
                localStorage.setItem('dbd_news_cache_time', new Date().getTime().toString());

                setNews(newsItems);
            } catch (err) {
                console.error('Error fetching DBD news, trying fallback:', err);

                // If API fails, try to aggressively use expired cache instead of breaking the app
                const cachedNews = localStorage.getItem('dbd_news_cache');
                if (cachedNews) {
                    setNews(JSON.parse(cachedNews));
                    setError(null); // Hide error since we have stale data
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return { news, loading, error };
};