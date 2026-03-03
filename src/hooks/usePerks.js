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
                
                // API hívás a tricky.lol-ról további perkekért
                const response = await fetch('/api-tricky/api/perksl');
                const apiData = response.ok ? await response.json() : {};

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

                // Normalize name for comparison
                const normalizeName = (name) => {
                    if (!name) return '';
                    return name.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                };

                // 3. Extra perkek az API-ból, amik nincsenek meg a helyi JSON-ban
                const localNames = new Set([...survivors, ...killers].map(p => normalizeName(p.name)));

                const extraPerks = Object.values(apiData)
                    .filter(perk => {
                        return !localNames.has(normalizeName(perk.name));
                    })
                    .map(perk => ({
                        id: perk.id || Math.random(),
                        name: perk.name,
                        code: perk.code || perk.name.toLowerCase().replace(/\s+/g, ''),
                        role: perk.role || (perk.killerName ? 'killer' : 'survivor'),
                        killerCode: perk.killerCode,
                        killerName: perk.killerName,
                        survivorCode: perk.survivorCode,
                        survivorName: perk.survivorName,
                        description: perk.description || '',
                        icon: perk.icon || `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/8/86/IconPerks_${perk.code}.png`,
                        isLocal: false
                    }));

                // 4. Összes perk kombinálása
                setPerks([...killers, ...survivors, ...extraPerks]);
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