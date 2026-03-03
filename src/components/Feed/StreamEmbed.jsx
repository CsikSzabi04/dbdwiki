import React from 'react';

const StreamEmbed = ({ channelName = 'otzdarva' }) => {
    // We use the official Twitch embed iframe.
    // When the streamer is live, this shows their stream.
    // When offline, it automatically shows their offline screen or latest VOD.
    return (
        <div className="w-full relative bg-obsidian-light rounded-xl overflow-hidden shadow-lg border border-white/10 group">
            {/* Thematic Glow */}
            <div className="absolute inset-0 bg-dbd-red/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="aspect-w-16 aspect-h-9 w-full relative z-10">
                <iframe
                    src={`https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&muted=true`}
                    frameBorder="0"
                    allowFullScreen={true}
                    scrolling="no"
                    height="100%"
                    width="100%"
                    className="absolute inset-0 w-full h-full object-cover"
                ></iframe>
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
