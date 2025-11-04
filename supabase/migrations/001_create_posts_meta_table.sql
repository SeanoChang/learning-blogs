-- Create posts_meta table for storing blog post metadata
-- The actual Markdown content lives in Git, only metadata is in the database

CREATE TABLE IF NOT EXISTS posts_meta (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  excerpt TEXT,
  cover_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common query patterns
CREATE INDEX idx_posts_meta_status ON posts_meta(status);
CREATE INDEX idx_posts_meta_published_at ON posts_meta(published_at DESC);
CREATE INDEX idx_posts_meta_slug ON posts_meta(slug);
CREATE INDEX idx_posts_meta_tags ON posts_meta USING GIN(tags);

-- Create a composite index for filtering published posts by date
CREATE INDEX idx_posts_meta_status_published_at ON posts_meta(status, published_at DESC)
WHERE status = 'published';

-- Add comments for documentation
COMMENT ON TABLE posts_meta IS 'Metadata for blog posts. Markdown content is stored in Git.';
COMMENT ON COLUMN posts_meta.id IS 'UUID from frontmatter, matches across Git and DB';
COMMENT ON COLUMN posts_meta.slug IS 'URL-friendly identifier, must be unique';
COMMENT ON COLUMN posts_meta.status IS 'Publication status: draft or published';
COMMENT ON COLUMN posts_meta.published_at IS 'Publication timestamp (ISO 8601)';
COMMENT ON COLUMN posts_meta.updated_at IS 'Last update timestamp';

-- Enable Row Level Security
ALTER TABLE posts_meta ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access ONLY to published posts
CREATE POLICY "Public read access for published posts"
  ON posts_meta
  FOR SELECT
  USING (status = 'published');

-- RLS Policy: Service role can do anything (for CI/CD and admin operations)
-- This policy allows full access when using the service role key
CREATE POLICY "Service role has full access"
  ON posts_meta
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON posts_meta TO anon;
GRANT ALL ON posts_meta TO service_role;
