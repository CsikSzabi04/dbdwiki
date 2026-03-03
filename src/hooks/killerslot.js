// killerslot.js - Perk erősség számítási logika a legjobb build-ek alapján

// Legjobb build-ek listája a megadott adatok alapján
export const topBuilds = [
    {
        name: "The Meta Standard",
        perks: [
            { id: 88, name: "Scourge Hook: Pain Resonance" },  // Pain Resonance ID: 88
            { id: 50, name: "Pop Goes the Weasel" },           // Pop Goes the Weasel ID: 50
            { id: 57, name: "Corrupt Intervention" },           // Corrupt Intervention ID: 57
            { id: 100, name: "Nowhere to Hide" }                // Nowhere to Hide ID: 100
        ]
    },
    {
        name: "Ultimate Slowdown",
        perks: [
            { id: 88, name: "Scourge Hook: Pain Resonance" },  // Pain Resonance
            { id: 67, name: "Dead Man's Switch" },             // Dead Man's Switch ID: 67
            { id: 57, name: "Corrupt Intervention" },           // Corrupt Intervention
            { id: 87, name: "Grim Embrace" }                    // Grim Embrace ID: 87
        ]
    },
    {
        name: "Fast-Break M1",
        perks: [
            { id: 50, name: "Pop Goes the Weasel" },           // Pop Goes the Weasel
            { id: 9, name: "Jolt" },                           // Jolt (Surge) ID: 9
            { id: 100, name: "Nowhere to Hide" },              // Nowhere to Hide
            { id: 48, name: "Bamboozle" }                       // Bamboozle ID: 48
        ]
    },
    {
        name: "Aura/Anti-Loop",
        perks: [
            { id: 81, name: "Lethal Pursuer" },                 // Lethal Pursuer ID: 81
            { id: 100, name: "Nowhere to Hide" },               // Nowhere to Hide
            { id: 67, name: "Dead Man's Switch" },              // Dead Man's Switch
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "The 'No-Gen' Build",
        perks: [
            { id: 84, name: "Deadlock" },                       // Deadlock ID: 84
            { id: 57, name: "Corrupt Intervention" },           // Corrupt Intervention
            { id: 50, name: "Pop Goes the Weasel" },           // Pop Goes the Weasel
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "Endgame Specialist",
        perks: [
            { id: 80, name: "No Way Out" },                     // No Way Out ID: 80
            { id: 43, name: "Remember Me" },                    // Remember Me ID: 43
            { id: 99, name: "Terminus" },                       // Terminus ID: 99
            { id: 44, name: "Blood Warden" }                    // Blood Warden ID: 44
        ]
    },
    {
        name: "Hex/Snowball",
        perks: [
            { id: 85, name: "Hex: Plaything" },                 // Hex: Plaything ID: 85
            { id: 89, name: "Hex: Pentimento" },                // Hex: Pentimento ID: 89
            { id: 74, name: "Hex: Undying" },                   // Hex: Undying ID: 74
            { id: 57, name: "Corrupt Intervention" }            // Corrupt Intervention
        ]
    },
    {
        name: "Anti-Healing/Hit&Run",
        perks: [
            { id: 11, name: "Sloppy Butcher" },                 // Sloppy Butcher ID: 11
            { id: 86, name: "Scourge Hook: Gift of Pain" },     // Gift of Pain ID: 86
            { id: 9, name: "Jolt" },                            // Jolt (Surge)
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "Chase/Map Control",
        perks: [
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 97, name: "Superior Anatomy" },               // Superior Anatomy ID: 97
            { id: 77, name: "Coup de Grâce" },                  // Coup de Grâce ID: 77
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "The Devious Aura",
        perks: [
            { id: 81, name: "Lethal Pursuer" },                 // Lethal Pursuer
            { id: 112, name: "Friends 'Til the End" },          // Friends 'til the End ID: 112
            { id: 62, name: "Furtive Chase" },                  // Furtive Chase ID: 62
            { id: 65, name: "Nemesis" }                          // Nemesis ID: 65
        ]
    },
    {
        name: "Aggressive M1",
        perks: [
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 73, name: "Hex: Blood Favour" },              // Hex: Blood Favour ID: 73
            { id: 74, name: "Hex: Undying" },                   // Hex: Undying
            { id: 109, name: "Rapid Brutality" }                // Rapid Brutality ID: 109
        ]
    },
    {
        name: "Vault Speed Build",
        perks: [
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 97, name: "Superior Anatomy" },               // Superior Anatomy
            { id: 51, name: "Spirit Fury" },                    // Spirit Fury ID: 51
            { id: 115, name: "Unbound" }                         // Unbound ID: 115
        ]
    },
    {
        name: "Stun/Exposed Build",
        perks: [
            { id: 51, name: "Spirit Fury" },                    // Spirit Fury
            { id: 21, name: "Enduring" },                       // Enduring ID: 21
            { id: 102, name: "Hubris" },                        // Hubris ID: 102
            { id: 16, name: "Brutal Strength" }                 // Brutal Strength ID: 16
        ]
    },
    {
        name: "Tunnel/Obsession",
        perks: [
            { id: 112, name: "Friends 'til the End" },          // Friends 'til the End
            { id: 62, name: "Furtive Chase" },                  // Furtive Chase
            { id: 100, name: "Nowhere to Hide" },               // Nowhere to Hide
            { id: 109, name: "Rapid Brutality" }                // Rapid Brutality
        ]
    },
    {
        name: "Stealth/Aggression",
        perks: [
            { id: 70, name: "Trail of Torment" },               // Trail of Torment ID: 70
            { id: 100, name: "Nowhere to Hide" },               // Nowhere to Hide
            { id: 50, name: "Pop Goes the Weasel" },           // Pop Goes the Weasel
            { id: 59, name: "Dark Devotion" }                   // Dark Devotion ID: 59
        ]
    },
    {
        name: "Pallet Shredder",
        perks: [
            { id: 16, name: "Brutal Strength" },                // Brutal Strength
            { id: 42, name: "Fire Up" },                        // Fire Up ID: 42
            { id: 51, name: "Spirit Fury" },                    // Spirit Fury
            { id: 21, name: "Enduring" }                        // Enduring
        ]
    },
    {
        name: "Hit-and-Run",
        perks: [
            { id: 82, name: "Hysteria" },                       // Hysteria ID: 82
            { id: 85, name: "Hex: Plaything" },                 // Hex: Plaything
            { id: 11, name: "Sloppy Butcher" },                 // Sloppy Butcher
            { id: 26, name: "A Nurse's Calling" }               // A Nurse's Calling ID: 26
        ]
    },
    {
        name: "Anti-Loop Lockdown",
        perks: [
            { id: 79, name: "Hex: Crowd Control" },             // Hex: Crowd Control ID: 79
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 93, name: "Dissolution" },                    // Dissolution ID: 93
            { id: 84, name: "Deadlock" }                        // Deadlock
        ]
    },
    {
        name: "Swift Strike",
        perks: [
            { id: 77, name: "Coup de Grâce" },                  // Coup de Grâce
            { id: 109, name: "Rapid Brutality" },               // Rapid Brutality
            { id: 88, name: "Scourge Hook: Pain Resonance" },   // Pain Resonance
            { id: 57, name: "Corrupt Intervention" }            // Corrupt Intervention
        ]
    },
    {
        name: "Basement/Agitation",
        perks: [
            { id: 17, name: "Agitation" },                      // Agitation ID: 17
            { id: 8, name: "Iron Grasp" },                      // Iron Grasp ID: 8
            { id: 78, name: "Starstruck" },                     // Starstruck ID: 78
            { id: 10, name: "Scourge Hook: Monstrous Shrine" }  // Monstrous Shrine ID: 10
        ]
    },
    // Killer-specific builds
    {
        name: "The Dark Lord (Dracula)",
        perks: [
            { id: 59, name: "Dark Devotion" },                  // Dark Devotion
            { id: 34, name: "Monitor & Abuse" },                // Monitor & Abuse ID: 34
            { id: 5, name: "Hex: No One Escapes Death" },       // NOED ID: 5
            { id: 26, name: "A Nurse's Calling" }               // Nurse's Calling
        ]
    },
    {
        name: "Vecna/Lich",
        perks: [
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 73, name: "Hex: Blood Favour" },              // Hex: Blood Favour
            { id: 74, name: "Hex: Undying" },                   // Hex: Undying
            { id: 109, name: "Rapid Brutality" }                // Rapid Brutality
        ]
    },
    {
        name: "Singularity/Hux",
        perks: [
            { id: 109, name: "Rapid Brutality" },               // Rapid Brutality
            { id: 77, name: "Coup de Grâce" },                  // Coup de Grâce
            { id: 107, name: "Forced Hesitation" },             // Forced Hesitation ID: 107
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "Dredge/Teleport",
        perks: [
            { id: 81, name: "Lethal Pursuer" },                 // Lethal Pursuer
            { id: 90, name: "Scourge Hook: Floods of Rage" },   // Floods of Rage ID: 90
            { id: 88, name: "Scourge Hook: Pain Resonance" },   // Pain Resonance
            { id: 50, name: "Pop Goes the Weasel" }            // Pop Goes the Weasel
        ]
    },
    {
        name: "The Unknown",
        perks: [
            { id: 115, name: "Unbound" },                       // Unbound
            { id: 48, name: "Bamboozle" },                      // Bamboozle
            { id: 88, name: "Scourge Hook: Pain Resonance" },   // Pain Resonance
            { id: 100, name: "Nowhere to Hide" }                // Nowhere to Hide
        ]
    },
    {
        name: "Oni/Blood",
        perks: [
            { id: 58, name: "Infectious Fright" },              // Infectious Fright ID: 58
            { id: 81, name: "Lethal Pursuer" },                 // Lethal Pursuer
            { id: 63, name: "Zanshin Tactics" },                // Zanshin Tactics ID: 63
            { id: 88, name: "Scourge Hook: Pain Resonance" }    // Pain Resonance
        ]
    },
    {
        name: "Nurse/Blight",
        perks: [
            { id: 81, name: "Lethal Pursuer" },                 // Lethal Pursuer
            { id: 100, name: "Nowhere to Hide" },               // Nowhere to Hide
            { id: 9, name: "Jolt" },                            // Jolt (Surge)
            { id: 90, name: "Scourge Hook: Floods of Rage" }    // Floods of Rage
        ]
    },
    {
        name: "Stealth Hag",
        perks: [
            { id: 82, name: "Hysteria" },                       // Hysteria
            { id: 85, name: "Hex: Plaything" },                 // Hex: Plaything
            { id: 68, name: "Hex: Retribution" },               // Hex: Retribution ID: 68
            { id: 11, name: "Sloppy Butcher" }                  // Sloppy Butcher
        ]
    },
    {
        name: "Doctor/Terror",
        perks: [
            { id: 3, name: "Distressing" },                     // Distressing ID: 3
            { id: 34, name: "Monitor & Abuse" },                // Monitor & Abuse
            { id: 59, name: "Dark Devotion" },                  // Dark Devotion
            { id: 58, name: "Infectious Fright" }               // Infectious Fright
        ]
    },
    {
        name: "Ghost Face/Stealth",
        perks: [
            { id: 28, name: "Play with Your Food" },            // Play with Your Food ID: 28
            { id: 112, name: "Friends 'til the End" },          // Friends 'til the End
            { id: 16, name: "Brutal Strength" },                // Brutal Strength
            { id: 27, name: "Save The Best for Last" }          // STBFL ID: 27
        ]
    }
];

