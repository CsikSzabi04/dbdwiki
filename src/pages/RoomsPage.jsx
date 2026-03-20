import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { createRoom, subscribeToRooms } from '../firebase/rooms';
import { toast } from 'react-hot-toast';
import { PlusIcon, UserGroupIcon, GlobeAltIcon, ServerIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const RoomsPage = () => {
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();
    
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createRoomName, setCreateRoomName] = useState('');
    const [createRoomPassword, setCreateRoomPassword] = useState('');
    const [isPrivateBoxChecked, setIsPrivateBoxChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRooms((fetchedRooms) => {
            setRooms(fetchedRooms);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateClick = () => {
        if (!user) {
            toast.error("You must be logged in to create a server.");
            navigate('/login');
            return;
        }
        setCreateRoomName(`${userProfile?.displayName || user.email.split('@')[0]}'s Session`);
        setCreateRoomPassword('');
        setIsPrivateBoxChecked(false);
        setIsCreateModalOpen(true);
    };

    const submitCreateServer = async (e) => {
        e.preventDefault();
        if (!createRoomName.trim()) {
            toast.error("Room name cannot be empty.");
            return;
        }
        if (isPrivateBoxChecked && !createRoomPassword.trim()) {
            toast.error("Private rooms require a password.");
            return;
        }
        
        setIsCreating(true);
        try {
            const finalPassword = isPrivateBoxChecked ? createRoomPassword.trim() : null;
            const roomId = await createRoom(user, userProfile, createRoomName.trim(), finalPassword);
            toast.success("Server created! The Entity awaits.");
            setIsCreateModalOpen(false);
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create the server.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinServer = (roomId, isFull) => {
        if (!user) {
            toast.error("You must be logged in to join a server.");
            navigate('/login');
            return;
        }
        if (isFull) {
            toast.error("This server is already full.");
            return;
        }
        navigate(`/room/${roomId}`);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                
                {/* Header & Create Action */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ServerIcon className="w-8 h-8 text-dbd-red" />
                            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
                                Discord Rooms<span className="text-dbd-red">.</span>
                            </h1>
                        </div>
                        <p className="text-smoke text-sm md:text-base max-w-2xl border-l-2 border-dbd-red pl-3">
                            Looking for a group? Join an active server or create your own to jump into the Fog with fellow survivors and killers.
                        </p>
                    </div>

                    <button
                        onClick={handleCreateClick}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-dbd-red hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Server
                    </button>
                </div>

                {/* Rooms Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-dbd-red/20 rounded-full border-t-dbd-red animate-spin"></div>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="glass-card border border-white/10 rounded-2xl p-16 text-center">
                        <GlobeAltIcon className="w-16 h-16 text-smoke/30 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">No Active Servers</h2>
                        <p className="text-smoke text-sm">The realms are currently quiet. Be the first to create a server and invite others!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rooms.map((room) => {
                            const maxPlayers = room.isPrivate ? 5 : 4;
                            const isFull = room.playerCount >= maxPlayers;
                            const isHost = user?.uid === room.hostId;
                            return (
                                <div
                                    key={room.id}
                                    onClick={() => handleJoinServer(room.id, isFull && !isHost)}
                                    className={`relative glass-card border border-white/5 overflow-hidden group cursor-pointer transition-all duration-300 hover:border-dbd-red/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] flex flex-col ${isFull && !isHost ? 'opacity-70 grayscale' : ''}`}
                                >
                                    {/* Card Header Background */}
                                    <div className="h-24 bg-gradient-to-br from-obsidian-light to-obsidian relative overflow-hidden flex items-end justify-between p-4 border-b border-white/5">
                                        <div className="absolute inset-0 bg-dbd-red/5 group-hover:bg-dbd-red/10 transition-colors pointer-events-none"></div>
                                        
                                        {room.isPrivate && (
                                            <div className="absolute top-3 right-3 text-smoke group-hover:text-dbd-red transition-colors flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-[9px] uppercase font-black border border-white/10">
                                                <LockClosedIcon className="w-3 h-3" /> Private
                                            </div>
                                        )}

                                        <div className="relative z-10 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text.xs font-black uppercase tracking-widest text-white border border-white/10 shadow-lg">
                                            <UserGroupIcon className="w-3.5 h-3.5 text-dbd-red" />
                                            {room.playerCount} / {maxPlayers}
                                        </div>
                                        <div className="relative z-10">
                                            {isFull ? (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">Full</span>
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">Open</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 relative flex-1 flex flex-col pt-8">
                                        {/* Avatar overlapping header */}
                                        <div className="absolute -top-8 left-5 w-14 h-14 rounded-xl border-2 border-obsidian shadow-xl bg-black overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                            <img src={room.hostData.photoURL} alt="Host" className="w-full h-full object-cover" />
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-dbd-red mb-0.5" title={room.hostData.displayName}>
                                                Held by {room.hostData.displayName.substring(0, 15)}
                                            </p>
                                            <h3 className="text-white font-bold text-lg truncate drop-shadow-sm">{room.name}</h3>
                                        </div>

                                        {/* Small connected players list */}
                                        <div className="mt-auto pt-4 border-t border-white/5 border-dashed">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-smoke mb-2">Connected Players</p>
                                            <div className="flex -space-x-2">
                                                {room.players.map((p, idx) => (
                                                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-obsidian bg-black overflow-hidden shrink-0 shadow-md">
                                                        <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" title={p.displayName} />
                                                    </div>
                                                ))}
                                                {/* Fill empty slots visually */}
                                                {[...Array(maxPlayers - room.players.length)].map((_, idx) => (
                                                    <div key={`empty-${idx}`} className="w-8 h-8 rounded-full border-2 border-obsidian bg-obsidian-light flex items-center justify-center shrink-0">
                                                        <span className="text-smoke/30 text-[10px] font-black">?</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Overlay button on hover */}
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            {room.isPrivate && !isHost && !room.players.some(p=>p.uid===user?.uid) && (
                                                <LockClosedIcon className="w-8 h-8 text-white/50 mb-1" />
                                            )}
                                            <span className="text-white font-black uppercase tracking-widest text-sm border-2 border-white/20 bg-white/5 py-2 px-6 rounded-xl group-hover:scale-110 group-hover:border-dbd-red group-hover:text-dbd-red transition-all">
                                                {isHost ? 'Enter Server' : (isFull ? 'Server Full' : 'Join Server')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Create Server Modal */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-obsidian-light border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
                            >
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-smoke hover:text-white hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase italic tracking-tighter">
                                        New Server<span className="text-dbd-red">.</span>
                                    </h2>
                                    <p className="text-smoke text-sm mt-1">Configure your new LFG session before opening it to the public.</p>
                                </div>

                                <form onSubmit={submitCreateServer} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2 ml-1">Room Name</label>
                                        <input
                                            type="text"
                                            value={createRoomName}
                                            onChange={e => setCreateRoomName(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dbd-red"
                                            placeholder="E.g., Chill Survivors Only"
                                            maxLength={40}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <input
                                            type="checkbox"
                                            id="private-checkbox"
                                            checked={isPrivateBoxChecked}
                                            onChange={e => {
                                                setIsPrivateBoxChecked(e.target.checked);
                                                if (!e.target.checked) setCreateRoomPassword('');
                                            }}
                                            className="w-5 h-5 rounded overflow-hidden accent-dbd-red cursor-pointer"
                                        />
                                        <label htmlFor="private-checkbox" className="text-sm font-bold text-white cursor-pointer select-none">
                                            Make server Private (Password required)
                                        </label>
                                    </div>

                                    {isPrivateBoxChecked && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                        >
                                            <label className="block text-xs font-bold uppercase tracking-widest text-dbd-red mb-2 ml-1 flex items-center gap-1">
                                                <LockClosedIcon className="w-3 h-3" /> Password
                                            </label>
                                            <input
                                                type="text"
                                                value={createRoomPassword}
                                                onChange={e => setCreateRoomPassword(e.target.value)}
                                                className="w-full bg-black/50 border border-dbd-red/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dbd-red"
                                                placeholder="Enter a secret password..."
                                                maxLength={30}
                                            />
                                        </motion.div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isCreating || (isPrivateBoxChecked && !createRoomPassword.trim())}
                                            className="w-full flex justify-center items-center py-3.5 bg-dbd-red text-white uppercase tracking-widest text-sm font-black rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {isCreating ? 'Creating...' : 'Initialize Server'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </Layout>
    );
};

export default RoomsPage;
