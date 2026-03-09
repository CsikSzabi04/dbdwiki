import React from 'react';
import Layout from '../components/Layout/Layout';
import {
    ShieldCheckIcon,
    FireIcon,
    EyeIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/* ─── Platform Card with proper logos - ALWAYS VISIBLE ─────────── */
const PlatformCard = ({ href, logo, name, sub, type, action, bgColor = 'bg-black/40' }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col gap-3 p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-dbd-red/40 hover:bg-white/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
        {/* top-right corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-dbd-red/20 group-hover:border-dbd-red/60 transition-colors rounded-tr-2xl" />

        {/* bottom red line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dbd-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />

        {/* Logo container - ALWAYS SHOW COLOR LOGO */}
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
            <img
                src={logo}
                alt={name}
                className="w-8 h-8 object-contain" // ELTÁVOLÍTVA: filter brightness-0 invert
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    // Fallback to colored text if image fails
                    e.target.parentElement.innerHTML = `<span class="text-2xl font-black text-white">${name.charAt(0)}</span>`;
                }}
            />
        </div>

        <div>
            <p className="font-black uppercase tracking-tight text-white text-base leading-none mb-1">{name}</p>
            <p className="text-xs text-smoke">{sub}</p>
        </div>

        <div className="mt-auto flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{type}</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-dbd-red group-hover:text-red-400 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {action}
            </span>
        </div>
    </a>
);

