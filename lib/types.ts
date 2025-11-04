export type Category = "projects" | "productivity" | "life";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  tags: string[];
  category?: Category;
  project?: string; // Project name for posts in projects category
  readingTime: string;
  published: boolean;
  gridSize?: 1 | 2 | 3;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  tags: string[];
  category?: Category;
  project?: string; // Project name for posts in projects category
  readingTime: string;
  published: boolean;
  gridSize?: 1 | 2 | 3;
}
