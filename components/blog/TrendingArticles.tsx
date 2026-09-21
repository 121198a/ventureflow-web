"use client";

import Link from "next/link";
import { ArrowUpRight, Flame, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { BlogPost } from "@/types/blog";

interface TrendingArticlesProps {
  posts: BlogPost[];
}

export function TrendingArticles({ posts }: TrendingArticlesProps) {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 border-t border-slate-200/70 bg-gradient-to-b from-slate-50/60 via-white to-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="gb-subtle-grid absolute inset-0 opacity-30" />
        <div className="gb-gradient-blob absolute bottom-0 left-10 h-[300px] w-[300px] rounded-full bg-blue-500/10" />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          {/* Left Column: Heading + Supporting Copy + Interactive Branded Visual */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/80">
                <Flame size={13} className="text-amber-600" />
                <span>High Velocity</span>
              </div>

              <h2 className="display mt-4 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Trending insights you need to read.
              </h2>

              <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-md">
                Stay ahead of market moves and company forecasts. Here are the
                most-read briefings across our investor community this week.
              </p>
            </Reveal>

            {/* Branded Visual Element — UnBound X Verified Thesis Node */}
            <Reveal delay={0.15}>
              <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Signal Meter
                      </h4>
                      <p className="text-sm font-bold text-slate-900">
                        Top Consensus Theses
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-micro font-bold text-emerald-700">
                    Live Feed
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <span className="font-semibold text-slate-800">Long NVDA Horizon 2026</span>
                    <span className="font-bold text-emerald-600">+42.1% Hit</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <span className="font-semibold text-slate-800">Seed Cap Table Benchmarks</span>
                    <span className="font-bold text-blue-600">Top Read</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Verified on public ledger
                  </span>
                  <Link
                    href="/#thesis"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View ledger
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Stacked Horizontal Cards */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.08}>
                <ArticleCard post={post} variant="horizontal" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
