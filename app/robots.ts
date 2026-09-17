import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/investor/dashboard",
        "/investor/dashboard/*",
        "/founder/dashboard",
        "/founder/dashboard/*",
        "/auth/callback",
        "/api/*",
        "/forbidden",
        "/unauthorized",
        "/test-401",
        "/test-403",
        "/test-500",
      ],
    },
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