// Perk statisztikák előkészítése
export const perkStats = (() => {
    const stats = {};
    
    // Minden build minden perkjét feldolgozzuk
    topBuilds.forEach(build => {
        build.perks.forEach(perk => {
            if (!stats[perk.id]) {
                stats[perk.id] = {
                    id: perk.id,
                    name: perk.name,
                    count: 0,
                    builds: []
                };
            }
            stats[perk.id].count++;
            if (!stats[perk.id].builds.includes(build.name)) {
                stats[perk.id].builds.push(build.name);
            }
        });
    });
    
    return stats;
})();

// Perkpárok statisztikái (melyik két perk szerepel együtt a legtöbb buildben)
export const perkPairStats = (() => {
    const pairs = {};
    
    topBuilds.forEach(build => {
        // Minden lehetséges párosítás a buildben
        for (let i = 0; i < build.perks.length; i++) {
            for (let j = i + 1; j < build.perks.length; j++) {
                const perk1 = build.perks[i];
                const perk2 = build.perks[j];
                const pairKey = `${Math.min(perk1.id, perk2.id)}-${Math.max(perk1.id, perk2.id)}`;
                
                if (!pairs[pairKey]) {
                    pairs[pairKey] = {
                        perk1Id: perk1.id,
                        perk2Id: perk2.id,
                        perk1Name: perk1.name,
                        perk2Name: perk2.name,
                        count: 0,
                        builds: []
                    };
                }
                pairs[pairKey].count++;
                if (!pairs[pairKey].builds.includes(build.name)) {
                    pairs[pairKey].builds.push(build.name);
                }
            }
        }
    });
    
    return pairs;
})();

