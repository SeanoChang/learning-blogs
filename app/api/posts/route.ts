import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const tag = searchParams.get("tag");
  const category = searchParams.get("category");

  let posts = getAllPosts(
    tag || undefined,
    category as any || undefined
  );

  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      posts = posts.slice(0, limitNum);
    }
  }

  return NextResponse.json({
    posts,
    total: posts.length,
  });
}
