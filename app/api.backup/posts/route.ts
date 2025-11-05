import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/data/posts';
import { POSTS_PER_PAGE, LIST_CACHE_TIME } from '@/lib/config/constants';
import type { PostsListResponse } from '@/lib/types/post';

/**
 * GET /api/posts
 *
 * Fetch published posts with optional filtering and pagination
 *
 * Query parameters:
 *   - tag: Filter by tag
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 10)
 *
 * Returns:
 *   {
 *     posts: PostListItem[],
 *     pagination: {
 *       total: number,
 *       page: number,
 *       limit: number,
 *       totalPages: number
 *     }
 *   }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const tag = searchParams.get('tag') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(POSTS_PER_PAGE), 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Fetch posts
    const { posts, total } = await getPosts({
      tag,
      page,
      limit,
      status: 'published',
    });

    const totalPages = Math.ceil(total / limit);

    const response: PostsListResponse = {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${LIST_CACHE_TIME}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