// Perk triplettek statisztikái (3 perk együtt)
export const perkTripletStats = (() => {
    const triplets = {};
    
    topBuilds.forEach(build => {
        // Minden lehetséges hármas a buildben
        for (let i = 0; i < build.perks.length; i++) {
            for (let j = i + 1; j < build.perks.length; j++) {
                for (let k = j + 1; k < build.perks.length; k++) {
                    const perk1 = build.perks[i];
                    const perk2 = build.perks[j];
                    const perk3 = build.perks[k];
                    const tripletKey = [perk1.id, perk2.id, perk3.id].sort().join('-');
                    
                    if (!triplets[tripletKey]) {
                        triplets[tripletKey] = {
                            perkIds: [perk1.id, perk2.id, perk3.id].sort(),
                            perkNames: [perk1.name, perk2.name, perk3.name],
                            count: 0,
                            builds: []
                        };
                    }
                    triplets[tripletKey].count++;
                    if (!triplets[tripletKey].builds.includes(build.name)) {
                        triplets[tripletKey].builds.push(build.name);
                    }
                }
            }
        }
    });
    
    return triplets;
})();

// Perk négyesek statisztikái (teljes build)
export const perkQuadStats = (() => {
    const quads = {};
    
    topBuilds.forEach(build => {
        const quadKey = build.perks.map(p => p.id).sort().join('-');
        
        quads[quadKey] = {
            perkIds: build.perks.map(p => p.id).sort(),
            perkNames: build.perks.map(p => p.name),
            buildName: build.name,
            count: 1
        };
    });
    
    return quads;
})();

