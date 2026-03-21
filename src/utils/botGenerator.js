import { initializeApp, deleteApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, Timestamp, getDocs, query, where, arrayUnion, increment, writeBatch, terminate } from 'firebase/firestore';
import { firebaseConfig } from '../firebase/config';
import { botPostTexts } from '../data/posttextbot';

import survivorsData from '../hooks/survivors.json';
import killersData from '../hooks/killers.json';

export const BOT_PASSWORD = "EntityBot_MasterKey_2026!";

// Define assets for bots
const FIRST_NAMES = [
    "Dark", "Entity", "Toxic", "Hex", "Boon", "Chill", "Sweaty", "Loop", "Gen", "Blood",
    "Ghost", "Dead", "Mori", "Shadow", "Fog", "Silent", "Savage", "Broken", "Lucky", "Cursed",
    "Feral", "Vengeful", "Hidden", "Lost", "Rapid", "Brutal", "Merciless", "Night", "Grim", "Wicked",
    "Phantom", "Dread", "Echo", "Fallen", "Mad", "Ruthless", "Sly", "Cold", "Hollow", "Wild",
    "Scarlet", "Obsidian", "Venom", "Frost", "Ashen", "Blight", "Twisted", "Shrouded", "Lurking", "Haunted",

    // normal names
    "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Quinn", "Parker",
    "Logan", "Reese", "Cameron", "Drew", "Elliot", "Hayden", "Kai", "Rowan", "Emerson", "Finley",
    "Blake", "Dakota", "Skyler", "Phoenix", "Remy", "Charlie", "Noah", "Liam", "Ethan", "Mason",
    "Lucas", "Elijah", "James", "Benjamin", "Sebastian", "Jack", "Owen", "Henry", "Levi", "Mateo",
    "Daniel", "Michael", "Jacob", "Samuel", "Alexander", "Jackson", "Aiden", "Matthew", "Joseph", "David"
];

const LAST_NAMES = [
    "Survivor", "Killer", "Main", "Gamer", "Player", "God", "Master", "Dwight", "Meg", "Claudette",
    "Trapper", "Wraith", "Nurse", "Huntress", "Doctor", "Spirit", "Legion", "Plague", "Oni", "Blight",
    "Executioner", "Artist", "Dredge", "Knight", "SkullMerchant", "Singularity", "Xenomorph", "Chucky", "Demo", "Pig",
    "GhostFace", "Myers", "Freddy", "Bubba", "Nemesis", "Wesker", "Ada", "Feng", "Nea", "Jake",
    "Bill", "Yui", "Zarina", "Kate", "Adam", "David", "Quentin", "Tapp", "Rebecca", "Leon",

    // normal names
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];
// Load dynamic portraits from the local wiki database
const allAvatars = [...survivorsData, ...killersData]
    .filter(char => char.imgs?.portrait)
    .map(char => char.imgs.portrait);

// Cache secondary app to avoid re-init errors
export let botApp;
export let botAuth;
export let botDb;

export const initBotApp = () => {
    const existingApp = getApps().find(a => a.name === 'BotAdminApp');
    if (existingApp) {
        botApp = existingApp;
    } else {
        botApp = initializeApp(firebaseConfig, 'BotAdminApp');
    }
    botAuth = getAuth(botApp);
    botDb = getFirestore(botApp);
};

/**
 * Cleanly terminates the secondary bot app after each operation.
 * This prevents the secondary Firestore WebSocket from interfering
 * with the main app's onSnapshot listeners.
 */
