import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjectsWithPosts } from "@/lib/blog";
import { PostItem } from "@/components/blog/post-item";
import { EmailSubscription } from "@/components/newsletter/email-subscription";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my projects and their related blog posts. Learn about development, design, and implementation details.",
  openGraph: {
    title: "Projects | Learning Blog",
    description: "Explore my projects and their related blog posts",
    url: "https://seanoc.xyz/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  const projectsWithPosts = getAllProjectsWithPosts(3);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-16">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>

        {Object.entries(projectsWithPosts).map(([projectName, posts]) => (
          <section key={projectName} className="space-y-6">
            {/* Project Name */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{projectName}</h2>
              <Link
                href={`/projects/${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>

            {/* Latest 3 Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostItem key={post.slug} post={post} index={index} />
              ))}
            </div>
          </section>
        ))}

        <EmailSubscription />
      </div>
    </div>
  );
}
