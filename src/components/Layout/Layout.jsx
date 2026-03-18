import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import CommunityLegends from './CommunityLegends';
import {
    HomeIcon,
    NewspaperIcon,
    BookOpenIcon,
    BeakerIcon,
    UserIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';

const bottomNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Explore', icon: MagnifyingGlassIcon, path: '/explore' },
    { name: 'News', icon: NewspaperIcon, path: '/news' },
    { name: 'Wiki', icon: BookOpenIcon, path: '/wiki' },
    { name: 'Builds', icon: BeakerIcon, path: '/builds' },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
];

const Layout = ({ children }) => {
    const [isQrExpanded, setIsQrExpanded] = useState(false);

    useEffect(() => {
        const handleOpenQr = () => setIsQrExpanded(true);
        window.addEventListener('open-qr-modal', handleOpenQr);
        return () => window.removeEventListener('open-qr-modal', handleOpenQr);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen bg-obsidian flex justify-center"
        >
            <div className="w-full max-w-[1700px] flex">

                {/* Left Sidebar — hidden on mobile, icon-only on md, full on lg */}
                <aside className="hidden md:flex md:w-[100px] lg:w-[300px] h-screen sticky top-0 border-r border-white/5 py-4 px-2 lg:px-4 flex-col justify-between shrink-0">
                    <Sidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen pb-20 md:pb-0 md:border-r md:border-white/5">
                    {children}
                </main>

                {/* Right Sidebar (Hidden on small screens) */}
                <aside className="hidden xl:block w-[400px] h-screen sticky top-0 px-6 py-4 overflow-y-auto scrollbar-none shrink-0">
                    <CommunityLegends />
                </aside>

            </div>

            {/* Mobile Bottom Navigation — visible only on mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                    {bottomNavItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
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
                    ))}
                </div>
            </nav>

            {/* Global Expanded QR Code Modal */}
            {isQrExpanded && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setIsQrExpanded(false)}
                >
                    <div
                        className="relative max-w-sm w-full bg-obsidian-light rounded-xl border border-white/10 p-6 flex flex-col items-center gap-4 animate-scaleUp"
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
                    >
                        <button
                            onClick={() => setIsQrExpanded(false)}
                            className="absolute top-4 right-4 text-smoke hover:text-dbd-red transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 w-full justify-center">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                @dbdcommunity_hub
                            </h3>
                        </div>

                        <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-white rounded-xl p-4 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                            <img
                                src="/qrcode.png"
                                alt="Instagram QR Code Enlarged"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="text-center text-smoke text-sm">
                            Scan this QR code with your phone's camera to join our Instagram community!
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Layout;
