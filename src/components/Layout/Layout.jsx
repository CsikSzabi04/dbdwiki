import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import CommunityLegends from './CommunityLegends';
import {
    HomeIcon,
    NewspaperIcon,
    BookOpenIcon,
    BeakerIcon,
    UserIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CreatePost from '../Feed/CreatePost';
import { createPost } from '../../firebase/posts';
import { toast } from 'react-hot-toast';

const bottomNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Explore', icon: MagnifyingGlassIcon, path: '/explore' },
    { name: 'Post', icon: PlusIcon, isAction: true },
    { name: 'Guides', icon: BookOpenIcon, isDropdown: true },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
];

const Layout = ({ children }) => {
    const [qrModalData, setQrModalData] = useState(null); // null, 'insta', or 'discord'
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isGuidesMenuOpen, setIsGuidesMenuOpen] = useState(false);

    useEffect(() => {
        const handleOpenQr = (e) => setQrModalData(e.detail?.type || 'insta');
        window.addEventListener('open-qr-modal', handleOpenQr);
        return () => window.removeEventListener('open-qr-modal', handleOpenQr);
    }, []);

    const handleCreatePost = async (newPostData) => {
        try {
            await createPost(newPostData);
            toast.success("Post published to the Fog!");
            setIsCreatePostOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to publish post.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen bg-obsidian flex justify-center w-full"
        >
            <div className="w-full max-w-[1790px] flex">

                {/* Left Sidebar — hidden on mobile, icon-only on md, full on lg */}
                <aside className="hidden md:flex md:w-[100px] lg:w-[300px] h-screen sticky top-0 border-r border-white/5 py-4 px-2 lg:px-4 flex-col justify-between shrink-0">
                    <Sidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen pb-20 md:pb-0 md:border-r md:border-white/5 overflow-x-hidden relative">
                    {children}
                </main>

                {/* Right Sidebar (Hidden on small screens) */}
                <aside className="hidden xl:block w-[400px] h-screen sticky top-0 px-6 py-4 overflow-hidden shrink-0">
                    <CommunityLegends />
                </aside>

            </div>

            {/* Mobile Bottom Navigation — visible only on mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-obsidian/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 relative">
                    {bottomNavItems.map((item) => {
                        if (item.isAction) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setIsCreatePostOpen(true);
                                        setIsGuidesMenuOpen(false);
                                    }}
                                    className="flex flex-col items-center justify-center gap-1 rounded-[1.25rem] transition-all duration-200 -mt-8 bg-dbd-red text-white p-4 shadow-[0_0_20px_rgba(236,72,153,0.3)] border border-red-500 hover:scale-105 z-50 mb-2"
                                >
                                    <item.icon className="w-6 h-6 stroke-2" />
                                </button>
                            );
                        }

                        if (item.isDropdown) {
                            return (
                                <div key={item.name} className="relative flex flex-col items-center">
                                    <button
                                        onClick={() => setIsGuidesMenuOpen(!isGuidesMenuOpen)}
                                        className={`
                                            flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200
                                            ${isGuidesMenuOpen ? 'text-dbd-red' : 'text-smoke hover:text-white'}
                                        `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
                                    </button>

                                    {/* Smooth popup menu for Guides */}
                                    <AnimatePresence>
                                        {isGuidesMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-obsidian border border-white/10 p-2 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col gap-1.5 min-w-[130px] z-50 overflow-hidden"
                                            >
                                                <NavLink
                                                    to="/wiki"
                                                    onClick={() => setIsGuidesMenuOpen(false)}
                                                    className={({ isActive }) => `flex items-center gap-2.5 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-dbd-red/20 border border-dbd-red/30 text-dbd-red' : 'bg-obsidian-light/50 border border-white/5 text-smoke hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <BookOpenIcon className="w-4 h-4 text-dbd-red" /> Wiki
                                                </NavLink>
                                                <NavLink
                                                    to="/builds"
                                                    onClick={() => setIsGuidesMenuOpen(false)}
                                                    className={({ isActive }) => `flex items-center gap-2.5 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-dbd-red/20 border border-dbd-red/30 text-dbd-red' : 'bg-obsidian-light/50 border border-white/5 text-smoke hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <BeakerIcon className="w-4 h-4 text-dbd-red" /> Builds
                                                </NavLink>
                                                <NavLink
                                                    to="/rooms"
                                                    onClick={() => setIsGuidesMenuOpen(false)}
                                                    className={({ isActive }) => `flex items-center gap-2.5 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-dbd-red/20 border border-dbd-red/30 text-dbd-red' : 'bg-obsidian-light/50 border border-white/5 text-smoke hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-dbd-red" /> Rooms
                                                </NavLink>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsGuidesMenuOpen(false)}
                                className={({ isActive }) => `
                                    flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'text-dbd-red'
                                        : 'text-smoke hover:text-white'}
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Create Post Modal */}
            <AnimatePresence>
                {isCreatePostOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed inset-0 z-[100] md:hidden bg-obsidian flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 bg-obsidian-light/80 backdrop-blur-md border-b border-white/10 shrink-0">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                New Post<span className="text-dbd-red">.</span>
                            </h2>
                            <button
                                onClick={() => setIsCreatePostOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-obsidian overflow-y-auto custom-scrollbar">
                            <CreatePost onSubmit={handleCreatePost} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Expanded QR Code Modal */}
            {qrModalData && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setQrModalData(null)}
                >
                    <div
                        className="relative max-w-sm w-full bg-obsidian-light rounded-xl border border-white/10 p-6 flex flex-col items-center gap-4 animate-scaleUp"
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
                    >
                        <button
                            onClick={() => setQrModalData(null)}
                            className="absolute top-4 right-4 text-smoke hover:text-dbd-red transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 w-full justify-center">
                            {qrModalData === 'discord' ? (
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    Join The Fog
                                </h3>
                            ) : (
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                    @dbdcommunity_hub
                                </h3>
                            )}
                        </div>

                        <div className={`relative w-full aspect-square max-w-[280px] mx-auto bg-white rounded-xl p-4 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] ${qrModalData === 'discord' ? 'shadow-blue-500/30' : ''}`}>
                            <img
                                src={qrModalData === 'discord' ? "/dcqr.png" : "/qrcode.png"}
                                alt="QR Code Enlarged"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="text-center text-smoke text-sm">
                            {qrModalData === 'discord' 
                                ? "Scan this QR code with your phone's camera to join our Discord server!" 
                                : "Scan this QR code with your phone's camera to join our Instagram community!"}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Layout;
