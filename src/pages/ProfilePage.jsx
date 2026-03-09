import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    UserIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    FireIcon,
    TrophyIcon,
    XMarkIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

// Load static characters for avatars
import survivorsData from '../hooks/survivors.json';
import killersData from '../hooks/killers.json';

const allAvatars = [...survivorsData, ...killersData]
    .filter(char => char.imgs?.portrait) // Ensure they have a portrait
    .map(char => ({
        id: char.id || char.name,
        name: char.name,
        portrait: char.imgs.portrait
    }));

const ProfilePage = () => {
    const { user, userProfile, loading, updateAvatar } = useAuth();
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    // If not logged in and auth state is finished loading, redirect to login
    if (!loading && !user) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-dbd-red/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-dbd-red font-black uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(255,18,18,0.5)]">
                        Loading Archive
                    </p>
                </div>
            </Layout>
        );
    }

    // Determine display name
    const displayName = userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity';
    const joinDate = userProfile?.createdAt
        ? new Date(userProfile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';

    const handleAvatarSelect = async (portraitUrl) => {
        setIsUpdatingAvatar(true);
        try {
            await updateAvatar(portraitUrl);
            toast.success("Avatar updated successfully!");
            setIsAvatarModalOpen(false);
        } catch {
            toast.error("Failed to update avatar.");
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const tabs = ['Overview', 'My Posts', 'My Builds'];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 animate-fade-in relative">

                {/* Header Banner - Facebook Style Cover Photo */}
                <div className="relative w-full h-40 sm:h-56 md:h-80 rounded-t-2xl overflow-hidden border border-white/10 z-0">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rotkbp70_Hd94dmciPGGIoy0w9AYsz2TKA&s"
                        alt="Profile Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

                    {/* Floating Blood Orbs (Decorative Overlay) */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-dbd-red rounded-full blur-[80px] opacity-20 animate-pulse mix-blend-screen pointer-events-none"></div>
                </div>

                {/* Profile Info Section */}
                <div className="relative glass-card border flex flex-col items-center md:items-start md:flex-row gap-4 sm:gap-6 md:gap-8 border-white/10 rounded-b-2xl px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 z-10 -mt-12 sm:-mt-16 md:-mt-24 pt-16 sm:pt-20 md:pt-24 shadow-xl">

                    {/* Absolute positioned Avatar Container to overlap both Cover and Info beautifully */}
                    <div className="absolute -top-12 sm:-top-16 md:top-2 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 z-50">
                        <div
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-obsidian border-4 border-obsidian shadow-2xl overflow-hidden relative group cursor-pointer"
                        >
                            <img
                                src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile Avatar"
                                className={`w-full h-full object-cover relative z-10 transition-transform duration-500 ${isUpdatingAvatar ? 'opacity-50 blur-sm' : 'group-hover:scale-110'}`}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-1 backdrop-blur-[2px]">
                                <PhotoIcon className="w-8 h-8 text-white" />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest text-center">Change</span>
                            </div>

                            {isUpdatingAvatar && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                                    <div className="w-8 h-8 border-2 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                                </div>
                            )}
                        </div>
                        {/* Status badge */}
                        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 rounded-full bg-green-500 border-4 border-obsidian shadow-[0_0_10px_rgba(34,197,94,0.5)] z-40"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 w-full">

                        {/* Empty Space for the Absolute Avatar on Desktop */}
                        <div className="hidden md:block w-36 h-2"></div>

                        {/* User Details */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md">
                                {displayName}
                            </h1>
                            <p className="text-dbd-red font-bold uppercase tracking-widest text-xs mt-1">
                                Entity's Favorite
                            </p>
                        </div>

                        {/* Edit Profile Action */}
                        <div className="flex justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
                            <button
                                onClick={() => setIsAvatarModalOpen(true)}
                                className="px-6 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                            >
                                <UserIcon className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Info Row */}
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-6 mt-4 sm:mt-6 px-2 sm:px-4">
                    <div className="flex items-center gap-3 text-smoke">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <EnvelopeIcon className="w-4 h-4 text-smoke" />
                        </div>
                        <span className="text-sm font-medium">{user?.email}</span>
                    </div>

                </div>

                {/* Professional Tabs */}
                <div className="flex gap-4 border-b border-white/10 mt-8 mb-6 overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${activeTab === tab
                                    ? 'text-dbd-red border-b-2 border-dbd-red'
                                    : 'text-smoke hover:text-white border-b-2 border-transparent'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {/* Stats Card */}
                        <div className="glass-card p-6 border border-white/10">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Trial Records</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-colors cursor-default">
                                    <p className="text-3xl font-black text-white">0</p>
                                    <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Posts Created</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-colors cursor-default">
                                    <p className="text-3xl font-black text-white">0</p>
                                    <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Builds Saved</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-colors cursor-default col-span-2">
                                    <p className="text-3xl font-black text-dbd-red drop-shadow-[0_0_10px_rgba(255,18,18,0.5)]">Prestige 1</p>
                                    <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Current Grade</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="glass-card p-6 border border-white/10">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                <FireIcon className="w-5 h-5 text-dbd-red" />
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Recent Activity</h3>
                            </div>
                            <div className="flex flex-col items-center justify-center h-48 text-center opacity-50">
                                <p className="text-smoke italic font-medium">The fog is quiet...</p>
                                <p className="text-xs text-smoke/70 mt-2">Start posting or creating builds to leave your mark.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'My Posts' && (
                    <div className="glass-card p-12 border border-white/10 flex flex-col items-center justify-center text-center animate-fade-in">
                        <FireIcon className="w-12 h-12 text-smoke/30 mb-4" />
                        <h3 className="text-xl font-black italic uppercase text-white mb-2">No Reports Found</h3>
                        <p className="text-smoke text-sm">You haven't shared any trials with the community yet.</p>
                    </div>
                )}

                {activeTab === 'My Builds' && (
                    <div className="glass-card p-12 border border-white/10 flex flex-col items-center justify-center text-center animate-fade-in">
                        <TrophyIcon className="w-12 h-12 text-smoke/30 mb-4" />
                        <h3 className="text-xl font-black italic uppercase text-white mb-2">No Builds Registered</h3>
                        <p className="text-smoke text-sm">Create and save your favorite perk combinations to see them here.</p>
                    </div>
                )}

            </div>

            {/* Avatar Selection Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsAvatarModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="glass-card w-full max-w-4xl max-h-[85vh] flex flex-col relative border border-white/10 shadow-2xl animate-scale-up">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white">Select Avatar</h2>
                                <p className="text-xs text-smoke mt-1">Choose a portrait from any Survivor or Killer.</p>
                            </div>
                            <button
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="p-2 text-smoke hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Avatar Grid */}
                        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-dbd-red/50 scrollbar-track-transparent">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
                                {allAvatars.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAvatarSelect(avatar.portrait)}
                                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-dbd-red transition-all focus:outline-none focus:border-dbd-red bg-obsidian-light"
                                    >
                                        <img
                                            src={avatar.portrait}
                                            alt={avatar.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                            <span className="text-[8px] font-bold text-white uppercase text-center px-1 truncate w-full">
                                                {avatar.name}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProfilePage;
