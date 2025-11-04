import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { Container } from "@/components/layout/container";
import { PostItem } from "@/components/blog/post-item";
import { Tag } from "@/components/blog/tag";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decodedTag}" - Learning Blog`,
    description: `Browse all posts tagged with ${decodedTag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getAllPosts(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container className="py-16">
      {/* Back Button */}
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to all posts
      </Link>

      {/* Header */}
      <div className="mb-16 space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Posts tagged
          </h1>
          <Tag tag={decodedTag} variant="active" clickable={false} />
        </div>
        <p className="text-lg text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} found
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-12 md:gap-16">
        {posts.map((post, index) => (
          <PostItem key={post.slug} post={post} index={index} />
        ))}
      </div>
    </Container>
  );
}
