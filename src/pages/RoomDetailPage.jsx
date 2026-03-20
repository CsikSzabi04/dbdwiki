import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { 
    subscribeToRoom, 
    subscribeToRoomMessages, 
    joinRoom, 
    leaveRoom, 
    sendRoomMessage,
    updateRoomPassword,
    deleteRoom
} from '../firebase/rooms';
import { toast } from 'react-hot-toast';
import { 
    PaperAirplaneIcon, 
    ArrowLeftIcon, 
    MicrophoneIcon, 
    InformationCircleIcon, 
    UserIcon,
    ExclamationTriangleIcon,
    LockClosedIcon,
    LinkIcon,
    Cog6ToothIcon,
    XMarkIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { HiFire } from 'react-icons/hi';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// Store timeout IDs to cancel pending leaves during React StrictMode remounts
const pendingLeaves = {};

const RoomDetailPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile } = useAuth();
    
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    
    // Privacy / Password state
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [joinPasswordInput, setJoinPasswordInput] = useState('');
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    // Settings Modal (Host only)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsPassword, setSettingsPassword] = useState('');
    const [isSettingsPrivate, setIsSettingsPrivate] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Parse invite code from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const inviteCode = queryParams.get('invite');

    // Initial load and subscription
    useEffect(() => {
        if (!user) {
            toast.error("You must be logged in to enter a room.");
            navigate('/login');
            return;
        }

        const unsubRoom = subscribeToRoom(roomId, async (roomData) => {
            if (!roomData) {
                toast.error("This server has been closed or does not exist.");
                navigate('/rooms');
                return;
            }
            
            setRoom(roomData);
            setLoading(false);
            
            // Check if current user is implicitly in the room
            const isMember = roomData.players?.some(p => p.uid === user.uid);
            
            if (!isMember && !joining && !isLockedOut) {
                setJoining(true); // prevent infinite loop calls
                try {
                    await joinRoom(roomId, user, userProfile, null, inviteCode);
                    toast.success("Joined the lobby!");
                    if (inviteCode) {
                        // clean up URL to avoid lingering invite codes
                        navigate(`/room/${roomId}`, { replace: true });
                    }
                } catch (error) {
                    setJoining(false);
                    if (error.message === "INVALID_PASSWORD") {
                        setIsLockedOut(true); // display the password wall
                    } else {
                        toast.error(error.message || "Cannot join this lobby.");
                        navigate('/rooms');
                    }
                }
            }
        });

        const unsubMessages = subscribeToRoomMessages(roomId, (msgs) => {
            setMessages(msgs);
        });

        return () => {
            unsubRoom();
            unsubMessages();
        };
    }, [roomId, user, userProfile, navigate, joining, isLockedOut, inviteCode]);

    // Cleanup on unmount (leave room)
    useEffect(() => {
        // Cancel any pending generic leave if we just remounted
        if (pendingLeaves[roomId]) {
            clearTimeout(pendingLeaves[roomId]);
            delete pendingLeaves[roomId];
        }

        const handleBeforeUnload = () => {
            if (user && roomId) {
                leaveRoom(roomId, user).catch(console.error);
            }
        };

        // Window unload behavior
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // In React Development StrictMode, components eagerly unmount and remount.
            // By delaying the leave logic slightly, if it immediately remounts, we cancel it.
            pendingLeaves[roomId] = setTimeout(() => {
                if (user && roomId && !isLockedOut) {
                    leaveRoom(roomId, user).catch(console.error);
                }
                delete pendingLeaves[roomId];
            }, 500);
        };
    }, [roomId, user, isLockedOut]);

    // Auto-scroll logic
    useEffect(() => {
        if (!isLockedOut) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLockedOut]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!joinPasswordInput.trim()) return;
        setIsSubmittingPassword(true);
        try {
            await joinRoom(roomId, user, userProfile, joinPasswordInput.trim());
            toast.success("Password correct!");
            setIsLockedOut(false);
        } catch(error) {
            if (error.message === "INVALID_PASSWORD") {
                toast.error("Helytelen jelszó!"); // Request from user to display incorrect password in hungarian
            } else {
                toast.error(error.message || "Cannot join.");
            }
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !room) return;
        
        const text = newMessage;
        setNewMessage('');
        
        try {
            await sendRoomMessage(roomId, user, userProfile, text);
        } catch (err) {
            console.error(err);
            toast.error("Message failed to send.");
        }
    };

    const handleLeave = async () => {
        try {
            await leaveRoom(roomId, user);
            navigate('/rooms');
        } catch (err) {
            console.error(err);
            toast.error("Error leaving room.");
        }
    };

    const handleCopyInvite = () => {
        if (!room) return;
        const inviteUrl = `${window.location.origin}/room/${room.id}?invite=${room.inviteCode}`;
        navigator.clipboard.writeText(inviteUrl);
        toast.success("Invite link copied to clipboard!");
    };

    const openSettings = () => {
        setIsSettingsPrivate(room.isPrivate);
        setSettingsPassword(room.password || '');
        setIsSettingsOpen(true);
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        if (isSettingsPrivate && !settingsPassword.trim()) {
            toast.error("Password is required for private rooms.");
            return;
        }
        setIsSavingSettings(true);
        try {
            const finalPassword = isSettingsPrivate ? settingsPassword.trim() : null;
            await updateRoomPassword(roomId, user.uid, finalPassword);
            toast.success("Room security updated.");
            setIsSettingsOpen(false);
        } catch(err) {
            console.error(err);
            toast.error("Failed to update settings.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleDeleteRoom = async () => {
        if (window.confirm("Are you sure you want to permanently delete this room?")) {
            try {
                await deleteRoom(roomId, user.uid);
                toast.success("Room deleted.");
                navigate('/rooms');
            } catch(e) {
                console.error(e);
                toast.error("Failed to delete.");
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-32">
                    <div className="w-12 h-12 border-4 border-dbd-red/20 rounded-full border-t-dbd-red animate-spin"></div>
                </div>
            </Layout>
        );
    }
    
    if (!room) return null;

    const isHost = room.hostId === user?.uid;
    const maxPlayers = room.isPrivate ? 5 : 4;

    if (isLockedOut) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in flex justify-center items-center min-h-[60vh]">
                    <div className="glass-card max-w-sm w-full border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dbd-red to-orange-500"></div>
                        <LockClosedIcon className="w-16 h-16 text-dbd-red mx-auto mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Private Server</h2>
                        <p className="text-smoke text-sm mb-6 pb-4 border-b border-white/5 truncate">
                            {room.name}
                        </p>
                        
                        <form onSubmit={handlePasswordSubmit}>
                            <input 
                                type="text"
                                value={joinPasswordInput}
                                onChange={e => setJoinPasswordInput(e.target.value)}
                                placeholder="Enter Password..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-dbd-red/50 focus:ring-1 focus:ring-dbd-red/50 mb-4 tracking-widest"
                            />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => navigate('/rooms')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmittingPassword || !joinPasswordInput.trim()} className="flex-1 py-3 bg-dbd-red disabled:opacity-50 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-colors shadow-lg">
                                    {isSubmittingPassword ? 'Checking...' : 'Enter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 animate-fade-in flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-64px)]">
                
                {/* Top Nav (Back & Title) */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-obsidian border-b border-white/5 py-4 px-2 sm:px-6 mb-4 rounded-xl shadow-lg shrink-0 gap-4 sm:gap-0">
                    <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4">
                        <button onClick={handleLeave} className="flex items-center gap-2 text-smoke hover:text-white transition-colors group z-10">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-dbd-red/20 border border-transparent group-hover:border-dbd-red/50 transition-all">
                                <ArrowLeftIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Leave</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-black text-white italic truncate shadow-xl tracking-tighter max-w-[200px] md:max-w-[400px]">
                                {room.name}
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                        {isHost && (
                            <div className="text-[9px] sm:text-[10px] shrink-0 font-black uppercase tracking-widest text-dbd-red bg-dbd-red/10 px-3 py-2 rounded-lg border border-dbd-red/20">
                                Host
                            </div>
                        )}
                        <button onClick={handleCopyInvite} className="flex shrink-0 items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-blue-500/20">
                            <LinkIcon className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Meghívó Link</span>
                            <span className="sm:hidden">Meghívó</span>
                        </button>
                        {isHost && (
                            <button onClick={openSettings} className="flex shrink-0 items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-smoke hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/5">
                                <Cog6ToothIcon className="w-4 h-4" /> 
                                <span className="hidden sm:inline">Beállítások</span>
                                <span className="sm:hidden">Beáll.</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                    
                    {/* Main Chat Area */}
                    <div className="flex-1 glass-card border flex flex-col border-white/10 rounded-2xl overflow-hidden shadow-2xl relative order-2 lg:order-1 h-full max-h-full">
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                            
                            {/* Pinned Server Information (Now scrolls with chat to support small screens) */}
                            <div className="bg-obsidian-light/90 border-b border-white/10 p-4 sm:p-6 shrink-0 relative overflow-hidden backdrop-blur-xl mb-4">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-dbd-red rounded-full opacity-10 blur-[50px] pointer-events-none"></div>
                                
                                <div className="flex flex-col gap-4 relative z-10">
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                                <MicrophoneIcon className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-80 decoration-blue-500/30">Discord Server</p>
                                                <a href="https://discord.gg/UF7FKmTg" target="_blank" rel="noopener noreferrer" className="font-bold text-sm sm:text-base hover:text-white hover:underline transition-colors block">
                                                    https://discord.gg/UF7FKmTg
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <a href="https://discord.gg/UF7FKmTg" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95 text-center w-full sm:w-auto">
                                            Csatlakozás Discordhoz
                                        </a>
                                    </div>

                                    <div className="border-t border-white/5 pt-4">
                                        <div className="flex items-start gap-2 text-dbd-red mb-2">
                                            <InformationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                                            <p className="font-black text-xs uppercase tracking-widest">Szabályzat & Infók</p>
                                        </div>
                                        <p className="text-white/80 text-sm leading-relaxed mb-3 italic pl-7 border-l-2 border-white/10 ml-2.5 border-dashed">
                                            Ne beszéljetek rondán egymással, és a legfontosabb, hogy élvezzétek a játékot!
                                        </p>
                                        <div className="bg-dbd-red/10 border border-dbd-red/20 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-red-100 flex items-start gap-3 shadow-inner">
                                            <ExclamationTriangleIcon className="w-6 h-6 shrink-0 text-dbd-red" />
                                            <p className="leading-relaxed">
                                                <span className="font-black">❗️ FIGYELEM:</span> A Discordon belépéskor elsőnek a main (fő) csoportba leszel bedobva. Onnan kell átcsatlakoznotok a csapatoddal valamelyik <span className="font-bold border-b border-red-500/30">"slot"</span> nevű hangcsatornához, ott tudtok majd zavartalanul beszélgetni és játszani!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center opacity-40">
                                    <HiFire className="w-12 h-12 text-smoke mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                                    <p className="text-smoke text-sm font-bold italic tracking-wide">The campfire is quiet. Say something.</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.uid === user.uid;
                                    const showAvatar = index === 0 || messages[index - 1].uid !== msg.uid;
                                    return (
                                        <div 
                                            key={msg.id} 
                                            className={`animate-fade-in flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end`}
                                        >
                                            {showAvatar ? (
                                                <div className="w-8 h-8 rounded-lg bg-obsidian border border-white/10 overflow-hidden shrink-0 shadow-xl self-end mb-1">
                                                    <img src={msg.photoURL} alt={msg.displayName} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 shrink-0"></div>
                                            )}
                                            
                                            <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                {showAvatar && (
                                                    <span className={`text-[9px] uppercase tracking-widest font-black mb-1 opacity-60 ${isMe ? 'text-dbd-red' : 'text-smoke'}`}>
                                                        {msg.displayName}
                                                    </span>
                                                )}
                                                <div className={`
                                                    p-3 sm:px-4 sm:py-2.5 rounded-2xl text-sm leading-relaxed backdrop-blur-md relative shadow-lg break-words w-full text-left
                                                    ${isMe 
                                                        ? 'bg-dbd-red text-white rounded-br-sm border border-red-500 border-opacity-50' 
                                                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'}
                                                `}>
                                                    <span dangerouslySetInnerHTML={{ __html: msg.text }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-obsidian-light/60 border-t border-white/10 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-black/50 border border-white/10 rounded-xl overflow-hidden flex items-center shadow-inner hover:border-white/20 transition-colors focus-within:border-white/30 focus-within:ring-2 focus-within:ring-dbd-red/30 pl-4 py-1">
                                    <input 
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message the lobby...`}
                                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white text-sm"
                                        maxLength={500}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-dbd-red text-white m-1 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-dbd-red transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.3)] disabled:shadow-none font-bold group"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Sidebar - Players */}
                    <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 order-1 lg:order-2 h-max max-h-48 lg:max-h-full">
                        <div className="glass-card border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl flex-1 max-h-full flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 shrink-0">
                                <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 drop-shadow-md">
                                    <UserIcon className="w-4 h-4 text-smoke" />
                                    Lobby Slot
                                </h3>
                                <div className="bg-black/80 px-2 py-1 rounded text-xs font-bold text-smoke border border-white/10 shadow-inner">
                                    {room.players.length} / {maxPlayers}
                                </div>
                            </div>

                            <div className="flex-1 flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden gap-3 custom-scrollbar pr-2 pb-2 lg:pb-0">
                                {room.players.map((p, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner hover:bg-white/10 transition-colors min-w-[150px] lg:min-w-0">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0 shadow-lg">
                                            <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate drop-shadow-sm">{p.displayName}</p>
                                            {p.uid === room.hostId && (
                                                <span className="text-[9px] uppercase tracking-widest text-dbd-red font-black">Host</span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {[...Array(maxPlayers - room.players.length)].map((_, idx) => (
                                    <div key={`empty-${idx}`} className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 border-dashed min-w-[150px] lg:min-w-0 opacity-50">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-obsidian-light flex justify-center items-center shadow-inner shrink-0 text-smoke/50">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-smoke">Empty Slot</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Host Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-obsidian-light border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
                        >
                            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 p-2 text-smoke hover:text-white hover:bg-white/5 rounded-full transition-colors">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                            
                            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                                Server Settings
                            </h2>

                            <form onSubmit={saveSettings} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <input
                                            type="checkbox" id="settings-private-checkbox"
                                            checked={isSettingsPrivate}
                                            onChange={e => {
                                                setIsSettingsPrivate(e.target.checked);
                                                if (!e.target.checked) setSettingsPassword('');
                                            }}
                                            className="w-5 h-5 rounded overflow-hidden accent-dbd-red cursor-pointer"
                                        />
                                        <label htmlFor="settings-private-checkbox" className="text-sm font-bold text-white cursor-pointer select-none">
                                            Make server Private (Password required)
                                        </label>
                                    </div>

                                    {isSettingsPrivate && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-dbd-red mb-2 ml-1 flex items-center gap-1">
                                                <LockClosedIcon className="w-3 h-3" /> Password
                                            </label>
                                            <input
                                                type="text" value={settingsPassword}
                                                onChange={e => setSettingsPassword(e.target.value)}
                                                className="w-full bg-black/50 border border-dbd-red/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                                                placeholder="Enter a new secret password..."
                                                maxLength={30}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                                    <button type="submit" disabled={isSavingSettings || (isSettingsPrivate && !settingsPassword.trim())} className="w-full flex justify-center py-3.5 bg-dbd-red text-white uppercase tracking-widest text-sm font-black rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                                        {isSavingSettings ? 'Saving...' : 'Save Settings'}
                                    </button>
                                    
                                    <button type="button" onClick={handleDeleteRoom} className="w-full flex justify-center items-center gap-2 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 uppercase tracking-widest text-xs font-bold rounded-xl transition-colors border border-red-500/20">
                                        <TrashIcon className="w-4 h-4" /> Delete Server Permanently
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </Layout>
    );
};

export default RoomDetailPage;
