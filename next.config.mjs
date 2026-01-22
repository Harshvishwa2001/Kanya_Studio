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
        hostname: 'kanyastudios.com', // Add this for your API images
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;