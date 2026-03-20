import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout/Layout';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { usePerks } from '../hooks/usePerks';
import { killerBuilds, survivorBuilds } from '../hooks/allslot';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiFire, HiOutlineUser, HiSparkles } from 'react-icons/hi';
import GlobalSearch from '../components/Search/GlobalSearch';

const ExplorePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { perks, loading: perksLoading } = usePerks();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        // 1. Fetch recent posts
        const postsRef = collection(db, 'posts');
        const postsQ = query(postsRef, orderBy('createdAt', 'desc'), limit(20));
        const postsSnap = await getDocs(postsQ);
        const postsList = postsSnap.docs.map(d => ({ type: 'post', data: { id: d.id, ...d.data() } }));

        // 2. Fetch recent users
        const usersRef = collection(db, 'users');
        const usersQ = query(usersRef, orderBy('createdAt', 'desc'), limit(20));
        const usersSnap = await getDocs(usersQ);
        const usersList = usersSnap.docs.map(d => ({ type: 'user', data: { id: d.id, ...d.data() } }));

        // 3. Prepare Builds (Random selection)
        const allBuilds = [...killerBuilds.map(b => ({ ...b, role: 'killer' })), ...survivorBuilds.map(b => ({ ...b, role: 'survivor' }))];
        // Shuffle builds and take a few
        const shuffledBuilds = allBuilds.sort(() => 0.5 - Math.random()).slice(0, 15);
        const buildsList = shuffledBuilds.map(b => ({ type: 'build', data: b }));

        // 4. Prepare Perks
        let perksList = [];
        if (perks && perks.length > 0) {
          const shuffledPerks = [...perks].sort(() => 0.5 - Math.random()).slice(0, 20);
          perksList = shuffledPerks.map(p => ({ type: 'perk', data: p }));
        }

        // Combine all and shuffle randomly
        let combined = [...postsList, ...usersList, ...buildsList, ...perksList];
        // We need around 30-40 items for a good explore page
        combined = combined.sort(() => 0.5 - Math.random()).slice(0, 40);

        setItems(combined);
      } catch (err) {
        console.error("Failed to fetch explore data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!perksLoading) {
      fetchExploreData();
    }
  }, [perksLoading, perks]);

  const handleNavigate = (type, data) => {
    if (type === 'user') navigate(`/user/${data.id}`);
    if (type === 'post') navigate(`/home`); // Assuming home feed
    if (type === 'perk') {
      navigate(`/builds`, { state: { role: data.role, perkName: data.name } });
    }
    if (type === 'build') {
      navigate(`/builds`, { state: { role: data.role, buildPerks: data.perks } });
    }
  };

  // Helper to determine if an item should be large based on the Instagram Explore pattern
  // Pattern over 10 items: 
  // [0] [1] [2L]
  // [3] [4] [2L]
  // [5L][6] [7]
  // [5L][8] [9]
  const isLargeItem = (index) => {
    const mod = index % 10;
    return mod === 2 || mod === 5;
  };

  return (
    <Layout>
      <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-3 sm:p-4 flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-white shrink-0 hidden sm:block">Explore</h2>
        <div className="flex-1 max-w-2xl w-full">
          <GlobalSearch />
        </div>
      </div>

      <div className="p-1 sm:p-2 bg-black min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-2 auto-rows-[120px] sm:auto-rows-[200px] md:auto-rows-[250px] grid-flow-dense">
            {items.map((item, index) => {
              const large = isLargeItem(index);
              const cardClass = `relative overflow-hidden cursor-pointer group bg-gray-900 rounded-md transition-all duration-300 hover:ring-2 hover:ring-dbd-red ${large ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={cardClass}
                  onClick={() => handleNavigate(item.type, item.data)}
                >
                  {/* --- Render Content based on Type --- */}
                  {item.type === 'post' && (
                    <div className="w-full h-full p-4 md:p-6 flex flex-col justify-between relative overflow-hidden bg-obsidian border border-white/5 group-hover:border-white/20 transition-colors">
                      {/* Decorative Background Elements */}
                      <div className="absolute -bottom-10 -right-10 text-[10rem] text-white/5 transform -rotate-12 pointer-events-none font-serif leading-none">"</div>
                      <div className="absolute inset-0 bg-gradient-to-br from-dbd-red/5 via-transparent to-transparent opacity-50"></div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                          <img src={item.data.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.data.authorId}`} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-tight">{item.data.authorName}</span>
                            <span className="text-[10px] text-smoke uppercase tracking-wider">Community Post</span>
                          </div>
                        </div>
                        <p className={`text-gray-200 font-medium leading-relaxed italic ${large ? 'text-base md:text-lg line-clamp-6' : 'text-xs sm:text-sm line-clamp-4'}`}>
                          "{item.data.content}"
                        </p>
                      </div>
                      <div className="relative z-10 flex justify-end mt-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-dbd-red/70 bg-dbd-red/10 px-2.5 py-1 rounded-full border border-dbd-red/20">
                          <HiFire className="w-4 h-4" /> Discussion
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'user' && (
                    <div className="w-full h-full relative group rounded-md overflow-hidden border border-white/5">
                      <img src={item.data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.data.id}`} alt="user cover" className="absolute inset-0 mt-8 sm:mt-10 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"></div>
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end gap-3 sm:gap-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                        <img src={item.data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.data.id}`} alt="avatar" className={`rounded-xl border-2 border-dbd-red shadow-2xl object-cover relative z-10 transition-transform duration-500 group-hover:scale-110 ${large ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-10 h-10 sm:w-12 sm:h-12'}`} />
                        <div className="overflow-hidden mb-1 flex-1">
                          <p className={`font-black text-white truncate drop-shadow-lg ${large ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>{item.data.displayName}</p>
                          <p className={`text-dbd-red font-bold uppercase tracking-widest truncate ${large ? 'text-xs sm:text-sm' : 'text-[10px]'}`}>@{item.data.username || 'user'}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 group-hover:bg-dbd-red group-hover:text-white transition-colors duration-300">
                        <HiOutlineUser className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>

                  )}

                  {item.type === 'perk' && (
                    <div className={`w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center border border-white/5 transition-all duration-500 overflow-hidden relative group-hover:border-white/20 ${large ? 'bg-gradient-to-b from-obsidian via-gray-900 to-obsidian' : 'bg-obsidian'}`}>
                      {/* Subtle role color glow */}
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 opacity-20 blur-2xl rounded-full ${item.data.role === 'killer' ? 'bg-dbd-red' : 'bg-blue-500'} pointer-events-none`}></div>

                      {large && (
                        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${item.data.role === 'killer' ? 'bg-dbd-red/20 text-dbd-red border-dbd-red/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                          {item.data.role}
                        </div>
                      )}

                      <div className={`relative z-10 mb-3 bg-black/60 rounded-xl flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500 ${large ? 'w-20 h-20 sm:w-28 sm:h-28 p-3' : 'w-14 h-14 p-2'}`}>
                        {item.data.icon ? (
                          <img src={item.data.icon} alt={item.data.name} className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                        ) : (
                          <div className="w-8 h-8 bg-black rounded-sm border border-white/10"></div>
                        )}
                      </div>
                      <h3 className={`font-black text-white px-2 w-full relative z-10 ${large ? 'text-lg sm:text-xl md:text-2xl mb-2 line-clamp-2 leading-tight' : 'text-xs sm:text-sm truncate'}`}>{item.data.name}</h3>

                      {large && (
                        <div className="relative z-10 mt-2 px-2">
                          <p className="text-xs sm:text-sm text-smoke line-clamp-3 leading-relaxed border-t border-white/10 pt-3">{item.data.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {item.type === 'build' && (
                    <div className={`w-full h-full relative overflow-hidden bg-obsidian border border-white/5 group-hover:border-dbd-red/50 transition-colors p-4 sm:p-5 flex flex-col justify-between ${large ? 'border-t-4 border-t-dbd-red' : 'border-l-4 border-l-dbd-red'}`}>
                      {/* Background Accents */}
                      <div className="absolute -right-10 -top-10 text-9xl text-white/5">
                        <HiSparkles />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br from-dbd-red/10 via-transparent to-transparent opacity-80 pointer-events-none`}></div>

                      <div className="relative z-10 flex-col">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-dbd-red uppercase tracking-widest mb-2">
                          <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                          {item.data.role} Build
                        </div>
                        <h3 className={`font-black text-white italic leading-tight drop-shadow-md ${large ? 'text-xl sm:text-2xl md:text-3xl mb-4' : 'text-sm sm:text-base line-clamp-2'}`}>
                          {item.data.name}
                        </h3>
                      </div>

                      <div className={`relative z-10 mt-auto ${large ? 'bg-black/40 rounded-xl p-3 sm:p-4 border border-white/5' : ''}`}>
                        {large ? (
                          <div className="grid grid-cols-4 gap-2">
                            {item.data.perks.map((p, i) => {
                              const matchedPerk = perks.find(perk => perk.name === p.name || perk.id === p.id);
                              return (
                                <div key={i} className="flex flex-col items-center text-center group/perk">
                                  <div className="w-10 h-10 sm:w-14 sm:h-14 mb-2 flex items-center justify-center bg-black rounded-lg border border-white/10 shadow-inner group-hover/perk:bg-white/5 transition-colors p-1.5">
                                    {matchedPerk?.icon ? (
                                      <img src={matchedPerk.icon} alt={p.name} className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                                    ) : (
                                      <div className="w-full h-full bg-gray-800 rounded"></div>
                                    )}
                                  </div>
                                  <span className="text-[9px] sm:text-[10px] text-smoke font-bold leading-tight line-clamp-2 px-1">{p.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex justify-start gap-1.5 mt-2">
                            {item.data.perks.map((p, i) => {
                              const matchedPerk = perks.find(perk => perk.name === p.name || perk.id === p.id);
                              return (
                                <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black rounded-md border border-white/10 shadow-inner hover:border-white/30 transition-colors p-1">
                                  {matchedPerk?.icon ? (
                                    <img src={matchedPerk.icon} alt={p.name} className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]" title={p.name} />
                                  ) : (
                                    <div className="w-full h-full bg-gray-800 rounded-sm" title={p.name}></div>
                                  )}
                                </div>
                              );
                            })}
                            {/* Fill empty slots if less than 4 */}
                            {[...Array(Math.max(0, 4 - (item.data.perks?.length || 0)))].map((_, i) => (
                              <div key={`empty-${i}`} className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 rounded-md border border-white/5"></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 mix-blend-overlay"></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
