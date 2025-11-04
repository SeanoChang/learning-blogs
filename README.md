# Learning Blog - Minimal & Clean

A beautiful, minimal blog built with Next.js 16, Tailwind CSS v4, and thoughtful design principles. Features a clean, borderless aesthetic with generous whitespace, rounded corners, and subtle animations.

## Design Philosophy

This blog embodies the **minimal, low-profile lavish** aesthetic inspired by Apple, Notion, and Figma:

- **Minimal ≠ empty** — balance whitespace, motion, and hierarchy
- **Typography-first** — clean Geist fonts define the reading experience
- **No borders, no cards** — pure image and text composition
- **All corners rounded** — soft, welcoming visual language
- **Subtle animations** — delightful micro-interactions with Framer Motion
- **Generous spacing** — content breathes naturally
- **Dark mode ready** — system-aware theming

## Features

- **Homepage** - Grid of blog posts with cover images, excerpts, tags, and metadata
- **Blog Detail Pages** - Full post rendering with beautiful typography
- **Tag Filtering** - Browse posts by topic
- **Markdown Support** - Full GitHub-flavored markdown with code highlighting
- **Reading Time** - Automatic calculation of estimated reading time
- **Responsive Design** - Mobile-first approach, looks great on all devices
- **Type-Safe** - Full TypeScript support throughout
- **Performant** - Static generation with Next.js for optimal speed

## Tech Stack

- **Next.js 16** - App Router, Server Components, Static Generation
- **TypeScript** - Strict mode for type safety
- **Tailwind CSS v4** - Utility-first styling with design tokens
- **Framer Motion** - Rich, expressive animations
- **Geist Fonts** - Clean, modern typography
- **gray-matter** - Markdown frontmatter parsing
- **react-markdown** - Markdown rendering
- **date-fns** - Date formatting
- **reading-time** - Reading time estimation

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## Creating Blog Posts

Create a new Markdown file in `content/posts/` with the following frontmatter:

```markdown
---
title: "Your Post Title"
excerpt: "A brief description of your post"
coverImage: "https://images.unsplash.com/photo-xxxxx"
date: "2024-01-15"
tags: ["Next.js", "React", "Design"]
published: true
---

# Your Post Title

Your content here...
```

### Frontmatter Fields

- **title** (required) - Post title
- **excerpt** (required) - Short description for list view
- **coverImage** (required) - URL to cover image
- **date** (required) - Publication date (YYYY-MM-DD)
- **tags** (required) - Array of tags
- **published** (optional) - Set to false to hide post

### Markdown Features

Full GitHub-flavored markdown support including:

- Headings (H1-H6)
- Lists (ordered & unordered)
- Code blocks with syntax highlighting
- Blockquotes
- Images (automatically rounded)
- Tables
- Links
- Bold, italic, strikethrough

## Design System

### Color Palette

The design uses a minimal, neutral palette with system-aware dark mode:

- **Light Mode**: White backgrounds, black text, gray accents
- **Dark Mode**: Dark backgrounds, white text, subtle grays

### Typography

- **Font Family**: Geist Sans (body), Geist Mono (code)
- **Scale**: 4xl, 3xl, 2xl, xl, base
- **Weight**: Semibold for headings, Regular for body
- **Tracking**: Tight tracking for all headings

### Spacing

Generous spacing scale ensures comfortable reading:

- Component spacing: 12-16 units between posts
- Section spacing: 16 units for major sections
- Element spacing: 3-6 units within components

### Border Radius

All interactive elements use rounded corners:

- Images: 2xl (rounded-2xl)
- Tags: full (rounded-full)
- Code blocks: xl (rounded-xl)

### Animations

Subtle animations powered by Framer Motion:

- **Entrance**: Fade + slide up (staggered)
- **Hover**: Scale 1.02 on images, opacity 0.7 on text
- **Transitions**: 200ms for colors, 300ms for transforms
- **Easing**: easeOut for natural motion

## Project Structure

```
learning-blogs/
├── app/
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx          # Blog post detail page
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx          # Tag filter page
│   ├── layout.tsx                # Root layout with header/footer
│   ├── page.tsx                  # Homepage (blog list)
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles & design tokens
│
├── components/
│   ├── blog/
│   │   ├── post-item.tsx         # Blog post list item
│   │   ├── tag.tsx               # Tag component
│   │   └── markdown-content.tsx # Markdown renderer
│   └── layout/
│       ├── header.tsx            # Site header
│       ├── footer.tsx            # Site footer
│       └── container.tsx         # Max-width container
│
├── content/
│   └── posts/
│       ├── getting-started-nextjs.md
│       ├── tailwind-css-best-practices.md
│       └── minimal-design-principles.md
│
├── lib/
│   ├── blog.ts                   # Blog post utilities
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions (cn)
│
└── public/                       # Static assets
```

## QA Checklist

- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark mode support
- [x] Accessibility (WCAG 2.2 AA)
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Performance optimized (static generation)
- [x] SEO metadata
- [x] Open Graph images
- [x] No layout shift
- [x] Fast page loads

## Performance

- **Static Generation** - All pages pre-rendered at build time
- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic per-route code splitting
- **Minimal JavaScript** - Server Components reduce bundle size
- **Fast Navigation** - Prefetching and optimistic UI updates

## Customization

### Changing Colors

Edit `app/globals.css` and update the CSS variables in `:root` and `.dark`.

### Changing Fonts

Edit `app/layout.tsx` and import your preferred fonts.

### Adjusting Spacing

Edit the spacing scale in `app/globals.css` under the `@theme` directive.

### Adding Components

Follow the existing patterns in `components/` for consistency.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

- Design inspiration: Apple, Notion, Linear, Stripe
- Photos: Unsplash
- Icons: Lucide Icons
