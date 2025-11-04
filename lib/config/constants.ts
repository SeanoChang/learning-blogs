/**
 * Application-wide constants
 */

import path from 'path';

export const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');
export const POSTS_PER_PAGE = 10;
export const CACHE_REVALIDATE_TIME = 3600; // 1 hour in seconds
export const LIST_CACHE_TIME = 60; // 1 minute in seconds

/**
 * Estimated reading speed (words per minute)
 */
export const WORDS_PER_MINUTE = 200;

/**
 * Revalidation paths
 */
export const REVALIDATE_PATHS = {
  POSTS_LIST: '/api/posts',
  POST_DETAIL: '/api/posts/[slug]',
  TAGS: '/api/tags',
} as const;
