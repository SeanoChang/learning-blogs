#!/usr/bin/env tsx

/**
 * Blog Post Indexing Script
 *
 * This script:
 * 1. Scans all Markdown files in /content/posts/
 * 2. Extracts and validates frontmatter
 * 3. Auto-generates excerpts if missing
 * 4. Upserts metadata to Supabase
 * 5. Detects duplicate slugs
 *
 * Usage:
 *   pnpm tsx scripts/index-posts.ts
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostFrontmatterSchema, type PostMeta } from '../lib/types/post';
import { getServiceRoleClient } from '../lib/supabase/client';
import { WORDS_PER_MINUTE } from '../lib/config/constants';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

interface IndexingResult {
  success: boolean;
  fileName: string;
  slug?: string;
  error?: string;
}

/**
 * Extract first paragraph from Markdown content as excerpt
 */
function extractExcerpt(content: string, maxLength = 160): string {
  // Remove frontmatter if present
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');

  // Remove Markdown formatting
  const plainText = withoutFrontmatter
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/\n\n+/g, ' ') // Collapse multiple newlines
    .trim();

  // Get first paragraph or sentence
  const firstParagraph = plainText.split('\n')[0] || plainText.split('.')[0] || plainText;

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  // Truncate at word boundary
  return firstParagraph.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Calculate estimated read time
 */
function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
}

/**
 * Parse a single Markdown file
 */
function parseMarkdownFile(filePath: string): PostMeta | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Generate excerpt if not provided
    if (!data.excerpt && content) {
      data.excerpt = extractExcerpt(content);
    }

    // Validate frontmatter
    const validatedData = PostFrontmatterSchema.parse(data);

    // Build metadata object
    const metadata: PostMeta = {
      id: validatedData.id,
      slug: validatedData.slug,
      title: validatedData.title,
      tags: validatedData.tags || [],
      excerpt: validatedData.excerpt || null,
      cover_image: validatedData.cover_image || null,
      status: validatedData.status,
      published_at: validatedData.published_at,
      updated_at: validatedData.updated_at || null,
    };

    return metadata;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Scan directory for Markdown files
 */
function scanPostsDirectory(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath);
  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => path.join(dirPath, file));
}

/**
 * Check for duplicate slugs
 */
function findDuplicateSlugs(posts: PostMeta[]): Map<string, string[]> {
  const slugMap = new Map<string, string[]>();

  posts.forEach(post => {
    if (!slugMap.has(post.slug)) {
      slugMap.set(post.slug, []);
    }
    slugMap.get(post.slug)!.push(post.id);
  });

  // Filter to only duplicates
  const duplicates = new Map<string, string[]>();
  slugMap.forEach((ids, slug) => {
    if (ids.length > 1) {
      duplicates.set(slug, ids);
    }
  });

  return duplicates;
}

/**
 * Upsert post metadata to Supabase
 */
async function upsertPostMeta(supabase: ReturnType<typeof getServiceRoleClient>, post: PostMeta): Promise<void> {
  const { error } = await supabase
    .from('posts_meta')
    .upsert(
      {
        id: post.id,
        slug: post.slug,
        title: post.title,
        tags: post.tags,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        status: post.status,
        published_at: post.published_at,
        updated_at: post.updated_at,
      },
      {
        onConflict: 'id',
      }
    );

  if (error) {
    throw new Error(`Failed to upsert post ${post.slug}: ${error.message}`);
  }
}

/**
 * Main indexing function
 */
async function indexPosts(): Promise<void> {
  console.log('Starting blog post indexing...\n');

  // Initialize Supabase client
  const supabase = getServiceRoleClient();

  // Scan posts directory
  console.log(`Scanning directory: ${POSTS_DIR}`);
  const markdownFiles = scanPostsDirectory(POSTS_DIR);

  if (markdownFiles.length === 0) {
    console.log('No Markdown files found.');
    return;
  }

  console.log(`Found ${markdownFiles.length} Markdown file(s)\n`);

  // Parse all files
  const results: IndexingResult[] = [];
  const posts: PostMeta[] = [];

  for (const filePath of markdownFiles) {
    const fileName = path.basename(filePath);
    console.log(`Processing: ${fileName}`);

    try {
      const post = parseMarkdownFile(filePath);

      if (!post) {
        results.push({
          success: false,
          fileName,
          error: 'Failed to parse file',
        });
        continue;
      }

      posts.push(post);
      results.push({
        success: true,
        fileName,
        slug: post.slug,
      });

      console.log(`  ✓ Parsed: ${post.title} (${post.slug})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({
        success: false,
        fileName,
        error: errorMessage,
      });
      console.error(`  ✗ Error: ${errorMessage}`);
    }
  }

  // Check for duplicate slugs
  const duplicates = findDuplicateSlugs(posts);
  if (duplicates.size > 0) {
    console.error('\n⚠️  DUPLICATE SLUGS DETECTED:');
    duplicates.forEach((ids, slug) => {
      console.error(`  - Slug "${slug}" used by posts: ${ids.join(', ')}`);
    });
    throw new Error('Cannot proceed with duplicate slugs. Please fix and retry.');
  }

  // Upsert to database
  console.log('\nUpserting to Supabase...');
  for (const post of posts) {
    try {
      await upsertPostMeta(supabase, post);
      console.log(`  ✓ Upserted: ${post.slug}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ Failed to upsert ${post.slug}: ${errorMessage}`);
      throw error;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('INDEXING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files:    ${markdownFiles.length}`);
  console.log(`Successful:     ${results.filter(r => r.success).length}`);
  console.log(`Failed:         ${results.filter(r => !r.success).length}`);
  console.log('='.repeat(60));

  if (results.some(r => !r.success)) {
    console.error('\nFailed files:');
    results
      .filter(r => !r.success)
      .forEach(r => console.error(`  - ${r.fileName}: ${r.error}`));

    process.exit(1);
  }

  console.log('\n✅ Indexing completed successfully!\n');
}

// Run the script
if (require.main === module) {
  indexPosts().catch(error => {
    console.error('\n❌ Indexing failed:', error);
    process.exit(1);
  });
}

export { indexPosts, parseMarkdownFile, extractExcerpt, calculateReadTime };
