import { useNews } from '../../hooks/useNews';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, UserIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import React, { useState, memo } from 'react';

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
        let timestamp = dateString;
        // Steam sends UNIX timestamp in seconds (10 digits). Convert to milliseconds.
        if (typeof dateString === 'number' && dateString < 10000000000) {
            timestamp = dateString * 1000;
        } else if (typeof dateString === 'string' && /^\d{10}$/.test(dateString)) {
            timestamp = parseInt(dateString, 10) * 1000;
        }
        
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

const NewsFeed = memo(() => {
    const { news, loading, error } = useNews();
    const [selectedNews, setSelectedNews] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-dbd-red/30 border-t-dbd-red rounded-full animate-spin shadow-[0_0_15px_rgba(255,18,18,0.4)]"></div>
                <p className="text-smoke animate-pulse font-black tracking-[0.2em] uppercase text-xs italic">Decrypting Entity Transmissions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center glass-card border border-dbd-red/50 bg-dbd-red/5 rounded-2xl m-4 backdrop-blur-xl animate-shake">
                <p className="text-white font-black italic text-xl mb-2 uppercase tracking-tighter">Connection Severed<span className="text-dbd-red">.</span></p>
                <p className="text-smoke text-xs font-medium max-w-xs mx-auto">The broadcast signals were interrupted by localized interference. ({error})</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {news.map((item, index) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className={`group relative flex flex-col ${
                            index === 0 ? 'md:col-span-2 lg:col-span-3' : ''
                        }`}
                    >
                        <div 
                            onClick={() => setSelectedNews(item)}
                            className={`render-opt
                                relative h-full flex flex-col gap-4 p-6 md:p-8 rounded-[2rem] cursor-pointer
                                bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 
                                hover:border-dbd-red/30 hover:bg-[#0f0f0f]/80
                                transition-all duration-500 shadow-2xl group
                                ${index === 0 ? 'md:flex-row md:items-stretch overflow-hidden' : ''}
                            `}
                        >
                            {/* Decorative background accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-dbd-red/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                            
                            {/* Featured Banner for first item */}
                            {index === 0 && (
                                <div className="hidden md:block w-1/3 relative -m-8 mr-8 overflow-hidden rounded-l-[2rem]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 z-10" />
                                    <img 
                                        src="/news_header.jpg" 
                                        alt="News Banner" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        onError={(e) => {
                                            e.target.src = "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/381210/ss_e1e5e6c7c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8.1920x1080.jpg";
                                        }}
                                    />
                                    <div className="absolute top-8 left-8 z-20">
                                        <span className="px-3 py-1 bg-dbd-red text-white text-[10px] font-black uppercase tracking-widest rounded shadow-xl">
                                            Latest
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 flex flex-col relative z-20">
                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest font-black text-smoke group-hover:text-dbd-red group-hover:border-dbd-red/30 transition-colors">
                                        {item.feedlabel || 'Transmission'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] text-smoke font-bold uppercase tracking-wider">
                                        <CalendarIcon className="w-3.5 h-3.5 opacity-50" />
                                        {formatDate(item.date)}
                                    </div>
                                </div>

                                <h3 className={`font-black italic tracking-tighter text-white group-hover:text-dbd-red transition-colors duration-500 uppercase ${
                                    index === 0 ? 'text-2xl md:text-5xl mb-6 leading-[0.9]' : 'text-xl md:text-2xl mb-4 leading-tight'
                                }`}>
                                    {item.title}
                                </h3>

                                <p className="text-smoke/70 text-sm md:text-base font-medium leading-relaxed mb-6 line-clamp-3 md:line-clamp-4 italic">
                                    {stripHtmlAndTruncate(item.content, index === 0 ? 500 : 200)}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <UserIcon className="w-4 h-4 text-smoke" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-smoke/50 italic">
                                            {item.author || 'Entity'}
                                        </span>
                                    </div>
                                    
                                    <span className="text-[10px] font-black uppercase tracking-widest text-dbd-red flex items-center gap-2 hover:underline">
                                        Read More
                                        <div className="w-6 h-6 rounded-full bg-dbd-red/10 border border-dbd-red/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-dbd-red group-hover:text-white transition-all">
                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-obsidian w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-dbd-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {selectedNews.feedlabel || 'News'}
                                        </span>
                                        <span className="text-smoke text-xs font-bold uppercase tracking-widest opacity-50">
                                            {formatDate(selectedNews.date)}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter leading-none">
                                        {selectedNews.title}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedNews(null)}
                                    className="p-3 bg-white/5 hover:bg-dbd-red rounded-full transition-colors group"
                                >
                                    <XMarkIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                                <div className="max-w-none prose prose-invert prose-p:text-smoke/90 prose-p:leading-relaxed prose-strong:text-dbd-red font-medium italic">
                                    {/* Using pre-wrap to preserve some of Steam's formatting without complex parsing */}
                                    <p className="whitespace-pre-wrap text-lg">
                                        {stripHtmlAndTruncate(selectedNews.content, 10000)}
                                    </p>
                                </div>
                                
                                <div className="mt-12 p-8 rounded-3xl bg-dbd-red/5 border border-dbd-red/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-white font-black uppercase italic tracking-widest text-sm">Full Transmission</h4>
                                        <p className="text-xs text-smoke">Read the original post on Steam News for all images and links.</p>
                                    </div>
                                    <a 
                                        href={selectedNews.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-dbd-red text-white text-xs font-black uppercase tracking-[0.2em] italic rounded-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl"
                                    >
                                        Open Official Link
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {news.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <p className="text-smoke font-black uppercase tracking-[0.2em] text-xs italic">Signal lost... No transmissions located.</p>
                </div>
            )}
        </div>
    );
});

export default NewsFeed;