import React from 'react';

// Erősségmérő komponens
const StrengthMeter = ({ percentage, activeTab }) => {
    const safePercentage = Math.min(100, Math.max(0, percentage));
    const accentColor = activeTab === 'killer' ? 'dbd-red' : 'blue-500';

    const getColor = () => {
        if (safePercentage < 30) return 'from-red-500 to-red-600';
        if (safePercentage < 60) return 'from-yellow-500 to-yellow-600';
        if (safePercentage < 80) return 'from-green-500 to-green-600';
        return `from-${accentColor} to-${accentColor}/80`;
    };

    const getCategory = () => {
        if (safePercentage <= 25) return 'Weak';
        if (safePercentage <= 50) return 'Balanced';
        if (safePercentage <= 75) return 'Good';
        if (safePercentage <= 85) return 'Strong';
        return 'Best';
    };

    return (
        <div data-testid="strength-meter-container" className="bg-obsidian-light rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span data-testid="strength-meter-value" className="text-white font-black text-lg">
                    {Math.round(safePercentage)}%
                </span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div
                    data-testid="strength-meter-bar"
                    className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${safePercentage}%` }}
                />
            </div>
            <div className="mt-3 text-center">
                <span data-testid="strength-meter-category" className={`text-${accentColor} font-bold uppercase tracking-wider text-sm`}>
                    {getCategory()}
                </span>
            </div>
        </div>
    );
};

export default StrengthMeter;
