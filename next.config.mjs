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
      {
        protocol: 'https',
        hostname: 'www.kanyastudios.com', // Added www version
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', 
    },
  },
};

export default nextConfig;