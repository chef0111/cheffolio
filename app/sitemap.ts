import type { MetadataRoute } from 'next';

import { SITE_INFO } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/'].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
