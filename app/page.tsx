import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { PostItem } from "@/components/blog/post-item";
import { assignSmartGridSizes } from "@/lib/grid-layout";
import { EmailSubscription } from "@/components/newsletter/email-subscription";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore articles on projects, productivity, and life insights. A minimal blog showcasing clean design and thoughtful content.",
  openGraph: {
    title: "Home | Learning Blog",
    description: "Explore articles on projects, productivity, and life insights",
    url: "https://seanoc.xyz",
    type: "website",
  },
};

export default function HomePage() {
  const allPosts = getAllPosts();
  const posts = assignSmartGridSizes(allPosts);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <h1 className="text-4xl font-semibold tracking-tight">Home</h1>

        {posts.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl bg-muted/30">
            <p className="text-lg text-muted-foreground">
              No blog posts found. Create your first post in the{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">
                content/posts
              </code>{" "}
              directory.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostItem key={post.slug} post={post} index={index} />
              ))}
            </div>

            <EmailSubscription />
          </>
        )}
      </div>
    </div>
  );
}
