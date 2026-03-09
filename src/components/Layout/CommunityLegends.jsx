import React, { useRef, useEffect, useState } from 'react';
import StreamEmbed from '../Feed/StreamEmbed';
import TikTokEmbed from '../Feed/TikTokEmbed';
import { useNews } from '../../hooks/useNews';

const CommunityLegends = () => {
    const { news, loading, error } = useNews();
    const scrollContainerRef = useRef(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);

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

    // Helper to format date
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

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

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* What's New Section - Kompaktabb változat */}
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

            {/* Scrollable Community Content */}
            <div className="relative flex-1 min-h-0">
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                    style={{ maxHeight: 'calc(100vh - 280px)' }}
                >
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
                                    <img
                                        src="https://static-cdn.jtvnw.net/jtv_user_pictures/otzdarva-profile_image-7c7a3a00da531549-300x300.png"
                                        alt="Otzdarva"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="text-base font-black italic text-white">O</span>';
                                        }}
                                    />
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
                                            <img
                                                src={`https://img.tiktok.com/api/avatar/?username=${creator.username}`}
                                                alt={creator.displayName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `<span class="text-xs font-black italic text-white">${creator.displayName.charAt(0)}</span>`;
                                                }}
                                            />
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
                </div>

                {/* Scroll Indicator - Ha szükséges */}
                {showScrollIndicator && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                )}
            </div>
        </div>
    );
};

export default CommunityLegends;