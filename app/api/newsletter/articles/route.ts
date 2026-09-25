import { NextResponse } from "next/server";
import { articles } from "@/lib/newsletter-data";
import { ARTICLE_CONFIGS } from "@/lib/newsletter/config";

export async function GET() {
  try {
    const formatted = articles.map((a) => {
      const config = ARTICLE_CONFIGS[a.id];
      return {
        ...a,
        frontendPath: config ? config.frontendPath : `/newsletter/article/${a.id}/${a.slug}`,
      };
    });

    return NextResponse.json(
      {
        success: true,
        total: formatted.length,
        articles: formatted,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load newsletter articles" },
      { status: 500 }
    );
  }
}
