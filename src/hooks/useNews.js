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
                setLoading(true);
                // Using Steam News API for DBD (AppID: 381210)
                // Use a CORS proxy to avoid CORS issues
                const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(
                    'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=381210&count=10&maxlength=5000&format=json'
                ));

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

                setNews(newsItems);
            } catch (err) {
                console.error('Error fetching DBD news:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return { news, loading, error };
};