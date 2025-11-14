import { NextRequest, NextResponse } from 'next/server';
import { getTags } from '@/lib/data/posts';
import { LIST_CACHE_TIME } from '@/lib/config/constants';
import type { TagsResponse } from '@/lib/types/post';

/**
 * GET /api/tags
 *
 * Fetch all tags with post counts
 *
 * Returns:
 *   {
 *     tags: [
 *       { tag: string, count: number }
 *     ]
 *   }
 */
export async function GET(request: NextRequest) {
  try {
    const tags = await getTags();

    const response: TagsResponse = {
      tags,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${LIST_CACHE_TIME}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/tags:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch tags',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
