import { NextRequest, NextResponse } from 'next/server';
import { getPostMetaBySlug } from '@/lib/data/posts';
import { CACHE_REVALIDATE_TIME } from '@/lib/config/constants';

/**
 * GET /api/posts/[slug]
 *
 * Fetch a single post's metadata by slug
 *
 * Returns:
 *   PostMeta object or 404 if not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const post = await getPostMetaBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE_TIME}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/posts/[slug]:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
