import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import PostSkeleton from '../components/Feed/PostSkeleton';
import { subscribeToPosts, createPost } from '../firebase/posts';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time posts from Firestore
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      setPosts(updatedPosts);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (newPostData) => {
    try {
      await createPost(newPostData);
      toast.success("Post published to the Fog!");
    } catch (error) {
      toast.error("Failed to publish post.");
    }
  };

  return (
    <Layout>
      <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-3 sm:p-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-white">Home</h2>
        <div className="flex gap-2 sm:gap-4">
          <button className="text-xs sm:text-sm font-bold pb-2 border-b-4 border-dbd-red transition-all">For You</button>

        </div>
      </div>

      <CreatePost onSubmit={handleCreatePost} />

      <div className="divide-y divide-white/5 pb-20">
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} isPriority={index === 0} />
          ))
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