import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useCharacters } from '../hooks/useCharacters';
import CharacterCard from '../components/Wiki/CharacterCard';
import CharacterProfile from '../components/Wiki/CharacterProfile';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

const difficultyOrder = { 'Easy': 1, 'Intermediate': 2, 'Moderate': 2, 'Hard': 3, 'Very Hard': 4 };

const WikiPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { characters, loading, error } = useCharacters();
    const [activeTab, setActiveTab] = useState(location.state?.role || 'survivor');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name-asc'); // name-asc, name-desc, diff-asc, diff-desc
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null); // New state for profile view

    useEffect(() => {
        if (!loading && characters.length > 0 && location.state?.characterName) {
            const char = characters.find(c => c.name.toLowerCase() === location.state.characterName.toLowerCase());
            if (char) {
                setActiveTab(char.role);
                setSelectedCharacter(char);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [loading, characters, location.state, navigate]);

    const filteredCharacters = useMemo(() => {
        let result = characters.filter(char => {
            const matchesTab = char.role === activeTab;
            const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });

        result.sort((a, b) => {
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);

            if (sortBy.startsWith('diff')) {
                const diffA = difficultyOrder[a.difficulty] || 99;
                const diffB = difficultyOrder[b.difficulty] || 99;
                if (diffA !== diffB) {
                    return sortBy === 'diff-asc' ? diffA - diffB : diffB - diffA;
                }
                return a.name.localeCompare(b.name); // fallback to name
            }
            return 0;
        });

        return result;
    }, [characters, activeTab, search, sortBy]);

    // Handle back navigation
    const handleBack = () => {
        setSelectedCharacter(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Layout>
            {/* ONLY show search/filter header if NO character is selected */}
            {!selectedCharacter && (
                <div className="sticky top-0 z-30 bg-obsidian-light/80 backdrop-blur-xl border-b border-white/5 p-3 sm:p-4 shadow-xl">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter drop-shadow-md">DBD WIKI<span className="text-dbd-red">.</span></h1>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
                                    <input
                                        type="text"
                                        placeholder="Search character..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-dbd-red focus:ring-1 focus:ring-dbd-red transition-all shadow-inner"
                                    />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative group">
                                    <button 
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="h-full px-4 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2 hover:border-white/20 hover:bg-white/5 transition-colors"
                                    >
                                        <AdjustmentsHorizontalIcon className={`w-5 h-5 text-smoke md:group-hover:text-dbd-red transition-colors ${isSortOpen ? 'text-dbd-red' : ''}`} />
                                        <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-smoke">Sort</span>
                                    </button>

                                    {isSortOpen && (
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                    )}

                                    <div className={`absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all z-50 ${isSortOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'}`}>
                                        <div className="p-1">
                                            {[
                                                { id: 'name-asc', label: 'Name (A-Z)' },
                                                { id: 'name-desc', label: 'Name (Z-A)' },
                                                { id: 'diff-asc', label: 'Difficulty (Easy First)' },
                                                { id: 'diff-desc', label: 'Difficulty (Hard First)' },
                                            ].map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSortBy(option.id);
                                                        setIsSortOpen(false);
                                                    }}
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

                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {['survivor', 'killer'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-dbd-red text-white shadow-[0_0_15px_rgba(255,18,18,0.4)]'
                                        : 'bg-black/40 border border-white/5 text-smoke hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={`max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 ${selectedCharacter ? 'pt-8' : ''}`}>
                {/* Render Profile or Grid based on state */}
                {selectedCharacter ? (
                    <CharacterProfile
                        character={selectedCharacter}
                        onBack={handleBack}
                    />
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 scale-in">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-dbd-red/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-dbd-red font-black uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(255,18,18,0.5)]">
                            Consulting the Archives
                        </p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center glass-card p-8 border-dbd-red/20 max-w-md mx-auto">
                        <p className="text-3xl text-dbd-red font-black uppercase italic mb-2">Error</p>
                        <p className="text-smoke">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredCharacters.map(char => (
                            <CharacterCard
                                key={char.id}
                                character={char}
                                onClick={() => {
                                    setSelectedCharacter(char);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        ))}
                    </div>
                )}

                {!loading && !selectedCharacter && filteredCharacters.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-smoke italic">No characters found in the fog...</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WikiPage;
