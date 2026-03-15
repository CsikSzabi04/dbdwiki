import React, { useState, useRef, useMemo } from 'react';
import {
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';


const compressImage = (base64Str, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
    };
  });
};

const CreatePost = ({ onSubmit }) => {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Simple guest avatar - avoids importing massive JSON files in the critical bundle
  const guestAvatar = useMemo(() => {
    if (user) return null;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=guest${Math.floor(Math.random() * 100)}`;
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for raw upload, we will compress it
        alert("Image is too large. Max 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result);
        setImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        const authorName = user ? (userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity') : 'bot@gmail.com';
        const authorAvatar = user ? (userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`) : guestAvatar;

        await onSubmit({
          content,
          imageUrl: image,
          authorId: user?.uid || 'anonymous',
          authorName,
          authorAvatar
        });
      }
      setContent('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 border-b border-white/5 bg-white/[0.02] text-center">
        <h3 className="text-xl font-bold text-white mb-2">Join the entity</h3>
        <p className="text-smoke text-sm mb-4">You're currently browsing as a guest bot. Sign in to post builds and highlights.</p>
        <Link
          to="/login"
          className="w-[20%] mx-auto flex items-center justify-center gap-3 px-3 lg:px-4 py-3 rounded-xl bg-dbd-red text-white hover:bg-dbd-red/80 transition-all group shadow-lg shadow-red-900/20"
          title="Sign In"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const displayAvatar = userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  return (
    <div className="p-3 sm:p-4 border-b border-white/5 bg-white/[0.02]">
      <div className="flex gap-3 sm:gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 overflow-hidden shrink-0 bg-obsidian-light">
          <img
            src={displayAvatar}
            alt="Your Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input Area */}
        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
          <div className="relative">
            <textarea
              id="post-content"
              name="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your latest build or a legendary escape..."
              maxLength={1000}
              className="w-full bg-transparent border-none text-base sm:text-xl resize-none focus:ring-0 placeholder:text-smoke/40 h-24 sm:h-32 mt-1 sm:mt-2"
            ></textarea>

            {/* Character Counter */}
            <div className={`absolute bottom-0 right-0 text-[10px] font-bold tracking-tighter px-2 py-1 select-none pointer-events-none transition-colors ${content.length >= 900 ? 'text-dbd-red' : 'text-smoke/30'
              }`}>
              {content.length} / 1000
            </div>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 mt-2">
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-dbd-red rounded-full transition-colors z-10"
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </button>
              <img src={image} alt="Upload Preview" className="w-full h-auto object-contain max-h-64" />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-0.5 sm:gap-1 text-dbd-red">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                id="post-image-upload"
              />
              <label
                htmlFor="post-image-upload"
                className="p-1.5 sm:p-2 hover:bg-dbd-red/10 rounded-full transition-colors cursor-pointer"
                title="Attach Image"
              >
                <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && !image)}
              className="dbd-button-primary scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
