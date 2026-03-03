import React from 'react';

const CharacterCard = ({ character, onClick }) => {
    const isKiller = character.role === 'killer';

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-green-400';
            case 'intermediate':
            case 'moderate': return 'text-yellow-400';
            case 'hard': return 'text-orange-400';
            case 'very hard': return 'text-red-500 font-extrabold';
            default: return 'text-smoke';
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative glass-card overflow-hidden cursor-pointer border border-white/5 hover:border-dbd-red/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,18,18,0.2)] bg-obsidian"
        >
            {/* Role Badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg z-10 backdrop-blur-md border ${isKiller ? 'bg-dbd-red/80 border-dbd-red text-white' : 'bg-blue-600/80 border-blue-500 text-white'
                }`}>
                {character.role}
            </div>

            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden relative bg-black/50">
                <img
                    src={character.imageUrl}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Vignette & Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent" />
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 transform transition-transform duration-300">
                <h3 className="text-base sm:text-xl md:text-2xl font-black italic tracking-tighter leading-none text-white drop-shadow-md group-hover:text-dbd-red transition-colors duration-300">
                    {character.name.toUpperCase()}
                </h3>

                <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-300 mt-2">
                    <p className={`text-xs uppercase tracking-widest font-bold ${getDifficultyColor(character.difficulty)}`}>
                        Difficulty: {character.difficulty || 'Normal'}
                    </p>
                </div>
            </div>

            {/* Hover Glow Accent */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-dbd-red/30 rounded-xl pointer-events-none transition-colors duration-500" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export default CharacterCard;
