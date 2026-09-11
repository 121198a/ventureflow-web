"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface FeaturedArticleProps {
  post: BlogPost;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <section className="relative overflow-hidden">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-blue-50/30 p-4 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-md"
      >
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Visual Showcase (Left on desktop, stacked on mobile) */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Top Category Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/95 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                <Sparkles size={12} />
                Featured Insight
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-semibold text-slate-200 backdrop-blur-md border border-white/10">
                {post.category}
              </span>
            </div>

            {/* Floating Live Metric Overlay Badges — matching UnBound X thesis ledger visual language */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3">
              <div className="rounded-xl border border-white/15 bg-slate-900/85 p-3 text-white backdrop-blur-md shadow-lg max-w-[200px] sm:max-w-[240px]">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span>Ledger Status</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-400">Target Standard</span>
                  <span className="font-bold text-white text-sm">10-sec answer</span>
                </div>
              </div>

              {post.keyStats && post.keyStats.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-blue-950/80 px-3.5 py-2 text-white backdrop-blur-md shadow-lg">
                  <TrendingUp size={15} className="text-blue-400" />
                  <div className="text-left">
                    <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                      {post.keyStats[0].label}
                    </p>
                    <p className="text-sm font-bold text-white">{post.keyStats[0].value}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editorial Content (Right on desktop) */}
          <div className="flex flex-col justify-between lg:py-2">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="font-bold tracking-wider text-blue-600 uppercase">
                  {post.tag}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Clock size={13} className="text-slate-400" />
                  {post.readTime}
                </span>
                <span>•</span>
                <span className="text-slate-500">{post.date}</span>
              </div>

              <h2 className="display mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-[1.15]">
                <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 lg:line-clamp-4">
                {post.summary}
              </p>

              {/* Author Strip */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-xs">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{post.author.name}</h4>
                  <p className="text-xs text-slate-500">{post.author.role}</p>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-7 flex items-center justify-between pt-2">
              <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)] transition-all duration-200 group-hover:bg-blue-700 group-hover:shadow-[0_14px_30px_rgba(37,99,235,0.35)]">
                <span>Read full briefing</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {post.category} · Masterclass
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
