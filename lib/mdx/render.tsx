/**
 * MDX rendering utilities
 */

import { MDXRemote } from 'next-mdx-remote/rsc';
import { ComponentProps } from 'react';

/**
 * Custom MDX components for rendering
 * Customize these to match your design system
 */
const components = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4 tracking-tight" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3" {...props} />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="text-base leading-7 mb-4" {...props} />
  ),
  a: (props: ComponentProps<'a'>) => (
    <a
      className="text-blue-600 hover:text-blue-800 underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li className="ml-4" {...props} />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700"
      {...props}
    />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code
      className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre
      className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4"
      {...props}
    />
  ),
  img: (props: ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg my-4 max-w-full h-auto"
      loading="lazy"
      {...props}
      alt={props.alt || ''}
    />
  ),
  hr: (props: ComponentProps<'hr'>) => (
    <hr className="my-8 border-gray-200" {...props} />
  ),
  table: (props: ComponentProps<'table'>) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      className="px-4 py-2 bg-gray-100 text-left text-sm font-semibold"
      {...props}
    />
  ),
  td: (props: ComponentProps<'td'>) => (
    <td className="px-4 py-2 border-t border-gray-200 text-sm" {...props} />
  ),
};

/**
 * Render MDX content
 * This is a React Server Component
 */
export async function renderMDX(content: string) {
  return <MDXRemote source={content} components={components} />;
}

export { components };
