import React, { useState } from 'react';

const StreamEmbed = ({ channelName = 'otzdarva' }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="w-full relative bg-obsidian-light rounded-xl overflow-hidden shadow-lg border border-white/10 group">
            {/* Thematic Glow */}
            <div className="absolute inset-0 bg-dbd-red/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="aspect-video w-full relative z-10">
                {isLoaded ? (
                    <iframe
                        src={`https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&muted=true&autoplay=true`}
                        frameBorder="0"
                        allowFullScreen={true}
                        scrolling="no"
                        className="absolute inset-0 w-full h-full"
                        title={`${channelName} live stream`}
                    ></iframe>
                ) : (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => setIsLoaded(true)}
                    >
                        <div className="w-16 h-16 rounded-full bg-purple-600/30 border-2 border-purple-500/50 flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-white text-sm font-bold uppercase tracking-widest">Watch {channelName}</p>
                        <p className="text-smoke text-xs">Click to load stream</p>
                    </div>
                )}
            </div>

            <div className="p-3 bg-black/60 backdrop-blur-md flex items-center justify-between border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Live Broadcast</span>
                </div>
                <a
                    href={`https://twitch.tv/${channelName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-smoke hover:text-dbd-red transition-colors uppercase font-bold"
                >
                    Watch on Twitch
                </a>
            </div>
        </div>
    );
};

export default StreamEmbed;
