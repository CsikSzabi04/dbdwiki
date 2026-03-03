import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { usePerks } from '../hooks/usePerks';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { calculatePerkStrength, getMatchingBuilds } from '../hooks/allslot';

// Perk kártya komponens
const PerkCard = ({ perk, onClick }) => {
    const [imageError, setImageError] = useState(false);

    // A perk tulajdonosának nevének meghatározása
    const ownerName = perk.killerName || perk.survivorName || 'All';
    const role = perk.role === 'killer' ? 'Killer' : 'Survivor';

    return (
        <div
            onClick={onClick}
            className="group relative bg-obsidian-light border border-white/5 rounded-xl overflow-hidden hover:border-dbd-red/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
            <div className="aspect-square bg-gradient-to-br from-black to-obsidian relative flex items-center justify-center">
                {!imageError ? (
                    <img
                        src={perk.icon}
                        alt={perk.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center bg-obsidian">
                        <span className="text-smoke font-bold text-xs uppercase tracking-wider">
                            {perk.name}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-2 left-2 flex gap-1">
                    {!perk.isLocal && (
                        <span className="px-2 py-1 bg-dbd-red/60 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider border border-dbd-red/30">
                            API
                        </span>
                    )}
                </div>
            </div>
            <div className="p-3">
                <h3 className="font-black text-sm text-white truncate">{perk.name}</h3>
                <p className="text-[10px] text-smoke mt-1 line-clamp-2">{perk.description.split('\n')[0]}</p>
                <div className="mt-2">
                    <span className="text-[8px] uppercase tracking-wider text-dbd-red font-bold">{role}</span>
                </div>
            </div>
        </div>
    );
};

// Perk Slot komponens
const PerkSlot = ({ perk, onClick, isFilled }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            onClick={onClick}
            className={`relative aspect-square rounded-xl border-2 ${isFilled
                ? 'border-dbd-red/50 bg-obsidian-light hover:border-dbd-red'
                : 'border-white/10 bg-black/40 hover:border-white/20'} 
                transition-all duration-300 cursor-pointer overflow-hidden group`}
        >
            {isFilled && perk ? (
                <>
                    {!imageError ? (
                        <img
                            src={perk.icon}
                            alt={perk.name}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-2 text-center bg-obsidian">
                            <span className="text-[10px] text-smoke font-bold uppercase">
                                {perk.name}
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-wider bg-dbd-red/80 px-2 py-1 rounded-lg">
                            Remove
                        </span>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-smoke/30 text-xs font-bold uppercase tracking-wider">
                        Empty
                    </span>
                </div>
            )}
        </div>
    );
};

// Erősségmérő komponens
const StrengthMeter = ({ percentage }) => {
    // Biztosítjuk, hogy a percentage 0-100 között legyen
    const safePercentage = Math.min(100, Math.max(0, percentage));

    // Szín meghatározása a percentage alapján
    const getColor = () => {
        if (safePercentage < 30) return 'from-red-500 to-red-600';
        if (safePercentage < 60) return 'from-yellow-500 to-yellow-600';
        if (safePercentage < 80) return 'from-green-500 to-green-600';
        return 'from-dbd-red to-dbd-red/80';
    };

    // Aktuális kategória meghatározása
    const getCategory = () => {
        if (safePercentage <= 25) return 'Weak';
        if (safePercentage <= 50) return 'Balanced';
        if (safePercentage <= 75) return 'Good';
        if (safePercentage <= 85) return 'Strong';
        return 'Best';
    };

    return (
        <div className="bg-obsidian-light  rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">

                <span className="text-white font-black text-lg">
                    {Math.round(safePercentage)}%
                </span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${safePercentage}%` }}
                />
            </div>

            {/* Csak az aktuális kategória jelenik meg */}
            <div className="mt-3 text-center">
                <span className="text-dbd-red font-bold uppercase tracking-wider text-sm">
                    {getCategory()}
                </span>
            </div>
        </div>
    );
};

// Perk profil komponens
const PerkProfile = ({ perk, onBack, onAddToLoadout }) => {
    const [imageError, setImageError] = useState(false);
    const ownerName = perk.killerName || perk.survivorName || 'All';
    const role = perk.role === 'killer' ? 'Killer' : 'Survivor';
    const ownerCode = perk.killerCode || perk.survivorCode || 'all';

    return (
        <div className="animate-fadeIn">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-smoke hover:text-dbd-red transition-colors group"
            >
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-bold uppercase tracking-widest text-xs">Back to Perks</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Perk Image */}
                <div className="lg:col-span-1">
                    <div className="bg-obsidian-light border border-white/5 rounded-2xl overflow-hidden sticky top-24">
                        <div className="aspect-square bg-gradient-to-br from-black to-obsidian p-8 flex items-center justify-center">
                            {!imageError ? (
                                <img
                                    src={perk.icon}
                                    alt={perk.name}
                                    className="w-full h-full object-contain"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                                    <span className="text-2xl font-bold text-white uppercase tracking-wider">
                                        {perk.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Add to Loadout Button */}
                        <div className="p-4 border-t border-white/5">
                            <button
                                onClick={() => onAddToLoadout(perk)}
                                className="w-full py-3 bg-dbd-red text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-dbd-red/80 transition-colors"
                            >
                                Add to Loadout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Perk Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black italic text-white mb-2">{perk.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-dbd-red/20 text-dbd-red rounded-full text-xs font-bold uppercase tracking-wider border border-dbd-red/30">
                                {ownerName}
                            </span>
                            <span className="px-3 py-1 bg-white/10 text-smoke rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                {role} Perk
                            </span>
                            {perk.isLocal ? (
                                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/30">
                                    Local Data
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                                    API Data
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-obsidian-light border border-white/5 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                        <div className="text-smoke space-y-2 whitespace-pre-line leading-relaxed">
                            {perk.description}
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    );
};

const WikiPage = () => {
    const { perks, loading, error } = usePerks();
    const [activeTab, setActiveTab] = useState('killer');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [selectedPerk, setSelectedPerk] = useState(null);

    // Perk loadout state - 4 slot
    const [loadout, setLoadout] = useState([null, null, null, null]);
    const [strength, setStrength] = useState(0);
    const [matchingBuilds, setMatchingBuilds] = useState([]);

    // FIGYELJÜK A TAB VÁLTOZÁSÁT ÉS TÖRÖLJÜK A LOADOUT-OT
    useEffect(() => {
        // Loadout törlése
        setLoadout([null, null, null, null]);
        setStrength(0);
        setMatchingBuilds([]);
        
        // Opcionális: keresés törlése is
        // setSearch('');
    }, [activeTab]); // Ez fut, amikor az activeTab változik

    // A calculateStrength függvény módosítása:
    const calculateStrength = (currentLoadout) => {
        const rolePerksInLoadout = currentLoadout.filter(perk => perk?.role === activeTab);

        if (rolePerksInLoadout.length === 0) return 0;

        // Átadjuk a role-t is a calculatePerkStrength-nek
        return calculatePerkStrength(currentLoadout, activeTab);
    };

    // Perk hozzáadása a loadout-hoz
    const addToLoadout = (perk) => {
        // Ellenőrizzük, hogy a perk role-ja megegyezik-e az aktív tabbal
        if (perk.role !== activeTab) {
            alert(`You can only add ${activeTab} perks to your loadout!`);
            return;
        }

        // Ellenőrizzük, hogy már nincs-e benne
        if (loadout.some(p => p?.id === perk.id)) {
            alert('This perk is already in your loadout!');
            return;
        }

        // Keressük az első üres slotot
        const emptySlotIndex = loadout.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) {
            alert('All slots are full! Remove a perk first.');
            return;
        }

        const newLoadout = [...loadout];
        newLoadout[emptySlotIndex] = perk;
        setLoadout(newLoadout);

        // Új erősség számítása a killerslot logikával
        const newStrength = calculateStrength(newLoadout);
        setStrength(newStrength);

        // A getMatchingBuilds hívás módosítása:
        const matches = getMatchingBuilds(newLoadout, activeTab);
        setMatchingBuilds(matches);
        
        // Visszadobás a főoldalra
        setSelectedPerk(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Perk eltávolítása a loadout-ból
    const removeFromLoadout = (index) => {
        const newLoadout = [...loadout];
        newLoadout[index] = null;
        setLoadout(newLoadout);

        // Új erősség számítása a killerslot logikával
        const newStrength = calculateStrength(newLoadout);
        setStrength(newStrength);

        // Matching build-ek lekérése
        const matches = getMatchingBuilds(newLoadout, activeTab);
        setMatchingBuilds(matches);
    };

    // Perk adatok szűrése a tab alapján
    const filteredByRole = useMemo(() => {
        if (!perks.length) return [];
        return perks.filter(perk => perk.role === activeTab);
    }, [perks, activeTab]);

    // Szűrés és rendezés
    const filteredPerks = useMemo(() => {
        let result = filteredByRole.filter(perk => {
            const matchesSearch = perk.name.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });

        result.sort((a, b) => {
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            if (sortBy === 'id-asc') return a.id - b.id;
            if (sortBy === 'id-desc') return b.id - a.id;
            return 0;
        });

        return result;
    }, [filteredByRole, search, sortBy]);

    const handleBack = () => {
        setSelectedPerk(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Perkek számának kiszámítása role-onként
    const killerCount = perks.filter(p => p.role === 'killer').length;
    const survivorCount = perks.filter(p => p.role === 'survivor').length;

    return (
        <Layout>
            {/* Search/Filter Header - csak ha nincs kiválasztva perk */}
            {!selectedPerk && (
                <div className="sticky top-0 z-30 bg-obsidian-light/80 backdrop-blur-xl border-b border-white/5 p-3 sm:p-4 shadow-xl">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter drop-shadow-md">
                                PERK WIKI<span className="text-dbd-red">.</span>
                            </h2>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
                                    <input
                                        type="text"
                                        placeholder="Search perk..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-dbd-red focus:ring-1 focus:ring-dbd-red transition-all shadow-inner"
                                    />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative group">
                                    <button className="h-full px-4 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2 hover:border-white/20 hover:bg-white/5 transition-colors">
                                        <AdjustmentsHorizontalIcon className="w-5 h-5 text-smoke group-hover:text-dbd-red transition-colors" />
                                        <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-smoke">Sort</span>
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-obsidian-light border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <div className="p-1">
                                            {[
                                                { id: 'name-asc', label: 'Name (A-Z)' },
                                                { id: 'name-desc', label: 'Name (Z-A)' },
                                              
                                            ].map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSortBy(option.id)}
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${sortBy === option.id ? 'bg-dbd-red/20 text-dbd-red' : 'text-smoke hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
                            <button
                                onClick={() => setActiveTab('killer')}
                                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'killer'
                                    ? 'bg-dbd-red text-white shadow-[0_0_15px_rgba(255,18,18,0.4)]'
                                    : 'bg-black/40 border border-white/5 text-smoke hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Killer Perks <span className="ml-1 opacity-60">({killerCount})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('survivor')}
                                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'survivor'
                                    ? 'bg-dbd-red text-white shadow-[0_0_15px_rgba(255,18,18,0.4)]'
                                    : 'bg-black/40 border border-white/5 text-smoke hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Survivor Perks <span className="ml-1 opacity-60">({survivorCount})</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`max-w-7xl mx-auto p-4 md:p-6 lg:p-8 ${selectedPerk ? 'pt-8' : ''}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 scale-in">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-dbd-red/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-dbd-red font-black uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(255,18,18,0.5)]">
                            Loading Perks
                        </p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center glass-card p-8 border-dbd-red/20 max-w-md mx-auto">
                        <p className="text-3xl text-dbd-red font-black uppercase italic mb-2">Error</p>
                        <p className="text-smoke">{error}</p>
                    </div>
                ) : selectedPerk ? (
                    <PerkProfile
                        perk={selectedPerk}
                        onBack={handleBack}
                        onAddToLoadout={addToLoadout}
                    />
                ) : (
                    <div className="space-y-8">
                        {/* Perk Loadout Section */}
                        <div className="bg-obsidian-light/50 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-dbd-red rounded-full animate-pulse"></span>
                                YOUR PERK LOADOUT
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* 4 Perk Slots */}
                                <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {loadout.map((perk, index) => (
                                        <PerkSlot
                                            key={index}
                                            perk={perk}
                                            isFilled={perk !== null}
                                            onClick={() => perk && removeFromLoadout(index)}
                                        />
                                    ))}
                                </div>

                                {/* Strength Meter */}
                                <div className="lg:col-span-1">
                                    <StrengthMeter percentage={strength} />
                                </div>
                            </div>

                            {/* Matching Builds - Opcionális, ha szeretnéd látni, mely build-ekhez illeszkedik */}
                            {matchingBuilds.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-2">Matching Builds:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {matchingBuilds.slice(0, 3).map((match, idx) => (
                                            <div key={idx} className="bg-black/40 rounded-lg px-3 py-1.5 border border-white/5">
                                                <span className="text-xs text-dbd-red font-bold">{match.buildName}</span>
                                                <span className="text-[10px] text-smoke ml-2">
                                                    ({match.matchedPerks}/{match.totalPerks} perks)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Perk Grid */}
                        {filteredPerks.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                                {filteredPerks.map(perk => (
                                    <PerkCard
                                        key={`${perk.role}-${perk.id}`}
                                        perk={perk}
                                        onClick={() => {
                                            setSelectedPerk(perk);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-smoke italic">No perks found in the fog...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WikiPage;