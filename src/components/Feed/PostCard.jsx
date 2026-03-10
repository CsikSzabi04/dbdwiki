import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import {
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import { toggleLikePost, addComment, subscribeToComments, deletePost, updatePost } from '../../firebase/posts';
import { toast } from 'react-hot-toast';
import survivorsData from '../../hooks/survivors.json';
import killersData from '../../hooks/killers.json';

const allCharacters = [...survivorsData, ...killersData].filter(c => c.imgs?.portrait);

const ADMIN_UID = 'm5bQpvVyXrhtTSvdmOA4rbeDsFb2';

const PostCard = memo(({ post, isPriority = false }) => {
  const { user, userProfile } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({}); // ÚJ: Kommentek kibontásának követése
  const menuRef = useRef(null);

  const isOwner = user?.uid === post.authorId;
  const isAdmin = userProfile?.admin === true;
  const canManage = isOwner || isAdmin;

  // Random avatar for guest comments
  const guestCommentAvatar = useMemo(() => {
    const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    return randomChar.imgs.portrait;
  }, []);

  useEffect(() => {
    setLikesCount(post.likes || 0);
    if (post.likedBy && user) {
      setIsLiked(post.likedBy.includes(user.uid));
    } else {
      setIsLiked(false);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key to close image modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsImageModalOpen(false);
    };
    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error('You must be in the Fog to like posts. Sign in or Sign up!', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }

    // Optimistic update
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikesCount(prev => currentlyLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikePost(post.id, user.uid, currentlyLiked);
    } catch (error) {
      console.error("DEBUG - Like failed. User:", user?.uid, "Error:", error);
      setIsLiked(currentlyLiked);
      setLikesCount(prev => currentlyLiked ? prev + 1 : prev - 1);
      toast.error('You must be in the Fog to like posts. Sign in or Sign up!');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?post=${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post.id);
      toast.success('Post deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete post.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const saveEdit = async () => {
    if (!editContent.trim() || editContent === post.content) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updatePost(post.id, editContent);
      setIsEditing(false);
      toast.success('Post updated!');
    } catch (error) {
      toast.error('Failed to update post.');
    } finally {
      setIsSaving(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const authorName = user ? (userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity') : 'bot@gmail.com';
      const authorAvatar = user ? (userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`) : guestCommentAvatar;

      await addComment(post.id, {
        text: newComment.trim(),
        authorId: user?.uid || 'anonymous',
        authorName,
        authorAvatar
      });
      setNewComment('');
      if (!user) toast.success('Replied as bot@gmail.com! 🤖');
    } catch (error) {
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const userDisplayAvatar = user
    ? (userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`)
    : guestCommentAvatar;

  const showReadMore = post.content && post.content.length > 350;
  const displayContent = showReadMore && !isExpanded
    ? post.content.slice(0, 350) + "..."
    : post.content;

  return (
    <>
      <div className={`p-3 sm:p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group relative ${showMenu ? 'z-[100]' : 'z-auto'}`}>
        <div className="flex gap-3 sm:gap-4">
          {/* Author Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex-shrink-0 overflow-hidden">
            {post.authorAvatar ? (
              <img
                loading={isPriority ? "eager" : "lazy"}
                fetchPriority={isPriority ? "high" : "auto"}
                decoding={isPriority ? "sync" : "async"}
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-smoke text-xs cursor-pointer hover:opacity-80 transition-opacity">
                {post.authorName?.charAt(0)}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                <span className="font-bold text-white hover:underline text-sm sm:text-base truncate cursor-pointer">{post.authorName}</span>
                {post.authorName === 'bot@gmail.com' && <span className="text-[10px] bg-dbd-red/20 text-dbd-red px-1.5 py-0.5 rounded font-black tracking-tighter uppercase mr-1">BOT</span>}
                {post.isVerified && <CheckBadgeIcon className="w-4 h-4 text-dbd-red shrink-0" />}
                <span className="text-smoke text-xs sm:text-sm truncate">@{post.authorName?.toLowerCase().replace(/\s+/g, '').replace('@', '_')}</span>
                <span className="text-smoke text-xs sm:text-sm shrink-0">
                  · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                  {post.isEdited && <span className="ml-1 opacity-50 italic">(edited)</span>}
                </span>
              </div>

              {/* Management Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className={`text-smoke hover:bg-dbd-red/10 hover:text-dbd-red p-2 rounded-full transition-colors ${showMenu ? 'bg-dbd-red/10 text-dbd-red' : ''}`}
                >
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-obsidian border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-in fade-in zoom-in duration-150 backdrop-blur-md">
                    {canManage ? (
                      <>
                        <button
                          onClick={handleEdit}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                        >
                          <PencilSquareIcon className="w-4 h-4 text-smoke" />
                          Edit Post
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-dbd-red hover:bg-dbd-red/10 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete Post
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-xs text-smoke italic">
                        You don't have permission to manage this post.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Text / Edit Mode */}
            {isEditing ? (
              <div className="space-y-3 mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={1000}
                  autoFocus
                  className="w-full bg-black/40 border border-dbd-red/30 rounded-xl p-3 text-sm sm:text-base text-white focus:outline-none focus:border-dbd-red transition-colors min-h-[100px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${editContent.length >= 900 ? 'text-dbd-red' : 'text-smoke/30'}`}>
                    {editContent.length} / 1000
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 text-xs text-smoke hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      disabled={isSaving || !editContent.trim()}
                      className="px-4 py-1.5 text-xs bg-dbd-red text-white rounded-lg font-bold hover:bg-dbd-red/80 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <p className="text-sm sm:text-[15px] leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {displayContent}
                </p>
                {showReadMore && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-dbd-red text-[11px] font-bold uppercase tracking-wider mt-1 hover:underline transition-all"
                  >
                    {isExpanded ? "Mutat kevesebbet" : "Mutat többet"}
                  </button>
                )}

                {/* Build Data Preview - ÚJ */}
                {post.buildData && (
                  <div className="mt-4 glass-card border border-white/10 p-4 bg-gradient-to-br from-obsidian-light/50 to-obsidian/80">
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-3 rounded-full ${post.buildData.role === 'killer' ? 'bg-dbd-red' : 'bg-blue-500'}`}></div>
                        <h4 className="text-sm font-black uppercase italic text-white tracking-tighter">{post.buildData.buildName}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-smoke uppercase tracking-widest leading-none">Strength</span>
                        <span className={`text-xs font-black ${post.buildData.role === 'killer' ? 'text-dbd-red' : 'text-blue-500'}`}>{post.buildData.strength}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {post.buildData.perks && post.buildData.perks.map((perk, i) => (
                        <div key={i} className="group/perk relative flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/40 border border-white/10 rounded-lg p-1 relative overflow-hidden group-hover/perk:border-dbd-red/50 transition-colors shadow-lg">
                            <img
                              src={perk.icon}
                              alt={perk.name}
                              className="w-full h-full object-cover rounded-sm group-hover/perk:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/perk:opacity-100 transition-opacity"></div>
                          </div>
                          <span className="mt-1 text-[8px] sm:text-[9px] font-bold text-smoke group-hover/perk:text-white transition-colors text-center truncate w-full uppercase tracking-tighter">
                            {perk.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image */}
            {post.imageUrl && (
              <div
                className="rounded-2xl border border-white/10 overflow-hidden mb-3 cursor-pointer group/img bg-white/5 aspect-video relative"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  loading={isPriority ? "eager" : "lazy"}
                  fetchPriority={isPriority ? "high" : "auto"}
                  decoding={isPriority ? "sync" : "async"}
                  src={post.imageUrl}
                  alt="Post Attachment"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
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
                <form onSubmit={submitComment} className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 mt-1 bg-obsidian-light">
                    <img loading="lazy" src={userDisplayAvatar} alt="You" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={user ? "Reply (max 100 chars)..." : "Reply as bot (max 100)..."}
                      disabled={isSubmittingComment}
                      maxLength={100}
                      className="w-full bg-black/40 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dbd-red transition-colors placeholder:text-smoke/50 disabled:opacity-50"
                    />
                    <div className="absolute right-12 top-11 text-[8px] font-bold text-smoke/30 italic">
                      {newComment.length} / 100
                    </div>
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
                          {comment.authorName === 'bot@gmail.com' && <span className="text-[8px] bg-dbd-red/20 text-dbd-red px-1 py-0.5 rounded font-black tracking-tighter uppercase mr-1">BOT</span>}
                          <span className="text-smoke text-[10px] shrink-0">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <p className="text-slate-300 text-sm break-words whitespace-pre-wrap leading-relaxed">
                            {comment.text.length > 50 && !expandedComments[comment.id]
                              ? `${comment.text.slice(0, 50)}...`
                              : comment.text}
                          </p>
                          {comment.text.length > 50 && (
                            <button
                              onClick={() => setExpandedComments(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                              className="text-dbd-red text-[9px] font-bold uppercase tracking-widest mt-1 hover:underline active:scale-95 transition-all"
                            >
                              {expandedComments[comment.id] ? "Kevesebb" : "Mutat többet"}
                            </button>
                          )}
                        </div>
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

      {/* Fullscreen Image Lightbox */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 group"
          >
            <XMarkIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>

          <div
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={post.imageUrl}
              alt="Full Size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/70 text-sm font-bold tracking-widest uppercase">
            {post.authorName}'s Highlight
          </div>
        </div>
      )}
    </>
  );
});

export default PostCard;
