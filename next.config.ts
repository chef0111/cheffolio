import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.giabao.dev',
        port: '',
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
