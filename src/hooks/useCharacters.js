import { useState, useEffect } from 'react';
import survivorsData from './survivors.json';
import killersData from './killers.json';

export const useCharacters = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                setLoading(true);
               

                // 1. Process Survivors from Local JSON
                const survivors = survivorsData.map(survivor => ({
                    id: survivor.code,
                    name: survivor.name,
                    role: 'survivor',
                    difficulty: survivor.difficulty,
                    imageUrl: survivor.imgs?.portrait, // Explicitly using portrait
                    perks: survivor.perks_names || [],
                    gender: survivor.gender,
                    dlc: survivor.dlc,
                    overview: survivor.overview,
                    backstory: survivor.backstory,
                    isLocal: true
                }));

                // 2. Process Killers from Local JSON
                const killers = killersData.map(killer => ({
                    id: killer.code,
                    name: killer.name,
                    role: 'killer',
                    difficulty: killer.difficulty,
                    imageUrl: killer.imgs?.portrait, // Explicitly using portrait
                    perks: killer.perks_names || [],
                    gender: killer.gender,
                    dlc: killer.dlc,
                    overview: killer.overview,
                    backstory: killer.story || killer.backstory, // Killers sometimes use 'story' instead of 'backstory'
                    isLocal: true
                }));

                // Normalize name for comparison (removes spaces, special chars, and leading 'the')
                const normalizeName = (name) => {
                    if (!name) return '';
                    let n = name.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (n.startsWith('the')) n = n.substring(3);

                    // Alias mapping for character names that differ between local JSON and tricky.lol API
                    const aliases = {
                        'leonscottkennedy': 'leonskennedy',
                        'chucky': 'goodguy',
                        'leatherface': 'cannibal',
                        'freddykrueger': 'nightmare',
                        'pyramidhead': 'executioner',
                        'sadakoyamamura': 'onryo',
                        'albertwesker': 'mastermind',
                        'pinhead': 'cenobite'
                    };
                    return aliases[n] || n;
                };

                // 3. Process any EXTRA characters from API that are not in our JSON
                const localNames = new Set([...survivors, ...killers].map(c => normalizeName(c.name)));

                const extraCharacters = Object.values(apiData)
                    .filter(char => {
                        return !localNames.has(normalizeName(char.name));
                    })
                    .map(char => ({
                        ...char,
                        // Make sure API characters have a consistent structure
                        difficulty: char.difficulty || 'intermediate',
                        role: char.role || (char.power ? 'killer' : 'survivor'),
                        perks: char.perks || [],
                        overview: char.description || '',
                        backstory: char.story || '',
                        // Use the official image path from API, prefixed with proxy
                        // Most tricky.lol assets are under /dbdassets/
                        imageUrl: char.image
                            ? `/api-tricky/dbdassets/${char.image}`
                            : `/api-tricky/assets/portraits/${char.id}.png`,
                        isLocal: false
                    }));

                // 4. Combine all
                setCharacters([...killers, ...survivors, ...extraCharacters]);
            } catch (err) {
                console.error("Error fetching characters:", err);
                // Fallback to local data only
                const survivors = survivorsData.map(s => ({
                    id: s.code, name: s.name, role: 'survivor', difficulty: s.difficulty, imageUrl: s.imgs.portrait, perks: s.perks_names
                }));
                const killers = killersData.map(k => ({
                    id: k.code, name: k.name, role: 'killer', difficulty: k.difficulty, imageUrl: k.imgs.portrait, perks: k.perks_names
                }));
                setCharacters([...killers, ...survivors]);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    return { characters, loading, error };
};

