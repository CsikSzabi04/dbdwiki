import { db } from './config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const getAdminStats = async () => {
  try {
    // Felhasználók lekérdezése
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    // Posztok lekérdezése visszamenőleg időrendben
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));
    const postsSnapshot = await getDocs(postsQuery);
    
    let totalPosts = 0;
    let totalLikes = 0;
    let totalComments = 0;
    
    // Napi aktivitási adatok a grafikonhoz (utolsó 7-14 nap mondjuk, vagy az összes)
    const activityMap = new Map();

    postsSnapshot.forEach(doc => {
      const data = doc.data();
      totalPosts++;
      totalLikes += data.likes || 0;
      totalComments += data.comments || 0;

      // Dátum formázása YYYY-MM-DD
      if (data.createdAt) {
        const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        if(!isNaN(dateObj)) {
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (!activityMap.has(dateStr)) {
            activityMap.set(dateStr, { name: dateStr, posts: 0, likes: 0, comments: 0 });
            }
            
            const dayStats = activityMap.get(dateStr);
            dayStats.posts += 1;
            dayStats.likes += data.likes || 0;
            dayStats.comments += data.comments || 0;
        }
      }
    });

    // Vegyük az utolsó 14 napot ha sok van, vagy az összeset
    let chartData = Array.from(activityMap.values());
    if (chartData.length > 14) {
      chartData = chartData.slice(-14);
    }

    return {
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      chartData
    };
  } catch (error) {
    console.error("Hiba az admin statisztikák betöltésekor:", error);
    throw error;
  }
};
