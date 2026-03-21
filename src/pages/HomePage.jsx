import React, { useState, useEffect, useTransition, useDeferredValue } from 'react';
import Layout from '../components/Layout/Layout';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import PostSkeleton from '../components/Feed/PostSkeleton';
import { subscribeToPosts, createPost } from '../firebase/posts';
import { toast } from 'react-hot-toast';

const EAGER_COUNT = 3; // First N posts render with full urgency

const HomePage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Deferred value for posts beyond the first EAGER_COUNT
  const deferredRest = useDeferredValue(allPosts.slice(EAGER_COUNT));

  useEffect(() => {
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      // First EAGER_COUNT posts set urgently to unblock LCP
      setAllPosts(updatedPosts.slice(0, EAGER_COUNT));
      setIsLoading(false);
      // Remaining posts scheduled as low-priority
      startTransition(() => {
        setAllPosts(updatedPosts);
      });
    });
    return () => unsubscribe();
  }, []);

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
