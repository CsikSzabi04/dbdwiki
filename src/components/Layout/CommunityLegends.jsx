import React, { useEffect, useState, memo } from 'react';
import StreamEmbed from '../Feed/StreamEmbed';
import TikTokEmbed from '../Feed/TikTokEmbed';
import { useNews } from '../../hooks/useNews';
import FogAssistant from '../Chatbot/FogAssistant';

const CommunityLegends = memo(() => {
    const { news, loading, error } = useNews();
    const [qrIndex, setQrIndex] = useState(0);
    const [contentIndex, setContentIndex] = useState(0);

    const openQrModal = (type) => {
        const event = new CustomEvent('open-qr-modal', { detail: { type } });
        window.dispatchEvent(event);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setQrIndex(prev => (prev === 0 ? 1 : 0));
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setContentIndex(prev => (prev === 4 ? 0 : prev + 1));
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const tiktokCreators = [
        {
            username: 'deadbydaylight',
            displayName: 'Dead by Daylight',
            handle: '@deadbydaylight',
            followers: '1.2M',
            category: 'Official'
        },
        {
            username: 'otzdarva',
            displayName: 'Otzdarva',
            handle: '@otzdarva',
            followers: '850K',
            category: 'Educational'
        },
        {
            username: 'dowsey',
            displayName: 'Dowsey',
            handle: '@dowsey',
            followers: '420K',
            category: 'Gameplay'
        }
    ];

    const youtubeCreators = [
        {
            channelId: 'notOtzdarva',
            displayName: 'notOtzdarva',
            handle: '@notOtzdarva',
            subscribers: '847K',
            category: 'Educational',
            channelUrl: 'https://www.youtube.com/@notOtzdarva',
            avatarUrl: 'https://yt3.googleusercontent.com/CPV5nRrssy6_y_tEZ2NRhKSQOTh8vtfNVsCDqeKqt-fYHjVQ-7ela9nUFhy0p5FJvPOUl5o8qjQ=s160-c-k-c0x00ffffff-no-rj'
        },
        {
            channelId: 'TheJRM',
            displayName: 'JRM',
            handle: '@TheJRM',
            subscribers: '312K',
            category: 'Gameplay',
            channelUrl: 'https://www.youtube.com/@TheJRM/videos',
            avatarUrl: 'https://yt3.googleusercontent.com/_PmFMfG7AYugmut_L68JpLdGuM02f35patcewjZItxYbPIEEp2A2Wlzcm56nKVi1j00MvOXFwA=s160-c-k-c0x00ffffff-no-rj'
        },
        {
            channelId: 'Hens',
            displayName: 'Hens333',
            handle: '@Hens333',
            subscribers: '203K',
            category: 'Gameplay',
            channelUrl: 'https://www.youtube.com/@hens333/videos',
            avatarUrl: 'https://yt3.googleusercontent.com/Je1bIJuvhva9x6003FP8GNdWAwrAJ2Ka8oeKvc-9Yepat_EIsYB9OLfmt4gwfzHT8rdyVEsAYQ=s160-c-k-c0x00ffffff-no-rj'
        }
    ];

    return (
        <div className="flex flex-col gap-4 h-full w-full justify-between">

            {/* Socials QR Code Slider Section */}
            <div className="glass-card relative overflow-hidden group p-0 shrink-0">
                <div
                    className="flex transition-transform duration-1000 ease-in-out w-[200%]"
                    style={{ transform: `translateX(-${qrIndex * 50}%)` }}
                >
                    {/* INSTAGRAM SLIDE */}
                    <div className="w-1/2 p-4 relative">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-70" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-gradient-to-b from-[#833ab4] to-[#fd1d1d] rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Instagram</h3>
                            </div>
                            <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[10px] text-center text-smoke/80 font-medium leading-tight w-full">
                                Join our community! Scan to follow us for daily DBD memes, updates & giveaways.
                            </p>

                            <div
                                className="relative group/qr cursor-pointer hover:z-10"
                                onClick={() => openQrModal('insta')}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-500 rounded-xl blur opacity-30 group-hover/qr:opacity-75 transition duration-500"></div>
                                <div className="relative bg-black rounded-lg p-2 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/qrcode.png"
                                        alt="Instagram QR Code"
                                        className="w-20 h-20 object-contain transition-transform duration-300 group-hover/qr:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DISCORD SLIDE */}
                    <div className="w-1/2 p-4 relative">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-70" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Discord</h3>
                            </div>
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[10px] text-center text-smoke/80 font-medium leading-tight w-full">
                                Looking for SWF? Scan to join our Discord to find players and voice chat!
                            </p>

                            <div
                                className="relative group/qr cursor-pointer hover:z-10"
                                onClick={() => openQrModal('discord')}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl blur opacity-30 group-hover/qr:opacity-75 transition duration-500"></div>
                                <div className="relative bg-black rounded-lg p-2 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/dcqr.png"
                                        alt="Discord QR Code"
                                        className="w-20 h-20 object-contain transition-transform duration-300 group-hover/qr:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Slider Pagination Indicators (Hidden as requested) */}
            </div>

            {/* AI Assistant Chatbot Area */}
            <div className="glass-card flex flex-1 p-1 relative overflow-hidden min-h-[200px] max-h-[425px]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
                <div className="relative z-10 w-full h-full">
                    <FogAssistant />
                </div>
            </div>

            {/* Paginated 5-Section Community Content */}
            <div className="glass-card relative overflow-hidden group p-0 flex-[1.5] min-h-[220px] max-h-[300px]">

                <div
                    className="flex flex-col transition-transform duration-1000 ease-in-out h-[500%] w-full"
                    style={{ transform: `translateY(-${contentIndex * 20}%)` }}
                >
                    {/* SECTION 1: What's New */}
                    <div className="h-1/5 w-full relative flex flex-col bg-black/20">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-dbd-red to-dbd-red/50 opacity-70" />
                        <div className="p-4 md:p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 shrink-0">
                                <div className="w-1 h-3 bg-dbd-red rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-white">What's New</h3>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                                {loading ? (
                                    <div className="flex flex-col gap-2 animate-pulse">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="space-y-1">
                                                <div className="h-1.5 w-12 bg-white/10 rounded"></div>
                                                <div className="h-2 w-full bg-white/10 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : error ? (
                                    <p className="text-xs text-dbd-red italic">Failed to load news.</p>
                                ) : news && news.length > 0 ? (
                                    news.slice(0, 4).map((item, index) => (
                                        <a
                                            key={item.id ?? index}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block space-y-0.5 group cursor-pointer bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors border border-white/5"
                                        >
                                            <p className={`text-[9px] font-bold uppercase tracking-wider ${index === 0 ? 'text-dbd-red' : 'text-blue-400'}`}>
                                                {index === 0 ? 'LATEST' : 'NEWS'}
                                            </p>
                                            <p className="text-xs font-medium text-white group-hover:text-dbd-red transition-colors line-clamp-2 leading-tight">
                                                {item.title}
                                            </p>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xs text-smoke italic text-center py-4">No news available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: YouTube Legends */}
                    <div className="h-1/5 w-full relative flex flex-col bg-black/20">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-600 to-red-800 opacity-70" />
                        <div className="p-4 md:p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-red-600 rounded-full"></div>
                                    <h3 className="text-base font-black uppercase italic tracking-tighter text-white">YouTube Legends</h3>
                                </div>
                                <span className="text-[8px] text-smoke bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">3 creators</span>
                            </div>

                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">

                                <div className="grid grid-cols-1 gap-2">
                                    {youtubeCreators.map((creator, index) => (
                                        <a
                                            key={index}
                                            href={creator.channelUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/5 hover:border-red-600/30 transition-all group"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center border-2 border-red-600/30 shrink-0 overflow-hidden group-hover:border-red-600/60 transition-all">
                                                    <img
                                                        loading="lazy"
                                                        src={creator.avatarUrl}
                                                        alt={creator.displayName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `<span class="text-sm font-black italic text-white">${creator.displayName.charAt(0)}</span>`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center border border-black">
                                                    <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                                                        {creator.displayName}
                                                    </p>
                                                    <span className="text-[8px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                                                        {creator.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className="text-[8px] text-red-400 font-bold">{creator.subscribers}</span>
                                                    <span className="text-[6px] text-smoke">subscribers</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Community Legend */}
                    <div className="h-1/5 w-full relative flex flex-col bg-black/20">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 to-dbd-red opacity-70" />
                        <div className="p-4 md:p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                    <h3 className="text-base font-black uppercase italic tracking-tighter text-white">Community Legend</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-1 overflow-hidden pr-2 pb-4">

                                <div className="w-full shrink-0">
                                    <StreamEmbed channelName="otzdarva" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: TikTok Legends */}
                    <div className="h-1/5 w-full relative flex flex-col bg-black/20">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 opacity-70" />
                        <div className="p-4 md:p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-pink-500 rounded-full"></div>
                                    <h3 className="text-base font-black uppercase italic tracking-tighter text-white">TikTok Legends</h3>
                                </div>
                                <span className="text-[8px] text-smoke bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">3 creators</span>
                            </div>

                            <div className="flex flex-col gap-2 flex-1 overflow-hidden pb-4">
                                <div className="grid grid-cols-1 gap-2 shrink-0">
                                    {tiktokCreators.map((creator, index) => (
                                        <a
                                            key={index}
                                            href={`https://tiktok.com/@${creator.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2.5 bg-black/40 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-pink-900/30 flex items-center justify-center border-2 border-pink-500/30 overflow-hidden group-hover:border-pink-500/60 transition-all">
                                                    <span className="text-lg font-black italic text-white">{creator.displayName.charAt(0)}</span>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center border border-black">
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12.525.02c1.31-.32 2.61.69 3.19 1.5.7.97.63 2.32.5 3.45-.03.3-.06.59-.08.88 1.03-.18 2.06-.33 3.11-.24.96.08 1.9.46 2.6 1.13.7.67 1.1 1.62 1.14 2.58.04 1.02-.34 2.02-1.04 2.76-.7.74-1.68 1.17-2.7 1.21-1 .04-2.01-.26-2.83-.88-.82-.62-1.4-1.54-1.61-2.54-.21-1-.06-2.05.42-2.98.48-.93 1.25-1.66 2.18-2.07v-2.1c-.8.13-1.61.35-2.39.66-.78.31-1.52.74-2.18 1.26v9.33c0 1.1-.34 2.16-.98 3.03-.64.87-1.56 1.49-2.59 1.76-1.03.27-2.13.19-3.11-.23-.98-.42-1.8-1.15-2.33-2.05-.53-.9-.76-1.96-.65-3.01.11-1.05.56-2.03 1.28-2.79s1.67-1.25 2.7-1.39 2.09.07 3.03.58v-2.18c-1.25-.49-2.61-.69-3.95-.58-1.34.11-2.63.53-3.76 1.23-1.13.7-2.05 1.68-2.69 2.82-.64 1.14-.94 2.45-.87 3.76.07 1.31.48 2.59 1.18 3.69s1.67 1.99 2.81 2.58c1.14.59 2.43.88 3.72.84 1.29-.04 2.55-.38 3.68-1.02 1.13-.64 2.07-1.54 2.75-2.61.68-1.07 1.04-2.32 1.04-3.6V6.51c.01-.48-.2-.94-.57-1.25-.37-.31-.87-.45-1.35-.39-1.36.16-2.72.48-4.05.95v-2.1c1.24-.43 2.53-.74 3.84-.9z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate">
                                                        {creator.displayName}
                                                    </p>
                                                    <span className="text-[9px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                                                        {creator.followers}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-smoke/60 font-medium">{creator.handle}</p>
                                            </div>
                                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Weekly Challenges */}
                    <div className="h-1/5 w-full relative flex flex-col bg-black/20">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-green-500 to-yellow-500 opacity-70" />
                        <div className="p-4 md:p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 shrink-0">
                                <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-white">Weekly Challenges</h3>
                            </div>

                            <div className="space-y-2 flex-1 overflow-hidden pr-2 pb-4">
                                {[
                                    { name: '4K Challenge', desc: '4 kills as any killer', reward: '500' },
                                    { name: 'Escapist', desc: 'Escape 5 times', reward: '300' },
                                    { name: 'Skill Check', desc: '20 great skill checks', reward: '200' }
                                ].map((challenge, index) => (
                                    <div key={index} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors group">
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="text-xs font-black text-white uppercase italic tracking-tighter truncate">{challenge.name}</p>
                                            <p className="text-[10px] text-smoke/60 truncate leading-tight">{challenge.desc}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/30 shrink-0 group-hover:bg-green-500/20 transition-all">
                                            {challenge.reward} BP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Content Slider Pagination Indicators (Hidden as requested) */}
            </div>

        </div>
    );
});

export default CommunityLegends;