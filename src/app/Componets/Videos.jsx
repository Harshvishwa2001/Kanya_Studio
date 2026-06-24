"use client";
import React from 'react';

const Videos = ({ videoItems }) => {
  if (!videoItems || videoItems.length === 0) {
    return <p className="text-gray-500">No videos available yet.</p>;
  }

  const getHighQualityUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Request maximum quality and 1080p resolution limit from Cloudinary
    return url.replace('/upload/', '/upload/q_auto:best,f_auto,w_1920,c_limit/');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {videoItems.map((video, index) => (
        <div key={video._id || index} className="relative aspect-video overflow-hidden shadow-lg bg-black group">
          <video
            src={getHighQualityUrl(video.videoUrl)} // High quality transformation
            controls
            className="w-full h-full object-cover"
          />
          {/* Optional Label */}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {video.name || "Wedding Film"}
          </div>
        </div>
      ))}
    </div>
  );
};

// THIS IS THE LINE THAT FIXES YOUR ERROR
export default Videos;