/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kanyastudios.com',
        pathname: '/**',
      },
    ],
  },
  // This section solves the 413 "Payload Too Large" error
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb', // Adjust this (e.g., 100mb) based on your video sizes
    },
  },
};

export default nextConfig;