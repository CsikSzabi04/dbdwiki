export const INITIAl_MESSAGE = {
    id: 'welcome_message',
    text: 'Welcome to the Fog! 🌫 How can I help you today?',
    sender: 'bot',
    timestamp: Date.now()
};

export const BOT_FALLBACK_REPLY = "I unfortunately do not know the answer to this, but try one of the topics below or join our Discord server and ask the community!";

export const KNOWLEDGE_BASE = [
    {
        id: "discord_rooms",
        question: "What are Discord Rooms?",
        keywords: ["discord", "room", "rooms", "voice", "chat", "talk", "discord server"],
        answer: "The Discord Rooms feature allows you to quickly find teammates to play with (SWF). Join our official Discord server where dedicated voice channels await Survivors and Killers!"
    },
    {
        id: "how_to_post",
        question: "How can I post?",
        keywords: ["post", "posting", "create post", "share", "picture", "new post", "upload"],
        answer: "You can find the post creation field on the Home page or in the Profile menu. Type your text, attach an image if you'd like, and hit the 'Post' button to share it with the rest of the Fog!"
    },
    {
        id: "what_are_builds",
        question: "What are Builds?",
        keywords: ["build", "builds", "perk", "perks", "setup", "abilities", "loadout"],
        answer: "Builds are perk combinations you can use in-game as either a Killer or Survivor. You can browse the best community-uploaded setups under the 'Builds' tab!"
    },
    {
        id: "submit_build",
        question: "How can I submit my own Build?",
        keywords: ["submit", "my build", "upload build", "new build", "create build", "share build"],
        answer: "Currently, you can submit your favorite Builds on our Discord server in the dedicated channel for moderation, or reach out to the admins. It will be added to the site soon!"
    },
    {
        id: "where_is_wiki",
        question: "Where can I find the Wiki?",
        keywords: ["wiki", "character", "characters", "lore", "story", "perks", "description"],
        answer: "In the 'Wiki' menu! Here you can find detailed lore for all Survivors and Killers, along with their three unique teachable perks and icons."
    },
    {
        id: "weekly_challenges",
        question: "What are the Weekly Challenges?",
        keywords: ["weekly", "challenge", "challenges", "bp", "bloodpoints", "task", "rewards"],
        answer: "These are community tasks updated weekly (e.g., getting a 4K with a specific killer, or getting safe unhooks). If you complete them and send proof on Discord, you'll earn Bloodpoints and a unique rank icon!"
    },
    {
        id: "youtube_legends",
        question: "Who are the YouTube Legends?",
        keywords: ["youtube", "youtuber", "legends", "content creator", "streamer", "videos"],
        answer: "In the YouTube Legends section, we've gathered the most well-known and helpful content creators in the Dead by Daylight community, such as Otzdarva. They are worth following for educational material!"
    },
    {
        id: "change_avatar",
        question: "How do I change my avatar?",
        keywords: ["avatar", "profile picture", "picture", "change", "icon", "photo", "image"],
        answer: "Go to your 'Profile' page, hover over your avatar, click the small camera icon, and choose your favorite DBD character from the popup menu!"
    },
    {
        id: "notifications",
        question: "Where can I see my notifications?",
        keywords: ["notification", "notifications", "bell", "alert", "message"],
        answer: "Click the Bell icon in the top right or on the left menu! Here you can see if someone liked/commented on your post, followed you, or if a new official News update drops."
    },
    {
        id: "follow_users",
        question: "How can I follow someone?",
        keywords: ["follow", "following", "friend", "add", "add friend"],
        answer: "Click on another user's name or avatar on their posts to open their profile. You'll find a big red 'Follow' button there. If they follow you back, you become friends!"
    },
    {
        id: "latest_news",
        question: "What is the latest news?",
        keywords: ["news", "latest", "steam", "update", "patch", "patch notes", "changes"],
        answer: "In the 'News' menu, or in the right sidebar's 'What's New' section, you'll always find the freshest official Steam news and patch notes. Read them to stay up to date on buffs and nerfs!"
    },
    {
        id: "dark_mode",
        question: "Is there a Light mode for the website?",
        keywords: ["light", "light mode", "white mode", "dark mode", "theme", "dark"],
        answer: "No! This is The Fog. True to the dark and horrifying world of Dead by Daylight, we have no intention of creating a Light mode. We hope you enjoy the Obsidian Dark design! 🖤"
    },
    {
        id: "is_it_free",
        question: "Is the website free to use?",
        keywords: ["free", "cost", "pay", "money", "subscription", "premium"],
        answer: "Absolutely! This is a fan-made community platform built purely out of love for the DBD community, without any monetization. You don't have to pay for any features."
    },
    {
        id: "who_made_this",
        question: "Who is behind the website?",
        keywords: ["creator", "creators", "developer", "owner", "admin", "admins", "staff"],
        answer: "It's maintained by a small, passionate team of developers and moderators. Join our Discord to chat directly with the developer or sumbit bug reports."
    },
    {
        id: "delete_account",
        question: "How can I delete my account?",
        keywords: ["delete", "remove", "account", "profile", "erase"],
        answer: "For security reasons, account deletion can currently only be done by admins. Please message us on Discord or open a Ticket, and we will help permanently delete your data."
    },
    {
        id: "what_is_the_fog",
        question: "What is The Fog?",
        keywords: ["fog", "the fog", "entity", "world", "realm"],
        answer: "The Fog is the dimension where the Entity drags Killers and Survivors. It is also the thematic name of our website's main feed."
    },
    {
        id: "tiktok_legends",
        question: "How can I become a TikTok Legend?",
        keywords: ["tiktok", "tiktoker", "video", "featured", "promoted", "legend"],
        answer: "If you are an active Dead by Daylight content creator on TikTok making quality clips, contact us on Discord! We're happy to support talented players locally and globally."
    },
    {
        id: "news_update",
        question: "How often does the news update?",
        keywords: ["often", "update", "news sync", "sync", "steam", "when"],
        answer: "The news automatically syncs with the official Steam API, with roughly a 10-minute delay. So you'll know almost immediately when patch notes are released!"
    },
    {
        id: "how_to_play",
        question: "How do I play the game?",
        keywords: ["how to play", "play", "tip", "tips", "help", "tutorial", "noob", "beginner", "learn"],
        answer: "It's highly recommended to read up on perks in the Wiki. For practical knowledge, check out the 'YouTube Legends' and 'Community Legend' sections on the right sidebar, where Otzdarva and others show professional tricks!"
    },
    {
        id: "what_are_rooms",
        question: "What are Rooms?",
        keywords: ["room", "rooms", "chat", "find team", "team", "swf", "play together"],
        answer: "In the 'Rooms' menu, you can create dedicated chat rooms or join existing ones on the web interface. Perfect if you just want to talk, strategize, or find teammates to play with!"
    }
];

// Helper functon to process and match user queries
export const findBestMatch = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    let bestMatch = null;
    let highestScore = 0;

    KNOWLEDGE_BASE.forEach(item => {
        let score = 0;
        item.keywords.forEach(keyword => {
            if (query.includes(keyword)) {
                score += 1;
            }
        });

        // Add bonus for exact phrase match
        if (query.includes(item.question.toLowerCase())) {
            score += 5;
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = item;
        }
    });

    // We only return a match if at least one keyword was hit
    if (highestScore > 0) {
        return bestMatch.answer;
    }

    return BOT_FALLBACK_REPLY;
};

// Generates 3 random suggestions that are distinct
export const getRandomSuggestions = () => {
    const shuffled = [...KNOWLEDGE_BASE].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(item => item.question);
};
