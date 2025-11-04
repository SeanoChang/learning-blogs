import { z } from 'zod';

/**
 * Post status enum
 */
export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export type PostStatusType = typeof PostStatus[keyof typeof PostStatus];

/**
 * Frontmatter schema with Zod validation
 * This defines the contract for frontmatter in Markdown files
 */
export const PostFrontmatterSchema = z.object({
  // Required fields
  id: z.string().uuid('Post ID must be a valid UUID'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  status: z.enum(['draft', 'published']),
  published_at: z.string().datetime('Published date must be in ISO 8601 format'),

  // Optional fields
  tags: z.array(z.string()).optional().default([]),
  cover_image: z.string().url('Cover image must be a valid URL').optional(),
  updated_at: z.string().datetime('Updated date must be in ISO 8601 format').optional(),
  excerpt: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/**
 * Database schema for posts_meta table
 */
export const PostMetaSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  excerpt: z.string().nullable(),
  cover_image: z.string().nullable(),
  status: z.enum(['draft', 'published']),
  published_at: z.string(),
  updated_at: z.string().nullable(),
  created_at: z.string().optional(),
});

export type PostMeta = z.infer<typeof PostMetaSchema>;

/**
 * Full post with content
 */
export interface Post extends PostMeta {
  content: string;
}

/**
 * Post list item (for API responses)
 */
export interface PostListItem extends Omit<PostMeta, 'created_at'> {
  read_time?: number; // estimated read time in minutes
}

/**
 * API response types
 */
export interface PostsListResponse {
  posts: PostListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TagWithCount {
  tag: string;
  count: number;
}

export interface TagsResponse {
  tags: TagWithCount[];
}

/**
 * Filter options for querying posts
 */
export interface PostFilters {
  tag?: string;
  status?: PostStatusType;
  page?: number;
  limit?: number;
}
