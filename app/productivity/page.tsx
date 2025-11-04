import { getAllPosts } from "@/lib/blog";
import { PostItem } from "@/components/blog/post-item";
import { assignSmartGridSizes } from "@/lib/grid-layout";
import { EmailSubscription } from "@/components/newsletter/email-subscription";

export default function ProductivityPage() {
  const allPosts = getAllPosts(undefined, "productivity");
  const posts = assignSmartGridSizes(allPosts);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <h1 className="text-4xl font-semibold tracking-tight">Productivity</h1>

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
