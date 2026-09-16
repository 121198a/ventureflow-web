import { NextResponse } from "next/server";
import { articles } from "@/lib/newsletter-data";

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        total: articles.length,
        articles,
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
