import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/Feed/PostCard';
import PostSkeleton from '../components/Feed/PostSkeleton';
import { subscribeToUserPosts, createPost } from '../firebase/posts';
import { getUserBuilds } from '../firebase/users';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    UserIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    FireIcon,
    TrophyIcon,
    XMarkIcon,
    PhotoIcon,
    ChatBubbleLeftRightIcon,
    ShareIcon
} from '@heroicons/react/24/outline';

// Load static characters for avatars
import survivorsData from '../hooks/survivors.json';
import killersData from '../hooks/killers.json';

const allAvatars = [...survivorsData, ...killersData]
    .filter(char => char.imgs?.portrait)
    .map(char => ({
        id: char.id || char.name,
        name: char.name,
        portrait: char.imgs.portrait
    }));

const getPrestigeLevel = (postCount) => {
    if (postCount < 10) return 1;
    if (postCount < 25) return 2;
    if (postCount < 50) return 3;
    if (postCount < 75) return 4;
    if (postCount < 100) return 5;
    return 6 + Math.floor((postCount - 100) / 50);
};

const ProfilePage = () => {
    const { user, userProfile, loading, updateAvatar, updateProfileInfo } = useAuth();
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ displayName: '', bio: '' });
    const [activeTab, setActiveTab] = useState('Overview');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [myPosts, setMyPosts] = useState([]);
    const [isPostsLoading, setIsPostsLoading] = useState(true);

    // Builds state
    const [savedBuilds, setSavedBuilds] = useState([]);
    const [isBuildsLoading, setIsBuildsLoading] = useState(true);

    // Share Build Modal state
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedBuildToShare, setSelectedBuildToShare] = useState(null);
    const [shareText, setShareText] = useState('');
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;

        setIsPostsLoading(true);
        const unsubscribe = subscribeToUserPosts(user.uid, (posts) => {
            setMyPosts(posts);
            setIsPostsLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Fetch user builds
    useEffect(() => {
        const fetchBuilds = async () => {
            if (!user?.uid) return;
            try {
                setIsBuildsLoading(true);
                const builds = await getUserBuilds(user.uid);
                setSavedBuilds(builds);
            } catch (error) {
                console.error("Error fetching builds:", error);
            } finally {
                setIsBuildsLoading(false);
            }
        };
        fetchBuilds();
    }, [user?.uid, isShareModalOpen]); // refetch when share modal closes, just to have fresh data though probably not strictly needed

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

    const displayName = userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity';
    const joinDate = userProfile?.createdAt
        ? new Date(userProfile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';
    const bio = userProfile?.bio || "The fog is quiet...";

    const handleOpenEditProfile = () => {
        setEditForm({
            displayName: displayName,
            bio: bio === "The fog is quiet..." ? "" : bio
        });
        setIsEditProfileModalOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await updateProfileInfo({
                displayName: editForm.displayName.trim() || displayName,
                bio: editForm.bio.trim()
            });
            toast.success("Profile updated successfully!");
            setIsEditProfileModalOpen(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

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

    const handleShareBuildClick = (build) => {
        setSelectedBuildToShare(build);
        setShareText(`Check out my new ${build.role} build: ${build.buildName}! It has a strength of ${build.strength}%.`);
        setIsShareModalOpen(true);
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        if (!shareText.trim() || !selectedBuildToShare) return;

        setIsSharing(true);
        try {
            // Include build data in the post content
            // Assuming post display logic can parse this or we just append it textually, 
            // but for a rich display we can save the build object in the post.

            // Format a textual representation for the feed (simpler approach if feed only supports text/images)
            const buildPerksText = selectedBuildToShare.perks.map(p => p.name).join(', ');
            const fullPostContent = `${shareText.trim()}\n\nBuild: ${selectedBuildToShare.buildName}\nRole: ${selectedBuildToShare.role.toUpperCase()}\nStrength: ${selectedBuildToShare.strength}%\nPerks: ${buildPerksText}`;

            await createPost({
                content: fullPostContent,
                authorId: user.uid,
                authorName: displayName,
                authorAvatar: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
                likes: [],
                comments: [],
                buildData: selectedBuildToShare // store it cleanly if Feed wants to render rich build card later
            });

            toast.success("Build shared successfully!");
            setIsShareModalOpen(false);
            setSelectedBuildToShare(null);
            setShareText('');
            setActiveTab('My Posts'); // switch to posts to see it
        } catch (error) {
            console.error("Error sharing build:", error);
            toast.error("Failed to share build.");
        } finally {
            setIsSharing(false);
        }
    };

    const tabs = ['Overview', 'My Posts', 'My Builds'];

    return (
        <Layout>
            <div className="max-w-[1200px] mx-auto p-3 sm:p-4 md:p-8 animate-fade-in relative">

                {/* Header Banner */}
                <div className="relative w-full h-40 sm:h-56 md:h-80 rounded-t-2xl overflow-hidden border border-white/10 z-0 shadow-2xl">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rotkbp70_Hd94dmciPGGIoy0w9AYsz2TKA&s"
                        alt="Profile Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent"></div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-dbd-red rounded-full blur-[80px] opacity-20 animate-pulse mix-blend-screen pointer-events-none"></div>
                </div>

                {/* Profile Info Section */}
                <div className="relative glass-card border flex flex-col items-center md:items-start md:flex-row gap-4 sm:gap-6 md:gap-8 border-white/10 rounded-b-2xl px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 z-10 -mt-12 sm:-mt-16 md:-mt-24 pt-16 sm:pt-20 md:pt-24 shadow-2xl">

                    <div className="absolute -top-12 sm:-top-16 md:top-2 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 z-50">
                        <div
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-obsidian border-4 border-obsidian shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer"
                        >
                            <img
                                src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile Avatar"
                                className={`w-full h-full object-cover relative z-10 transition-transform duration-500 ${isUpdatingAvatar ? 'opacity-50 blur-sm' : 'group-hover:scale-110'}`}
                            />
                            <div className="absolute bg-black/60 inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                                <PhotoIcon className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Change Portrait</span>
                            </div>
                            {isUpdatingAvatar && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 border-2 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 rounded-full bg-green-500 border-4 border-obsidian shadow-[0_0_15px_rgba(34,197,94,0.6)] z-40"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 w-full">
                        <div className="hidden md:block w-36 h-2"></div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md">
                                {displayName}
                            </h1>
                            <p className="text-dbd-red font-bold uppercase tracking-widest text-xs mt-1 flex items-center justify-center md:justify-start gap-2">
                                <FireIcon className="w-4 h-4" /> Entity's Favorite
                            </p>
                        </div>
                        <div className="flex justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
                            <button
                                onClick={handleOpenEditProfile}
                                className="px-6 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg w-full md:w-auto justify-center group"
                            >
                                <UserIcon className="w-4 h-4 text-smoke group-hover:text-white transition-colors" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6 px-2 sm:px-4">
                    <div className="glass-card border border-white/5 p-5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-dbd-red rounded-full"></div>
                            <span className="text-dbd-red font-black uppercase tracking-widest text-xs">BIO</span>
                        </div>
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed italic">"{bio}"</p>
                        <div className="flex items-center gap-4 mt-4 text-[10px] text-smoke font-bold uppercase tracking-widest">

                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10 mt-8 mb-6 overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap relative
                                ${activeTab === tab ? 'text-dbd-red' : 'text-smoke hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dbd-red shadow-[0_0_10px_rgba(255,18,18,0.5)]"></div>
                            )}
                            {tab === 'My Posts' && myPosts.length > 0 && (
                                <span className="ml-1.5 opacity-50 text-[10px]">({myPosts.length})</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="glass-card p-6 border border-white/10 hover:border-white/20 transition-colors group">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                    <TrophyIcon className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Trial Records</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-all cursor-default group/stat">
                                        <p className="text-3xl font-black text-white group-hover/stat:text-dbd-red transition-colors">{myPosts.length}</p>
                                        <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Posts Created</p>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-all cursor-default group/stat">
                                        <p className="text-3xl font-black text-white group-hover/stat:text-blue-400 transition-colors">{savedBuilds.length}</p>
                                        <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Builds Saved</p>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center hover:border-white/20 transition-all cursor-default col-span-2 relative overflow-hidden group/grade">
                                        <div className="relative z-10">
                                            <p className="text-3xl font-black text-dbd-red drop-shadow-[0_0_10px_rgba(255,18,18,0.5)]">Prestige {getPrestigeLevel(myPosts.length)}</p>
                                            <p className="text-[10px] text-smoke font-bold uppercase tracking-widest mt-1">Current Grade</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-dbd-red/5 to-transparent translate-x-[-100%] group-hover/grade:translate-x-[100%] transition-transform duration-1000"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 border border-white/10 hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                    <FireIcon className="w-5 h-5 text-dbd-red" />
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Recent Activity</h3>
                                </div>
                                <div className="flex flex-col items-center justify-center h-48 text-center opacity-50 relative group">
                                    {myPosts.length > 0 ? (
                                        <div className="space-y-4 w-full text-left">
                                            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                                                <div className="w-2 h-2 rounded-full bg-dbd-red animate-pulse"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs font-bold uppercase truncate">Latest Post</p>
                                                    <p className="text-smoke text-[10px] truncate">{myPosts[0].content}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-smoke/70 italic text-center">Showing your most recent activity in the Fog.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-smoke italic font-medium whitespace-pre-wrap px-4">The fog is quiet...</p>
                                            <p className="text-xs text-smoke/70 mt-2">Start posting or creating builds to leave your mark.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'My Posts' && (
                        <div className="animate-fade-in space-y-4">
                            {isPostsLoading ? (
                                <div className="divide-y divide-white/5 glass-card border border-white/5">
                                    {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
                                </div>
                            ) : myPosts.length > 0 ? (
                                <div className="glass-card border border-white/5 overflow-hidden divide-y divide-white/5">
                                    {myPosts.map((post, index) => (
                                        <PostCard key={post.id} post={post} isPriority={index === 0} />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-16 border border-white/10 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mb-6">
                                        <ChatBubbleLeftRightIcon className="w-10 h-10 text-smoke/20" />
                                    </div>
                                    <h3 className="text-xl font-black italic uppercase text-white mb-2 tracking-tighter">Silence in the Fog</h3>
                                    <p className="text-smoke text-sm max-w-sm mx-auto leading-relaxed">
                                        Your reports haven't reached the community yet. Share your experiences, highlights, or complaints about the Trials!
                                    </p>
                                    <button
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="mt-8 px-8 py-3 bg-dbd-red text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-dbd-red/80 transition-all shadow-xl"
                                    >
                                        Share Report
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'My Builds' && (
                        <div className="animate-fade-in space-y-4">
                            {isBuildsLoading ? (
                                <div className="text-center py-16">
                                    <div className="w-8 h-8 border-2 border-dbd-red rounded-full border-t-transparent animate-spin mx-auto"></div>
                                </div>
                            ) : savedBuilds.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedBuilds.map((build) => {
                                        const accentColor = build.role === 'killer' ? 'dbd-red' : 'blue-500';

                                        // Category logic from StrengthMeter
                                        let category = 'Best';
                                        if (build.strength <= 25) category = 'Weak';
                                        else if (build.strength <= 50) category = 'Balanced';
                                        else if (build.strength <= 75) category = 'Good';
                                        else if (build.strength <= 85) category = 'Strong';

                                        return (
                                            <div key={build.id} className={`glass-card p-5 border border-white/10 hover:border-${accentColor}/50 transition-all group flex flex-col justify-between`}>
                                                <div>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="text-lg font-black text-white italic truncate pr-2">{build.buildName}</h4>
                                                        <span className={`px-2 py-1 bg-${accentColor}/20 text-${accentColor} text-[10px] font-bold uppercase tracking-widest rounded`}>
                                                            {build.role}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="text-2xl font-black text-white">{build.strength}%</div>
                                                        <div className={`text-xs font-bold uppercase text-${accentColor}`}>{category}</div>
                                                    </div>

                                                    <div className="flex gap-2 mb-6">
                                                        {build.perks && build.perks.map((perk, i) => (
                                                            <div key={i} className="w-10 h-10 rounded bg-black/40 border border-white/10 p-1 tooltip-trigger relative">
                                                                <img src={perk.icon} alt={perk.name} className="w-full h-full object-cover rounded-sm" title={perk.name} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleShareBuildClick(build)}
                                                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <ShareIcon className="w-4 h-4" /> Share Build
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 glass-card border border-white/10">
                                    <TrophyIcon className="w-12 h-12 text-smoke/30 mx-auto mb-4" />
                                    <h3 className="text-xl font-black italic uppercase text-white mb-2">No Equipment Registered</h3>
                                    <p className="text-smoke text-sm max-w-sm mx-auto mb-6">You haven't saved any perk loadouts yet. Visit the Perk Wiki to experiment with synergies!</p>
                                    <a href="/wiki" className="inline-block px-8 py-3 border border-dbd-red text-dbd-red text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-dbd-red/10 transition-all">Browse Perks</a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Avatar Selection Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAvatarModalOpen(false)}></div>
                    <div className="glass-card w-full max-w-4xl max-h-[85vh] flex flex-col relative border border-white/10 shadow-2xl animate-scale-up overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white">Select Avatar</h2>
                                <p className="text-xs text-smoke mt-1">Choose a portrait from any Survivor or Killer.</p>
                            </div>
                            <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 text-smoke hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-dbd-red/50 scrollbar-track-transparent">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                {allAvatars.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAvatarSelect(avatar.portrait)}
                                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-dbd-red transition-all bg-obsidian-light"
                                    >
                                        <img src={avatar.portrait} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                            <span className="text-[8px] font-bold text-white uppercase text-center px-1 truncate w-full">{avatar.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditProfileModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsEditProfileModalOpen(false)}></div>
                    <div className="glass-card w-full max-w-md relative border border-white/10 shadow-2xl animate-scale-up overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white">Edit Profile</h2>
                                <p className="text-xs text-smoke mt-1">Update your display name and bio.</p>
                            </div>
                            <button onClick={() => setIsEditProfileModalOpen(false)} className="p-2 text-smoke hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Display Name</label>
                                <input
                                    type="text"
                                    maxLength={25}
                                    value={editForm.displayName}
                                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors"
                                    placeholder="Enter display name"
                                    required
                                />
                                <div className="text-right text-[10px] text-smoke mt-1">{editForm.displayName.length} / 25</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Biography</label>
                                <textarea
                                    rows={4}
                                    maxLength={150}
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors resize-none"
                                    placeholder="Tell your story..."
                                />
                                <div className="text-right text-[10px] text-smoke mt-1">{editForm.bio.length} / 150</div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditProfileModalOpen(false)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-smoke hover:text-white transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="px-6 py-2.5 bg-dbd-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-dbd-red/80 transition-all disabled:opacity-50 min-w-[120px]"
                                >
                                    {isSavingProfile ? <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin mx-auto"></div> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Share Build Modal */}
            {isShareModalOpen && selectedBuildToShare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !isSharing && setIsShareModalOpen(false)}></div>
                    <div className="glass-card w-full max-w-lg relative border border-white/10 shadow-2xl animate-scale-up overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white">Share Build</h2>
                                <p className="text-xs text-smoke mt-1">Post your build to the community feed.</p>
                            </div>
                            <button onClick={() => !isSharing && setIsShareModalOpen(false)} className="p-2 text-smoke hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleShareSubmit} className="p-6 space-y-4">
                            {/* Build Preview */}
                            <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4">
                                <h4 className="text-dbd-red font-black text-sm uppercase italic mb-2">{selectedBuildToShare.buildName}</h4>
                                <div className="flex items-center gap-2">
                                    {selectedBuildToShare.perks.map((p, i) => (
                                        <img key={i} src={p.icon} alt={p.name} className="w-8 h-8 rounded bg-obsidian border border-white/10 object-cover" />
                                    ))}
                                    <span className="text-xs font-bold text-white ml-2">Strength: {selectedBuildToShare.strength}%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Post Description</label>
                                <textarea
                                    rows={3}
                                    maxLength={200}
                                    value={shareText}
                                    onChange={(e) => setShareText(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors resize-none"
                                    placeholder="Say something about this build..."
                                    required
                                />
                                <div className="text-right text-[10px] text-smoke mt-1">{shareText.length} / 200</div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsShareModalOpen(false)} disabled={isSharing} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-smoke hover:text-white transition-all disabled:opacity-50">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSharing || !shareText.trim()}
                                    className="px-6 py-2.5 bg-dbd-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-dbd-red/80 transition-all disabled:opacity-50 min-w-[120px] shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSharing ? <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin mx-auto"></div> : <><ShareIcon className="w-4 h-4" /> Share to Feed</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProfilePage;
