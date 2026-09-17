import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { UBVERSE_API_BASE_URL, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const memory = typeof process !== "undefined" && process.memoryUsage ? process.memoryUsage() : null;
  const uptimeSeconds = typeof process !== "undefined" && process.uptime ? Math.floor(process.uptime()) : 0;

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || "development",
      services: {
        supabase: {
          configured: isSupabaseConfigured(),
        },
        ubverseApi: {
          configured: Boolean(process.env.NEXT_PUBLIC_UBVERSE_API_URL),
          baseUrl: UBVERSE_API_BASE_URL,
        },
        cmsApi: {
          configured: Boolean(process.env.NEXT_PUBLIC_CMS_API_URL),
        },
        siteUrl: SITE_URL,
      },
      system: {
        nodeVersion: typeof process !== "undefined" ? process.version : undefined,
        platform: typeof process !== "undefined" ? process.platform : undefined,
        memoryUsageMb: memory ? Math.round(memory.rss / (1024 * 1024)) : undefined,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