/* ─── Social Card with proper logos - ALWAYS VISIBLE ───────────── */
const SocialCard = ({ href, logo, name, desc, action, bgColor = 'bg-black/40' }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center text-center gap-2 p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-white/12 hover:bg-white/5 transition-all duration-300"
    >
        <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300 mb-2`}>
            <img
                src={logo}
                alt={name}
                className="w-10 h-10 object-contain" // ELTÁVOLÍTVA: filter brightness-0 invert
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    // Fallback to colored text if image fails
                    e.target.parentElement.innerHTML = `<span class="text-3xl font-black text-white">${name.charAt(0)}</span>`;
                }}
            />
        </div>
        <p className="font-black uppercase tracking-tight text-white text-sm">{name}</p>
        <p className="text-xs text-smoke">{desc}</p>
        <span className="text-[10px] font-bold uppercase tracking-widest text-dbd-red group-hover:text-red-400 transition-colors mt-1">
            {action}
        </span>
    </a>
);

/* ─── Section Divider ───────────────────────────────────────────── */
const Divider = ({ label }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">
            {label}
        </span>
        <div className="flex-1 h-px bg-white/5" />
    </div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const AvailableOnPage = () => {
    // Platform logos from official sources - FRISSÍTVE jobb minőségű logókra
    const platformLogos = {
        steam: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
        epic: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
        microsoft: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Microsoft_logo_%282012%29.svg',
        playstation: 'https://www.freepnglogos.com/uploads/playstation-logo-png/playstation-logo-ps-one-1.png',
        xbox: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
        nintendo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Nintendo_switch_logo.png'
    };

    // Social media logos - FRISSÍTVE színes verziókra
    const socialLogos = {
        youtube: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png',
        facebook: 'https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg',
        twitter: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
        twitch: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg',
        instagram: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'
    };

    // Alternatív, megbízhatóbb logók (ha a fentiek nem működnének)
    const fallbackLogos = {
        steam: 'https://store.steampowered.com/favicon.ico',
        epic: 'https://static-assets-prod.epicgames.com/epic-store/static/favicon.ico',
        playstation: 'https://www.playstation.com/favicon.ico',
        xbox: 'https://www.xbox.com/favicon.ico',
        youtube: 'https://www.youtube.com/s/desktop/0141db2f/img/favicon.ico',
        twitch: 'https://www.twitch.tv/favicon.ico'
    };

    return (
        <Layout>
            {/* Sticky header with rating badges */}
            <div className="sticky top-0 z-30 bg-obsidian-light/80 backdrop-blur-xl border-b border-white/5 p-3 sm:p-4 shadow-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter drop-shadow-md">
                        AVAILABLE ON<span className="text-dbd-red">.</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-dbd-red/10 border border-dbd-red/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-dbd-red">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            PEGI 18+
                        </span>
                        <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-smoke">
                            <CurrencyDollarIcon className="w-3 h-3" />
                            In-Game Purchases
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

                {/* Hero intro with DBD logo */}
                <div className="mb-10 mt-4 text-center">
                    <img
                        src="https://cdn2.steamgriddb.com/logo/e0b7fb19e92fc04ce11b0009c7dfa1af.png"
                        alt="Dead by Daylight"
                        className="h-16 sm:h-20 mx-auto mb-4 object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://deadbydaylight.com/favicon.ico'; // Fallback
                        }}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-dbd-red mb-2">Behaviour Interactive</p>
                    <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,18,18,0.25)] mb-3">
                        Dead by Daylight
                    </h1>
                    <p className="text-sm text-smoke max-w-md mx-auto">
                        Experience the terror across all platforms. Join the trial and face your fears — every shadow could be your last.
                    </p>
                </div>

                {/* ── PC Platforms ── */}
                <Divider label="PC Platforms" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                    <PlatformCard
                        href="https://store.steampowered.com/app/381210/Dead_by_Daylight/"
                        logo={platformLogos.steam}
                        name="Steam"
                        sub="Windows · macOS · Linux"
                        type="Official Store"
                        action="Download"
                        bgColor="bg-[#171a21]"
                    />
                    <PlatformCard
                        href="https://www.epicgames.com/store/en-US/p/dead-by-daylight"
                        logo={platformLogos.epic}
                        name="Epic Games"
                        sub="Windows"
                        type="Digital Store"
                        action="Get Game"
                        bgColor="bg-[#2a2a2a]"
                    />
                    <PlatformCard
                        href="https://www.microsoft.com/en-us/p/dead-by-daylight/9n5t10z67z9m"
                        logo={platformLogos.microsoft}
                        name="Microsoft Store"
                        sub="Windows · Xbox"
                        type="Official Store"
                        action="Install"
                        bgColor="bg-[#00a4ef]"
                    />
                </div>

                {/* ── Console Platforms ── */}
                <Divider label="Console Platforms" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
                    <PlatformCard
                        href="https://store.playstation.com/en-us/product/UP4134-CUSA03041_00-DEADBYDAYLIGHT"
                        logo={platformLogos.playstation}
                        name="PlayStation"
                        sub="PS4 · PS5"
                        type="Console Store"
                        action="Download"
                        bgColor="bg-[#003791]"
                    />
                    <PlatformCard
                        href="https://www.xbox.com/en-US/games/store/dead-by-daylight/9nblggh4z39g"
                        logo={platformLogos.xbox}
                        name="Xbox"
                        sub="Xbox One · Series S/X"
                        type="Console Store"
                        action="Install"
                        bgColor="bg-white"
                    />
                    <PlatformCard
                        href="https://www.nintendo.com/us/store/products/dead-by-daylight-switch/"
                        logo={platformLogos.nintendo}
                        name="Nintendo Switch"
                        sub="Switch · Lite · OLED"
                        type="Console Store"
                        action="Get Game"
                        bgColor="bg-[#e60012]"
                    />
                </div>

                {/* ── Community / Social ── */}
                <div className="rounded-2xl bg-black/30 border border-white/5 p-6 mb-10">
                    <div className="text-center mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-dbd-red mb-1">Community</p>
                        <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white">
                            Follow The Trial<span className="text-dbd-red">.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <SocialCard
                            href="https://www.youtube.com/c/DeadbyDaylight"
                            logo={socialLogos.youtube}
                            name="YouTube"
                            desc="Trailers & updates"
                            action="Subscribe"
                            bgColor="bg-[#ff0000]"
                        />
                        <SocialCard
                            href="https://www.facebook.com/DeadbyDaylight/"
                            logo={socialLogos.facebook}
                            name="Facebook"
                            desc="Community events"
                            action="Like Page"
                            bgColor="bg-[#1877f2]"
                        />
                        <SocialCard
                            href="https://twitter.com/dbdgame"
                            logo={socialLogos.twitter}
                            name="X"
                            desc="Real-time updates"
                            action="Follow"
                            bgColor="bg-black"
                        />
                        <SocialCard
                            href="https://www.twitch.tv/deadbydaylight"
                            logo={socialLogos.twitch}
                            name="Twitch"
                            desc="Live streams"
                            action="Follow"
                            bgColor="bg-[#9146ff]"
                        />
                        <SocialCard
                            href="https://www.instagram.com/deadbydaylight/"
                            logo={socialLogos.instagram}
                            name="Instagram"
                            desc="Art & behind-the-scenes"
                            action="Follow"
                            bgColor="bg-[#e4405f]"
                        />
                    </div>
                </div>

                {/* ── Footer Info ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dbd-red mb-3">
                            <ShieldCheckIcon className="w-3.5 h-3.5" /> Quick Links
                        </p>
                        <ul className="space-y-2">
                            {[
                                ['Privacy Policy', '/privacy-policy'],
                                ['Terms of Use', '/terms-of-use'],
                                ['Profile', '/profile']
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <a href={href} className="text-sm text-smoke hover:text-white transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dbd-red mb-3">
                            <FireIcon className="w-3.5 h-3.5" /> Support
                        </p>
                        <ul className="space-y-2">
                            {[
                                ['Official Support', 'https://deadbydaylight.com/en/support'],
                                ['Latest News', 'https://deadbydaylight.com/en/news'],
                                ['Patch Notes', 'https://deadbydaylight.com/en/patch-notes'],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-smoke hover:text-white transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dbd-red mb-3">
                            <EyeIcon className="w-3.5 h-3.5" /> About
                        </p>
                        <p className="text-sm text-smoke leading-relaxed mb-3">
                            Dead by Daylight is a multiplayer (4vs1) horror game where one player takes on the role of the savage Killer, and the other four players play as Survivors, trying to escape.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-dbd-red/10 border border-dbd-red/30 text-dbd-red">Multiplayer</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">Asymmetric</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">Survival Horror</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AvailableOnPage;