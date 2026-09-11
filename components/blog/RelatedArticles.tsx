"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { BlogPost } from "@/types/blog";
import { Reveal } from "@/components/motion/Reveal";

interface RelatedArticlesProps {
  posts: BlogPost[];
  currentCategory: string;
}

export function RelatedArticles({ posts, currentCategory }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="relative border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <Sparkles size={12} />
              <span>Continue Reading</span>
            </div>
            <h2 className="display mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              More Insights from {currentCategory}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View all articles</span>
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <ArticleCard post={post} variant="standard" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
