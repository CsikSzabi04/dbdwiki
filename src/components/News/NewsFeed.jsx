import React from 'react';
import { useNews } from '../../hooks/useNews';

const stripHtmlAndTruncate = (htmlString, maxLength) => {
    if (!htmlString) return '';
    
    // First, decode Steam's {STEAM_CLAN_IMAGE} placeholders and clean up
    let cleaned = htmlString
        .replace(/\{STEAM_CLAN_IMAGE\}/g, 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans')
        .replace(/\[img[^\]]*\]/gi, '') // Remove [img] tags
        .replace(/\[\/img\]/gi, '') // Remove [/img] tags
        .replace(/\[url[^\]]*\]/gi, '') // Remove [url] tags
        .replace(/\[\/url\]/gi, '') // Remove [/url] tags
        .replace(/\[h3\]/gi, '') // Remove [h3] tags
        .replace(/\[\/h3\]/gi, '') // Remove [/h3] tags
        .replace(/\[b\]/gi, '') // Remove [b] tags
        .replace(/\[\/b\]/gi, '') // Remove [/b] tags
        .replace(/\[p\]/gi, '') // Remove [p] tags
        .replace(/\[\/p\]/gi, '') // Remove [/p] tags
        .replace(/\[list\]/gi, '') // Remove [list] tags
        .replace(/\[\/list\]/gi, '') // Remove [/list] tags
        .replace(/\[\*\]/gi, '• '); // Replace [*] with bullet points

    // Then strip any remaining HTML tags
    const stripped = cleaned.replace(/<[^>]*>?/gm, '');
    
    // Clean up multiple spaces and trim
    const cleanText = stripped.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
};

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

const NewsFeed = () => {
    const { news, loading, error } = useNews();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-dbd-red/30 border-t-dbd-red rounded-full animate-spin"></div>
                <p className="text-smoke animate-pulse font-medium tracking-widest uppercase text-sm">Synchronizing with The Entity...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center glass-card border border-dbd-red/50 bg-dbd-red/10 rounded-xl m-4">
                <p className="text-white font-bold text-lg mb-2">Connection Severed</p>
                <p className="text-smoke text-sm">Failed to retrieve the latest broadcasts from the Fog. ({error})</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-2 h-8 bg-dbd-red rounded-full"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    Latest <span className="text-dbd-red">Transmissions</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item, index) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative glass-card p-6 flex flex-col gap-4 overflow-hidden border border-white/5 hover:border-dbd-red/50 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,18,18,0.3)] ${
                            index === 0 ? 'md:col-span-2 md:flex-row md:items-center' : ''
                        }`}
                    >
                        {/* Background Vignette Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-dbd-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Content */}
                        <div className="flex-1 relative z-10">
                            {/* Metadata */}
                            <div className="flex items-center gap-3 mb-3 shrink-0 flex-wrap">
                                <span className="px-2 py-1 bg-dbd-red/20 border border-dbd-red/50 rounded text-[10px] uppercase tracking-wider font-bold text-dbd-red">
                                    {item.feedlabel === 'Community Announcements' ? 'Community' : item.feedlabel || 'News'}
                                </span>
                                <span className="text-xs text-smoke font-mono">{formatDate(item.date)}</span>
                                <span className="text-xs text-smoke/50 ml-auto flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Official News
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className={`font-black italic tracking-tight text-white group-hover:text-dbd-red transition-colors duration-300 ${
                                index === 0 ? 'text-2xl md:text-3xl mb-4 text-balance' : 'text-xl mb-3 leading-tight'
                            }`}>
                                {item.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-smoke/90 leading-relaxed font-medium">
                                {stripHtmlAndTruncate(item.content, index === 0 ? 300 : 150)}
                            </p>
                        </div>
                    </a>
                ))}
            </div>

            {news.length === 0 && !loading && (
                <div className="text-center py-20 text-smoke">
                    No news available at the moment.
                </div>
            )}
        </div>
    );
};

export default NewsFeed;