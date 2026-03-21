import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { generateBotProfile, generateBotPost, botAuth, botDb, initBotApp, BOT_PASSWORD, botSocialActivity, cleanupBotApp } from '../utils/botGenerator';
import { SparklesIcon, PlusIcon, BoltIcon, ClockIcon, UserGroupIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import survivorPerks from '../hooks/survivorperks.json';
import killerPerks from '../hooks/killersperks.json';

const compressImage = (base64Str, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); 
    };
  });
};

const BotAdminDashboard = () => {
    const navigate = useNavigate();
    const [bots, setBots] = useState([]);
    const [selectedBot, setSelectedBot] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Manual post state
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    
    // Auto Gen UI state
    const [isAutoGenerating, setIsAutoGenerating] = useState(false);
    
    // Bot Profile Edit state
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    
    // File input refs
    const postFileInputRef = React.useRef(null);
    const avatarFileInputRef = React.useRef(null);

    useEffect(() => {
        // Auth Guard
        if (sessionStorage.getItem('botAdminAuth') !== 'true') {
            navigate('/botadmin04');
            return;
        }
        fetchBots();
    }, [navigate]);

    useEffect(() => {
        if (selectedBot) {
            setEditName(selectedBot.displayName || '');
            setEditBio(selectedBot.bio || '');
        }
    }, [selectedBot]);

    const fetchBots = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "users"),
                where("isBot", "==", true)
            );
            const snapshot = await getDocs(q);
            const botList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Order locally since we queried by email
            botList.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            setBots(botList);
        } catch (error) {
            console.error("Error fetching bots:", error);
            toast.error("Failed to load bots.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBot = async () => {
        const loadingToast = toast.loading('Initiating Entity bot protocol...');
        try {
            const newBot = await generateBotProfile();
            toast.success(`Bot ${newBot.displayName} created!`, { id: loadingToast });
            // Kick off social activity (non-blocking)
            botSocialActivity(newBot).catch(console.warn);
            fetchBots();
        } catch (error) {
            toast.error('Failed to create bot.', { id: loadingToast });
        }
    };

    const handleDeleteBot = async () => {
        if (!selectedBot) return;
        if (!window.confirm(`Are you sure you want to completely erase ${selectedBot.displayName} and all their posts?`)) return;

        const loadingToast = toast.loading('Erasing from the Fog...');
        try {
            // Initiate the secondary app
            initBotApp();
            
            let useBotDb = false;
            try {
                // Try logging in as the bot so we get native "self-delete" permissions
                await signInWithEmailAndPassword(botAuth, selectedBot.email, BOT_PASSWORD);
                useBotDb = true;
            } catch (authError) {
                console.warn("Could not log into bot account natively (might be an old bot with random password). Executing via primary credentials...");
            }

            // Target whichever DB verified auth context
            const activeDb = useBotDb ? botDb : db;

            // Delete all posts
            const q = query(collection(activeDb, "posts"), where("authorId", "==", selectedBot.uid));
            const postsSnap = await getDocs(q);
            const deletePromises = postsSnap.docs.map(postDoc => deleteDoc(doc(activeDb, "posts", postDoc.id)));
            await Promise.all(deletePromises);

            // Delete user and pfp
            await deleteDoc(doc(activeDb, "pfp", selectedBot.uid));
            await deleteDoc(doc(activeDb, "users", selectedBot.uid));

            // Also delete the Auth entry if we successfully logged in natively
            if (useBotDb && botAuth.currentUser) {
                await deleteUser(botAuth.currentUser);
            }

            toast.success('Bot successfully erased.', { id: loadingToast });
            setSelectedBot(null);
            fetchBots();
        } catch (error) {
            console.error("Delete Bot Error:", error);
            // Help the user diagnose rule errors if the primary credential failed
            if (error.code === 'permission-denied') {
                toast.error("Permission Denied: Old bot without standard password, and your current account lacks Admin Firestore bypass rules.", { id: loadingToast, duration: 8000 });
            } else {
                toast.error("Failed to delete bot.", { id: loadingToast });
            }
        } finally {
            await cleanupBotApp();
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!selectedBot || !editName.trim()) return;

        setIsUpdatingProfile(true);
        const toastId = toast.loading('Rewriting bot identity...');
        try {
            initBotApp();
            await signInWithEmailAndPassword(botAuth, selectedBot.email, BOT_PASSWORD);

            await updateDoc(doc(botDb, 'users', selectedBot.uid), {
                displayName: editName.trim(),
                bio: editBio.trim()
            });

            // Update local state
            const updatedBot = { ...selectedBot, displayName: editName.trim(), bio: editBio.trim() };
            setSelectedBot(updatedBot);
            setBots(prev => prev.map(b => b.uid === selectedBot.uid ? updatedBot : b));
            
            toast.success('Identity rewritten!', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile.', { id: toastId });
        } finally {
            await cleanupBotApp();
            setIsUpdatingProfile(false);
        }
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const toastId = toast.loading('Updating bot avatar...');
                try {
                    const compressed = await compressImage(reader.result, 400, 400);

                    initBotApp();
                    await signInWithEmailAndPassword(botAuth, selectedBot.email, BOT_PASSWORD);
                    
                    // Update PFP col and Users col using the secondary (bot) app
                    await setDoc(doc(botDb, 'pfp', selectedBot.uid), { pfps: compressed });
                    await updateDoc(doc(botDb, 'users', selectedBot.uid), { photoURL: compressed });
                    
                    // Update local state
                    setSelectedBot(prev => ({ ...prev, photoURL: compressed }));
                    setBots(prev => prev.map(b => b.uid === selectedBot.uid ? { ...b, photoURL: compressed } : b));
                    toast.success('Avatar updated!', { id: toastId });
                } catch (error) {
                    toast.error('Failed to update avatar.', { id: toastId });
                } finally {
                    await cleanupBotApp();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result);
                setPostImage(compressed);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleManualPost = async (e) => {
        e.preventDefault();
        if (!selectedBot || !postText.trim()) return;

        setIsPosting(true);
        try {
            const scheduledTime = scheduleDate ? new Date(scheduleDate) : null;
            // Since we don't have the bot's raw password later, generating a post manually 
            // from the dashboard requires the admin privilege bypass.
            // Wait, we need the bot's password to login natively in secondary app.
            // But we don't store passwords! 
            // Ah! The `generateBotPost` from botGenerator requires `botUser.password`.
            // Instead of logging in as the bot, we can just use the admin's session to write to 'posts'
            // because `allow create: if request.auth != null;` handles it cleanly in Firestore rules!
            
            // Let's create the post directly with primary DB
            const { addDoc, serverTimestamp } = await import('firebase/firestore');
            const createdAt = scheduledTime ? Timestamp.fromDate(scheduledTime) : serverTimestamp();
            
            const newPostData = {
                authorId: selectedBot.uid,
                content: postText.trim(),
                authorName: selectedBot.displayName,
                authorAvatar: selectedBot.photoURL,
                likes: 0,
                likedBy: [],
                views: 0,
                commentsCount: 0,
                tags: [],
                createdAt: createdAt,
                updatedAt: createdAt
            };

            if (postImage) {
                newPostData.imageUrl = postImage;
            }
            
            await addDoc(collection(db, "posts"), newPostData);

            toast.success(scheduledTime ? "Post scheduled!" : "Posted successfully!");
            setPostText('');
            setPostImage(null);
            setScheduleDate('');
            if (postFileInputRef.current) postFileInputRef.current.value = '';
        } catch (error) {
            console.error(error);
            toast.error("Failed to post.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleAutomaticGen = async () => {
        if (!window.confirm("This will create a new bot and schedule a random perk build post. Proceed?")) return;

        setIsAutoGenerating(true);
        const loadingToast = toast.loading('Running Automatic Generation...');
        try {
            // Load perks directly from bundled JSON (no fetch needed)
            const allPerks = [...survivorPerks, ...killerPerks];

            // 1. Generate Bot
            const bot = await generateBotProfile();
            
            // 2. Pick 4 unique random perks with full objects (name + icon)
            const shuffled = allPerks.sort(() => Math.random() - 0.5);
            const selectedPerks = shuffled.slice(0, 4).map(p => ({ name: p.name, icon: p.icon }));

            // 3. Decide role and strength
            const isKillerBuild = Math.random() > 0.5;
            const role = isKillerBuild ? 'killer' : 'survivor';
            const buildNames = isKillerBuild
                ? ['Pressure Build', 'Tunneling Setup', 'Gen Defense', 'Anti-Loop Strategy', 'Slugging Loadout']
                : ['Safe Escape', 'Gen Rush Loadout', 'Support Build', 'Stealth Setup', 'Chase Specialist'];
            const buildName = buildNames[Math.floor(Math.random() * buildNames.length)];
            const strength = Math.floor(Math.random() * 51) + 40; // 40–90%

            const buildData = { buildName, role, strength, perks: selectedPerks };

            // 4. Post text
            const { botPostTexts } = await import('../data/posttextbot');
            const randomText = botPostTexts[Math.floor(Math.random() * botPostTexts.length)];
            const finalContent = randomText;

            // 5. Generate random schedule time (0 to 24 hours from now)
            const scheduledTime = new Date();
            scheduledTime.setHours(scheduledTime.getHours() + Math.floor(Math.random() * 24));

            // Wait 1 second before creating the post so the DB auth registers
            await new Promise(r => setTimeout(r, 1000));

            // 6. Post using BotApp logic and attach the buildData
            await generateBotPost(bot, finalContent, scheduledTime, buildData);

            // Kick off social activity (non-blocking)
            botSocialActivity(bot).catch(console.warn);

            toast.success(`Auto-Gen Complete! Bot ${bot.displayName} scheduled a post.`, { id: loadingToast });
            fetchBots();
        } catch (error) {
            console.error(error);
            toast.error("Auto Gen failed.", { id: loadingToast });
        } finally {
            setIsAutoGenerating(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-obsidian text-white overflow-hidden">
            
            {/* Left Sidebar - Bot List */}
            <div className="w-full md:w-80 bg-obsidian-light border-r border-white/5 flex flex-col shrink-0">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <h2 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 text-dbd-red">
                        <UserGroupIcon className="w-5 h-5" /> 
                        Bot Hive
                    </h2>
                    <span className="text-xs text-smoke bg-white/5 px-2 py-1 rounded">{bots.length} active</span>
                </div>
                
                <div className="p-4 border-b border-white/5 flex gap-2">
                    <button 
                        onClick={handleCreateBot}
                        className="flex-1 flex justify-center items-center gap-1 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider py-2 rounded border border-white/10 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" /> Create Bot
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {loading ? (
                        <div className="text-center py-10 text-smoke text-sm">Loading hive...</div>
                    ) : bots.length === 0 ? (
                        <div className="text-center py-10 text-smoke text-xs uppercase tracking-widest">No bots generated yet.</div>
                    ) : (
                        bots.map(bot => (
                            <button
                                key={bot.id}
                                onClick={() => setSelectedBot(bot)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                    selectedBot?.id === bot.id 
                                    ? 'bg-dbd-red/10 border border-dbd-red/30 shadow-inner' 
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <img src={bot.photoURL} alt={bot.displayName} className="w-10 h-10 rounded-full border border-white/10" />
                                <div className="overflow-hidden">
                                    <h3 className="text-sm font-bold text-white truncate">{bot.displayName}</h3>
                                    <p className="text-[10px] text-smoke truncate">{bot.email}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Right Area - Workspace */}
            <div className="flex-1 flex flex-col relative h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-obsidian-light/50 via-obsidian to-black">
                {/* Header Actions */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 shrink-0">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-dbd-red" />
                        <span className="font-black uppercase tracking-widest text-sm text-smoke">Simulation Console</span>
                    </div>

                    <button
                        onClick={handleAutomaticGen}
                        disabled={isAutoGenerating}
                        className="flex items-center gap-2 bg-gradient-to-r from-dbd-red to-red-600 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg font-black uppercase tracking-wider text-xs shadow-lg transition-all disabled:opacity-50"
                    >
                        <BoltIcon className="w-4 h-4" />
                        {isAutoGenerating ? 'Generating...' : 'Automatic Gen'}
                    </button>
                </div>

                {/* Workspace Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {!selectedBot ? (
                        <div className="h-full flex flex-col items-center justify-center text-smoke/50">
                            <UserGroupIcon className="w-24 h-24 mb-4 opacity-20" />
                            <h2 className="text-xl font-black uppercase tracking-widest text-white/40">Select a Bot Actor</h2>
                            <p className="text-sm text-center max-w-sm mt-2">Initialize manual posting sequence by selecting a generated bot from the left panel.</p>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto w-full animate-fade-in">
                            <div className="glass-card border border-white/10 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative group cursor-pointer" onClick={() => avatarFileInputRef.current?.click()}>
                                            <img src={selectedBot.photoURL} alt="Bot" className="w-16 h-16 rounded-full border-2 border-dbd-red shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all group-hover:brightness-50" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <PhotoIcon className="w-5 h-5 text-white mb-0.5" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white tracking-tighter text-center leading-tight">Change<br/>PFP</span>
                                            </div>
                                            <input type="file" ref={avatarFileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{selectedBot.displayName}</h3>
                                            <p className="text-xs font-bold text-dbd-red uppercase tracking-widest">Active System Actor</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleDeleteBot}
                                        className="p-2 border border-red-500/20 bg-red-900/20 hover:bg-red-900/50 hover:border-red-500/50 text-red-500 rounded-xl transition-colors tooltip-trigger"
                                        title="Erase Bot Entity"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Profile Editor */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1 h-4 bg-dbd-red rounded-full"></div>
                                            <span className="text-dbd-red font-black uppercase tracking-widest text-[10px]">Profile Matrix</span>
                                        </div>
                                        
                                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors text-sm"
                                                    placeholder="Set name..."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Biography</label>
                                                <textarea
                                                    value={editBio}
                                                    onChange={e => setEditBio(e.target.value)}
                                                    rows="3"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors text-sm resize-none"
                                                    placeholder="Set bio..."
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isUpdatingProfile || (editName === selectedBot.displayName && editBio === selectedBot.bio)}
                                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-30"
                                            >
                                                {isUpdatingProfile ? 'Updating...' : 'Save Identity'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Post Simulator */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1 h-4 bg-dbd-red rounded-full"></div>
                                            <span className="text-dbd-red font-black uppercase tracking-widest text-[10px]">Post Simulator</span>
                                        </div>
                                        
                                        <form onSubmit={handleManualPost} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Simulate News / Post</label>
                                                <textarea
                                                    value={postText}
                                                    onChange={e => setPostText(e.target.value)}
                                                    rows="3"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors text-sm resize-none"
                                                    placeholder="What's on their mind?"
                                                    required
                                                ></textarea>
                                            </div>
                                    
                                    {/* Image Preview */}
                                    {postImage && (
                                        <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setPostImage(null)}
                                                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-dbd-red rounded-full transition-colors z-10"
                                            >
                                                <XMarkIcon className="w-4 h-4 text-white" />
                                            </button>
                                            <img src={postImage} alt="Upload Preview" className="w-full h-auto object-contain max-h-64" />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-smoke mb-2 flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-dbd-red" /> 
                                            Schedule Timeline (Optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={scheduleDate}
                                            onChange={e => setScheduleDate(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-dbd-red transition-colors [color-scheme:dark]"
                                        />
                                        <p className="text-[10px] text-smoke/60 mt-2">Leave blank to post immediately. If scheduled, the post will remain hidden in the main feed until this exact time.</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => postFileInputRef.current?.click()}
                                            className="px-4 flex items-center justify-center gap-2 bg-black/40 hover:bg-white/10 border border-white/10 text-smoke hover:text-white py-3.5 rounded-xl transition-colors"
                                            title="Attach Image"
                                        >
                                            <PhotoIcon className="w-5 h-5" />
                                        </button>
                                        <input type="file" ref={postFileInputRef} onChange={handlePostImageUpload} accept="image/*" className="hidden" />

                                        <button
                                            type="submit"
                                            disabled={isPosting || (!postText.trim() && !postImage)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-dbd-red hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(236,72,153,0.2)] disabled:opacity-50 transition-colors"
                                        >
                                            {isPosting ? 'Transmitting...' : (
                                                <>
                                                    <PaperAirplaneIcon className="w-5 h-5" /> 
                                                    {scheduleDate ? 'Inject to Timeline' : 'Post as Bot'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default BotAdminDashboard;
