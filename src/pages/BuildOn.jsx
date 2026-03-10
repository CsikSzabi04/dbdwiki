import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { usePerks } from '../hooks/usePerks';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ArrowLeftIcon, BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { calculatePerkStrength, getMatchingBuilds } from '../hooks/allslot';
import { useAuth } from '../hooks/useAuth';
import { saveUserBuild } from '../firebase/users';
import { toast } from 'react-hot-toast';
import StrengthMeter from '../components/Wiki/StrengthMeter';

// Perk kártya komponens
const PerkCard = ({ perk, onClick, onInfoClick, activeTab }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const role = perk.role === 'killer' ? 'Killer' : 'Survivor';
    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';
    const accentColorHover = activeTab === 'killer' ? 'dbd-red/50' : 'blue-500/50';

    const handleCardClick = (e) => {
        if (e.target.closest('.info-button')) {
            return;
        }
        onClick();
    };

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-obsidian-light border border-white/5 rounded-xl overflow-hidden hover:border-${accentColorHover} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
        >
            <div className="aspect-square bg-gradient-to-br from-black to-obsidian relative flex items-center justify-center">
                {!imageError ? (
                    <img
                        loading="lazy"
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

                {isHovered && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onInfoClick();
                        }}
                        className={`info-button absolute top-2 right-2 w-8 h-8 bg-${accentColor} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-10`}
                    >
                        <span className="text-white font-bold text-lg">i</span>
                    </button>
                )}

                <div className="absolute top-2 left-2 flex gap-1">
                    {!perk.isLocal && (
                        <span className={`px-2 py-1 bg-${accentColor}/60 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider border border-${accentColor}/30`}>
                            API
                        </span>
                    )}
                </div>
            </div>
            <div className="p-3">
                <h3 className="font-black text-sm text-white truncate">{perk.name}</h3>
                <p className="text-[10px] text-smoke mt-1 line-clamp-2">{perk.description.split('\n')[0]}</p>
                <div className="mt-2">
                    <span className={`text-[8px] uppercase tracking-wider text-${accentColor} font-bold`}>{role}</span>
                </div>
            </div>
        </div>
    );
};

