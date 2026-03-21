import React, { useState, useEffect, useTransition, useDeferredValue, useRef, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import PostSkeleton from '../components/Feed/PostSkeleton';
import { subscribeToPosts, createPost, loadMorePosts } from '../firebase/posts';
import { toast } from 'react-hot-toast';

const EAGER_COUNT = 3; // First N posts render with full urgency

const HomePage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [, startTransition] = useTransition();

  // Deferred value for posts beyond the first EAGER_COUNT
  const deferredRest = useDeferredValue(allPosts.slice(EAGER_COUNT));

  // Intersection observer ref for auto-load on scroll
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      // First EAGER_COUNT posts set urgently to unblock LCP
      setAllPosts(updatedPosts.slice(0, EAGER_COUNT));
      setIsLoading(false);
      // Remaining posts scheduled as low-priority
      startTransition(() => {
        setAllPosts(updatedPosts);
      });
      // Reset hasMore when live posts refresh
      setHasMore(updatedPosts.length >= 8);
    });
    return () => unsubscribe();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || allPosts.length === 0) return;
    setIsLoadingMore(true);
    try {
      const lastPost = allPosts[allPosts.length - 1];
      const { posts: newPosts, hasMore: more } = await loadMorePosts(lastPost, 8);
      if (newPosts.length > 0) {
        setAllPosts(prev => {
          // Deduplicate by id
          const existing = new Set(prev.map(p => p.id));
          return [...prev, ...newPosts.filter(p => !existing.has(p.id))];
        });
      }
      setHasMore(more);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, allPosts]);

  // Auto-load when the sentinel becomes visible
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isLoadingMore, isLoading]);

  const handleCreatePost = async (newPostData) => {
    try {
      await createPost(newPostData);
      toast.success("Post published to the Fog!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post.");
    }
  };

  const eagerPosts = allPosts.slice(0, EAGER_COUNT);

  return (
    <Layout>
      <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-3 sm:p-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-white">Home</h2>
        <div className="flex gap-2 sm:gap-4">
          <button className="text-xs sm:text-sm font-bold pb-2 border-b-4 border-dbd-red transition-all">For You</button>
        </div>
      </div>

      <div className="hidden md:block">
        <CreatePost onSubmit={handleCreatePost} />
      </div>

      <div className="divide-y divide-white/5 pb-20">
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : allPosts.length > 0 ? (
          <>
            {/* Eagerly rendered — unlocks LCP */}
            {eagerPosts.map((post, index) => (
              <PostCard key={post.id} post={post} isPriority={index === 0} />
            ))}
            {/* Deferred — scheduled as low-priority after first paint */}
            {deferredRest.map((post) => (
              <PostCard key={post.id} post={post} isPriority={false} />
            ))}

            {/* Infinite scroll sentinel + Load More button */}
            <div ref={loadMoreRef} className="py-6 flex flex-col items-center gap-3">
              {isLoadingMore ? (
                <div className="flex items-center gap-3 text-smoke text-xs font-bold uppercase tracking-widest">
                  <div className="w-4 h-4 border-2 border-dbd-red/40 border-t-dbd-red rounded-full animate-spin" />
                  Loading more...
                </div>
              ) : hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-smoke hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
                >
                  Load More
                </button>
              ) : (
                <p className="text-smoke/40 text-xs uppercase tracking-widest italic">You've reached the end of the Fog.</p>
              )}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-smoke text-sm">No posts yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
