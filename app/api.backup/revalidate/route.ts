import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/revalidate
 *
 * Trigger on-demand ISR (Incremental Static Regeneration)
 * This endpoint should be called after updating posts in CI/CD
 *
 * Authentication: Requires REVALIDATION_SECRET in request body or header
 *
 * Body parameters:
 *   - secret: Revalidation secret (must match REVALIDATION_SECRET env var)
 *   - paths: Optional array of paths to revalidate (default: all post-related paths)
 *
 * Example:
 *   POST /api/revalidate
 *   {
 *     "secret": "your-secret",
 *     "paths": ["/blog", "/blog/my-post-slug"]
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = body.secret || request.headers.get('x-revalidation-secret');

    // Verify secret
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error('REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('Invalid revalidation secret attempt');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse paths to revalidate
    const paths: string[] = body.paths || [
      '/blog',
      '/api/posts',
      '/api/tags',
    ];

    // Revalidate each path
    const revalidatedPaths: string[] = [];
    const errors: { path: string; error: string }[] = [];

    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
        console.log(`Revalidated: ${path}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ path, error: errorMessage });
        console.error(`Failed to revalidate ${path}:`, errorMessage);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: 'Revalidation completed with errors',
          revalidated: revalidatedPaths,
          errors,
        },
        { status: 207 } // Multi-Status
      );
    }

    return NextResponse.json({
      message: 'Revalidation successful',
      revalidated: revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in POST /api/revalidate:', error);

    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
