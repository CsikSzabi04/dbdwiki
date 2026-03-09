import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const CreatePost = ({ onSubmit }) => {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image is too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
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
        await onSubmit({
          content,
          imageUrl: image,
          authorId: user?.uid,
          authorName: userProfile?.displayName || user?.email?.split('@')[0] || 'Unknown Entity',
          authorAvatar: userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
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
      <div className="p-4 border-b border-white/5 bg-white/[0.02] text-center">
        <p className="text-smoke text-sm">Sign in to share your thoughts with the community!</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 border-b border-white/5 bg-white/[0.02]">
      <div className="flex gap-3 sm:gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 overflow-hidden shrink-0">
          <img
            src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
            alt="Your Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input Area */}
        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your latest build or a legendary escape..."
            className="w-full bg-transparent border-none text-base sm:text-xl resize-none focus:ring-0 placeholder:text-smoke/40 h-16 sm:h-24 mt-1 sm:mt-2"
          ></textarea>

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