/**
 * Perk erősség számítása a loadout alapján
 * @param {Array} loadout - 4 perk objektumot tartalmazó tömb (lehet null is)
 * @returns {number} - 0-100 közötti erősség százalék
 */
export const calculatePerkStrength = (loadout) => {
    const filledPerks = loadout.filter(perk => perk !== null);
    if (filledPerks.length === 0) return 0;
    
    // Alap pontszám: minden perk kap egy alapértéket a gyakorisága alapján
    let baseScore = 0;
    filledPerks.forEach(perk => {
        const stat = perkStats[perk.id];
        if (stat) {
            // Minél több buildben szerepel a perk, annál több alap pont
            // Minden előfordulás 5 pontot ér
            baseScore += stat.count * 5;
        } else {
            // Ha nem szerepel egy buildben sem, kap egy kis alap pontot
            baseScore += 3;
        }
    });
    
    // Páronkénti bónusz: ha két perk gyakran szerepel együtt
    let pairBonus = 0;
    const pairCounts = [];
    for (let i = 0; i < filledPerks.length; i++) {
        for (let j = i + 1; j < filledPerks.length; j++) {
            const perk1 = filledPerks[i];
            const perk2 = filledPerks[j];
            const pairKey = `${Math.min(perk1.id, perk2.id)}-${Math.max(perk1.id, perk2.id)}`;
            const pairStat = perkPairStats[pairKey];
            
            if (pairStat) {
                pairCounts.push(pairStat.count);
                // Minden együtt szereplésért bónusz (20 pont / előfordulás)
                pairBonus += pairStat.count * 20;
            } else {
                // Ha nem szerepelnek együtt egy buildben sem, nincs bónusz
                pairBonus += 0;
            }
        }
    }
    
    // Hármas bónusz: ha három perk együtt szerepel valamelyik buildben
    let tripletBonus = 0;
    if (filledPerks.length >= 3) {
        // Minden lehetséges hármas kombináció
        for (let i = 0; i < filledPerks.length; i++) {
            for (let j = i + 1; j < filledPerks.length; j++) {
                for (let k = j + 1; k < filledPerks.length; k++) {
                    const perkIds = [filledPerks[i].id, filledPerks[j].id, filledPerks[k].id].sort();
                    const tripletKey = perkIds.join('-');
                    const tripletStat = perkTripletStats[tripletKey];
                    
                    if (tripletStat) {
                        // Hármas bónusz (40 pont / előfordulás)
                        tripletBonus += tripletStat.count * 40;
                    }
                }
            }
        }
    }
    
    // Négyes bónusz: ha a teljes loadout megegyezik valamelyik top builddel
    let quadBonus = 0;
    if (filledPerks.length === 4) {
        const perkIds = filledPerks.map(p => p.id).sort();
        const quadKey = perkIds.join('-');
        const quadStat = perkQuadStats[quadKey];
        
        if (quadStat) {
            // Teljes build bónusz (100 pont)
            quadBonus = 100;
        }
    }
    
    // Összpontszám számítása
    const totalScore = baseScore + pairBonus + tripletBonus + quadBonus;
    
    // Normalizálás 0-100 közé, de úgy, hogy egy teljes build minimum 70% legyen
    // Számoljuk ki az elméleti maximumot egy top build esetén
    const exampleTopBuild = topBuilds[0];
    let exampleBaseScore = 0;
    exampleTopBuild.perks.forEach(perk => {
        const stat = perkStats[perk.id];
        if (stat) {
            exampleBaseScore += stat.count * 5;
        }
    });
    
    let examplePairBonus = 0;
    for (let i = 0; i < exampleTopBuild.perks.length; i++) {
        for (let j = i + 1; j < exampleTopBuild.perks.length; j++) {
            const perk1 = exampleTopBuild.perks[i];
            const perk2 = exampleTopBuild.perks[j];
            const pairKey = `${Math.min(perk1.id, perk2.id)}-${Math.max(perk1.id, perk2.id)}`;
            const pairStat = perkPairStats[pairKey];
            if (pairStat) {
                examplePairBonus += pairStat.count * 20;
            }
        }
    }
    
    let exampleTripletBonus = 0;
    for (let i = 0; i < exampleTopBuild.perks.length; i++) {
        for (let j = i + 1; j < exampleTopBuild.perks.length; j++) {
            for (let k = j + 1; k < exampleTopBuild.perks.length; k++) {
                const perkIds = [exampleTopBuild.perks[i].id, exampleTopBuild.perks[j].id, exampleTopBuild.perks[k].id].sort();
                const tripletKey = perkIds.join('-');
                const tripletStat = perkTripletStats[tripletKey];
                if (tripletStat) {
                    exampleTripletBonus += tripletStat.count * 40;
                }
            }
        }
    }
    
    const exampleTotal = exampleBaseScore + examplePairBonus + exampleTripletBonus + 100; // quadBonus
    
    // Skálázás, hogy egy teljes build 70-85% között legyen, a legjobb build-ek pedig 90% felett
    // Az elméleti maximum az exampleTotal, de azt szeretnénk, hogy az exampleTotal 85%-nak feleljen meg
    const targetMaxForFullBuild = 85;
    const scaleFactor = targetMaxForFullBuild / exampleTotal;
    
    let normalizedScore = Math.min(100, totalScore * scaleFactor);
    
    // Biztosítjuk, hogy egy teljes build minimum 60% legyen
    if (filledPerks.length === 4 && quadBonus > 0) {
        normalizedScore = Math.max(60, normalizedScore);
    }
    
    // Biztosítjuk, hogy egy 3/4-es build is kapjon minimum 40%-ot
    if (filledPerks.length === 3 && tripletBonus > 0) {
        normalizedScore = Math.max(40, normalizedScore);
    }
    
    return Math.round(normalizedScore);
};

