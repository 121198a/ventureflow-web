import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { blogPosts } from "@/lib/blog-data";
import { articles } from "@/lib/newsletter-data";
import { offerings } from "@/lib/offerings-data";
import { roles } from "@/data/careers";
import { LEGAL_PAGES } from "@/lib/cms";
import { pressReleases } from "@/lib/press-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core canonical static routes
  const staticRoutes = [
    "",
    "/about",
    "/careers",
    "/blog",
    "/press",
    "/legal",
    "/platform",
    "/services",
    "/for-founders",
    "/newsletter",
    "/spaces",
    "/thesis",
    "/beyond-feed",
    "/ubverse",
    "/ubverse/company",
    "/ubverse/ventures",
    "/login",
    "/signup",
    "/investor/login",
    "/investor/signup",
    "/issuer/login",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Dynamic company/deal routes (/:slug)
  const offeringRoutes = offerings.map((o) => ({
    url: `${SITE_URL}/${o.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic blog articles
  const blogRoutes = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic newsletter articles — slug URL only. The numeric-id route still
  // resolves (for old links) but is intentionally left out of the sitemap
  // and carries a canonical tag back to the slug URL, so it's never indexed
  // as a second copy of the same article (Phase 23: no duplicate content).
  const newsletterRoutes = articles.map((article) => ({
    url: `${SITE_URL}/newsletter/article/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic career roles
  const careerRoutes = roles.map((role) => ({
    url: `${SITE_URL}/careers/${role.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic legal documents
  const legalRoutes = LEGAL_PAGES.map((page) => ({
    url: `${SITE_URL}/legal/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Press release briefings
  const pressRoutes = pressReleases
    .filter((pr) => pr.href.startsWith("/"))
    .map((pr) => ({
      url: `${SITE_URL}${pr.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const allEntries = [
    ...staticRoutes,
    ...offeringRoutes,
    ...blogRoutes,
    ...newsletterRoutes,
    ...careerRoutes,
    ...legalRoutes,
    ...pressRoutes,
  ];

  const seen = new Set<string>();
  return allEntries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}
