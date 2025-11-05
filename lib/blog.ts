import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPost, BlogPostMetadata, Category } from "./types";

const postsDirectory = path.join(process.cwd(), "content/posts");

/**
 * Return the first valid date string found in the frontmatter.
 * Supports both `date` and `published_at` variations.
 */
function resolvePostDate(data: Record<string, unknown>): string {
  const candidates = [
    data["date"],
    data["published_at"],
    data["publishedAt"],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const value = candidate.trim();
      if (!value) {
        continue;
      }

      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return value;
      }
    } else if (candidate instanceof Date && !Number.isNaN(candidate.getTime())) {
      return candidate.toISOString();
    }
  }

  return "";
}

/**
 * Get all blog posts metadata, optionally filtered by tag or category
 */
export function getAllPosts(tag?: string, category?: Category): BlogPostMetadata[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        date: resolvePostDate(data),
        tags: data.tags || [],
        category: data.category || undefined,
        project: data.project || undefined,
        readingTime: stats.text,
        published: data.published !== false,
        gridSize: data.gridSize || undefined,
      } as BlogPostMetadata;
    })
    .filter((post) => post.published);

  // Filter by tag if provided
  let filteredPosts = tag
    ? allPostsData.filter((post) => post.tags.includes(tag))
    : allPostsData;

  // Filter by category if provided
  if (category) {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  // Sort posts by date in descending order
  return filteredPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    let fileContents = "";

    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, "utf8");
    } else {
      // Try .mdx extension
      const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
      if (fs.existsSync(mdxPath)) {
        fileContents = fs.readFileSync(mdxPath, "utf8");
      } else {
        return null;
      }
    }

    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      content,
      coverImage: data.coverImage || "",
      date: resolvePostDate(data),
      tags: data.tags || [],
      category: data.category || undefined,
      project: data.project || undefined,
      readingTime: stats.text,
      published: data.published !== false,
      gridSize: data.gridSize || undefined,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.(md|mdx)$/, ""));
}

/**
 * Get all unique project names
 */
export function getAllProjects(): string[] {
  const posts = getAllPosts(undefined, "projects");
  const projectsSet = new Set<string>();

  posts.forEach((post) => {
    if (post.project) {
      projectsSet.add(post.project);
    }
  });

  return Array.from(projectsSet).sort();
}

/**
 * Get posts by project name
 */
export function getPostsByProject(projectName: string, limit?: number): BlogPostMetadata[] {
  const posts = getAllPosts(undefined, "projects");
  const projectPosts = posts.filter((post) => post.project === projectName);

  if (limit) {
    return projectPosts.slice(0, limit);
  }

  return projectPosts;
}

/**
 * Get all projects with their latest posts (for overview page)
 */
export function getAllProjectsWithPosts(postsPerProject: number = 3): Record<string, BlogPostMetadata[]> {
  const projects = getAllProjects();
  const projectsWithPosts: Record<string, BlogPostMetadata[]> = {};

  projects.forEach((project) => {
    projectsWithPosts[project] = getPostsByProject(project, postsPerProject);
  });

  return projectsWithPosts;
}
