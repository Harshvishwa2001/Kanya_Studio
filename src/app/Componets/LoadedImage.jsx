"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const LoadedImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

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
        src={src}
        alt={alt}
        className={`${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </>
  );
};

export default LoadedImage;
