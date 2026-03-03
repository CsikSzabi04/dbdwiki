import React from 'react';
import {
  PhotoIcon,
  MapPinIcon,
  FaceSmileIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const CreatePost = () => {
  return (
    <div className="p-3 sm:p-4 border-b border-white/5 bg-white/[0.02]">
      <div className="flex gap-3 sm:gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-dbd-red to-orange-500 flex-shrink-0"></div>

        {/* Input Area */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          <textarea
            placeholder="Share your latest build or a legendary escape..."
            className="w-full bg-transparent border-none text-base sm:text-xl resize-none focus:ring-0 placeholder:text-smoke/40 h-16 sm:h-24 mt-1 sm:mt-2"
          ></textarea>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-0.5 sm:gap-1 text-dbd-red">
              <button className="p-1.5 sm:p-2 hover:bg-dbd-red/10 rounded-full transition-colors">
                <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-dbd-red/10 rounded-full transition-colors">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-dbd-red/10 rounded-full transition-colors">
                <FaceSmileIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-dbd-red/10 rounded-full transition-colors">
                <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <button className="dbd-button-primary scale-90">
              Post Build
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;