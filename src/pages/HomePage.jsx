import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('dbd-posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const handleCreatePost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('dbd-posts', JSON.stringify(updatedPosts));
  };

  return (
    <Layout>
      <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-3 sm:p-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-white">Home</h2>
        <div className="flex gap-2 sm:gap-4">
          <button className="text-xs sm:text-sm font-bold pb-2 border-b-4 border-dbd-red transition-all">For You</button>
          <button className="text-xs sm:text-sm font-bold pb-2 text-smoke hover:text-white transition-all">Following</button>
        </div>
      </div>

      <CreatePost onSubmit={handleCreatePost} />

      <div className="divide-y divide-white/5 pb-20">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
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