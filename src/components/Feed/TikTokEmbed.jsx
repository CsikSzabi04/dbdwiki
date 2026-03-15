import React, { useState } from 'react';

const TikTokEmbed = ({ creator }) => {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="relative bg-black/40 rounded-xl overflow-hidden border border-white/5 group">
            {/* TikTok Header */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-600/20 to-blue-600/20 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-pink-900/50 flex items-center justify-center border border-pink-500/30 overflow-hidden shrink-0">
                    <span className="text-lg font-black italic text-white">{creator.displayName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{creator.displayName}</p>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-pink-500/20 border border-pink-500/30 rounded text-pink-400">
                            {creator.category}
                        </span>
                    </div>
                    <p className="text-xs text-smoke">{creator.handle}</p>
                </div>
                <a
                    href={`https://tiktok.com/@${creator.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-black/60 rounded-lg border border-white/10 hover:border-pink-500/50 hover:text-pink-400 transition-colors"
                >
                    Follow
                </a>
            </div>

            {/* TikTok Video Preview */}
            <div className="relative aspect-video bg-black/80 flex items-center justify-center">
                {!showVideo ? (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-blue-600/20" />
                        <div className="relative z-10 text-center p-4">
                            <div className="text-4xl mb-2">🎮</div>
                            <p className="text-xs text-smoke mb-2">Latest DBD content on TikTok</p>
                            <button
                                onClick={() => setShowVideo(true)}
                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-pink-500/20 border border-pink-500/50 rounded-lg text-pink-400 hover:bg-pink-500/30 transition-colors"
                            >
                                Load Preview
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/90">
                        <p className="text-xs text-smoke text-center p-4">
                            ⚠️ TikTok embed would go here<br />
                            <span className="text-[8px] text-pink-400 mt-1 block">
                                (Requires TikTok Embed API)
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between p-2 bg-black/60 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[8px] text-smoke">
                        <svg className="w-3 h-3 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                        </svg>
                        {creator.followers}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[8px] text-smoke">Active now</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[8px] text-pink-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Verified
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TikTokEmbed;