export const cleanupBotApp = async () => {
    try {
        if (botDb) {
            await terminate(botDb);
        }
        if (botApp) {
            await deleteApp(botApp);
        }
    } catch (e) {
        // ignore cleanup errors
    } finally {
        botApp = undefined;
        botAuth = undefined;
        botDb = undefined;
    }
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Generate a random bot account
export const generateBotProfile = async () => {
    initBotApp();

    const firstName = getRandomItem(FIRST_NAMES);
    const lastName = getRandomItem(LAST_NAMES);
    const randomNum = Math.floor(Math.random() * 9999);

    const displayName = `${firstName}${lastName}${randomNum}`;
    const email = `${displayName.toLowerCase()}@gmail.com`;
    const password = BOT_PASSWORD;
    const photoURL = getRandomItem(allAvatars) || "https://api.dicebear.com/7.x/avataaars/svg?seed=bot";

    try {
        // Create user in Firebase Auth using the Secondary App
        const userCredential = await createUserWithEmailAndPassword(botAuth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, {
            displayName,
            photoURL
        });

        // Save profile in Firestore `users/{uid}` using the Secondary App's DB so `uid` matches request.auth
        await setDoc(doc(botDb, 'users', user.uid), {
            uid: user.uid,
            displayName,
            photoURL,
            email,
            bio: getRandomItem([
                "Death is not an escape. 💀",
                "Maining survivor since 2016.",
                "Looking for a consistent SWF group!",
                "Just here for the bloodpoints.",
                "I love the sound of a finishing generator.",
                "GG WP everyone!",
                "Hex: Devour Hope is my favorite perk.",
                "Trying to reach Rank 1 this season.",
                "Looping killers since day one.",
                "Totems? What totems?",
                "Just one more match…",
                "Skill checks are my cardio.",
                "Stealth is my second nature.",
                "Always cleansing dull totems.",
                "I run when I hear the heartbeat.",
                "Flashlight saves are life.",
                "Gen rushing is a lifestyle.",
                "Chasing survivors all night.",
                "No pallets left behind.",
                "I hear the terror radius already.",
                "Hook, camp, repeat.",
                "Survivor main but I dabble in killer.",
                "I see scratch marks everywhere.",
                "Trust me, I’ll get the save.",
                "Borrowed Time is a must.",
                "Spine Chill never lies.",
                "I miss old ranks.",
                "Camping? Never heard of it.",
                "Just vibing in the fog.",
                "I always check lockers.",
                "Urban Evasion enjoyer.",
                "Running Kindred every match.",
                "Slugging is efficient.",
                "Mindgames over everything.",
                "I hear breathing…",
                "One gen left, stay focused!",
                "Dead Hard gamer.",
                "I panic at skill checks.",
                "Totem hunter mode activated.",
                "Always last alive somehow.",
                "I bring the toolbox every time.",
                "Maps are underrated.",
                "I hate skill check lag.",
                "Bloodweb grind never ends.",
                "Prestige is forever.",
                "Hook states matter.",
                "I love basement plays.",
                "Never trust a friendly killer.",
                "I respect good loops.",
                "Chases are my favorite part.",
                "I drop pallets early.",
                "I greed pallets too much.",
                "I forget where gens are.",
                "I run Windows of Opportunity.",
                "I am the distraction.",
                "I go down first.",
                "I carry the team (sometimes).",
                "Locker tech master.",
                "I hear the hatch calling.",
                "Key or no key?",
                "I love endgame chaos.",
                "I never leave teammates behind.",
                "Unless I have to…",
                "I panic vault everything.",
                "Fast vault or nothing.",
                "I get tunneled every game.",
                "I might be the tunnel.",
                "I’m not toxic, I swear.",
                "Just a casual fog wanderer.",
                "I love spooky killers.",
                "Ghost Face scares me every time.",
                "Nurse mains terrify me.",
                "Huntress lullaby haunts me.",
                "Trapper got me again.",
                "Always stepping in traps.",
                "I cleanse hexes instantly.",
                "I regret cleansing sometimes.",
                "Hex builds are fun.",
                "I love meme builds.",
                "Random perks, let’s go.",
                "I miss skill check sounds.",
                "I hear crows constantly.",
                "Immersed gameplay only.",
                "I crouch everywhere.",
                "Running in circles works.",
                "I lose killers easily.",
                "Or maybe not…",
                "I love clutch saves.",
                "I die for the team.",
                "I escape by luck.",
                "I trust no one.",
                "I trust everyone.",
                "I open exit gates fast.",
                "I 99 gates every time.",
                "I forget to open gates.",
                "Endgame collapse panic.",
                "I always go back.",
                "I never go back.",
                "Just another fog survivor.",
                "Just another ruthless killer.",
                "Bloodpoints over everything.",
                "See you in the fog."
            ]),
            isBot: true,
            stats: {
                hoursPlayed: Math.floor(Math.random() * 5000),
                survivalRate: Math.floor(Math.random() * 80) + 10,
                killerRate: Math.floor(Math.random() * 80) + 10
            },
            mainRole: Math.random() > 0.5 ? "Survivor" : "Killer",
            followers: [],
            following: [],
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp()
        });

        // Sign out and fully terminate the secondary app
        await signOut(botAuth);
        await cleanupBotApp();

        return {
            uid: user.uid,
            displayName,
            photoURL,
            email,
            password
        };

    } catch (err) {
        console.error("Bot Generation Error:", err);
        throw err;
    }

    // Kick off social activity in background (non-blocking)
    // We schedule this OUTSIDE of the try-catch so it doesn't block the return
};

// ─── Social Activity Engine ───────────────────────────────────────────────────

/**
 * After a bot is created, it:
 * 1. Likes all other bot posts
 * 2. Follows all other bots
 * 3. Picks 1–3 random real users and likes all their posts
 */
export const botSocialActivity = async (newBot) => {
    initBotApp();

    try {
        // Log in as the new bot
        await signInWithEmailAndPassword(botAuth, newBot.email, BOT_PASSWORD);

        const botUid = newBot.uid;

        // ── 1. Fetch all other bots ──────────────────────────────────────────
        const botUsersSnap = await getDocs(
            query(collection(botDb, 'users'), where('isBot', '==', true))
        );
        const otherBots = botUsersSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(b => b.uid !== botUid && b.uid);

        // ── 2. Like all other bot posts ───────────────────────────────────────
        const botPostsSnap = await getDocs(
            query(collection(botDb, 'posts'),
                where('authorId', 'in', otherBots.slice(0, 10).map(b => b.uid))
            )
        );

        const likesBatch = writeBatch(botDb);
        botPostsSnap.docs.forEach(postDoc => {
            const data = postDoc.data();
            const alreadyLiked = (data.likedBy || []).includes(botUid);
            if (!alreadyLiked) {
                likesBatch.update(doc(botDb, 'posts', postDoc.id), {
                    likedBy: arrayUnion(botUid),
                    likes: increment(1)
                });
            }
        });
        await likesBatch.commit();

        // ── 3. Follow all other bots ──────────────────────────────────────────
        const followsBatch = writeBatch(botDb);
        otherBots.forEach(otherBot => {
            const followDocId = `${botUid}_${otherBot.uid}`;
            followsBatch.set(doc(botDb, 'follows', followDocId), {
                followerId: botUid,
                followingId: otherBot.uid,
                createdAt: new Date().toISOString()
            });
        });
        await followsBatch.commit();

        // ── 4. Pick 1–3 random real users and like their posts ─────────────────
        const realUsersSnap = await getDocs(
            query(collection(botDb, 'users'), where('isBot', '!=', true))
        );
        const realUsers = realUsersSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(u => u.uid && u.uid !== botUid);

        if (realUsers.length > 0) {
            // Shuffle and pick 1–3 random real users
            const shuffled = realUsers.sort(() => Math.random() - 0.5);
            const pickCount = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
            const pickedUsers = shuffled.slice(0, Math.min(pickCount, shuffled.length));

            for (const realUser of pickedUsers) {
                const userPostsSnap = await getDocs(
                    query(collection(botDb, 'posts'), where('authorId', '==', realUser.uid))
                );

                const realLikesBatch = writeBatch(botDb);
                userPostsSnap.docs.forEach(postDoc => {
                    const data = postDoc.data();
                    const alreadyLiked = (data.likedBy || []).includes(botUid);
                    if (!alreadyLiked) {
                        realLikesBatch.update(doc(botDb, 'posts', postDoc.id), {
                            likedBy: arrayUnion(botUid),
                            likes: increment(1)
                        });
                    }
                });
                await realLikesBatch.commit();
            }
        }

        await signOut(botAuth);
        await cleanupBotApp();
        console.log(`[BotSocial] ${newBot.displayName} liked ${botPostsSnap.docs.length} bot posts, followed ${otherBots.length} bots, and engaged with real users.`);
    } catch (err) {
        // Non-critical — don't crash parent flow
        console.warn('[BotSocial] Social activity partial failure:', err);
    }
};

// Generate a post for a specific bot
export const generateBotPost = async (botUser, overrideText = null, isScheduledDate = null, buildData = null) => {
    initBotApp();

    // We will use the BOT's credential to create the post? 
    // Actually, creating a post allows `request.auth != null`. 
    // The admin's PRIMARY auth can do this on their behalf, OR we just log in the bot.
    // Logging in the bot temporarily ensures security matches up.

    try {
        await signInWithEmailAndPassword(botAuth, botUser.email, botUser.password);

        const content = overrideText || getRandomItem(botPostTexts);

        // For scheduled, check if `isScheduledDate` is a JS Date object.
        const createdAt = isScheduledDate ? Timestamp.fromDate(isScheduledDate) : serverTimestamp();

        const newPost = {
            authorId: botUser.uid,
            content,
            authorName: botUser.displayName,
            authorAvatar: botUser.photoURL,
            likes: 0,
            likedBy: [],
            views: 0,
            commentsCount: 0,
            tags: [],
            createdAt: createdAt,
            updatedAt: createdAt
        };

        // Attach build card data if provided
        if (buildData) {
            newPost.buildData = buildData;
        }

        const docRef = await addDoc(collection(botDb, "posts"), newPost);

        await signOut(botAuth);
        await cleanupBotApp();

        return { id: docRef.id, ...newPost };
    } catch (error) {
        console.error("Bot Post Generation Error:", error);
        throw error;
    }
};

// Auto Generate (Batch) Function: Creates X bots and posts for them
export const automaticBatchGeneration = async (count = 1) => {
    const results = [];
    for (let i = 0; i < count; i++) {
        // Create bot
        const bot = await generateBotProfile();
        // Schedule post (randomize between now and 48 hours in future)
        const randomHours = Math.floor(Math.random() * 48);
        const scheduledTime = new Date();
        scheduledTime.setHours(scheduledTime.getHours() + randomHours);

        const post = await generateBotPost(bot, null, scheduledTime);
        results.push({ bot, post });
    }
    return results;
};
