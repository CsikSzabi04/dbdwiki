import React, { useRef, useEffect, useState, memo } from 'react';
import StreamEmbed from '../Feed/StreamEmbed';
import TikTokEmbed from '../Feed/TikTokEmbed';
import { useNews } from '../../hooks/useNews';

const CommunityLegends = memo(() => {
    const { news, loading, error } = useNews();
    const scrollContainerRef = useRef(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [qrIndex, setQrIndex] = useState(0);

    // Function to open QR modal via custom event
    const openQrModal = (type) => {
        const event = new CustomEvent('open-qr-modal', { detail: { type } });
        window.dispatchEvent(event);
    };

    // Auto-slide QR code every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setQrIndex(prev => (prev === 0 ? 1 : 0));
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    // Check if content is scrollable
    useEffect(() => {
        const checkScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollHeight, clientHeight } = scrollContainerRef.current;
                setShowScrollIndicator(scrollHeight > clientHeight);
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    // Helper to format date (Not currently used but kept for future use)
    // const formatDate = (timestamp) => {
    //     if (!timestamp) return '';
    //     const date = new Date(timestamp * 1000);
    //     return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    // };

    // Sample TikTok creators who play DBD
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

    // YouTube creators
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
        <div className="flex flex-col gap-4 h-full">

            {/* Socials QR Code Slider Section */}
            <div className="glass-card relative overflow-hidden group p-0">
                {/* Scrollable track */}
                <div 
                    className="flex transition-transform duration-1000 ease-in-out w-[200%]"
                    style={{ transform: `translateX(-${qrIndex * 50}%)` }}
                >
                    {/* INSTAGRAM SLIDE */}
                    <div className="w-1/2 p-4 relative">
                        {/* Instagram Gradient Top Bar */}
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-70" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-gradient-to-b from-[#833ab4] to-[#fd1d1d] rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Instagram</h3>
                            </div>
                            {/* Tiny Instagram Icon */}
                            <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <p className="text-[10px] text-center text-smoke/80 font-medium leading-relaxed w-full">
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
                                        className="w-24 h-24 object-contain transition-transform duration-300 group-hover/qr:scale-105"
                                    />
                                </div>
                            </div>

                            <a
                                href="https://www.instagram.com/dbdcommunity_hub/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 w-full text-center text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md bg-gradient-to-r from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border border-pink-500/30 text-white hover:text-white hover:from-[#833ab4]/40 hover:via-[#fd1d1d]/40 hover:to-[#fcb045]/40 transition-all duration-300"
                            >
                                Follow Us
                            </a>
                        </div>
                    </div>

                    {/* DISCORD SLIDE */}
                    <div className="w-1/2 p-4 relative">
                        {/* Discord Gradient Top Bar */}
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-70" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Discord</h3>
                            </div>
                            {/* Tiny Discord Icon */}
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <p className="text-[10px] text-center text-smoke/80 font-medium leading-relaxed w-full">
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
                                        className="w-24 h-24 object-contain transition-transform duration-300 group-hover/qr:scale-105"
                                    />
                                </div>
                            </div>

                            <a
                                href="https://discord.gg/UF7FKmTg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 w-full text-center text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-white hover:text-white hover:from-blue-500/40 hover:to-indigo-600/40 transition-all duration-300"
                            >
                                Join Rules
                            </a>
                        </div>
                    </div>
                </div>

                {/* Slider Pagination Indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-20">
                    <button 
                        onClick={() => setQrIndex(0)} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${qrIndex === 0 ? 'bg-pink-500 w-4' : 'bg-white/30 hover:bg-white/50 w-1.5'}`} 
                    />
                    <button 
                        onClick={() => setQrIndex(1)} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${qrIndex === 1 ? 'bg-blue-500 w-4' : 'bg-white/30 hover:bg-white/50 w-1.5'}`} 
                    />
                </div>
            </div>

            {/* Scrollable Community Content */}
            <div className="relative flex-1 min-h-0 overflow-hidden" >
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                    style={{
                        maxHeight: 'calc(100vh - 280px)',
                        scrollbarWidth: 'none',  /* Firefox */
                        msOverflowStyle: 'none',  /* IE/Edge */
                        WebkitOverflowScrolling: 'touch'  /* Smooth scrolling iOS */
                    }}
                >
                    {/* What's New Section - Most már a görgethető részen belül */}
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                            <div className="w-1 h-3 bg-dbd-red rounded-full"></div>
                            <h3 className="text-base font-black uppercase italic tracking-tighter text-white">What's New</h3>
                        </div>

                        <div className="space-y-3">
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
                                news.slice(0, 3).map((item, index) => (
                                    <a
                                        key={item.id ?? index}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block space-y-0.5 group cursor-pointer"
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
                                <p className="text-xs text-smoke italic">No news available.</p>
                            )}
                        </div>
                    </div>
                    {/* YouTube Creators Section - ÚJ */}
                    <div className="glass-card p-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-600 to-red-800 opacity-50" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-red-600 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-white">YouTube Legends</h3>
                            </div>
                            <span className="text-[8px] text-smoke bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">
                                3 creators
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] text-smoke/80 font-medium leading-relaxed">
                                Top DBD content creators on YouTube. Watch their latest videos and guides.
                            </p>

                            {/* YouTube Creators Grid */}
                            <div className="grid grid-cols-1 gap-2">
                                {youtubeCreators.map((creator, index) => (
                                    <a
                                        key={index}
                                        href={creator.channelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/5 hover:border-red-600/30 transition-all group"
                                    >
                                        {/* YouTube profil kép */}
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center border-2 border-red-600/30 shrink-0 overflow-hidden group-hover:border-red-600/60 transition-all">
                                                <img
                                                    loading="lazy"
                                                    src={creator.avatarUrl}
                                                    alt={creator.displayName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `<span class="text-lg font-black italic text-white">${creator.displayName.charAt(0)}</span>`;
                                                    }}
                                                />
                                            </div>
                                            {/* YouTube logo badge */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-black">
                                                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
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
                                            <p className="text-[9px] text-smoke truncate">{creator.handle}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-[8px] text-red-400 font-bold">{creator.subscribers}</span>
                                                <span className="text-[6px] text-smoke">subscribers</span>
                                            </div>
                                        </div>

                                        {/* YouTube indikátor */}
                                        <div className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Community Legend / Featured Streamer Section */}
                    <div className="glass-card p-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 to-dbd-red opacity-50" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-white">Community Legend</h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] text-smoke/80 font-medium leading-relaxed">
                                Spotlight on top creatures of the Fog. Catch them live or watch their latest trials.
                            </p>

                            {/* Twitch Embed - Reszponzív magasság */}
                            <div className="w-full">
                                <StreamEmbed channelName="otzdarva" />
                            </div>

                            {/* Streamer Info - Kompaktabb */}
                            <div className="flex items-center gap-2 p-2 bg-black/40 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 shrink-0 overflow-hidden">
                                    <span className="text-base font-black italic text-white">O</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <p className="text-xs font-bold text-white uppercase tracking-wider truncate">Otzdarva</p>
                                        <span className="text-[8px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/20">
                                            Educational
                                        </span>
                                    </div>
                                    <a
                                        href="https://twitch.tv/otzdarva"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] text-purple-400 hover:text-purple-300 transition-colors block truncate"
                                    >
                                        twitch.tv/otzdarva
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TikTok Creators Section - ÁTSZERVEZVE, kompaktabb */}
                    <div className="glass-card p-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 opacity-50" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-pink-500 rounded-full"></div>
                                <h3 className="text-base font-black uppercase italic tracking-tighter text-white">TikTok Legends</h3>
                            </div>
                            <span className="text-[8px] text-smoke bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">
                                3 creators
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] text-smoke/80 font-medium leading-relaxed">
                                Quick tips, funny moments & community highlights.
                            </p>

                            {/* TikTok Embed - Első creator */}
                            <div className="w-full">
                                <TikTokEmbed creator={tiktokCreators[0]} />
                            </div>

                            {/* TikTok Creators Grid - 2 oszlop, kompakt */}
                            <div className="grid grid-cols-2 gap-1.5">
                                {tiktokCreators.slice(1).map((creator, index) => (
                                    <a
                                        key={index}
                                        href={`https://tiktok.com/@${creator.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 p-1.5 bg-black/40 rounded-lg border border-white/5 hover:border-pink-500/30 transition-all group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-pink-900/30 flex items-center justify-center border border-pink-500/30 shrink-0 overflow-hidden">
                                            <span className="text-xs font-black italic text-white">{creator.displayName.charAt(0)}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold text-white truncate leading-tight">
                                                {creator.displayName}
                                            </p>
                                            <p className="text-[7px] text-smoke truncate">{creator.handle}</p>
                                            <p className="text-[7px] text-pink-400">{creator.followers}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Weekly Challenges Section - Kompaktabb */}
                    <div className="glass-card p-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-green-500 to-yellow-500 opacity-50" />

                        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                            <h3 className="text-base font-black uppercase italic tracking-tighter text-white">Weekly Challenges</h3>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] text-smoke/80">Complete these and share your clips!</p>

                            {[
                                { name: '4K Challenge', desc: '4 kills as any killer', reward: '500' },
                                { name: 'Escapist', desc: 'Escape 5 times', reward: '300' },
                                { name: 'Skill Check', desc: '20 great skill checks', reward: '200' }
                            ].map((challenge, index) => (
                                <div key={index} className="flex items-center justify-between p-1.5 bg-black/40 rounded-lg border border-white/5">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <p className="text-[11px] font-bold text-white truncate">{challenge.name}</p>
                                        <p className="text-[8px] text-smoke truncate">{challenge.desc}</p>
                                    </div>
                                    <span className="text-[8px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/30 shrink-0">
                                        {challenge.reward} BP
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Indicator - Ha szükséges */}
                    {showScrollIndicator && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    )}
                </div>
            </div>
        </div>
    );
});

export default CommunityLegends;