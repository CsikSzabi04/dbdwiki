// survivorslot.js - Perk erősség számítási logika a legjobb túlélő build-ek alapján
// AZONOS EXPORTOK mint a killerslot.js-ben, hogy a WikiPage egységesen tudja használni

// Legjobb túlélő build-ek listája (topBuilds néven exportálva)
export const topBuilds = [
    // Top 10 Meta & High-Efficiency Builds (2026)
    {
        name: "The 'Illegal' 2026 Meta",
        perks: [
            { id: 57, name: "Windows of Opportunity" },     // Windows of Opportunity ID: 57
            { id: 48, name: "Lithe" },                       // Lithe ID: 48
            { id: 25, name: "Adrenaline" },                  // Adrenaline ID: 25
            { id: 119, name: "Finesse" }                     // Finesse ID: 119
        ]
    },
    {
        name: "Vault Speed Demon",
        perks: [
            { id: 119, name: "Finesse" },                    // Finesse
            { id: 48, name: "Lithe" },                       // Lithe
            { id: 12, name: "Resilience" },                  // Resilience ID: 12
            { id: 52, name: "Vigil" }                        // Vigil ID: 52
        ]
    },
    {
        name: "Ultimate Solo Queue",
        perks: [
            { id: 5, name: "Kindred" },                      // Kindred ID: 5
            { id: 20, name: "Bond" },                        // Bond ID: 20
            { id: 1, name: "Déjà Vu" },                      // Déjà Vu ID: 1
            { id: 57, name: "Windows of Opportunity" }       // Windows of Opportunity
        ]
    },
    {
        name: "Anti-Slug/Injured Aggression",
        perks: [
            { id: 166, name: "Plot Twist" },                 // Plot Twist ID: 166
            { id: 53, name: "Tenacity" },                    // Tenacity ID: 53
            { id: 37, name: "Unbreakable" },                 // Unbreakable ID: 37
            { id: 43, name: "Decisive Strike" }              // Decisive Strike ID: 43
        ]
    },
    {
        name: "Gen-Rush Efficiency",
        perks: [
            { id: 112, name: "Hyperfocus" },                 // Hyperfocus ID: 112
            { id: 55, name: "Stake Out" },                   // Stake Out ID: 55
            { id: 114, name: "Fogwise" },                    // Fogwise ID: 114
            { id: 86, name: "Fast Track" }                   // Fast Track ID: 86
        ]
    },
    {
        name: "Looping God",
        perks: [
            { id: 39, name: "Dead Hard" },                   // Dead Hard ID: 39
            { id: 57, name: "Windows of Opportunity" },      // Windows of Opportunity
            { id: 12, name: "Resilience" },                  // Resilience
            { id: 52, name: "Vigil" }                        // Vigil
        ]
    },
    {
        name: "The 'Disappearing Act'",
        perks: [
            { id: 23, name: "Quick & Quiet" },               // Quick & Quiet ID: 23
            { id: 71, name: "Lucky Break" },                 // Lucky Break ID: 71
            { id: 48, name: "Lithe" },                       // Lithe
            { id: 4, name: "Inner Healing" }                 // Inner Healing ID: 4
        ]
    },
    {
        name: "Totem/Objective Destroyer",
        perks: [
            { id: 54, name: "Detective's Hunch" },           // Detective's Hunch ID: 54
            { id: 16, name: "Small Game" },                  // Small Game ID: 16
            { id: 106, name: "Overzealous" },                // Overzealous ID: 106
            { id: 89, name: "Counterforce" }                 // Counterforce ID: 89
        ]
    },
    {
        name: "Team Protector (Altruism)",
        perks: [
            { id: 19, name: "We'll Make It" },               // We'll Make It ID: 19
            { id: 36, name: "Borrowed Time" },               // Borrowed Time ID: 36
            { id: 81, name: "Desperate Measures" },          // Desperate Measures ID: 81
            { id: 5, name: "Kindred" }                       // Kindred
        ]
    },
    {
        name: "Aura Informant",
        perks: [
            { id: 20, name: "Bond" },                        // Bond
            { id: 44, name: "Open-Handed" },                 // Open-Handed ID: 44
            { id: 5, name: "Kindred" },                      // Kindred
            { id: 114, name: "Fogwise" }                     // Fogwise
        ]
    },
    
    // Chase & Looping Builds
    {
        name: "Sprint Burst Combo",
        perks: [
            { id: 24, name: "Sprint Burst" },                // Sprint Burst ID: 24
            { id: 52, name: "Vigil" },                       // Vigil
            { id: 13, name: "Self-Aware" },                  // Self-Aware ID: 13
            { id: 12, name: "Resilience" }                   // Resilience
        ]
    },
    {
        name: "Background Player Save",
        perks: [
            { id: 170, name: "Background Player" },          // Background Player ID: 170
            { id: 73, name: "Breakout" },                    // Breakout ID: 73
            { id: 93, name: "Flashbang" },                   // Flashbang ID: 93
            { id: 31, name: "Saboteur" }                     // Saboteur ID: 31
        ]
    },
    {
        name: "Dance With Me",
        perks: [
            { id: 56, name: "Dance With Me" },               // Dance With Me ID: 56
            { id: 48, name: "Lithe" },                       // Lithe
            { id: 23, name: "Quick & Quiet" },               // Quick & Quiet
            { id: 57, name: "Windows of Opportunity" }       // Windows of Opportunity
        ]
    },
    {
        name: "Power Struggle",
        perks: [
            { id: 85, name: "Power Struggle" },              // Power Struggle ID: 85
            { id: 68, name: "Flip-Flop" },                   // Flip-Flop ID: 68
            { id: 53, name: "Tenacity" },                    // Tenacity
            { id: 37, name: "Unbreakable" }                  // Unbreakable
        ]
    },
    {
        name: "Any Means Necessary",
        perks: [
            { id: 72, name: "Any Means Necessary" },         // Any Means Necessary ID: 72
            { id: 57, name: "Windows of Opportunity" },      // Windows of Opportunity
            { id: 48, name: "Lithe" },                       // Lithe
            { id: 12, name: "Resilience" }                   // Resilience
        ]
    },
    {
        name: "Distortion Stealth",
        perks: [
            { id: 64, name: "Distortion" },                  // Distortion ID: 64
            { id: 7, name: "Lightweight" },                  // Lightweight ID: 7
            { id: 30, name: "Calm Spirit" },                 // Calm Spirit ID: 30
            { id: 23, name: "Quick & Quiet" }                // Quick & Quiet
        ]
    },
    {
        name: "Dead Hard Value",
        perks: [
            { id: 39, name: "Dead Hard" },                   // Dead Hard
            { id: 74, name: "Off the Record" },              // Off the Record ID: 74
            { id: 12, name: "Resilience" },                  // Resilience
            { id: 57, name: "Windows of Opportunity" }       // Windows of Opportunity
        ]
    },
    {
        name: "Head On Stun",
        perks: [
            { id: 67, name: "Head On" },                     // Head On ID: 67
            { id: 23, name: "Quick & Quiet" },               // Quick & Quiet
            { id: 93, name: "Flashbang" },                   // Flashbang
            { id: 52, name: "Vigil" }                        // Vigil
        ]
    },
    {
        name: "Lucky Star",
        perks: [
            { id: 158, name: "Lucky Star" },                 // Lucky Star ID: 158
            { id: 166, name: "Plot Twist" },                 // Plot Twist
            { id: 92, name: "Bite the Bullet" },             // Bite the Bullet ID: 92
            { id: 4, name: "Inner Healing" }                 // Inner Healing
        ]
    },
    {
        name: "Aggressive Saboteur",
        perks: [
            { id: 31, name: "Saboteur" },                    // Saboteur
            { id: 170, name: "Background Player" },          // Background Player
            { id: 73, name: "Breakout" },                    // Breakout
            { id: 0, name: "Dark Sense" }                    // Dark Sense ID: 0 (placeholder Alex's Toolbox helyett)
        ]
    },
    
    // Survivor & Support (Utility) Builds
    {
        name: "Fast Healer",
        perks: [
            { id: 27, name: "Botany Knowledge" },            // Botany Knowledge ID: 27
            { id: 19, name: "We'll Make It" },               // We'll Make It
            { id: 81, name: "Desperate Measures" },          // Desperate Measures
            { id: 28, name: "Self-Care" }                    // Self-Care ID: 28
        ]
    },
    {
        name: "The 'Flashy' Build",
        perks: [
            { id: 93, name: "Flashbang" },                   // Flashbang
            { id: 91, name: "Blast Mine" },                  // Blast Mine ID: 91
            { id: 101, name: "Parental Guidance" },          // Parental Guidance ID: 101
            { id: 48, name: "Lithe" }                        // Lithe
        ]
    },
    {
        name: "Team Efficiency",
        perks: [
            { id: 21, name: "Prove Thyself" },               // Prove Thyself ID: 21
            { id: 20, name: "Bond" },                        // Bond
            { id: 22, name: "Leader" },                      // Leader ID: 22
            { id: 1, name: "Déjà Vu" }                       // Déjà Vu
        ]
    },
    {
        name: "For the People",
        perks: [
            { id: 76, name: "For the People" },              // For the People ID: 76
            { id: 69, name: "Buckle Up" },                   // Buckle Up ID: 69
            { id: 52, name: "Vigil" },                       // Vigil
            { id: 39, name: "Dead Hard" }                    // Dead Hard
        ]
    },
    {
        name: "Endgame Savior",
        perks: [
            { id: 8, name: "No One Left Behind" },           // No One Left Behind ID: 8
            { id: 25, name: "Adrenaline" },                  // Adrenaline
            { id: 3, name: "Hope" },                         // Hope ID: 3
            { id: 111, name: "Reassurance" }                 // Reassurance ID: 111
        ]
    },
    {
        name: "Chest Hoarder",
        perks: [
            { id: 46, name: "Ace in the Hole" },             // Ace in the Hole ID: 46
            { id: 83, name: "Appraisal" },                   // Appraisal ID: 83
            { id: 9, name: "Plunderer's Instinct" },         // Plunderer's Instinct ID: 9
            { id: 34, name: "Streetwise" }                   // Streetwise ID: 34
        ]
    },
    {
        name: "Flashbang Creator",
        perks: [
            { id: 93, name: "Flashbang" },                   // Flashbang
            { id: 91, name: "Blast Mine" },                  // Blast Mine
            { id: 105, name: "Residual Manifest" },          // Residual Manifest ID: 105
            { id: 20, name: "Bond" }                         // Bond
        ]
    },
    {
        name: "Mirror Image",
        perks: [
            { id: 152, name: "Mirrored Illusion" },          // Mirrored Illusion ID: 152
            { id: 84, name: "Deception" },                   // Deception ID: 84
            { id: 59, name: "Diversion" },                   // Diversion ID: 59
            { id: 7, name: "Lightweight" }                   // Lightweight
        ]
    },
    {
        name: "Last Survivor",
        perks: [
            { id: 41, name: "Sole Survivor" },               // Sole Survivor ID: 41
            { id: 42, name: "Object of Obsession" },         // Object of Obsession ID: 42
            { id: 64, name: "Distortion" },                  // Distortion
            { id: 30, name: "Calm Spirit" }                  // Calm Spirit
        ]
    },
    {
        name: "No Mither Challenge",
        perks: [
            { id: 40, name: "No Mither" },                   // No Mither ID: 40
            { id: 12, name: "Resilience" },                  // Resilience
            { id: 18, name: "This Is Not Happening" },       // This Is Not Happening ID: 18
            { id: 39, name: "Dead Hard" }                    // Dead Hard
        ]
    }
];

