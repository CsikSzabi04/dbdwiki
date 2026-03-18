import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { usePerks } from '../../hooks/usePerks';
import { useCharacters } from '../../hooks/useCharacters';
import { killerBuilds, survivorBuilds } from '../../hooks/allslot';
import { HiOutlineSearch, HiX } from 'react-icons/hi';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [], wiki: [], builds: [], characters: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { perks } = usePerks();
  const { characters } = useCharacters();

  // Debounced Search
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults({ users: [], posts: [], wiki: [], builds: [], characters: [] });
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const term = searchTerm.toLowerCase();

      try {
        // 1. Search Users (Client-side filter on a limited fetch, or simple query)
        // Note: For a real large-scale app, use Algolia/Typesense. Here we fetch the first 50 users and filter.
        const usersRef = collection(db, 'users');
        const usersQ = query(usersRef, limit(50));
        const usersSnap = await getDocs(usersQ);
        const usersData = usersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.displayName?.toLowerCase().includes(term) || u.username?.toLowerCase().includes(term))
          .slice(0, 3);

        // 2. Search Posts
        const postsRef = collection(db, 'posts');
        const postsQ = query(postsRef, limit(50));
        const postsSnap = await getDocs(postsQ);
        const postsData = postsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.content?.toLowerCase().includes(term))
          .slice(0, 3);

        // 3. Search Wiki (Perks)
        const wikiData = perks
          .filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
          .slice(0, 3);

        // 4. Search Builds
        const allBuilds = [
          ...killerBuilds.map(b => ({ ...b, role: 'killer' })),
          ...survivorBuilds.map(b => ({ ...b, role: 'survivor' }))
        ];
        const buildsData = allBuilds
          .filter(b => b.name.toLowerCase().includes(term))
          .slice(0, 3);

        // 5. Search Characters
        let charsData = [];
        if (characters) {
           charsData = characters
             .filter(c => c.name.toLowerCase().includes(term))
             .slice(0, 3);
        }

        setResults({ users: usersData, posts: postsData, wiki: wikiData, builds: buildsData, characters: charsData });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, perks]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path, state = null) => {
    if (state) {
        navigate(path, { state });
    } else {
        navigate(path);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <HiOutlineSearch className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-xl focus:ring-dbd-red focus:border-dbd-red block pl-10 p-2.5 transition-all duration-300 placeholder-gray-400"
          placeholder="Search DBD..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && searchTerm.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-80 lg:w-full mt-2 bg-obsidian rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10 max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-4 flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : results.users.length === 0 && results.posts.length === 0 && results.wiki.length === 0 && results.builds?.length === 0 && results.characters?.length === 0 ? (
              <div className="p-4 text-center text-smoke text-sm">No results found for "{searchTerm}"</div>
            ) : (
              <div className="py-2">
                {/* Users Section */}
                {results.users.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Users</div>
                    {results.users.map(user => (
                      <div
                        key={user.id}
                        onClick={() => handleNavigate(`/user/${user.id}`)}
                        className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors text-white"
                      >
                        <img
                          src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-semibold">{user.displayName}</div>
                          <div className="text-xs text-smoke">@{user.username || 'user'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Wiki Section */}
                {results.wiki.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Wiki (Perks)</div>
                    {results.wiki.map(perk => (
                      <div
                        key={perk.id}
                        onClick={() => handleNavigate(`/builds`, { role: perk.role, perkName: perk.name })}
                        className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors text-white"
                      >
                        <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center flex-shrink-0 border border-white/10 p-0.5">
                           {perk.icon ? (
                             <img src={perk.icon} alt={perk.name} className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]" />
                           ) : (
                             <div className="w-full h-full bg-red-500 rounded-sm"></div>
                           )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold truncate">{perk.name}</div>
                          <div className="text-xs text-smoke truncate">{perk.role === 'killer' ? 'Killer Perk' : 'Survivor Perk'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Characters Section */}
                {results.characters?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Characters</div>
                    {results.characters.map(char => (
                      <div
                        key={char.id}
                        onClick={() => handleNavigate(`/wiki`, { characterName: char.name, role: char.role })}
                        className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors text-white"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                           <img src={char.portrait || char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold truncate">{char.name}</div>
                          <div className="text-xs text-smoke truncate capitalize">{char.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Builds Section */}
                {results.builds?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Builds</div>
                    {results.builds.map(build => (
                      <div
                        key={build.name}
                        onClick={() => handleNavigate(`/builds`, { role: build.role, buildPerks: build.perks })}
                        className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors text-white"
                      >
                         <div className="w-8 h-8 bg-black border border-white/10 rounded-md shrink-0 flex items-center justify-center">
                            <span className="text-[10px] uppercase font-bold text-dbd-red">{build.role.slice(0,3)}</span>
                         </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold truncate">{build.name}</div>
                          <div className="text-xs text-smoke truncate">{build.role === 'killer' ? 'Killer Build' : 'Survivor Build'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Posts Section */}
                {results.posts.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Posts</div>
                    {results.posts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => handleNavigate(`/home`)} // Assuming no single post view yet, just go to feed
                        className="px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors text-white"
                      >
                        <div className="text-sm line-clamp-2">
                           <span className="font-semibold">{post.authorName}:</span> {post.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
