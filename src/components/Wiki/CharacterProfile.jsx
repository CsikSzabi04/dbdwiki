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

    const getDifficultyColor = (diff) => {
        const d = diff?.toLowerCase() || '';
        if (d === 'easy') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        if (d === 'intermediate' || d === 'moderate') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
        if (d === 'hard') return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
        if (d === 'very hard') return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
        return 'text-smoke border-white/20 bg-white/5';
    };

    const diffColorClass = getDifficultyColor(character.difficulty);
    const isKiller = character.role === 'killer';

    // Modern színpaletta
    const roleConfig = {
        killer: {
            color: 'rose-500',
            light: 'rose-500',
            dark: 'rose-600',
            gradient: 'from-rose-500/20 to-transparent',
            bg: 'bg-rose-500',
            text: 'text-rose-500',
            border: 'border-rose-500/30',
            glow: 'shadow-rose-500/20'
        },
        survivor: {
            color: 'blue-500',
            light: 'blue-400',
            dark: 'blue-600',
            gradient: 'from-blue-500/20 to-transparent',
            bg: 'bg-blue-500',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            glow: 'shadow-blue-500/20'
        }
    };

    const roleStyle = isKiller ? roleConfig.killer : roleConfig.survivor;
    const roleColor = `${roleStyle.text} ${roleStyle.border} ${roleStyle.bg}/10`;

    return (
        <div className="w-full animate-fade-in pb-12">
            {/* Top Navigation Bar - Modernized */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="group relative flex items-center gap-3 px-5 py-2.5 overflow-hidden rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all duration-300"
                >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${roleStyle.gradient}`} />
                    <svg className="w-4 h-4 text-smoke group-hover:text-white group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-bold uppercase tracking-widest text-smoke group-hover:text-white transition-colors">
                        Back to Selection
                    </span>
                </button>
            </div>

            {/* Profile Header Block - Premium Design */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm">
                {/* Animated Background Effects */}
                <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${roleStyle.gradient}`} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

                {/* Floating Orbs */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-${roleStyle.color} opacity-5 blur-3xl`} />
                <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-${roleStyle.color} opacity-5 blur-3xl`} />

                <div className="relative flex flex-col md:flex-row">
                    {/* Left: Portrait with Frame */}
                    <div className="relative md:w-1/3 flex items-center justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5">
                        {/* Character Image with Glow Effect */}
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 bg-${roleStyle.color} animate-pulse`} />
                            <div className="relative w-40 h-40 md:w-40 md:h-40">
                                {/* Decorative Frame */}
                                <div className={`absolute inset-0 rounded-full border-2 border-${roleStyle.color}/20 animate-spin-slow`} />
                                <div className={`absolute inset-2 rounded-full border border-${roleStyle.color}/10`} />

                                {/* Image Container - Center the image properly */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src={character.imageUrl}
                                        alt={character.name}
                                        className="w-[80%] h-[80%] object-contain drop-shadow-2xl z-10 transform hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://dbd.tricky.lol/dbdassets/portraits/default.png'; }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Character Info */}
                    <div className="flex-1 p-8 md:p-10">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${roleStyle.border} ${roleStyle.bg}/10 ${roleStyle.text}`}>
                                {character.role}
                            </span>
                            {character.difficulty && (
                                <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${diffColorClass}`}>
                                    {character.difficulty}
                                </span>
                            )}
                            {character.dlc && (
                                <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 text-smoke bg-black/40 backdrop-blur-sm">
                                    {character.dlc}
                                </span>
                            )}
                        </div>

                        {/* Name with Underline Effect */}
                        <div className="relative mb-6">
                            <h1 className="text-4xl md:text-2xl lg:text-2xl font-black italic tracking-tighter text-white uppercase">
                                {character.name}
                            </h1>
                            <div className={`absolute -bottom-2 left-0 w-24 h-1 bg-${roleStyle.color} rounded-full`} />
                        </div>


                    </div>
                </div>
            </div>

            {/* Bottom Section: Content Panel + Perks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Lore OR Perk Description */}
                <div className="lg:col-span-2 relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleStyle.gradient} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500`} />
                    <div className="relative glass-card border border-white/10 overflow-hidden flex flex-col h-[600px] rounded-2xl backdrop-blur-sm">

                        {/* Header with Dynamic Perk Info */}
                        <div className="relative border-b border-white/10 p-6">
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 opacity-5 bg-gradient-to-r ${roleStyle.gradient}`} />

                            <div className="relative flex items-center gap-4">
                                {selectedPerk ? (
                                    <>
                                        {/* Perk Icon with Glow */}
                                        {selectedPerk.icon && (
                                            <div className="relative">
                                                <div className={`absolute inset-0 bg-${roleStyle.color} rounded-lg blur-md opacity-30`} />
                                                <div className="relative w-12 h-12 rounded-lg border-2 border-white/10 overflow-hidden bg-obsidian-light transform group-hover:scale-110 transition-transform">
                                                    <img src={selectedPerk.icon} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl md:text-1xl font-black uppercase italic tracking-tighter text-white truncate">
                                                {selectedPerk.name}
                                            </h2>
                                            {selectedPerk.tier && (
                                                <span className="text-xs text-smoke/50 uppercase tracking-wider">
                                                    Tier {selectedPerk.tier}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setSelectedPerk(null)}
                                            className="relative group/btn px-4 py-2 overflow-hidden rounded-lg border border-white/10 hover:border-white/30 transition-all"
                                        >
                                            <div className={`absolute inset-0 ${roleStyle.bg}/0 group-hover/btn:${roleStyle.bg}/10 transition-colors`} />
                                            <span className="relative text-xs font-bold uppercase tracking-widest text-smoke group-hover/btn:text-white">
                                                ← Back to Lore
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className={`w-1.5 h-8 rounded-full bg-${roleStyle.color}`} />
                                        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">
                                            Lore & Background
                                        </h2>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            ref={contentScrollRef}
                            className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
                        >
                            {selectedPerk ? (
                                <div className="space-y-4">
                                    <p className="text-smoke/90 leading-relaxed text-base whitespace-pre-line">
                                        {selectedPerk.description || 'No description available.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Decorative Quote Mark */}
                                    <div className={`absolute -top-2 -left-2 text-6xl font-serif text-${roleStyle.color}/20`}>"</div>
                                    <p className="relative text-smoke/90 leading-loose text-base whitespace-pre-line pl-4 border-l-2 border-white/10">
                                        {character.backstory || 'The Entity has obscured these memories...'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Perks List */}
                <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleStyle.gradient} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500`} />
                    <div className="relative glass-card border border-white/10 flex flex-col overflow-hidden h-[600px] rounded-2xl backdrop-blur-sm">

                        {/* Perks Header */}
                        <div className="relative border-b border-white/10 p-6">
                            <div className={`absolute inset-0 opacity-5 bg-gradient-to-r ${roleStyle.gradient}`} />
                            <div className="relative flex items-center gap-3">
                                <div className={`w-1.5 h-8 rounded-full bg-${roleStyle.color}`} />
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                                    Unique Perks
                                </h2>
                                {characterPerks.length > 0 && (
                                    <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${roleStyle.border} ${roleStyle.bg}/10 ${roleStyle.text}`}>
                                        {characterPerks.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Perks List - Scrollable */}
                        <div
                            ref={perksScrollRef}
                            className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
                        >
                            {characterPerks.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {characterPerks.map((perk, idx) => {
                                        const isActive = selectedPerk?.id === perk.id;

                                        return (
                                            <button
                                                key={perk.id ?? idx}
                                                onClick={() => setSelectedPerk(isActive ? null : perk)}
                                                className={`relative group/perk overflow-hidden rounded-xl transition-all duration-300
                                                    ${isActive
                                                        ? `bg-gradient-to-r ${roleStyle.gradient} border-${roleStyle.color}/30 shadow-lg ${roleStyle.glow}`
                                                        : 'bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5'
                                                    }
                                                `}
                                            >
                                                {/* Hover Effect */}
                                                <div className={`absolute inset-0 opacity-0 group-hover/perk:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${roleStyle.gradient}`} />

                                                <div className="relative flex items-center gap-3 p-3">
                                                    {/* Perk Icon with Glow */}
                                                    <div className="relative">
                                                        {isActive && (
                                                            <div className={`absolute inset-0 bg-${roleStyle.color} rounded-lg blur-md opacity-50 animate-pulse`} />
                                                        )}
                                                        <div className={`relative w-12 h-12 rounded-lg border overflow-hidden transition-all duration-300
                                                            ${isActive
                                                                ? `border-${roleStyle.color}/40 bg-${roleStyle.color}/10 scale-110`
                                                                : 'border-white/10 bg-obsidian-light group-hover/perk:border-white/30'
                                                            }
                                                        `}>
                                                            {perk.icon ? (
                                                                <img
                                                                    src={perk.icon}
                                                                    alt={perk.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-smoke/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Perk Info */}
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <p className={`font-bold text-sm uppercase tracking-wider transition-colors line-clamp-2
                                                            ${isActive ? 'text-white' : 'text-white/80 group-hover/perk:text-white'}
                                                        `}>
                                                            {perk.name}
                                                        </p>
                                                        {perk.tier && (
                                                            <p className="text-[10px] text-smoke/50 uppercase tracking-wider mt-0.5">
                                                                Tier {perk.tier}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className={`w-2 h-2 rounded-full bg-${roleStyle.color} animate-pulse`} />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-smoke/50 italic text-sm text-center">
                                        No unique perks recorded.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterProfile;