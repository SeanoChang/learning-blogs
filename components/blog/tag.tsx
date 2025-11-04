"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TagProps {
  tag: string;
  variant?: "default" | "active";
  clickable?: boolean;
}

export function Tag({ tag, variant = "default", clickable = true }: TagProps) {
  const content = (
    <motion.span
      whileHover={clickable ? { scale: 1.05 } : undefined}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variant === "active"
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-foreground/10"
      )}
    >
      {tag}
    </motion.span>
  );

  if (!clickable) {
    return content;
  }

  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Link>
  );
}
