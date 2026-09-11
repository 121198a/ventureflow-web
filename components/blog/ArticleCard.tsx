"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  post: BlogPost;
  variant?: "standard" | "horizontal" | "editorial" | "compact";
  className?: string;
  showImage?: boolean;
}

export function ArticleCard({
  post,
  variant = "standard",
  className = "",
  showImage = true,
}: ArticleCardProps) {
  // 1. Horizontal variant (used in Trending list on the right side)
  if (variant === "horizontal") {
    return (
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "group relative flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-blue-300/80 hover:shadow-[0_14px_30px_rgba(37,99,235,0.08)]",
          className
        )}
      >
        {showImage && (
          <div className="relative h-44 sm:h-auto sm:w-44 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 backdrop-blur-xs shadow-2xs">
              {post.category}
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-blue-600">{post.tag}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                {post.readTime}
              </span>
            </div>

            <h3 className="mt-2 text-base sm:text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
              <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                <span className="absolute inset-0" aria-hidden="true" />
                {post.title}
              </Link>
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {post.summary}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="relative h-5 w-5 overflow-hidden rounded-full border border-slate-200">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-slate-700">{post.author.name}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
              Read more
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  // 2. Editorial variant (used for high-impact thematic insight cards)
  if (variant === "editorial") {
    return (
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)]",
          className
        )}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              {post.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">{post.readTime}</span>
          </div>

          <h3 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 leading-snug">
            <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {post.summary}
          </p>

          {post.keyStats && post.keyStats.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100/70 p-3 border border-slate-200/60">
              {post.keyStats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <p className="text-[11px] font-medium text-slate-500">{stat.label}</p>
                  <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-slate-200">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-slate-800">{post.author.name}</span>
              <span className="text-slate-400 ml-1">· {post.date}</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
            Read article
            <ArrowUpRight size={14} />
          </span>
        </div>
      </motion.article>
    );
  }

  // 3. Compact variant (minimal metadata, good for sidebar or quick links)
  if (variant === "compact") {
    return (
      <article
        className={cn(
          "group relative flex items-start gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-slate-200 hover:bg-slate-50/70",
          className
        )}
      >
        {showImage && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-semibold text-blue-600">{post.category}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <h4 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h4>
        </div>
      </article>
    );
  }

  // 4. Standard card (default for the 3-column recent grid & filter grid)
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-blue-300/90 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <div>
        {showImage && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-xs shadow-xs">
                {post.category}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 drop-shadow-xs">
              <span className="font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                {post.tag}
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{post.author.name}</span>
            <span>{post.date}</span>
          </div>

          <h3 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h3>

          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {post.summary}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3.5 sm:px-6 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Published on UnBound X
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
          Read more
          <ArrowRight size={13} />
        </span>
      </div>
    </motion.article>
  );
}
