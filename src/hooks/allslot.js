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
    },
    // ==================== HIÁNYZÓ KILLER BUILDS ====================

    // 🏆 Abszolút Meta & Versenyszintű Buildek
    {
        name: "A 'Négyes Lassítás'",
        perks: [
            { id: 57, name: "Corrupt Intervention" },      // Corrupt Intervention ID: 57
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance ID: 88
            { id: 50, name: "Pop Goes the Weasel" },       // Pop Goes the Weasel ID: 50
            { id: 84, name: "Deadlock" }                   // Deadlock ID: 84
        ]
    },
    {
        name: "Modern Generátor-Kontroll",
        perks: [
            { id: 87, name: "Grim Embrace" },              // Grim Embrace ID: 87
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 67, name: "Dead Man's Switch" },         // Dead Man's Switch ID: 67
            { id: 61, name: "Thrilling Tremors" }          // Thrilling Tremors ID: 61
        ]
    },
    {
        name: "Aura Információs Build",
        perks: [
            { id: 81, name: "Lethal Pursuer" },            // Lethal Pursuer ID: 81
            { id: 40, name: "Barbecue & Chili" },          // Barbecue & Chili ID: 40
            { id: 100, name: "Nowhere to Hide" },          // Nowhere to Hide ID: 100
            { id: 90, name: "Scourge Hook: Floods of Rage" } // Floods of Rage ID: 90
        ]
    },
    {
        name: "A 'Gen-Kick' Meta",
        perks: [
            { id: 83, name: "Eruption" },                  // Eruption ID: 83
            { id: 100, name: "Nowhere to Hide" },          // Nowhere to Hide
            { id: 50, name: "Pop Goes the Weasel" },       // Pop Goes the Weasel
            { id: 35, name: "Overcharge" }                 // Overcharge ID: 35
        ]
    },
    {
        name: "2026 Új Perk Meta (The First)",
        perks: [
            { id: 999, name: "Hex: Hive Mind" },           // **Ismeretlen perk (The First)**
            { id: 999, name: "Secret Project" },           // **Ismeretlen perk (The First)**
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 84, name: "Deadlock" }                   // Deadlock
        ]
    },
    {
        name: "Endgame Garancia",
        perks: [
            { id: 80, name: "No Way Out" },                // No Way Out ID: 80
            { id: 99, name: "Terminus" },                  // Terminus ID: 99
            { id: 53, name: "Rancor" },                    // Rancor ID: 53
            { id: 43, name: "Remember Me" }                // Remember Me ID: 43
        ]
    },
    {
        name: "Sérülés Alapú Lassítás",
        perks: [
            { id: 11, name: "Sloppy Butcher" },            // Sloppy Butcher ID: 11
            { id: 86, name: "Scourge Hook: Gift of Pain" }, // Gift of Pain ID: 86
            { id: 49, name: "Coulrophobia" },              // Coulrophobia ID: 49
            { id: 26, name: "A Nurse's Calling" }          // Nurse's Calling ID: 26
        ]
    },
    {
        name: "Gyors Üldözés (Chase)",
        perks: [
            { id: 48, name: "Bamboozle" },                 // Bamboozle ID: 48
            { id: 16, name: "Brutal Strength" },           // Brutal Strength ID: 16
            { id: 21, name: "Enduring" },                  // Enduring ID: 21
            { id: 51, name: "Spirit Fury" }                // Spirit Fury ID: 51
        ]
    },
    {
        name: "A 'Haste' Speedster",
        perks: [
            { id: 109, name: "Rapid Brutality" },          // Rapid Brutality ID: 109
            { id: 27, name: "Save the Best for Last" },    // STBFL ID: 27
            { id: 28, name: "Play with Your Food" },       // Play with Your Food ID: 28
            { id: 9, name: "Jolt" }                        // Jolt (Surge) ID: 9
        ]
    },
    {
        name: "Lopakodó (Stealth) Meta",
        perks: [
            { id: 70, name: "Trail of Torment" },          // Trail of Torment ID: 70
            { id: 59, name: "Dark Devotion" },             // Dark Devotion ID: 59
            { id: 23, name: "Tinkerer" },                  // Tinkerer ID: 23
            { id: 112, name: "Friends 'til the End" }      // Friends 'til the End ID: 112
        ]
    },

    // 🔪 Karakter-Specifikus Top Buildek
    {
        name: "Nurse (The God)",
        perks: [
            { id: 81, name: "Lethal Pursuer" },            // Lethal Pursuer
            { id: 78, name: "Starstruck" },                // Starstruck ID: 78
            { id: 17, name: "Agitation" },                 // Agitation ID: 17
            { id: 100, name: "Nowhere to Hide" }           // Nowhere to Hide
        ]
    },
    {
        name: "Blight (Rush)",
        perks: [
            { id: 73, name: "Hex: Blood Favour" },         // Hex: Blood Favour ID: 73
            { id: 74, name: "Hex: Undying" },              // Hex: Undying ID: 74
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 84, name: "Deadlock" }                   // Deadlock
        ]
    },
    {
        name: "Hillbilly (Curve)",
        perks: [
            { id: 48, name: "Bamboozle" },                 // Bamboozle
            { id: 21, name: "Enduring" },                  // Enduring
            { id: 23, name: "Tinkerer" },                  // Tinkerer
            { id: 54, name: "Discordance" }                // Discordance ID: 54
        ]
    },
    {
        name: "The First (Control)",
        perks: [
            { id: 999, name: "Hex: Hive Mind" },           // **Ismeretlen perk**
            { id: 999, name: "Secret Project" },           // **Ismeretlen perk**
            { id: 57, name: "Corrupt Intervention" },      // Corrupt Intervention
            { id: 80, name: "No Way Out" }                 // No Way Out
        ]
    },
    {
        name: "The Artist (Sniping)",
        perks: [
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 87, name: "Grim Embrace" },              // Grim Embrace
            { id: 84, name: "Deadlock" },                  // Deadlock
            { id: 66, name: "Gearhead" }                   // Gearhead ID: 66
        ]
    },
    {
        name: "Cenobite (Box Pressure)",
        perks: [
            { id: 84, name: "Deadlock" },                  // Deadlock
            { id: 11, name: "Sloppy Butcher" },            // Sloppy Butcher
            { id: 41, name: "Franklin's Demise" },         // Franklin's Demise ID: 41
            { id: 121, name: "Weave Attunement" }          // Weave Attunement ID: 121
        ]
    },
    {
        name: "Wesker (Stealth/Chase)",
        perks: [
            { id: 70, name: "Trail of Torment" },          // Trail of Torment
            { id: 112, name: "Friends 'til the End" },     // Friends 'til the End
            { id: 62, name: "Furtive Chase" },             // Furtive Chase ID: 62
            { id: 97, name: "Superior Anatomy" }           // Superior Anatomy ID: 97
        ]
    },
    {
        name: "The Ghoul (New Meta)",
        perks: [
            { id: 128, name: "Forever Entwined" },         // Forever Entwined ID: 128
            { id: 131, name: "Phantom Fear" },             // Phantom Fear ID: 131
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 81, name: "Lethal Pursuer" }             // Lethal Pursuer
        ]
    },
    {
        name: "Spirit (Aura)",
        perks: [
            { id: 24, name: "Stridor" },                   // Stridor ID: 24
            { id: 11, name: "Sloppy Butcher" },            // Sloppy Butcher
            { id: 88, name: "Scourge Hook: Pain Resonance" }, // Pain Resonance
            { id: 999, name: "Mother-Daughter Ring" }      // **Addon, nem perk!**
        ]
    },
    {
        name: "Huntress (Sniper)",
        perks: [
            { id: 56, name: "Iron Maiden" },               // Iron Maiden ID: 56
            { id: 94, name: "Darkness Revealed" },         // Darkness Revealed ID: 94
            { id: 81, name: "Lethal Pursuer" },            // Lethal Pursuer
            { id: 90, name: "Scourge Hook: Floods of Rage" } // Floods of Rage
        ]
    },

    // 🃏 Szórakoztató & Tematikus Buildek
    {
        name: "'Jumpscare' Myers",
        perks: [
            { id: 81, name: "Lethal Pursuer" },            // Lethal Pursuer
            { id: 34, name: "Monitor & Abuse" },           // Monitor & Abuse ID: 34
            { id: 999, name: "Scratched Mirror" },         // **Addon**
            { id: 999, name: "Lume Green" }                // **Addon**
        ]
    },
    {
        name: "Totem Védelem",
        perks: [
            { id: 32, name: "Hex: Devour Hope" },          // Devour Hope ID: 32
            { id: 74, name: "Hex: Undying" },              // Undying
            { id: 89, name: "Hex: Pentimento" },           // Pentimento ID: 89
            { id: 85, name: "Hex: Plaything" }             // Plaything ID: 85
        ]
    },
    {
        name: "'Madness' Doctor",
        perks: [
            { id: 92, name: "Merciless Storm" },           // Merciless Storm ID: 92
            { id: 15, name: "Unnerving Presence" },        // Unnerving Presence ID: 15
            { id: 3, name: "Distressing" },                // Distressing ID: 3
            { id: 38, name: "Hex: Huntress Lullaby" }      // Huntress Lullaby ID: 38
        ]
    },
    {
        name: "'Backpack' Build",
        perks: [
            { id: 55, name: "Mad Grit" },                  // Mad Grit ID: 55
            { id: 17, name: "Agitation" },                 // Agitation
            { id: 8, name: "Iron Grasp" },                 // Iron Grasp ID: 8
            { id: 98, name: "Awakened Awareness" }         // Awakened Awareness ID: 98
        ]
    },
    {
        name: "Impossible Skillcheck",
        perks: [
            { id: 92, name: "Merciless Storm" },           // Merciless Storm
            { id: 76, name: "Oppression" },                // Oppression ID: 76
            { id: 35, name: "Overcharge" },                // Overcharge
            { id: 15, name: "Unnerving Presence" }         // Unnerving Presence
        ]
    },
    {
        name: "Anti-Healing",
        perks: [
            { id: 49, name: "Coulrophobia" },              // Coulrophobia
            { id: 11, name: "Sloppy Butcher" },            // Sloppy Butcher
            { id: 3, name: "Distressing" },                // Distressing
            { id: 95, name: "Septic Touch" }               // Septic Touch ID: 95
        ]
    },
    {
        name: "'Vérszomjas' Oni",
        perks: [
            { id: 58, name: "Infectious Fright" },         // Infectious Fright ID: 58
            { id: 81, name: "Lethal Pursuer" },            // Lethal Pursuer
            { id: 9, name: "Jolt" },                       // Jolt
            { id: 11, name: "Sloppy Butcher" }             // Sloppy Butcher
        ]
    },
    {
        name: "Traps Everywhere",
        perks: [
            { id: 57, name: "Corrupt Intervention" },      // Corrupt Intervention
            { id: 31, name: "Hex: Ruin" },                 // Ruin ID: 31
            { id: 84, name: "Deadlock" },                  // Deadlock
            { id: 80, name: "No Way Out" }                 // No Way Out
        ]
    },
    {
        name: "Pallet Shredder (Bővített)",
        perks: [
            { id: 16, name: "Brutal Strength" },           // Brutal Strength
            { id: 42, name: "Fire Up" },                   // Fire Up ID: 42
            { id: 48, name: "Bamboozle" },                 // Bamboozle
            { id: 97, name: "Superior Anatomy" }           // Superior Anatomy
        ]
    },
    {
        name: "Screaming Build",
        perks: [
            { id: 111, name: "Ultimate Weapon" },          // Ultimate Weapon ID: 111
            { id: 103, name: "THWACK!" },                  // THWACK! ID: 103
            { id: 72, name: "Dragon's Grip" },             // Dragon's Grip ID: 72
            { id: 58, name: "Infectious Fright" }          // Infectious Fright
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
    },
    // ==================== HIÁNYZÓ SURVIVOR BUILDS ====================

    // Totem Hunter Build
    {
        name: "Totem Hunter",
        perks: [
            { id: 4, name: "Inner Healing" },      // Nancy Wheeler
            { id: 120, name: "Hardened" },          // Lara Croft
            { id: 89, name: "Counterforce" },       // Jill Valentine
            { id: 54, name: "Detective's Hunch" }   // David Tapp
        ]
    },

    // Treasure Hunter
    {
        name: "Treasure Hunter",
        perks: [
            { id: 46, name: "Ace in the Hole" },     // Ace Visconti
            { id: 123, name: "Moment of Glory" },    // Trevor Belmont
            { id: 83, name: "Appraisal" },           // Elodie Rakoto
            { id: 9, name: "Plunderer's Instinct" }  // General Perk
        ]
    },

    // Locker Build
    {
        name: "Locker Build",
        perks: [
            { id: 56, name: "Dance With Me" },       // Kate Denson
            { id: 67, name: "Head On" },             // Jane Romero
            { id: 4, name: "Inner Healing" },         // Nancy Wheeler
            { id: 23, name: "Quick & Quiet" }         // Meg Thomas
        ]
    },

    // Altruism Build
    {
        name: "Altruism Build",
        perks: [
            { id: 5, name: "Kindred" },               // General Perk
            { id: 36, name: "Borrowed Time" },        // Bill Overbeck
            { id: 136, name: "Shoulder the Burden" }, // Taurie Cain (új ID, ellenőrizd!)
            { id: 19, name: "We'll Make It" }          // General Perk
        ]
    },

    // Aura-Reading Build
    {
        name: "Aura-Reading Build",
        perks: [
            { id: 5, name: "Kindred" },                // General Perk
            { id: 124, name: "Eyes of Belmont" },      // Trevor Belmont
            { id: 44, name: "Open-Handed" },           // Ace Visconti
            { id: 26, name: "Empathy" }                // Claudette Morel
        ]
    },

    // Stun Build
    {
        name: "Stun Build",
        perks: [
            { id: 91, name: "Blast Mine" },            // Jill Valentine
            { id: 122, name: "Exultation" },           // Trevor Belmont (új ID, ellenőrizd!)
            { id: 72, name: "Any Means Necessary" },   // Yui Kimura
            { id: 67, name: "Head On" }                // Jane Romero
        ]
    },

    // The Non-Teachable Build
    {
        name: "The Non-Teachable Build",
        perks: [
            { id: 1, name: "Déjà Vu" },                // General Perk
            { id: 5, name: "Kindred" },                // General Perk
            { id: 3, name: "Hope" },                   // General Perk
            { id: 19, name: "We'll Make It" }          // General Perk
        ]
    },

    // The Beginner Build
    {
        name: "The Beginner Build",
        perks: [
            { id: 57, name: "Windows of Opportunity" }, // Kate Denson
            { id: 98, name: "Overcome" },               // Jonah Vasquez
            { id: 5, name: "Kindred" },                 // General Perk
            { id: 1, name: "Déjà Vu" }                  // General Perk
        ]
    },

    // The Self-Heal Build
    {
        name: "The Self-Heal Build",
        perks: [
            { id: 116, name: "Strength in Shadows" },   // Sable Ward (új ID, ellenőrizd!)
            { id: 27, name: "Botany Knowledge" },       // Claudette Morel
            { id: 20, name: "Bond" },                   // Dwight Fairfield
            { id: 90, name: "Resurgence" }              // Jill Valentine
        ]
    },

    // The Anti-Slug Build
    {
        name: "The Anti-Slug Build",
        perks: [
            { id: 37, name: "Unbreakable" },            // Bill Overbeck
            { id: 24, name: "Sprint Burst" },           // Meg Thomas
            { id: 38, name: "We're Gonna Live Forever" }, // David King
            { id: 43, name: "Decisive Strike" }         // Laurie Strode
        ]
    },

    // The Endgame Build
    {
        name: "The Endgame Build",
        perks: [
            { id: 3, name: "Hope" },                     // General Perk
            { id: 111, name: "Reassurance" },            // Rebecca Chambers
            { id: 25, name: "Adrenaline" },              // Meg Thomas
            { id: 24, name: "Sprint Burst" }             // Meg Thomas
        ]
    },

    // The Anti-Tunnel Build
    {
        name: "The Anti-Tunnel Build",
        perks: [
            { id: 39, name: "Dead Hard" },               // David King
            { id: 74, name: "Off the Record" },          // Zarina Kassir
            { id: 43, name: "Decisive Strike" },         // Laurie Strode
            { id: 37, name: "Unbreakable" }              // Bill Overbeck
        ]
    },

    // The Runner Build
    {
        name: "The Runner Build",
        perks: [
            { id: 24, name: "Sprint Burst" },            // Meg Thomas
            { id: 119, name: "Finesse" },                // Lara Croft
            { id: 57, name: "Windows of Opportunity" },  // Kate Denson
            { id: 171, name: "Blood Rush" }              // Renato Lyra
        ]
    },

    // The Generator Build
    {
        name: "The Generator Build",
        perks: [
            { id: 115, name: "Quick Gambit" },           // Vittorio Toscano
            { id: 24, name: "Sprint Burst" },            // Meg Thomas
            { id: 21, name: "Prove Thyself" },           // Dwight Fairfield
            { id: 1, name: "Déjà Vu" }                   // General Perk
        ]
    },

    // The Wallhacks Build
    {
        name: "The Wallhacks Build",
        perks: [
            { id: 124, name: "Eyes of Belmont" },        // Trevor Belmont
            { id: 0, name: "Dark Sense" },               // General Perk
            { id: 66, name: "Poised" },                  // Jane Romero
            { id: 116, name: "Wicked" }                  // Sable Ward
        ]
    },

    // 🔦 Csapatsegítő & Mentő (Altruistic) Buildek
    {
        name: "A Végső Mentő",
        perks: [
            { id: 19, name: "We'll Make It" },           // General Perk
            { id: 5, name: "Kindred" },                  // General Perk
            { id: 27, name: "Botany Knowledge" },        // Claudette Morel
            { id: 81, name: "Desperate Measures" }       // Felix Richter
        ]
    },
    {
        name: "Flashlight Mentő",
        perks: [
            { id: 170, name: "Background Player" },      // Renato Lyra
            { id: 155, name: "Champion of Light" },      // Alan Wake
            { id: 93, name: "Flashbang" },               // Leon Scott Kennedy
            { id: 26, name: "Empathy" }                  // Claudette Morel
        ]
    },
    {
        name: "Sabotage / Kampó-mentő",
        perks: [
            { id: 31, name: "Saboteur" },                // Jake Park
            { id: 73, name: "Breakout" },                // Yui Kimura
            { id: 26, name: "Empathy" },                 // Claudette Morel
            { id: 170, name: "Background Player" }       // Renato Lyra
        ]
    },
    {
        name: "Horgot átvállaló (Anti-Kill)",
        perks: [
            { id: 136, name: "Shoulder the Burden" },    // Taurie Cain
            { id: 60, name: "Deliverance" },             // Adam Francis
            { id: 19, name: "We'll Make It" },           // General Perk
            { id: 74, name: "Off the Record" }           // Zarina Kassir
        ]
    },
    {
        name: "Aura Információs (Solo Q)",
        perks: [
            { id: 20, name: "Bond" },                    // Dwight Fairfield
            { id: 5, name: "Kindred" },                  // General Perk
            { id: 44, name: "Open-Handed" },             // Ace Visconti
            { id: 57, name: "Windows of Opportunity" }   // Kate Denson
        ]
    },
    {
        name: "Castlevania Info Build",
        perks: [
            { id: 57, name: "Windows of Opportunity" },  // Kate Denson
            { id: 124, name: "Eyes of Belmont" },        // Trevor Belmont
            { id: 163, name: "Troubleshooter" },         // Gabriel Soma
            { id: 63, name: "Aftercare" }                // Jeff Johansen
        ]
    },
    {
        name: "Öngyógyító Csapatjátékos",
        perks: [
            { id: 20, name: "Bond" },                    // Dwight Fairfield
            { id: 27, name: "Botany Knowledge" },        // Claudette Morel
            { id: 28, name: "Self-Care" },               // Claudette Morel
            { id: 12, name: "Resilience" }               // General Perk
        ]
    },
    {
        name: "Látunk Téged (Anti-Aura)",
        perks: [
            { id: 999, name: "We See You" },             // **Ismeretlen perk / placeholder**
            { id: 124, name: "Eyes of Belmont" },        // Trevor Belmont
            { id: 42, name: "Object of Obsession" },     // Laurie Strode
            { id: 43, name: "Decisive Strike" }          // Laurie Strode
        ]
    },

    // 🛠️ Solo Queue & Túlélő Stratégiák
    {
        name: "Solo Q Alap",
        perks: [
            { id: 20, name: "Bond" },                    // Dwight Fairfield
            { id: 1, name: "Déjà Vu" },                  // General Perk
            { id: 57, name: "Windows of Opportunity" },  // Kate Denson
            { id: 5, name: "Kindred" }                   // General Perk
        ]
    },
    {
        name: "Lopakodó (Stealth)",
        perks: [
            { id: 29, name: "Iron Will" },               // Jake Park
            { id: 30, name: "Calm Spirit" },             // Jake Park
            { id: 33, name: "Urban Evasion" },           // Nea Karlsson
            { id: 64, name: "Distortion" }               // Jeff Johansen
        ]
    },
    {
        name: "A 'Houdini'",
        perks: [
            { id: 48, name: "Lithe" },                   // Feng Min
            { id: 56, name: "Dance With Me" },           // Kate Denson
            { id: 23, name: "Quick & Quiet" },           // Meg Thomas
            { id: 57, name: "Windows of Opportunity" }   // Kate Denson
        ]
    },
    {
        name: "Extra Szenzoros",
        perks: [
            { id: 999, name: "Extra Sensory Perception" }, // **Ismeretlen perk**
            { id: 33, name: "Urban Evasion" },            // Nea Karlsson
            { id: 147, name: "Come and Get Me" },         // Rick Grimes
            { id: 59, name: "Diversion" }                 // Adam Francis
        ]
    },
    {
        name: "Gen-Rush szerszámosládával",
        perks: [
            { id: 34, name: "Streetwise" },               // Nea Karlsson
            { id: 82, name: "Built to Last" },            // Felix Richter
            { id: 1, name: "Déjà Vu" },                   // General Perk
            { id: 161, name: "Scavenger" }                // Gabriel Soma
        ]
    },
    {
        name: "Pallet Stun Build",
        perks: [
            { id: 87, name: "Smash Hit" },                // Yun-Jin Lee
            { id: 101, name: "Parental Guidance" },       // Yoichi Asakawa
            { id: 159, name: "Chemical Trap" },           // Ellen Ripley
            { id: 91, name: "Blast Mine" }                // Jill Valentine
        ]
    },

    // 🃏 Szórakoztató & Speciális Buildek
    {
        name: "Meme / Bosszantó",
        perks: [
            { id: 91, name: "Blast Mine" },               // Jill Valentine
            { id: 152, name: "Mirrored Illusion" },       // Aestri Yazar
            { id: 93, name: "Flashbang" },                // Leon Scott Kennedy
            { id: 67, name: "Head On" }                   // Jane Romero
        ]
    },
    {
        name: "Anti-Slug (Földön hagyás ellen)",
        perks: [
            { id: 37, name: "Unbreakable" },              // Bill Overbeck
            { id: 68, name: "Flip-Flop" },                // Ash J. Williams
            { id: 58, name: "Boil Over" },                // Kate Denson
            { id: 53, name: "Tenacity" }                  // David Tapp
        ]
    },
    {
        name: "Láda-vadász",
        perks: [
            { id: 9, name: "Plunderer's Instinct" },      // General Perk
            { id: 83, name: "Appraisal" },                // Elodie Rakoto
            { id: 46, name: "Ace in the Hole" },          // Ace Visconti
            { id: 164, name: "Dramaturgy" }               // Nicolas Cage
        ]
    },
    {
        name: "Szerencse Build",
        perks: [
            { id: 45, name: "Up the Ante" },              // Ace Visconti
            { id: 15, name: "Slippery Meat" },            // General Perk
            { id: 60, name: "Deliverance" },              // Adam Francis
            { id: 52, name: "Vigil" }                     // Quentin Smith
        ]
    },
    {
        name: "Dying State Tank",
        perks: [
            { id: 53, name: "Tenacity" },                 // David Tapp
            { id: 37, name: "Unbreakable" },              // Bill Overbeck
            { id: 77, name: "Soul Guard" },               // Cheryl Mason
            { id: 69, name: "Buckle Up" }                 // Ash J. Williams
        ]
    },
    {
        name: "Ingyenes Alap (Free-to-Play)",
        perks: [
            { id: 24, name: "Sprint Burst" },             // Meg Thomas
            { id: 19, name: "We'll Make It" },            // General Perk
            { id: 12, name: "Resilience" },               // General Perk
            { id: 5, name: "Kindred" }                    // General Perk
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