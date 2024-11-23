import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ajl6b5fkv3ftuwql.public.blob.vercel-storage.com',
        port: '',
        pathname: '/*',
      },
    ],
  },
};

export default nextConfig;
