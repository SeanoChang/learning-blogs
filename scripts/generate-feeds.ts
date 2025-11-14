import fs from "fs";
import path from "path";
import { getAllPosts } from "../lib/blog";

const baseUrl = "https://seanoc.xyz";

function generateRSS() {
  const posts = getAllPosts().slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sean O'Connor's Blog</title>
    <link>${baseUrl}</link>
    <description>Projects, productivity, and life insights</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.category ? `<category>${post.category}</category>` : ""}
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return rss;
}

function generateJSON() {
  const posts = getAllPosts().slice(0, 20);

  return JSON.stringify(
    {
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        tags: post.tags,
        category: post.category,
        readingTime: post.readingTime,
        coverImage: post.coverImage,
        url: `${baseUrl}/blog/${post.slug}`,
      })),
      total: posts.length,
      generated: new Date().toISOString(),
    },
    null,
    2
  );
}

// Generate feeds
const publicDir = path.join(process.cwd(), "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "feed.xml"), generateRSS());
fs.writeFileSync(path.join(publicDir, "posts.json"), generateJSON());

console.log("✓ Generated feed.xml");
console.log("✓ Generated posts.json");
