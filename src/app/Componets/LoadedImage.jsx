"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const LoadedImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getOptimizedUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url;
    if (url.includes('/upload/q_')) return url; // Already has transformation
    // Request auto quality, auto format, and cap width at 1200px to ensure blazingly fast load times
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_1200,c_limit/');
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <>
      {/* Shimmer Loader Background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center z-0">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-[#a0884d] rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual Image */}
      <Image
        src={optimizedSrc}
        alt={alt}
        className={`${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </>
  );
};

export default LoadedImage;
