"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { TrendingArticles } from "@/components/blog/TrendingArticles";
import { CuratedTracks } from "@/components/blog/CuratedTracks";
import { EditorialFeatureBanner } from "@/components/blog/EditorialFeatureBanner";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { Reveal } from "@/components/motion/Reveal";
import {
  blogPosts,
  blogCategories,
  getFeaturedPost,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/blog-data";
import type { BlogPost, BlogCategory } from "@/types/blog";

export function BlogClient() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [apiPosts, setApiPosts] = useState<BlogPost[] | null>(null);

  const featuredPost = useMemo(() => getFeaturedPost(), []);
  const trendingPosts = useMemo(() => getTrendingPosts(), []);
  const recentPosts = useMemo(() => getRecentPosts(featuredPost.slug, 3), [featuredPost.slug]);

  // Calculate article counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<BlogCategory, number> = {
      All: blogPosts.length,
      Thesis: 0,
      Investing: 0,
      Ventures: 0,
      UBverse: 0,
      Founders: 0,
      "Craft & Culture": 0,
    };
    blogPosts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, []);

  // Fetch results from the search API on query or category change
  useEffect(() => {
    if (!searchQuery.trim() && activeCategory === "All") {
      setApiPosts(null);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (activeCategory !== "All") params.set("category", activeCategory);

        const res = await fetch(`/api/blog/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (isMounted && Array.isArray(data.posts)) {
          setApiPosts(data.posts);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Search API error:", err);
        }
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, activeCategory]);

  // Instant client-side fallback while API resolves
  const fallbackFilteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);

    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (terms.length === 0) return true;

      const bodyText = post.body
        .map((b) => ("text" in b ? b.text : ""))
        .join(" ")
        .toLowerCase();
      const fullText = `${post.title} ${post.subtitle || ""} ${post.summary} ${post.tag} ${post.category} ${post.author.name} ${bodyText}`.toLowerCase();

      return terms.every((term) => fullText.includes(term));
    });
  }, [activeCategory, searchQuery]);

  const displayedPosts = apiPosts ?? fallbackFilteredPosts;
  const isFiltering = activeCategory !== "All" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setApiPosts(null);
  };

  return (
    <div className="relative">
      {/* 1. Blog Hero */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <BlogHero totalArticles={blogPosts.length} />
      </div>

      {/* 2. Interactive Search & Filter Toolbar */}
      <section id="explore" className="scroll-mt-24 sticky top-20 z-30 bg-white/85 py-4 backdrop-blur-md border-y border-slate-200/80 shadow-2xs">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 max-w-2xl">
            <CategoryFilter
              categories={blogCategories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={categoryCounts}
            />
          </div>
          <div className="w-full md:w-80 shrink-0">
            <BlogSearch
              value={searchQuery}
              onChange={setSearchQuery}
              loading={isSearching}
            />
          </div>
        </div>
      </section>

      {/* If actively filtering or searching, show the direct results grid */}
      {isFiltering ? (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : `${activeCategory} Briefings`}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Found {displayedPosts.length} {displayedPosts.length === 1 ? "article" : "articles"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>

            <ArticleGrid posts={displayedPosts} onResetSearch={handleResetFilters} />
          </div>
        </section>
      ) : (
        /* Full Editorial Flow (when not filtering) */
        <>
          {/* 3. Featured Article (Dominant Split Composition) */}
          <div className="mx-auto max-w-[1240px] px-5 sm:px-6 pt-10 sm:pt-14 pb-8">
            <FeaturedArticle post={featuredPost} />
          </div>

          {/* 4. Latest / Recent Articles (3-card grid with editorial cards) */}
          <section className="py-14 sm:py-20 border-t border-slate-200/70 bg-slate-50/40">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <Reveal>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    <TrendingUp size={12} />
                    <span>Fresh Off the Ledger</span>
                  </div>
                  <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-tight text-slate-900">
                    Our Recent Briefings
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
                    Stay current with our latest stock research, founder guides, and verified market signals.
                  </p>
                </Reveal>

                <Reveal delay={0.1}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("all-articles");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Browse complete library</span>
                    <ArrowRight size={15} />
                  </button>
                </Reveal>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentPosts.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 0.08}>
                    <ArticleCard post={post} variant="standard" />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Trending Insights (Split: Left Heading + Visual, Right Stacked Horizontal Cards) */}
          <TrendingArticles posts={trendingPosts} />

          {/* 6. Thematic / Curated Insider Playbooks */}
          <CuratedTracks />

          {/* 7. Editorial Feature Platform Showcase */}
          <EditorialFeatureBanner />

          {/* 8. All Articles Exploration Section */}
          <section id="all-articles" className="py-14 sm:py-20 border-t border-slate-200/70 bg-slate-50/50">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
              <Reveal>
                <div className="mb-10 text-center max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <span>The Full Archive</span>
                  </div>
                  <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold tracking-tight text-slate-900">
                    Explore All Briefings
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">
                    Filter by topic or search our deep archive of founder and investor memos.
                  </p>
                </div>
              </Reveal>

              <ArticleGrid posts={blogPosts} />
            </div>
          </section>
        </>
      )}

      {/* 9. Newsletter & Community CTA */}
      <NewsletterCTA />
    </div>
  );
}
