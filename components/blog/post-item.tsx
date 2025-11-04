"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { BlogPostMetadata } from "@/lib/types";

interface PostItemProps {
  post: BlogPostMetadata;
  index?: number;
}

export function PostItem({ post, index = 0 }: PostItemProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block space-y-4">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content below image */}
        <div className="space-y-2">
          {/* Title */}
          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-muted-foreground">
            {post.title}
          </h2>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {format(new Date(post.date), "MMM d, yyyy")}
            </time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
