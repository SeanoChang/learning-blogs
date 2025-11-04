/**
 * Sitemap generation utilities
 */

import { getAllPostSlugs } from '../data/posts';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate XML sitemap
 */
export async function generateSitemap(siteUrl: string): Promise<string> {
  const urls: SitemapURL[] = [];

  // Add homepage
  urls.push({
    loc: siteUrl,
    changefreq: 'daily',
    priority: 1.0,
  });

  // Add blog index
  urls.push({
    loc: `${siteUrl}/blog`,
    changefreq: 'daily',
    priority: 0.9,
  });

  // Add all published posts
  const slugs = await getAllPostSlugs();
  slugs.forEach(slug => {
    urls.push({
      loc: `${siteUrl}/blog/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}
