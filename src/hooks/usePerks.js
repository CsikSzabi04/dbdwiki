import { useState, useEffect } from 'react';
import survivorsPerksData from './survivorperks.json';
import killersPerksData from './killersperks.json';

export const usePerks = () => {
    const [perks, setPerks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerks = async () => {
            try {
                setLoading(true);



                // 1. Survivor perkek feldolgozása a helyi JSON-ból
                const survivors = survivorsPerksData.map(perk => ({
                    id: perk.id,
                    name: perk.name,
                    code: perk.code,
                    role: 'survivor',
                    survivorCode: perk.survivorCode || 'all',
                    survivorName: perk.survivorName || 'All',
                    description: perk.description,
                    icon: perk.icon,
                    isLocal: true
                }));

                // 2. Killer perkek feldolgozása a helyi JSON-ból
                const killers = killersPerksData.map(perk => ({
                    id: perk.id,
                    name: perk.name,
                    code: perk.code,
                    role: 'killer',
                    killerCode: perk.killerCode || 'all',
                    killerName: perk.killerName || 'All',
                    description: perk.description,
                    icon: perk.icon,
                    isLocal: true
                }));



                // 4. Összes perk kombinálása
                setPerks([...killers, ...survivors]);
            } catch (err) {
                console.error("Error fetching perks:", err);
                // Fallback to local data only
                const survivors = survivorsPerksData.map(p => ({
                    id: p.id, name: p.name, code: p.code, role: 'survivor',
                    survivorCode: p.survivorCode, survivorName: p.survivorName,
                    description: p.description, icon: p.icon
                }));
                const killers = killersPerksData.map(p => ({
                    id: p.id, name: p.name, code: p.code, role: 'killer',
                    killerCode: p.killerCode, killerName: p.killerName,
                    description: p.description, icon: p.icon
                }));
                setPerks([...killers, ...survivors]);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPerks();
    }, []);

    return { perks, loading, error };
};