// Perk Slot komponens
const PerkSlot = ({ perk, onClick, isFilled, activeTab }) => {
    const [imageError, setImageError] = useState(false);
    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';

    return (
        <div
            onClick={onClick}
            className={`relative aspect-square rounded-xl border-2 ${isFilled
                ? `border-${accentColor}/50 bg-obsidian-light hover:border-${accentColor}`
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
                        <span className={`text-white text-xs font-bold uppercase tracking-wider bg-${accentColor}/80 px-2 py-1 rounded-lg`}>
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



// Matching Builds komponens
const MatchingBuildsList = ({ builds, perkName, activeTab }) => {
    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';

    if (!builds || builds.length === 0) {
        return (
            <div className="text-center py-8 bg-obsidian-light/30 rounded-2xl border border-white/5">
                <p className="text-smoke italic">No matching builds found for {perkName}.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {builds.slice(0, 5).map((build, index) => (
                <div
                    key={index}
                    className={`bg-obsidian-light/30 border border-white/5 rounded-xl p-4 backdrop-blur-sm hover:border-${accentColor}/30 transition-all group`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-${accentColor} font-black group-hover:translate-x-1 transition-transform`}>
                            {build.buildName}
                        </h3>
                        <span className={`text-xs bg-${accentColor}/20 text-${accentColor} px-2 py-1 rounded-full font-bold`}>
                            {build.matchedPerks}/{build.totalPerks}
                        </span>
                    </div>
                    <p className="text-smoke text-sm">
                        {build.description || 'A powerful build combination with great synergy.'}
                    </p>

                    {/* Perk előnézet */}
                    {build.perks && (
                        <div className="mt-3 flex gap-2">
                            {build.perks.map((perkName, idx) => (
                                <div
                                    key={idx}
                                    className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center"
                                    title={perkName}
                                >
                                    <span className="text-[8px] text-white font-bold uppercase">
                                        {perkName.substring(0, 3)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Perk profil komponens
const PerkProfile = ({ perk, onBack, onAddToLoadout, matchingBuilds = [], activeTab }) => {
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const ownerName = perk.killerName || perk.survivorName || 'All';
    const role = perk.role === 'killer' ? 'Killer' : 'Survivor';
    const roleColor = activeTab === 'killer' ? 'from-red-600 to-red-800' : 'from-blue-600 to-blue-800';
    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';

    const handleAddToLoadout = () => {
        setIsAdding(true);
        onAddToLoadout(perk);
        setTimeout(() => setIsAdding(false), 1000);
    };

    // Perk specifikus matching build-ek szűrése
    const perkSpecificBuilds = matchingBuilds.filter(build =>
        build.perks?.some(p => p === perk.name) || build.matchedPerks > 0
    );

    return (
        <div className="animate-fadeIn">
            {/* Back to Perks gomb - mindig látható */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className={`group flex items-center gap-2 text-smoke hover:text-${accentColor} transition-all`}
                >
                    <div className={`w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:bg-${accentColor}/20 group-hover:border-${accentColor}/30 transition-all group-hover:-translate-x-1`}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Perks</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Bal oldal - Perk kép */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="space-y-4">
                        {/* Perk kép kártya */}
                        <div className="group relative">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${roleColor} rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                            <div className="relative bg-obsidian-light border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <div className="aspect-square bg-gradient-to-br from-black via-obsidian to-black p-8 flex items-center justify-center">
                                    {!imageError ? (
                                        <img
                                            src={perk.icon}
                                            alt={perk.name}
                                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-8 text-center">
                                            <span className="text-3xl font-black text-white uppercase tracking-wider">
                                                {perk.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gyors statisztikák */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="bg-obsidian-light/50 border border-white/5 rounded-xl p-3 backdrop-blur-sm">
                                <div className="text-xs text-smoke uppercase tracking-wider mb-1">Role</div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${perk.role === 'killer' ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`} />
                                    <span className="text-white font-bold text-sm">{role}</span>
                                </div>
                            </div>
                            <div className="bg-obsidian-light/50 border border-white/5 rounded-xl p-3 backdrop-blur-sm">
                                <div className="text-xs text-smoke uppercase tracking-wider mb-1">Owner</div>
                                <span className="text-white font-bold text-sm truncate ">{ownerName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobb oldal - Részletes információk */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    {/* Címsor */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white mb-3 leading-tight">
                            {perk.name}
                            <span className={`text-${accentColor}`}>.</span>
                        </h1>

                        {/* Címkék - reszponzív wrap */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 bg-gradient-to-r ${roleColor} rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg`}>
                                {role}
                            </span>
                            <span className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-smoke">
                                {ownerName}
                            </span>
                            <span className={`px-3 py-1 ${perk.isLocal ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'} rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm`}>
                                {perk.isLocal ? 'Local Data' : 'API Data'}
                            </span>
                        </div>
                    </div>

                    {/* Leírás */}
                    <div className="bg-obsidian-light/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <span className={`w-1 h-5 bg-${accentColor} rounded-full`}></span>
                            Description
                        </h2>
                        <div className="text-sm sm:text-base text-smoke whitespace-pre-line leading-relaxed">
                            {perk.description}
                        </div>
                    </div>

                    {/* Matching Builds szekció */}
                    <div className="bg-obsidian-light/30 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className={`w-1 h-5 bg-${accentColor} rounded-full`}></span>
                            Best Synergies & Builds
                        </h2>

                        <MatchingBuildsList
                            builds={perkSpecificBuilds}
                            perkName={perk.name}
                            activeTab={activeTab}
                        />

                        {/* Tippek és trükkök */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full bg-${accentColor}/20 flex items-center justify-center flex-shrink-0`}>
                                    <span className={`text-${accentColor} text-lg`}>💡</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">Pro Tip</h4>
                                    <p className="text-smoke text-sm">
                                        This perk works best when combined with other {role.toLowerCase()} perks
                                        that focus on similar playstyles. Check out the matching builds above for inspiration!
                                    </p>
                                </div>
                            </div>
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
    const [loadout, setLoadout] = useState([null, null, null, null]);
    const [strength, setStrength] = useState(0);
    const [matchingBuilds, setMatchingBuilds] = useState([]);

    // Build saving state
    const { user } = useAuth();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [buildName, setBuildName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Check if loudout is fully loaded (4 perks)
    const isLoadoutFull = loadout.every(perk => perk !== null);

    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';

    useEffect(() => {
        setLoadout([null, null, null, null]);
        setStrength(0);
        setMatchingBuilds([]);
    }, [activeTab]);

    const calculateStrength = (currentLoadout) => {
        const rolePerksInLoadout = currentLoadout.filter(perk => perk?.role === activeTab);
        if (rolePerksInLoadout.length === 0) return 0;
        return calculatePerkStrength(currentLoadout, activeTab);
    };

    const addToLoadout = (perk) => {
        if (perk.role !== activeTab) {
            alert(`You can only add ${activeTab} perks to your loadout!`);
            return;
        }

        if (loadout.some(p => p?.id === perk.id)) {
            alert('This perk is already in your loadout!');
            return;
        }

        const emptySlotIndex = loadout.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) {
            alert('All slots are full! Remove a perk first.');
            return;
        }

        const newLoadout = [...loadout];
        newLoadout[emptySlotIndex] = perk;
        setLoadout(newLoadout);
        setStrength(calculateStrength(newLoadout));

        const matches = getMatchingBuilds(newLoadout, activeTab);
        setMatchingBuilds(matches);

        setSelectedPerk(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeFromLoadout = (index) => {
        const newLoadout = [...loadout];
        newLoadout[index] = null;
        setLoadout(newLoadout);
        setStrength(calculateStrength(newLoadout));
        setMatchingBuilds(getMatchingBuilds(newLoadout, activeTab));
    };

    const handleSaveBuild = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You need to be logged in to save builds.');
            return;
        }

        if (!buildName.trim()) {
            toast.error('Please enter a name for your build.');
            return;
        }

        setIsSaving(true);
        try {
            const buildData = {
                buildName: buildName.trim(),
                role: activeTab,
                strength,
                perks: loadout.map(p => ({
                    id: p.id,
                    name: p.name,
                    icon: p.icon
                }))
            };

            await saveUserBuild(user.uid, buildData);
            toast.success('Build saved successfully!');
            setIsSaveModalOpen(false);
            setBuildName('');
        } catch (error) {
            console.error('Error saving build:', error);
            toast.error('Failed to save build.');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredByRole = useMemo(() => {
        if (!perks.length) return [];
        return perks.filter(perk => perk.role === activeTab);
    }, [perks, activeTab]);

    const filteredPerks = useMemo(() => {
        let result = filteredByRole.filter(perk => {
            return perk.name.toLowerCase().includes(search.toLowerCase());
        });

        result.sort((a, b) => {
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return 0;
        });

        return result;
    }, [filteredByRole, search, sortBy]);

    const handleBack = () => {
        setSelectedPerk(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInfoClick = (perk) => {
        setSelectedPerk(perk);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const killerCount = perks.filter(p => p.role === 'killer').length;
    const survivorCount = perks.filter(p => p.role === 'survivor').length;

    return (
        <Layout>
            {/* Search/Filter Header - csak ha nincs kiválasztva perk */}
            {!selectedPerk && (
                <div className="sticky top-0 z-30 bg-obsidian-light/80 backdrop-blur-xl border-b border-white/5 p-3 sm:p-4 shadow-xl">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter">
                                PERK WIKI<span className={`text-${accentColor}`}>.</span>
                            </h2>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
                                    <input
                                        type="text"
                                        placeholder="Search perk..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-dbd-red focus:ring-1 focus:ring-dbd-red transition-all"
                                    />
                                </div>

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
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${sortBy === option.id ? `bg-${accentColor}/20 text-${accentColor}` : 'text-smoke hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher - dinamikus színekkel */}
                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
                            <button
                                onClick={() => setActiveTab('killer')}
                                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'killer'
                                    ? 'bg-dbd-red text-white shadow-[0_0_15px_rgba(255,18,18,0.4)]'
                                    : 'bg-black/40 border border-white/5 text-smoke hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Killer <span className="hidden xs:inline">Perks</span> <span className="ml-1 opacity-60">({killerCount})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('survivor')}
                                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'survivor'
                                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                    : 'bg-black/40 border border-white/5 text-smoke hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Survivor <span className="hidden xs:inline">Perks</span> <span className="ml-1 opacity-60">({survivorCount})</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 ${selectedPerk ? 'pt-4 lg:pt-8' : ''}`}>
                {/* ... (loading/error logic remains same) */}
                {/* ... existing code for loading, error, selectedPerk ... */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-dbd-red/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-dbd-red font-black uppercase tracking-[0.3em] animate-pulse">
                            Loading Perks
                        </p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center bg-obsidian-light/30 border border-dbd-red/20 rounded-2xl max-w-md mx-auto p-8">
                        <p className="text-3xl text-dbd-red font-black uppercase italic mb-2">Error</p>
                        <p className="text-smoke">{error}</p>
                    </div>
                ) : selectedPerk ? (
                    <PerkProfile
                        perk={selectedPerk}
                        onBack={handleBack}
                        onAddToLoadout={addToLoadout}
                        matchingBuilds={matchingBuilds}
                        activeTab={activeTab}
                    />
                ) : (
                    <div className="space-y-8">
                        {/* Perk Loadout Section */}
                        <div className="bg-obsidian-light/50 border border-white/5 rounded-2xl p-4 sm:p-6 mb-8">
                            <h3 className="text-lg sm:text-xl font-black text-white mb-4 flex items-center gap-2">
                                <span className={`w-2 h-2 bg-${accentColor} rounded-full animate-pulse`}></span>
                                YOUR LOADOUT
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                                <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    {loadout.map((perk, index) => (
                                        <PerkSlot
                                            key={index}
                                            perk={perk}
                                            isFilled={perk !== null}
                                            onClick={() => perk && removeFromLoadout(index)}
                                            activeTab={activeTab}
                                        />
                                    ))}
                                </div>
                                <div className="lg:col-span-1 flex flex-col gap-3">
                                    <StrengthMeter percentage={strength} activeTab={activeTab} />

                                    {/* Action Buttons below Strength Meter */}
                                    <button
                                        onClick={() => user ? setIsSaveModalOpen(true) : toast.error('You need to be logged in to save builds.')}
                                        disabled={!isLoadoutFull}
                                        className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isLoadoutFull
                                            ? `bg-${accentColor} text-white hover:bg-${accentColor}/80 shadow-lg`
                                            : 'bg-black/40 border border-white/10 text-smoke opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <BookmarkIcon className="w-4 h-4" />
                                        Save Build
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Perk Grid */}
                        {filteredPerks.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {filteredPerks.map(perk => (
                                    <PerkCard
                                        key={`${perk.role}-${perk.id}`}
                                        perk={perk}
                                        onClick={() => addToLoadout(perk)}
                                        onInfoClick={() => handleInfoClick(perk)}
                                        activeTab={activeTab}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-smoke italic">No perks found matching "{search}"...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Save Build Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !isSaving && setIsSaveModalOpen(false)}></div>
                    <div className="glass-card w-full max-w-md relative border border-white/10 shadow-2xl animate-scale-up overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white">Save Build</h2>
                                <p className="text-xs text-smoke mt-1">Name your loadout to save it to your profile.</p>
                            </div>
                            <button onClick={() => !isSaving && setIsSaveModalOpen(false)} className="p-2 text-smoke hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveBuild} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-smoke mb-2">Build Name</label>
                                <input
                                    type="text"
                                    maxLength={30}
                                    value={buildName}
                                    onChange={(e) => setBuildName(e.target.value)}
                                    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-${accentColor} transition-colors`}
                                    placeholder={`E.g. "My Epic ${activeTab === 'killer' ? 'Killer' : 'Survivor'} Build"`}
                                    required
                                    autoFocus
                                />
                                <div className="text-right text-[10px] text-smoke mt-1">{buildName.length} / 30</div>
                            </div>

                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {loadout.map((perk, i) => (
                                        perk && <img key={i} src={perk.icon} alt="perk" className="w-8 h-8 rounded bg-obsidian border border-white/10" />
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{strength}% Strength</p>
                                    <p className={`text-[10px] uppercase text-${accentColor}`}>{activeTab}</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsSaveModalOpen(false)} disabled={isSaving} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-smoke hover:text-white transition-all disabled:opacity-50">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSaving || !buildName.trim()}
                                    className={`px-6 py-2.5 bg-${accentColor} text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-${accentColor}/80 transition-all disabled:opacity-50 min-w-[120px]`}
                                >
                                    {isSaving ? <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin mx-auto"></div> : "Save Build"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default WikiPage;