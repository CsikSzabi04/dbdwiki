import React from 'react';
import {
  ChatBubbleLeftIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const PostCard = ({ post }) => {
  return (
    <div className="p-3 sm:p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
      <div className="flex gap-3 sm:gap-4">
        {/* Author Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex-shrink-0 overflow-hidden">
          {post.authorPhoto ? (
            <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-smoke text-xs">
              {post.authorName?.charAt(0)}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="font-bold text-white hover:underline text-sm sm:text-base truncate">{post.authorName}</span>
              {post.isVerified && <CheckBadgeIcon className="w-4 h-4 text-dbd-red shrink-0" />}
              <span className="text-smoke text-xs sm:text-sm truncate">@{post.authorUsername}</span>
              <span className="text-smoke text-xs sm:text-sm shrink-0">· {post.time}</span>
            </div>
            <button className="text-smoke hover:bg-dbd-red/10 hover:text-dbd-red p-2 rounded-full transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Text */}
          <p className="text-sm sm:text-[15px] leading-relaxed mb-3 text-slate-200">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-dbd-red text-sm hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Build Info (Optional) */}
          {post.type === 'build' && (
            <div className="glass-card p-4 mb-3 flex gap-3 items-center">
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 bg-dbd-red/10 border border-dbd-red/30 rounded rotate-45 flex items-center justify-center overflow-hidden">
                    <div className="-rotate-45 font-bold text-dbd-red text-[10px]">PERK</div>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{post.buildTitle || 'Custom Build'}</p>
                <p className="text-xs text-smoke">Character: {post.character || 'Any'}</p>
              </div>
            </div>
          )}

          {/* Image */}
          {post.imageURL && (
            <div className="rounded-2xl border border-white/10 overflow-hidden mb-3">
              <img src={post.imageURL} alt="Post item" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}

          {/* Interactions */}
          <div className="flex items-center justify-between max-w-md text-smoke -ml-1 sm:-ml-2">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors group">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              {post.comments > 0 && <span className="text-sm">{post.comments}</span>}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-green-500/10 hover:text-green-500 rounded-full transition-colors group">
              <ArrowsRightLeftIcon className="w-5 h-5" />
              {post.reshares > 0 && <span className="text-sm">{post.reshares}</span>}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-pink-500/10 hover:text-pink-500 rounded-full transition-colors group">
              <HeartIcon className="w-5 h-5 group-hover:fill-pink-500" />
              {post.likes > 0 && <span className="text-sm">{post.likes}</span>}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors group">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;