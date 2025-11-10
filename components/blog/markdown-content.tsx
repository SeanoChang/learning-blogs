"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import type { Heading as MdastHeading } from "mdast";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createHeadingSlugger,
  extractMarkdownHeadings,
} from "@/lib/markdown-headings";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          borderRadius: "0.75rem",
          padding: "1.5rem",
          margin: "1.5rem 0",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

const extractHeadingText = (node?: MdastHeading): string => {
  if (!node || !node.children) {
    return "";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collect = (child: any): string => {
    if (!child) return "";
    if (typeof child.value === "string") {
      return child.value;
    }
    if (Array.isArray(child.children)) {
      return child.children.map(collect).join("");
    }
    return "";
  };

  return node.children.map(collect).join(" ").trim();
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const headings = useMemo(() => extractMarkdownHeadings(content), [content]);

  const headingIdByLine = useMemo(() => {
    const map = new Map<number, string>();
    headings.forEach(({ line, id }) => {
      map.set(line, id);
    });
    return map;
  }, [headings]);

  const fallbackSlugger = useMemo(() => createHeadingSlugger(), []);

  const resolveHeadingId = (node?: MdastHeading, children?: ReactNode) => {
    const line = node?.position?.start?.line;
    if (line !== undefined) {
      const mapped = headingIdByLine.get(line);
      if (mapped) {
        return mapped;
      }
    }

    const fallbackText =
      extractHeadingText(node) ||
      (typeof children === "string" ? children : "");

    return fallbackSlugger(fallbackText);
  };

  const markdownComponents: Components = {
    h1({ node, children, ...props }) {
      const id = resolveHeadingId(node as MdastHeading | undefined, children);
      return (
        <h1 id={id} {...props}>
          {children}
        </h1>
      );
    },
    h2({ node, children, ...props }) {
      const id = resolveHeadingId(node as MdastHeading | undefined, children);
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
    h3({ node, children, ...props }) {
      const id = resolveHeadingId(node as MdastHeading | undefined, children);
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
    code(props) {
      const { className, children, ...rest } = props;
      const inline = !("inline" in props) || props.inline === undefined ? false : props.inline;
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <CodeBlock language={match[1]}>{codeString}</CodeBlock>
      ) : (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
    a({ href, children, ...props }) {
      const isExternal =
        href?.startsWith("http://") || href?.startsWith("https://");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("prose prose-neutral dark:prose-invert", className)}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
