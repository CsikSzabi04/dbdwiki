import React from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommunityLegends from './CommunityLegends';
import {
    HomeIcon,
    NewspaperIcon,
    BookOpenIcon,
    BeakerIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const bottomNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'News', icon: NewspaperIcon, path: '/news' },
    { name: 'Wiki', icon: BookOpenIcon, path: '/wiki' },
    { name: 'Builds', icon: BeakerIcon, path: '/builds' },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
];

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-obsidian flex justify-center">
            <div className="w-full max-w-[1600px] flex">

                {/* Left Sidebar — hidden on mobile, icon-only on md, full on lg */}
                <aside className="hidden md:flex md:w-[80px] lg:w-[260px] h-screen sticky top-0 border-r border-white/5 py-4 px-2 lg:px-4 flex-col justify-between shrink-0">
                    <Sidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen pb-20 md:pb-0 md:border-r md:border-white/5">
                    {children}
                </main>

                {/* Right Sidebar (Hidden on small screens) */}
                <aside className="hidden xl:block w-[350px] h-screen sticky top-0 px-6 py-4 overflow-y-auto scrollbar-none shrink-0">
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
        </div>
    );
};

export default Layout;

