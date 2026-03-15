import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/Feed/PostCard';
import PostSkeleton from '../components/Feed/PostSkeleton';
import { getUserProfile } from '../firebase/users';
import { subscribeToUserPosts } from '../firebase/posts';
import {
    UserIcon,
    CalendarDaysIcon,
    FireIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';

const getPrestigeLevel = (postCount) => {
    if (postCount < 10) return 1;
    if (postCount < 25) return 2;
    if (postCount < 50) return 3;
    if (postCount < 75) return 4;
    if (postCount < 100) return 5;
    return 6 + Math.floor((postCount - 100) / 50);
};

const UserProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [notFound, setNotFound] = useState(false);

    // Fetch the user's profile data
    useEffect(() => {
        if (!userId) return;
        setIsProfileLoading(true);
        getUserProfile(userId)
            .then((data) => {
                if (!data) setNotFound(true);
                else setProfile(data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setIsProfileLoading(false));
    }, [userId]);

    // Subscribe to this user's posts
    useEffect(() => {
        if (!userId) return;
        setIsPostsLoading(true);
        const unsubscribe = subscribeToUserPosts(userId, (fetchedPosts) => {
            setPosts(fetchedPosts);
            setIsPostsLoading(false);
        });
        return () => unsubscribe();
    }, [userId]);

    const tabs = ['Overview', 'Posts'];

    if (isProfileLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-dbd-red/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-dbd-red font-black uppercase tracking-[0.3em] animate-pulse">Loading Archive</p>
                </div>
            </Layout>
        );
    }

    if (notFound) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                    <div className="text-6xl">👁️</div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Entity Unknown</h2>
                    <p className="text-smoke text-sm">This survivor has escaped the fog or never existed.</p>
                    <Link to="/" className="mt-4 px-4 py-2 bg-dbd-red/20 border border-dbd-red/40 text-dbd-red rounded-xl text-sm font-bold hover:bg-dbd-red/30 transition-colors">
                        Return to Home
                    </Link>
                </div>
            </Layout>
        );
    }

    const displayName = profile?.displayName || 'Unknown Entity';
    const joinDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';
    const bio = profile?.bio || 'The fog is quiet...';
    const prestige = getPrestigeLevel(posts.length);

    return (
        <Layout>
            <div className="max-w-[1200px] mx-auto p-3 sm:p-4 md:p-8 animate-fade-in relative">

                {/* Header Banner */}
                <div className="relative w-full h-40 sm:h-56 md:h-64 rounded-t-2xl overflow-hidden border border-white/10 z-0 shadow-2xl">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rotkbp70_Hd94dmciPGGIoy0w9AYsz2TKA&s"
                        alt="Profile Cover"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent"></div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-dbd-red rounded-full blur-[80px] opacity-20 animate-pulse mix-blend-screen pointer-events-none"></div>
                </div>

                {/* Profile Info Section */}
                <div className="relative glass-card border border-white/10 rounded-b-2xl px-4 sm:px-6 md:px-10 pb-6 z-10 -mt-16 sm:-mt-20 md:-mt-24 pt-20 sm:pt-24 md:pt-28 shadow-2xl flex flex-col items-center md:items-start md:flex-row gap-4 sm:gap-6 md:gap-8">

                    {/* Avatar */}
                    <div className="absolute -top-12 sm:-top-16 md:top-2 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 z-50">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 lg:w-40 md:h-36 lg:h-40 rounded-full bg-obsidian border-4 border-obsidian shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                            <img
                                src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-slate-500 border-4 border-obsidian z-40"></div>
                    </div>

                    {/* Text info */}
                    <div className="w-full pt-14 md:pt-0 md:pl-44 lg:pl-52 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{displayName}</h1>
                            <p className="text-smoke text-sm mt-0.5">@{displayName.toLowerCase().replace(/\s+/g, '')}</p>
                            <p className="text-smoke text-sm mt-2 max-w-md italic">{bio}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 sm:gap-4 justify-center md:justify-end flex-wrap">
                            <div className="flex flex-col items-center min-w-[60px] glass-card border border-white/10 rounded-xl px-3 py-2">
                                <span className="text-xl font-black text-white">{posts.length}</span>
                                <span className="text-[10px] text-smoke uppercase tracking-widest">Posts</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px] glass-card border border-white/10 rounded-xl px-3 py-2">
                                <span className="text-xl font-black text-dbd-red">{prestige}</span>
                                <span className="text-[10px] text-smoke uppercase tracking-widest">Prestige</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-2 mt-4 text-smoke text-xs">
                    <span className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4 text-dbd-red/70" />
                        Joined {joinDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FireIcon className="w-4 h-4 text-dbd-red/70" />
                        Prestige {prestige}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <TrophyIcon className="w-4 h-4 text-dbd-red/70" />
                        {posts.length} Posts
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4 border-b border-white/5 mb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab
                                ? 'text-white border-b-2 border-dbd-red -mb-px'
                                : 'text-smoke hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'Overview' && (
                    <div className="glass-card border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-smoke/60">BIO</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{bio}</p>
                        <hr className="border-white/5" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-smoke" />
                                <div>
                                    <p className="text-[10px] text-smoke uppercase tracking-widest">Username</p>
                                    <p className="text-sm font-bold text-white">{displayName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FireIcon className="w-5 h-5 text-smoke" />
                                <div>
                                    <p className="text-[10px] text-smoke uppercase tracking-widest">Prestige</p>
                                    <p className="text-sm font-bold text-white">{prestige}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarDaysIcon className="w-5 h-5 text-smoke" />
                                <div>
                                    <p className="text-[10px] text-smoke uppercase tracking-widest">Joined</p>
                                    <p className="text-sm font-bold text-white">{joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Posts' && (
                    <div className="animate-fade-in">
                        {isPostsLoading ? (
                            <div className="glass-card border border-white/5 divide-y divide-white/5">
                                {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="glass-card border border-white/5 overflow-hidden divide-y divide-white/5">
                                {posts.map((post, index) => (
                                    <PostCard key={post.id} post={post} isPriority={index === 0} />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card border border-white/10 rounded-2xl p-12 text-center">
                                <TrophyIcon className="w-10 h-10 text-smoke/30 mx-auto mb-3" />
                                <p className="text-smoke text-sm">No posts yet from this survivor.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserProfilePage;
