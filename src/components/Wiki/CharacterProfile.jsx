import React, { useState, useMemo, useRef, useEffect } from 'react';
import survivorPerksData from '../../hooks/survivorperks.json';
import killerPerksData from '../../hooks/killersperks.json';

const CharacterProfile = ({ character, onBack }) => {
    const [selectedPerk, setSelectedPerk] = useState(null);
    const contentScrollRef = useRef(null);
    const perksScrollRef = useRef(null);

    // Get unique perks for this character from the JSON data
    const characterPerks = useMemo(() => {
        const isKiller = character.role === 'killer';
        const perksData = isKiller ? killerPerksData : survivorPerksData;
        const codeKey = isKiller ? 'killerCode' : 'survivorCode';
        return perksData.filter(perk => perk[codeKey] === character.id);
    }, [character]);

    // Preserve scroll position when changing content
    useEffect(() => {
        // Don't reset scroll position when selected perk changes
        // Keep it where the user left off
    }, [selectedPerk]);

    const getDifficultyColor = (diff) => {
        const d = diff?.toLowerCase() || '';
        if (d === 'easy') return 'text-green-500 border-green-500/30 bg-green-500/10';
        if (d === 'intermediate' || d === 'moderate') return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        if (d === 'hard') return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
        if (d === 'very hard') return 'text-red-500 border-red-500/30 bg-red-500/10';
        return 'text-smoke border-white/20 bg-white/5';
    };

    const diffColorClass = getDifficultyColor(character.difficulty);
    const isKiller = character.role === 'killer';
    const roleColor = isKiller ? 'text-dbd-red border-dbd-red/30 bg-dbd-red/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    const accentColor = isKiller ? 'dbd-red' : 'blue-500';
    const accentColorClass = isKiller ? 'dbd-red' : 'blue-500';

    // Content panel shows either lore or selected perk
    const contentTitle = selectedPerk ? selectedPerk.name : 'Lore & Background';
    const contentBody = selectedPerk ? selectedPerk.description : character.backstory;
    const contentEmpty = selectedPerk ? 'No description available.' : 'The Entity has obscured these memories...';

    return (
        <div className="w-full animate-fade-in pb-12">
            {/* Top Navigation Bar */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-white/10 rounded-lg text-smoke hover:text-white hover:bg-white/5 hover:border-white/30 transition-all font-bold tracking-widest text-xs sm:text-sm uppercase group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="hidden sm:inline">Back to Roster</span>
                    <span className="sm:hidden">Back</span>
                </button>
            </div>

            {/* Profile Header Block */}
            <div className="glass-card mb-6 sm:mb-8 border border-white/10 flex flex-col md:flex-row overflow-hidden relative">
                <div className={`absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br ${isKiller ? 'from-dbd-red to-transparent' : 'from-blue-600 to-transparent'}`} />

                {/* Left: Portrait */}
                <div className="relative w-full md:w-1/3 bg-obsidian-light/50 border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-4 sm:p-6 md:p-8 shrink-0">
                    <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64">
                        <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 bg-${accentColor}`} />
                        <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                            onError={(e) => { e.target.src = 'https://dbd.tricky.lol/dbdassets/portraits/default.png'; }}
                        />
                    </div>
                </div>

                {/* Right: Quick Info */}
                <div className="p-4 sm:p-6 md:p-10 flex flex-col justify-center relative z-10 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border ${roleColor}`}>
                            {character.role}
                        </span>
                        {character.difficulty && (
                            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border ${diffColorClass}`}>
                                {character.difficulty}
                            </span>
                        )}
                        {character.dlc && (
                            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-white/10 text-smoke bg-black/40">
                                {character.dlc}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-md mb-3 sm:mb-5">
                        {character.name}
                    </h1>

                    {character.overview && (
                        <div className="bg-black/30 p-3 sm:p-5 rounded-xl border border-white/5">
                            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-smoke/70 mb-1.5 sm:mb-2">Overview</h3>
                            <p className="text-smoke leading-relaxed font-medium text-xs sm:text-sm md:text-base line-clamp-4 md:line-clamp-none">
                                {character.overview}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Content Panel + Perks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3 lg:gap-4">
                {/* Left Column: Lore OR Perk Description — FIXED HEIGHT WITH SCROLLING */}
                <div className="lg:col-span-2 glass-card border border-white/10 relative overflow-hidden flex flex-col h-[500px]">
                    <div className={`absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br ${isKiller ? 'from-dbd-red to-transparent' : 'from-blue-600 to-transparent'}`} />

                    {/* Header — shows title + back-to-lore button when viewing a perk */}
                    <div className="flex items-center gap-3 border-b border-white/10 p-4 sm:p-6 relative z-10 shrink-0">
                        <div className={`w-1.5 h-6 rounded-full bg-${accentColor}`}></div>

                        {selectedPerk ? (
                            <>
                                {/* Perk icon in header */}
                                {selectedPerk.icon && (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/10 overflow-hidden shrink-0 bg-obsidian-light">
                                        <img src={selectedPerk.icon} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <h2 className="text-base sm:text-lg md:text-xl font-black uppercase italic tracking-tighter text-white flex-1 truncate">
                                    {contentTitle}
                                </h2>
                                <button
                                    onClick={() => setSelectedPerk(null)}
                                    className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest text-smoke border border-white/10 hover:text-white hover:bg-white/5 hover:border-white/30 transition-all shrink-0"
                                >
                                    ← Lore
                                </button>
                            </>
                        ) : (
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">
                                {contentTitle}
                            </h2>
                        )}
                    </div>

                    {/* Scrollable Content - Fixed height, scrollable */}
                    <div 
                        ref={contentScrollRef}
                        className="overflow-y-auto flex-1 p-4 sm:p-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    >
                        {contentBody ? (
                            <p className="text-smoke/90 leading-loose whitespace-pre-line font-medium text-sm sm:text-base">
                                {contentBody}
                            </p>
                        ) : (
                            <p className="text-smoke/50 italic text-center py-10">
                                {contentEmpty}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column: Perks List — FIXED HEIGHT WITH SCROLLING */}
               <div className="glass-card border border-white/10 flex flex-col overflow-hidden h-[500px]">

                    <div className="flex items-center gap-2 border-b border-white/10 p-6 shrink-0">
                        <div className={`w-2 h-6 rounded-full bg-${accentColor}`} />
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                            Unique Perks
                        </h2>
                        {characterPerks.length > 0 && (
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-smoke bg-white/5 px-2 py-1 rounded-full">
                                {characterPerks.length}
                            </span>
                        )}
                    </div>

                    {/* Perks List - Scrollable */}
                    <div 
                        ref={perksScrollRef}
                        className="overflow-y-auto flex-1 p-3 sm:p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    >
                        {characterPerks.length > 0 ? (
                            <div className="flex flex-col gap-1 sm:gap-3">
                                {characterPerks.map((perk, idx) => {
                                    const isActive = selectedPerk?.id === perk.id;

                                    return (
                                        <button
                                            key={perk.id ?? idx}
                                            onClick={() => setSelectedPerk(isActive ? null : perk)}
                                            className={`w-full flex items-center gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl border transition-all duration-300 text-left group
                                                ${isActive
                                                    ? `bg-${accentColorClass}/10 border-${accentColorClass}/30 shadow-lg shadow-${accentColorClass}/10`
                                                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'}
                                            `}
                                        >
                                            {/* Perk Icon - Fixed size */}
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border overflow-hidden shrink-0 shadow-inner transition-all duration-300
                                                ${isActive
                                                    ? `border-${accentColorClass}/40 bg-${accentColorClass}/10`
                                                    : 'border-white/10 bg-obsidian-light group-hover:border-white/20'}
                                            `}>
                                                {perk.icon ? (
                                                    <img
                                                        src={perk.icon}
                                                        alt={perk.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-smoke/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Perk Name - With proper truncation */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm uppercase tracking-wider transition-colors duration-300
                                                    break-words whitespace-normal line-clamp-2
                                                    ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}
                                                `}>
                                                    {perk.name}
                                                </p>

                                                {perk.tier && (
                                                    <p className="text-[10px] text-smoke/50 uppercase tracking-wider mt-1">
                                                        Tier {perk.tier}
                                                    </p>
                                                )}
                                            </div>
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className={`w-1.5 h-1.5 rounded-full bg-${accentColorClass} shrink-0 ml-1`} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center py-10">
                                <p className="text-smoke/50 italic text-sm text-center">No unique perks recorded.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterProfile;