import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
    instantInsights: {
      validationLevel: 'manual-warning',
    },
  },
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
  async redirects() {
    return [
      {
        source: '/:section(blog)/:slug.mdx',
        destination: '/:section/:slug.md',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      // beforeFiles so these run before prerendered pages are served;
      beforeFiles: [
        {
          source: '/:section(blog)/:slug.md',
          destination: '/blog.md/:slug',
        },
        {
          source: '/:section(blog)/:slug',
          destination: '/blog.md/:slug',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(?<accept>.*text/markdown.*)',
            },
          ],
        },
      ],
    };
  },
};

export default nextConfig;