/**
 * Visszaadja a loadout által elért legjobb build-eket
 * @param {Array} loadout - 4 perk objektumot tartalmazó tömb
 * @returns {Array} - A legjobban illeszkedő build-ek listája
 */
export const getMatchingBuilds = (loadout) => {
    const filledPerks = loadout.filter(perk => perk !== null);
    if (filledPerks.length === 0) return [];
    
    const matches = [];
    const perkIds = new Set(filledPerks.map(p => p.id));
    
    topBuilds.forEach(build => {
        const buildPerkIds = new Set(build.perks.map(p => p.id));
        const commonPerks = [...perkIds].filter(id => buildPerkIds.has(id));
        const matchPercentage = (commonPerks.length / filledPerks.length) * 100;
        
        if (commonPerks.length > 0) {
            matches.push({
                buildName: build.name,
                matchedPerks: commonPerks.length,
                totalPerks: build.perks.length,
                percentage: matchPercentage,
                commonPerkNames: build.perks
                    .filter(p => perkIds.has(p.id))
                    .map(p => p.name)
            });
        }
    });
    
    // Rendezés a találatok száma szerint csökkenően
    return matches.sort((a, b) => b.matchedPerks - a.matchedPerks);
};

export default {
    topBuilds,
    perkStats,
    perkPairStats,
    perkTripletStats,
    perkQuadStats,
    calculatePerkStrength,
    getMatchingBuilds
};