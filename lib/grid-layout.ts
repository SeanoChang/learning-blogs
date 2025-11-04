import type { BlogPostMetadata } from "./types";

/**
 * Simple grid layout - all posts are 1x1 for now
 */
export function assignSmartGridSizes(posts: BlogPostMetadata[]): BlogPostMetadata[] {
  if (posts.length === 0) return [];

  // If posts already have gridSize defined, use them
  const hasCustomSizes = posts.some(post => post.gridSize !== undefined);
  if (hasCustomSizes) {
    return posts;
  }

  // All posts are 1x1 by default
  const postsWithSizes = posts.map((post) => {
    return {
      ...post,
      gridSize: 1 as 1 | 2 | 3,
    };
  });

  return postsWithSizes;
}

/**
 * Calculate grid layout positions to check for gaps
 * Returns array of posts with their calculated positions
 */
export function calculateGridPositions(
  posts: BlogPostMetadata[],
  columns: number = 3
): Array<BlogPostMetadata & { row: number; col: number }> {
  const grid: boolean[][] = [];
  const positionsWithPosts: Array<BlogPostMetadata & { row: number; col: number }> = [];

  posts.forEach(post => {
    const size = post.gridSize || 1;

    // Find the first available position
    let placed = false;
    let row = 0;

    while (!placed) {
      for (let col = 0; col < columns; col++) {
        if (canPlaceAt(grid, row, col, size, columns)) {
          // Place the item
          placeItem(grid, row, col, size);
          positionsWithPosts.push({ ...post, row, col });
          placed = true;
          break;
        }
      }
      if (!placed) row++;
    }
  });

  return positionsWithPosts;
}

function canPlaceAt(
  grid: boolean[][],
  row: number,
  col: number,
  size: number,
  columns: number
): boolean {
  // Check if item fits within grid bounds
  if (col + size > columns) return false;

  // Check if all cells are available
  for (let r = row; r < row + size; r++) {
    for (let c = col; c < col + size; c++) {
      if (grid[r]?.[c]) return false;
    }
  }

  return true;
}

function placeItem(grid: boolean[][], row: number, col: number, size: number): void {
  for (let r = row; r < row + size; r++) {
    if (!grid[r]) grid[r] = [];
    for (let c = col; c < col + size; c++) {
      grid[r][c] = true;
    }
  }
}
