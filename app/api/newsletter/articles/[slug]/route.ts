import { NextResponse } from "next/server";
import { getNewsletterArticle } from "@/lib/newsletter/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await getNewsletterArticle(slug);

    if (!result) {
      return NextResponse.json(
        { success: false, error: `Article not found for identifier: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        article: result.article,
        config: result.config,
        source: result.source,
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
      { success: false, error: "Failed to load newsletter article" },
      { status: 500 }
    );
  }
}
