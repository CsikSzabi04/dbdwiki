// allslot.js - Perk erősség számítási logika a legjobb killer és survivor build-ek alapján

// ==================== KILLER BUILDS ====================
export const killerBuilds = [
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

// ==================== SURVIVOR BUILDS ====================
export const survivorBuilds = [
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
            { id: 0, name: "Dark Sense" }                    // Dark Sense ID: 0 (placeholder)
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

// ==================== FÜGGVÉNYEK ====================

/**
 * Visszaadja a megfelelő build listát a role alapján
 * @param {string} role - 'killer' vagy 'survivor'
 * @returns {Array} - A megfelelő build lista
 */
export const getBuildsByRole = (role) => {
    return role === 'killer' ? killerBuilds : survivorBuilds;
};

/**
 * Perk statisztikák előkészítése a megadott build lista alapján
 * @param {Array} builds - Build lista
 * @returns {Object} - Perk statisztikák
 */
const calculateStats = (builds) => {
    const stats = {};
    
    builds.forEach(build => {
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
};

/**
 * Perkpárok statisztikái a megadott build lista alapján
 * @param {Array} builds - Build lista
 * @returns {Object} - Perkpár statisztikák
 */
const calculatePairStats = (builds) => {
    const pairs = {};
    
    builds.forEach(build => {
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
};

/**
 * Perk hármasok statisztikái a megadott build lista alapján
 * @param {Array} builds - Build lista
 * @returns {Object} - Perk hármas statisztikák
 */
const calculateTripletStats = (builds) => {
    const triplets = {};
    
    builds.forEach(build => {
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
};

/**
 * Perk négyesek statisztikái a megadott build lista alapján
 * @param {Array} builds - Build lista
 * @returns {Object} - Perk négyes statisztikák
 */
const calculateQuadStats = (builds) => {
    const quads = {};
    
    builds.forEach(build => {
        const quadKey = build.perks.map(p => p.id).sort().join('-');
        
        quads[quadKey] = {
            perkIds: build.perks.map(p => p.id).sort(),
            perkNames: build.perks.map(p => p.name),
            buildName: build.name,
            count: 1
        };
    });
    
    return quads;
};

// Pre-kiszámolt statisztikák a killer build-ekhez
export const killerStats = calculateStats(killerBuilds);
export const killerPairStats = calculatePairStats(killerBuilds);
export const killerTripletStats = calculateTripletStats(killerBuilds);
export const killerQuadStats = calculateQuadStats(killerBuilds);

// Pre-kiszámolt statisztikák a survivor build-ekhez
export const survivorStats = calculateStats(survivorBuilds);
export const survivorPairStats = calculatePairStats(survivorBuilds);
export const survivorTripletStats = calculateTripletStats(survivorBuilds);
export const survivorQuadStats = calculateQuadStats(survivorBuilds);

/**
 * Perk erősség számítása a loadout alapján
 * @param {Array} loadout - 4 perk objektumot tartalmazó tömb (lehet null is)
 * @param {string} role - 'killer' vagy 'survivor'
 * @returns {number} - 0-100 közötti erősség százalék
 */
export const calculatePerkStrength = (loadout, role = 'killer') => {
    const filledPerks = loadout.filter(perk => perk !== null);
    if (filledPerks.length === 0) return 0;
    
    // Válasszuk ki a megfelelő statisztikákat a role alapján
    const stats = role === 'killer' ? killerStats : survivorStats;
    const pairStats = role === 'killer' ? killerPairStats : survivorPairStats;
    const tripletStats = role === 'killer' ? killerTripletStats : survivorTripletStats;
    const quadStats = role === 'killer' ? killerQuadStats : survivorQuadStats;
    const builds = role === 'killer' ? killerBuilds : survivorBuilds;
    
    // Alap pontszám: minden perk kap egy alapértéket a gyakorisága alapján
    let baseScore = 0;
    filledPerks.forEach(perk => {
        const stat = stats[perk.id];
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
            const pairStat = pairStats[pairKey];
            
            if (pairStat) {
                // Minden együtt szereplésért bónusz (20 pont / előfordulás)
                pairBonus += pairStat.count * 20;
            }
        }
    }
    
    // Hármas bónusz: ha három perk együtt szerepel valamelyik buildben
    let tripletBonus = 0;
    if (filledPerks.length >= 3) {
        for (let i = 0; i < filledPerks.length; i++) {
            for (let j = i + 1; j < filledPerks.length; j++) {
                for (let k = j + 1; k < filledPerks.length; k++) {
                    const perkIds = [filledPerks[i].id, filledPerks[j].id, filledPerks[k].id].sort();
                    const tripletKey = perkIds.join('-');
                    const tripletStat = tripletStats[tripletKey];
                    
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
        const quadStat = quadStats[quadKey];
        
        if (quadStat) {
            // Teljes build bónusz (100 pont)
            quadBonus = 100;
        }
    }
    
    // Összpontszám számítása
    const totalScore = baseScore + pairBonus + tripletBonus + quadBonus;
    
    // Normalizálás 0-100 közé
    // Számoljuk ki az elméleti maximumot egy átlagos top build esetén
    const exampleTopBuild = builds[0];
    let exampleBaseScore = 0;
    exampleTopBuild.perks.forEach(perk => {
        const stat = stats[perk.id];
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
            const pairStat = pairStats[pairKey];
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
                const tripletStat = tripletStats[tripletKey];
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
 * Visszaadja a loadout által elért legjobb build-eket
 * @param {Array} loadout - 4 perk objektumot tartalmazó tömb
 * @param {string} role - 'killer' vagy 'survivor'
 * @returns {Array} - A legjobban illeszkedő build-ek listája
 */
export const getMatchingBuilds = (loadout, role = 'killer') => {
    const filledPerks = loadout.filter(perk => perk !== null);
    if (filledPerks.length === 0) return [];
    
    const builds = role === 'killer' ? killerBuilds : survivorBuilds;
    const matches = [];
    const perkIds = new Set(filledPerks.map(p => p.id));
    
    builds.forEach(build => {
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
    killerBuilds,
    survivorBuilds,
    killerStats,
    survivorStats,
    killerPairStats,
    survivorPairStats,
    killerTripletStats,
    survivorTripletStats,
    killerQuadStats,
    survivorQuadStats,
    calculatePerkStrength,
    getMatchingBuilds,
    getBuildsByRole
};