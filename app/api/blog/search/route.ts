import { NextResponse } from "next/server";
import { blogPosts } from "@/lib/blog-data";
import type { BlogPost } from "@/types/blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const category = (searchParams.get("category") || "All").trim();

    let results: BlogPost[] = blogPosts;

    // 1. Filter by category if specified and not 'All'
    if (category && category.toLowerCase() !== "all") {
      results = results.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Filter by search query across multiple fields & content
    if (query) {
      const terms = query.split(/\s+/).filter(Boolean);

      results = results
        .map((post) => {
          const bodyText = post.body
            .map((b) => ("text" in b ? b.text : ""))
            .join(" ")
            .toLowerCase();

          const title = post.title.toLowerCase();
          const subtitle = (post.subtitle || "").toLowerCase();
          const summary = post.summary.toLowerCase();
          const tag = post.tag.toLowerCase();
          const author = post.author.name.toLowerCase();
          const categoryName = post.category.toLowerCase();
          const slug = post.slug.toLowerCase();

          const combined = `${title} ${subtitle} ${summary} ${tag} ${author} ${categoryName} ${slug} ${bodyText}`;

          // Check if every search term appears somewhere
          const matches = terms.every((term) => combined.includes(term));
          if (!matches) return null;

          // Simple relevance score: title match is highest, then tag, summary, content
          let score = 0;
          for (const term of terms) {
            if (title.includes(term)) score += 10;
            if (tag.includes(term)) score += 6;
            if (summary.includes(term)) score += 4;
            if (subtitle.includes(term)) score += 3;
            if (bodyText.includes(term)) score += 1;
          }

          return { post, score };
        })
        .filter((item): item is { post: BlogPost; score: number } => item !== null)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.post);
    }

    return NextResponse.json(
      {
        success: true,
        query,
        category,
        total: results.length,
        posts: results,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform search query",
        total: 0,
        posts: [],
      },
      { status: 500 }
    );
  }
}
