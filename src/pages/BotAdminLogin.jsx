import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, ShieldCheckIcon, XCircleIcon } from '@heroicons/react/24/solid';

const BotAdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);

    useEffect(() => {
        // Generate 4 distinct random numbers between 1 and 99, excluding 4
        const randoms = new Set();
        while (randoms.size < 4) {
            let r = Math.floor(Math.random() * 99) + 1;
            if (r !== 4) randoms.add(r.toString().padStart(2, '0'));
        }
        
        // Add "04" and shuffle
        const allNumbers = [...randoms, "04"].sort(() => 0.5 - Math.random());
        setNumbers(allNumbers);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (username !== 'admin' || password !== 'admin') {
            setError('Invalid credentials.');
            return;
        }

        if (selectedNumber !== '04') {
            setError('Security check failed.');
            return;
        }

        // Authentication successful
        sessionStorage.setItem('botAdminAuth', 'true');
        navigate('/botadmin04/dashboard');
    };

    return (
        <div className="min-h-screen bg-obsidian flex justify-center items-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-dbd-red/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-dbd-red/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="glass-card w-full max-w-md p-8 relative z-10 border border-dbd-red/20 shadow-2xl shadow-red-900/20">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-black/50 rounded-full border border-dbd-red flex justify-center items-center mb-4 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <ShieldCheckIcon className="w-8 h-8 text-dbd-red" />
                    </div>
                    <h1 className="text-2xl font-black uppercase italic tracking-widest text-white flex items-center gap-2">
                        Entity Protocol
                        <SparklesIcon className="w-5 h-5 text-dbd-red" />
                    </h1>
                    <p className="text-smoke text-sm mt-1">Classified Bot Generation Console</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                        <XCircleIcon className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-smoke uppercase tracking-wider mb-1.5">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-smoke uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <label className="block text-xs font-bold text-smoke uppercase tracking-wider mb-3 text-center">
                            Acknowledge Sequence
                        </label>
                        <div className="flex justify-center gap-3">
                            {numbers.map((num, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedNumber(num)}
                                    className={`w-12 h-12 rounded-lg font-black text-lg transition-all border ${
                                        selectedNumber === num 
                                        ? 'bg-dbd-red text-white border-red-600 scale-110 shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                                        : 'bg-black/30 text-smoke border-white/10 hover:bg-white/5 hover:border-white/20'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-dbd-red hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-lg transition-colors mt-4 shadow-lg active:scale-[0.98]"
                    >
                        Access Terminal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BotAdminLogin;
