import React, { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import NewsFeed from '../components/News/NewsFeed';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

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
            <div className="relative min-h-screen">
                {/* Hero Section with Video/Header Overlay */}
                <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-obsidian/20 via-obsidian/40 to-obsidian" />

                    {/* Video Background */}
                    <div className="absolute inset-0 w-full h-full scale-105">
                        <iframe
                            src="https://www.youtube.com/embed/GBHMeo6_RRU?si=2T2J_f2-r22e2-M&autoplay=1&mute=1&controls=0&loop=1&playlist=GBHMeo6_RRU"
                            title="Dead by Daylight Featured Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            className="w-full h-full pointer-events-none opacity-60"
                        ></iframe>
                    </div>

                    {/* Content Overlay */}

                </div>

                <div className="relative z-30 -mt-20 px-4 md:px-8 pb-20">
                    <NewsFeed />
                </div>
            </div>
        </Layout>
    );
};

export default NewsPage;