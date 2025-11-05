---
id: 550e8400-e29b-41d4-a716-446655440000
title: Getting Started with Markdown Blogging
slug: getting-started
status: published
published_at: 2024-01-15T10:00:00Z
updated_at: 2024-01-20T14:30:00Z
tags:
  - tutorial
  - markdown
  - blogging
cover_image: https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800
excerpt: Learn how to create and publish blog posts using Markdown files with our simple yet powerful blogging platform.
---

# Getting Started with Markdown Blogging

Welcome to our Markdown-based blogging platform! This guide will walk you through creating and publishing your first blog post.

## Why Markdown?

Markdown is a lightweight markup language that's easy to write and read. Here are some key benefits:

- **Simple syntax** - Focus on writing, not formatting
- **Version control** - Track changes with Git
- **Portable** - Works everywhere
- **Fast** - No database queries for content

## Creating Your First Post

To create a new blog post, simply create a Markdown file in the `/content/posts/` directory with the following frontmatter:

```yaml
---
id: 550e8400-e29b-41d4-a716-446655440000
title: Your Post Title
slug: your-post-slug
status: draft
published_at: 2024-01-15T10:00:00Z
tags:
  - tutorial
  - markdown
---
```

### Required Fields

- **id**: A unique UUID for your post
- **title**: The title of your post
- **slug**: URL-friendly identifier (lowercase with hyphens)
- **status**: Either `draft` or `published`
- **published_at**: ISO 8601 timestamp

### Optional Fields

- **tags**: Array of tags for categorization
- **cover_image**: URL to a cover image
- **updated_at**: Last update timestamp
- **excerpt**: Short description (auto-generated if omitted)

## Markdown Syntax

Here are some common Markdown elements you can use:

### Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also use `inline code`.

### Lists

Unordered list:
- First item
- Second item
- Third item

Ordered list:
1. First step
2. Second step
3. Third step

### Links and Images

[Visit our website](https://example.com)

![Sample Image](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400)

### Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

### Blockquotes

> This is a blockquote. It's great for highlighting important information or quotes.

## Publishing Your Post

Once you're ready to publish:

1. Change the `status` field to `published`
2. Commit and push your changes to the `main` branch
3. The CI/CD pipeline will automatically index your post
4. Your post will be live within minutes!

## Next Steps

Now that you know the basics, try:

- Creating your first blog post
- Exploring advanced Markdown features
- Customizing the post template
- Adding custom components to MDX

Happy blogging!
