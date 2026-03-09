import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    NewspaperIcon,
    UserIcon,
    BeakerIcon,
    BookOpenIcon,
    GlobeAltIcon,
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
    const { user, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Escaped the Fog');
            navigate('/');
        } catch {
            toast.error('Failed to logout');
        }
    };

    const navItems = [
        { name: 'Home', icon: HomeIcon, path: '/' },
        { name: 'News', icon: NewspaperIcon, path: '/news' },
        { name: 'Wiki', icon: BookOpenIcon, path: '/wiki' },
        { name: 'Builds', icon: BeakerIcon, path: '/builds' },
        { name: 'Available On', icon: GlobeAltIcon, path: '/available-on' },
        { name: 'Profile', icon: UserIcon, path: '/profile', private: true },
    ];

    return (
        <aside className="w-full h-screen flex flex-col">
            {/* Logo */}
            <div className="p-4 lg:p-8">
                <h1 className="text-xl lg:text-3xl font-black italic tracking-tighter text-white text-center lg:text-left">
                    <span className="hidden lg:inline">DBD</span>
                    <span className="lg:hidden">D</span>
                    <span className="text-dbd-red">
                        <span className="hidden lg:inline">HUB</span>
                        <span className="lg:hidden">H</span>
                    </span>
                </h1>
                <p className="hidden lg:block text-[10px] uppercase tracking-[0.3em] text-smoke mt-1 opacity-50">Community Console</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 lg:px-4 space-y-1 lg:space-y-2">
                {navItems.map((item) => {
                    if (item.private && !user) return null;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center justify-center lg:justify-start gap-4 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-dbd-red/10 text-dbd-red border border-dbd-red/20'
                                    : 'text-smoke hover:bg-white/5 hover:text-white border border-transparent'}
                            `}
                            title={item.name}
                        >
                            <item.icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:inline font-bold uppercase tracking-widest text-xs">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* clear Section */}
            <div className="p-4 border-t border-white/5">
                <a
                    href="https://deadbydaylight.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="https://images.steamusercontent.com/ugc/988989114488731806/4F7547A4CD93085C38217C96CEB0E879BE91C4F0/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
                            alt="DBD Icon"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-bold uppercase tracking-widest text-sm text-white group-hover:text-dbd-red transition-colors">
                            Dead By Daylight
                        </span>
                    </div>
                    <img
                        src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg"
                        alt="Dead by Daylight"
                        className="w-full rounded-lg border border-white/10 group-hover:border-dbd-red/50 transition-colors"
                    />
                </a>
            </div>


            {/* User Profile / Auth Action */}
            <div className="p-2 lg:p-4 border-t border-white/5">
                {user ? (
                    <div className="space-y-2 lg:space-y-4">
                        <Link to="/profile" className="flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group" title="Profile">
                            <div className="w-10 h-10 rounded-lg bg-obsidian border border-white/10 overflow-hidden shadow-lg shrink-0">
                                <img
                                    src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden lg:block flex-1 overflow-hidden">
                                <p className="text-xs font-black text-white truncate uppercase italic">
                                    {userProfile?.displayName || user.email.split('@')[0]}
                                </p>
                                <p className="text-[10px] text-smoke font-bold uppercase tracking-wider">Survivor</p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl text-smoke hover:text-dbd-red hover:bg-dbd-red/5 transition-all group border border-transparent hover:border-dbd-red/20"
                            title="Log Out"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden lg:inline font-bold uppercase tracking-widest text-xs italic">Log Out</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-dbd-red text-white hover:bg-dbd-red/80 transition-all group shadow-lg shadow-red-900/20"
                            title="Sign In"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                            <span className="hidden lg:inline font-bold uppercase tracking-widest text-xs italic">Sign In</span>
                        </Link>
                        <p className="hidden lg:block text-[10px] text-center text-smoke uppercase tracking-widest mt-2 opacity-50">
                            Join the trial
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
