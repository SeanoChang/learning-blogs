/**
 * RSS feed generation utilities
 */

import RSS from 'rss';
import { getPosts } from '../data/posts';

interface RSSConfig {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  language?: string;
  copyright?: string;
}

/**
 * Generate RSS feed for published posts
 */
export async function generateRSSFeed(config: RSSConfig): Promise<string> {
  const feed = new RSS({
    title: config.title,
    description: config.description,
    feed_url: config.feedUrl,
    site_url: config.siteUrl,
    language: config.language || 'en',
    copyright: config.copyright || `© ${new Date().getFullYear()} ${config.title}`,
    pubDate: new Date(),
  });

  // Fetch all published posts
  const { posts } = await getPosts({
    status: 'published',
    limit: 100, // Reasonable limit for RSS
  });

  // Add posts to feed
  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || '',
      url: `${config.siteUrl}/blog/${post.slug}`,
      guid: post.id,
      date: new Date(post.published_at),
      categories: post.tags,
    });
  });

  return feed.xml({ indent: true });
}
