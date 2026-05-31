// app/sitemap.ts
import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // Define our routes (excluding /programs as requested)
  const routes = ['', '/team', '/events', '/blog'];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8, // Homepage gets max priority
  }));
}