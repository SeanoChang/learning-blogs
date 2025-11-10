/**
 * Server-side data fetching utilities for blog posts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabase } from '../supabase/client';
import {
  type Post,
  type PostMeta,
  type PostListItem,
  type PostFilters,
  type TagWithCount,
} from '../types/post';
import { POSTS_DIRECTORY } from '../config/constants';

/**
 * Fetch posts from Supabase with filters and pagination
 */
export async function getPosts(filters: PostFilters = {}): Promise<{
  posts: PostListItem[];
  total: number;
}> {
  const {
    tag,
    status = 'published',
    page = 1,
    limit = 10,
  } = filters;

  let query = supabase
    .from('posts_meta')
    .select('*', { count: 'exact' })
    .eq('status', status)
    .order('published_at', { ascending: false });

  // Filter by tag if provided
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  const posts: PostListItem[] = (data || []).map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    tags: post.tags || [],
    excerpt: post.excerpt,
    cover_image: post.cover_image,
    status: post.status,
    published_at: post.published_at,
    updated_at: post.updated_at,
  }));

  return {
    posts,
    total: count || 0,
  };
}

/**
 * Fetch a single post metadata by slug
 */
export async function getPostMetaBySlug(slug: string): Promise<PostMeta | null> {
  const { data, error } = await supabase
    .from('posts_meta')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching post:', error);
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data as PostMeta;
}

/**
 * Read and parse Markdown file from filesystem
 */
export async function getPostContent(slug: string): Promise<Post | null> {
  // First, get metadata from database
  const meta = await getPostMetaBySlug(slug);

  if (!meta) {
    return null;
  }

  // Find the Markdown file
  const postsDir = POSTS_DIRECTORY;

  if (!fs.existsSync(postsDir)) {
    throw new Error(`Posts directory not found: ${postsDir}`);
  }

  const files = fs.readdirSync(postsDir);
  const markdownFile = files.find(file => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return data.slug === slug;
  });

  if (!markdownFile) {
    console.warn(`Markdown file not found for slug: ${slug}`);
    return null;
  }

  const filePath = path.join(postsDir, markdownFile);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);

  return {
    ...meta,
    content,
  };
}

/**
 * Get all unique tags with post counts
 */
export async function getTags(): Promise<TagWithCount[]> {
  const { data, error } = await supabase
    .from('posts_meta')
    .select('tags')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  // Aggregate tags
  const tagCounts = new Map<string, number>();

  (data || []).forEach(post => {
    const tags = post.tags || [];
    tags.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Convert to array and sort by count
  const tags: TagWithCount[] = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  return tags;
}

/**
 * Get all published post slugs (for static generation)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('posts_meta')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching slugs:', error);
    throw new Error(`Failed to fetch slugs: ${error.message}`);
  }

  return (data || []).map(post => post.slug);
}

/**
 * Search posts by title or excerpt
 */
export async function searchPosts(query: string, limit = 10): Promise<PostListItem[]> {
  const { data, error } = await supabase
    .from('posts_meta')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching posts:', error);
    throw new Error(`Failed to search posts: ${error.message}`);
  }

  return (data || []).map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    tags: post.tags || [],
    excerpt: post.excerpt,
    cover_image: post.cover_image,
    status: post.status,
    published_at: post.published_at,
    updated_at: post.updated_at,
  }));
}
