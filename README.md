# Dead by Daylight Community Hub

![DBD Community Hub Dashboard](https://github.com/user-attachments/assets/7cd7aa05-fbfd-4654-bd3f-6c05063a8bd1)

Welcome to the **Dead by Daylight Community Hub** – a central place for players to share their mains, track their progress, explore the wiki, and analyze perk synergies. Whether you're a survivor main or a killer main, this hub helps you connect with the community and optimize your builds.

---

## Features

- **Community Posts** – Share your main character, your current level, and engage with other players.
- **Character Wiki** – Browse all killers and survivors with detailed info (difficulty, perks, backstory, etc.).
- **Perk Wiki** – Explore all perks with filtering, sorting, and detailed descriptions.
- **Perk Build Analyzer** – Select up to 4 perks and see how well they synergize. The strength meter gives a percentage based on top community builds.
- **Matching Builds** – See which popular builds match your current perk selection.
- **User Authentication** – Sign in to personalize your experience (soon: save your loadouts and mains).
- **Responsive Design** – Optimized for desktop, tablet, and mobile.

---

## Tech Stack

- **Frontend**: React 18, React Router 6, Tailwind CSS, Heroicons
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Data Fetching**: Custom hooks (`usePerks`, `useCharacters`)
- **Build Analysis**: Custom algorithm based on top community builds (`allslot.js`)
- **Icons**: Heroicons, React Icons (FontAwesome, etc.)
- **Styling**: Tailwind with custom DBD theme (obsidian, blood red, smoke)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dbd-community-hub.git
   cd dbd-community-hub
   npm install
   npm start



## Structure

src/
├── components/         # Reusable UI components (Layout, Sidebar, etc.)
├── data/               # Local JSON files (characters, perks)
├── hooks/              # Custom hooks (usePerks, useCharacters, useAuth)
├── pages/              # Main pages (Home, Wiki, Profile, Builds, News)
├── styles/             # Global CSS (Tailwind imports, animations)
└── App.js              # Main routing