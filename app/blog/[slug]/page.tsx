import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/blog/tag";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { MarkdownNavigator } from "@/components/blog/markdown-navigator";
import { BackButton } from "@/components/blog/back-button";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `https://seanoc.xyz/blog/${post.slug}`;
  const ogImage = post.coverImage || "/og-image.png";

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "Sean O'Chang" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      authors: ["Sean O'Chang"],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
      creator: "@seanochang",
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Build breadcrumbs based on post category and project
  const breadcrumbs: Array<{ label: string; href?: string }> = [{ label: "Home", href: "/" }];

  if (post.category === "projects") {
    breadcrumbs.push({ label: "Projects", href: "/projects" });
    if (post.project) {
      const projectSlug = post.project.toLowerCase().replace(/\s+/g, '-');
      breadcrumbs.push({ label: post.project, href: `/projects/${projectSlug}` });
    }
  } else if (post.category === "productivity") {
    breadcrumbs.push({ label: "Productivity", href: "/productivity" });
  } else if (post.category === "life") {
    breadcrumbs.push({ label: "Life", href: "/life" });
  }

  breadcrumbs.push({ label: post.title });

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || "/og-image.png",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Sean O'Chang",
      url: "https://seanoc.xyz",
    },
    publisher: {
      "@type": "Organization",
      name: "Learning Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://seanoc.xyz/logo.png",
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    url: `https://seanoc.xyz/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://seanoc.xyz/blog/${post.slug}`,
    },
  };

  return (
    <Container className="py-16">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <BackButton />
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-6">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[2.5/1] w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <time className="flex items-center gap-1.5" dateTime={post.date}>
                <Calendar className="h-4 w-4" />
                {format(new Date(post.date), "MMMM d, yyyy")}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      {/* Markdown Navigator */}
      <MarkdownNavigator content={post.content} />
    </Container>
  );
}
