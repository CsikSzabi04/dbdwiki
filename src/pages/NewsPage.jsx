import React, { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import NewsFeed from '../components/News/NewsFeed';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

const NewsPage = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [showControls, setShowControls] = useState(false);

    // Apply volume to video element whenever state changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    return (
        <Layout>
            <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-4 md:px-8 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Official News</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-smoke bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Steam Feed
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-8 pb-12">
                {/* Featured Video Section */}
                <section
                    className="relative w-full bg-black group"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    {/* Thematic top/bottom borders */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-dbd-red to-transparent opacity-50 z-10" />

                    <div className="relative w-full max-w-[1600px] mx-auto">

                        <div className="aspect-w-16 aspect-h-9 md:aspect-video w-full">
                            <iframe
                                src="https://www.youtube.com/embed/GBHMeo6_RRU?si=2T2J_f2-r22e2-M&autoplay=1&mute=1"
                                title="Dead by Daylight Featured Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full object-cover"
                            ></iframe>
                        </div>
                        {/* 
                        <div className="aspect-w-16 aspect-h-9 md:aspect-video w-full relative">
                            <video
                                ref={videoRef}
                                src="/dbd.mp4"
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                className="w-full h-full object-cover"
                            ></video>

                          
                            <div className={`absolute bottom-6 right-6 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 shadow-2xl rounded-full transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-dbd-red transition-colors focus:outline-none"
                                >
                                    {isMuted || volume === 0 ? (
                                        <SpeakerXMarkIcon className="w-5 h-5" />
                                    ) : (
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    )}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-dbd-red"
                                />
                            </div>
                        </div>
                        */}
                        {/* Overlay Gradients to blend into the dark theme */}
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian to-transparent pointer-events-none hidden md:block" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian to-transparent pointer-events-none hidden md:block" />
                    </div>

                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 z-10" />
                </section>

                <section className="max-w-[1600px] mx-auto w-full">
                    <NewsFeed />
                </section>
            </div>
        </Layout>
    );
};

export default NewsPage;