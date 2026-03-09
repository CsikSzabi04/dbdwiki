import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import { toggleLikePost, addComment, subscribeToComments } from '../../firebase/posts';
import { toast } from 'react-hot-toast';

const PostCard = ({ post }) => {
  const { user, userProfile } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    setLikesCount(post.likes || 0);
    if (user && post.likedBy) {
      setIsLiked(post.likedBy.includes(user.uid));
    }
  }, [post.likes, post.likedBy, user]);

  useEffect(() => {
    let unsubscribe;
    if (isCommentOpen) {
      unsubscribe = subscribeToComments(post.id, (fetchedComments) => {
        setComments(fetchedComments);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [post.id, isCommentOpen]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('You need to sign in to like posts.');
      return;
    }

    // Optimistic exact update
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikesCount(prev => currentlyLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikePost(post.id, user.uid, currentlyLiked);
    } catch (error) {
      setIsLiked(currentlyLiked);
      setLikesCount(prev => currentlyLiked ? prev + 1 : prev - 1);
      toast.error('Failed to like post.');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Simulate copying URL since we are an SPA
    const url = `${window.location.origin}/?post=${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You need to sign in to comment.');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment(post.id, {
        text: newComment.trim(),
        authorId: user.uid,
        authorName: userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity',
        authorAvatar: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
      });
      setNewComment('');
    } catch (error) {
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <div className="flex gap-3 sm:gap-4">
        {/* Author Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex-shrink-0 overflow-hidden">
          {post.authorAvatar ? (
            <img loading="lazy" src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-smoke text-xs cursor-pointer hover:opacity-80 transition-opacity">
              {post.authorName?.charAt(0)}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="font-bold text-white hover:underline text-sm sm:text-base truncate cursor-pointer">{post.authorName}</span>
              {post.isVerified && <CheckBadgeIcon className="w-4 h-4 text-dbd-red shrink-0" />}
              <span className="text-smoke text-xs sm:text-sm truncate">@{post.authorName?.toLowerCase().replace(/\s+/g, '')}</span>
              <span className="text-smoke text-xs sm:text-sm shrink-0">
                · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <button className="text-smoke hover:bg-dbd-red/10 hover:text-dbd-red p-2 rounded-full transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Text */}
          <p className="text-sm sm:text-[15px] leading-relaxed mb-3 text-slate-200 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <div className="rounded-2xl border border-white/10 overflow-hidden mb-3">
              <img loading="lazy" src={post.imageUrl} alt="Post Attachment" className="w-full h-auto max-h-[500px] object-cover cursor-pointer hover:opacity-90 transition-opacity" />
            </div>
          )}

          {/* Interactions */}
          <div className="flex items-center justify-between max-w-md text-smoke -ml-1 sm:-ml-2 mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsCommentOpen(!isCommentOpen); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors group ${isCommentOpen ? 'text-dbd-red bg-dbd-red/10' : 'hover:bg-dbd-red/10 hover:text-dbd-red'}`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              {post.comments > 0 && <span className="text-sm">{post.comments}</span>}
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors group ${isLiked ? 'text-pink-500 bg-pink-500/10' : 'hover:bg-pink-500/10 hover:text-pink-500'}`}
            >
              {isLiked ? (
                <HeartSolid className="w-5 h-5 text-pink-500" />
              ) : (
                <HeartOutline className="w-5 h-5 group-hover:fill-pink-500/30" />
              )}
              {likesCount > 0 && <span className="text-sm">{likesCount}</span>}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors group"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Expandable Comments Section */}
          {isCommentOpen && (
            <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
              {/* Comment Input */}
              {user && (
                <form onSubmit={submitComment} className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 mt-1">
                    <img loading="lazy" src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="You" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Post your reply..."
                      disabled={isSubmittingComment}
                      className="w-full bg-black/40 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dbd-red transition-colors placeholder:text-smoke/50 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="absolute right-1 top-1 bottom-1 px-3 bg-dbd-red/20 text-dbd-red rounded-full hover:bg-dbd-red hover:text-white transition-colors disabled:opacity-0 flex items-center justify-center pointer-events-auto"
                    >
                      {isSubmittingComment ? (
                        <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
                      ) : (
                        <PaperAirplaneIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
                      {comment.authorAvatar ? (
                        <img loading="lazy" src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-smoke text-xs">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-black/20 rounded-2xl rounded-tl-none p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-0.5 max-w-full min-w-0">
                        <span className="font-bold text-white text-sm truncate">{comment.authorName}</span>
                        <span className="text-smoke text-[10px] shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm break-words whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center text-smoke/50 text-sm py-4">
                    Be the first to reply to this post!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;