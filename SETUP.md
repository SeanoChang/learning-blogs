# Setup Guide

This guide will walk you through setting up your Markdown-in-Git blog platform from scratch.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A GitHub account
- A Supabase account (free tier works)
- A Vercel account (optional, for deployment)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose an organization and provide:
   - Project name
   - Database password (save this!)
   - Region (choose closest to your users)
4. Wait for the project to be created (takes ~2 minutes)

#### Run Database Migration

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `/supabase/migrations/001_create_posts_meta_table.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration

This will:
- Create the `posts_meta` table
- Set up indexes for performance
- Configure Row-Level Security (RLS) policies
- Grant proper permissions

#### Get Your API Credentials

1. In Supabase dashboard, go to "Settings" > "API"
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (under "Project API keys")
   - **Service Role Key** (under "Project API keys" - keep this secret!)

### 3. Configure Environment Variables

#### For Local Development

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
REVALIDATION_SECRET=generate-a-random-secret
```

3. Generate a secure revalidation secret:

```bash
openssl rand -base64 32
```

Copy the output and use it for `REVALIDATION_SECRET`.

#### For Production (Vercel)

Add environment variables in Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables for "Production", "Preview", and "Development":
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REVALIDATION_SECRET`

### 4. Index Your Example Posts

Run the indexing script to sync the example blog posts to Supabase:

```bash
pnpm run index-posts
```

You should see output like:

```
Starting blog post indexing...

Scanning directory: /path/to/content/posts
Found 3 Markdown file(s)

Processing: getting-started.md
  ✓ Parsed: Getting Started with Markdown Blogging (getting-started)
...

Upserting to Supabase...
  ✓ Upserted: getting-started
...

✅ Indexing completed successfully!
```

### 5. Verify in Supabase

1. Go to Supabase dashboard > "Table Editor"
2. Select the `posts_meta` table
3. You should see your 3 example posts with all metadata

### 6. Test Locally

Start the development server:

```bash
pnpm dev
```

Test the API endpoints:

```bash
# List all posts
curl http://localhost:3000/api/posts

# Get a specific post
curl http://localhost:3000/api/posts/getting-started

# Get all tags
curl http://localhost:3000/api/tags
```

### 7. Set Up GitHub Actions (CI/CD)

#### Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret" and add:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your service role key
   - `REVALIDATION_SECRET` - Your revalidation secret
   - `VERCEL_URL` - Your production URL (e.g., `https://yourdomain.com`)

#### Test the Workflow

1. Make a small change to one of the example posts
2. Commit and push to `main` branch:

```bash
git add content/posts/getting-started.md
git commit -m "Test: update getting started post"
git push origin main
```

3. Go to "Actions" tab in GitHub to watch the workflow run
4. The workflow should:
   - Install dependencies
   - Run the indexing script
   - Trigger revalidation
   - Post a status comment on your commit

### 8. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
5. Add environment variables (from step 3)
6. Click "Deploy"

Vercel will automatically:
- Deploy on every push to `main`
- Create preview deployments for PRs
- Handle SSL certificates
- Provide global CDN

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
pnpm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 9. Create Your First Blog Post

1. Generate a UUID for your post:

```bash
# macOS/Linux
uuidgen | tr '[:upper:]' '[:lower:]'

# Output: 550e8400-e29b-41d4-a716-446655440003
```

2. Create a new Markdown file:

```bash
touch content/posts/my-first-post.md
```

3. Add frontmatter and content:

```markdown
---
id: 550e8400-e29b-41d4-a716-446655440003
title: My First Blog Post
slug: my-first-post
status: published
published_at: 2024-02-20T10:00:00Z
tags:
  - meta
  - introduction
excerpt: This is my very first blog post on my new platform!
---

# My First Blog Post

Welcome to my blog! This is where I'll share...
```

4. Index the post:

```bash
pnpm run index-posts
```

5. Commit and push:

```bash
git add content/posts/my-first-post.md
git commit -m "Add: my first blog post"
git push origin main
```

6. GitHub Actions will automatically index and deploy!

## Troubleshooting

### Issue: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Solution:** Ensure `.env.local` exists and contains the service role key.

### Issue: Posts Not Appearing

**Solutions:**
1. Check the post has `status: published`
2. Verify the indexing script ran successfully
3. Check Supabase dashboard for the post in `posts_meta` table
4. Try revalidating: `curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d '{"secret":"your-secret"}'`

### Issue: GitHub Actions Failing

**Solutions:**
1. Verify all GitHub Secrets are set correctly
2. Check the Actions logs for specific error messages
3. Ensure the migration was run in Supabase
4. Test the indexing script locally first

### Issue: Type Errors

**Solution:** Ensure all dependencies are installed:
```bash
pnpm install
```

## Next Steps

- Customize the MDX components in `/lib/mdx/render.tsx`
- Add custom blog post layouts
- Implement search functionality
- Add comments with Supabase Realtime
- Create an admin dashboard
- Add analytics tracking

## Support

If you encounter issues not covered here:

1. Check the main README.md for detailed documentation
2. Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

Happy blogging!
