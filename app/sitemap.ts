import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { blogPosts } from "@/lib/blog-data";
import { articles } from "@/lib/newsletter-data";
import { offerings } from "@/lib/offerings-data";
import { roles } from "@/data/careers";
import { LEGAL_PAGES } from "@/lib/cms";

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

  // Dynamic offerings (/offerings/[slug])
  const offeringRoutes = offerings.map((o) => ({
    url: `${SITE_URL}/offerings/${o.slug}`,
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

  // Dynamic newsletter articles
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

  return [
    ...staticRoutes,
    ...offeringRoutes,
    ...blogRoutes,
    ...newsletterRoutes,
    ...careerRoutes,
    ...legalRoutes,
  ];
}
