import React from 'react';

const PostSkeleton = () => (
    <div className="p-3 sm:p-4 border-b border-white/5 animate-pulse">
        <div className="flex gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-white/5 rounded-md w-24"></div>
                    <div className="h-3 bg-white/5 rounded-md w-16"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded-md w-full"></div>
                    <div className="h-3 bg-white/5 rounded-md w-[90%]"></div>
                </div>
                <div className="aspect-video w-full bg-white/5 rounded-2xl"></div>
            </div>
        </div>
    </div>
);

export default PostSkeleton;
