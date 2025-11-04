import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getPostsByProject } from "@/lib/blog";
import { PostItem } from "@/components/blog/post-item";
import { EmailSubscription } from "@/components/newsletter/email-subscription";

interface ProjectPageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    name: project.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { name: projectSlug } = await params;
  const projects = getAllProjects();

  const projectName = projects.find(
    (p) => p.toLowerCase().replace(/\s+/g, '-') === projectSlug
  );

  if (!projectName) {
    return {
      title: "Project Not Found",
    };
  }

  const posts = getPostsByProject(projectName);

  return {
    title: projectName,
    description: `Explore articles and updates about ${projectName}. ${posts.length} ${posts.length === 1 ? 'post' : 'posts'} available.`,
    openGraph: {
      title: `${projectName} | Learning Blog`,
      description: `Explore articles and updates about ${projectName}`,
      url: `https://seanoc.xyz/projects/${projectSlug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: projectName,
      description: `Explore articles and updates about ${projectName}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { name: projectSlug } = await params;
  const projects = getAllProjects();

  // Find the project name that matches the slug
  const projectName = projects.find(
    (p) => p.toLowerCase().replace(/\s+/g, '-') === projectSlug
  );

  if (!projectName) {
    notFound();
  }

  const posts = getPostsByProject(projectName);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <h1 className="text-4xl font-semibold tracking-tight">{projectName}</h1>

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
