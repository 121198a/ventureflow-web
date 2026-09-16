import { NextResponse } from "next/server";
import { getArticle } from "@/lib/newsletter-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, error: `Article not found for identifier: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        article,
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