// Perk statisztikák előkészítése (perkStats néven exportálva)
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

// Perkpárok statisztikái (perkPairStats néven exportálva)
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

// Perk triplettek statisztikái (perkTripletStats néven exportálva)
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

// Perk négyesek statisztikái (perkQuadStats néven exportálva)
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
 * Perk erősség számítása a loadout alapján (calculatePerkStrength néven exportálva)
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
    for (let i = 0; i < filledPerks.length; i++) {
        for (let j = i + 1; j < filledPerks.length; j++) {
            const perk1 = filledPerks[i];
            const perk2 = filledPerks[j];
            const pairKey = `${Math.min(perk1.id, perk2.id)}-${Math.max(perk1.id, perk2.id)}`;
            const pairStat = perkPairStats[pairKey];
            
            if (pairStat) {
                // Minden együtt szereplésért bónusz (20 pont / előfordulás)
                pairBonus += pairStat.count * 20;
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
    
    // Normalizálás 0-100 közé
    // Számoljuk ki az elméleti maximumot egy átlagos top build esetén
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
    
    // Skálázás, hogy egy teljes build 70-85% között legyen
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
 * Visszaadja a loadout által elért legjobb build-eket (getMatchingBuilds néven exportálva)
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
        
        if (commonPerks.length > 0) {
            matches.push({
                buildName: build.name,
                matchedPerks: commonPerks.length,
                totalPerks: build.perks.length,
                percentage: (commonPerks.length / filledPerks.length) * 100,
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