import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { PostItem } from "@/components/blog/post-item";
import { assignSmartGridSizes } from "@/lib/grid-layout";
import { EmailSubscription } from "@/components/newsletter/email-subscription";

export const metadata: Metadata = {
  title: "Life",
  description: "Personal reflections, life lessons, and stories from everyday experiences.",
  openGraph: {
    title: "Life | Learning Blog",
    description: "Personal reflections, life lessons, and stories from everyday experiences",
    url: "https://seanoc.xyz/life",
    type: "website",
  },
};

export default function LifePage() {
  const allPosts = getAllPosts(undefined, "life");
  const posts = assignSmartGridSizes(allPosts);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <h1 className="text-4xl font-semibold tracking-tight">Life</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <PostItem key={post.slug} post={post} index={index} />
          ))}
        </div>

        <EmailSubscription />
      </div>
    </div>
  );
}
