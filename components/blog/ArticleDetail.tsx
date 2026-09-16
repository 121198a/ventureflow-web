"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Sparkles,
} from "lucide-react";
import { ComplianceShieldIcon, FundingRoundCalendarIcon } from "@/components/ui/CustomIcons";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Reveal } from "@/components/motion/Reveal";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { AuthButton } from "@/components/ui/AuthButton";
import type { BlogPost } from "@/types/blog";

interface ArticleDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function ArticleDetail({ post, relatedPosts }: ArticleDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${post.title} — via @UnBoundXapp`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const shareLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  return (
    <div className="relative">
      {/* 1. Top Breadcrumbs & Back Bar */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 pt-6 sm:pt-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to all briefings</span>
            </Link>

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">{post.category}</span>
            </nav>
          </div>
        </Reveal>
      </div>

      {/* 2. Article Header */}
      <header className="mx-auto max-w-4xl px-5 sm:px-6 pt-8 sm:pt-12 text-center">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <Sparkles size={12} />
              {post.category}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {post.tag}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <FundingRoundCalendarIcon size={12} className="text-slate-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="display mt-6 text-[clamp(2.1rem,5vw,3.6rem)] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            {post.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            {post.summary}
          </p>

          {/* Author & Publication Metadata */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-y border-slate-200/70 py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 shadow-2xs">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
                <p className="text-xs text-slate-500">{post.author.role}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="text-xs text-slate-500 text-left">
              <p className="font-semibold text-slate-700">Published</p>
              <p>{post.date} · UnBound X Editorial</p>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shareTwitter}
                aria-label="Share on X"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
              >
                <FaTwitter size={12} />
              </button>
              <button
                type="button"
                onClick={shareLinkedIn}
                aria-label="Share on LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-blue-700 transition-colors shadow-2xs cursor-pointer"
              >
                <FaLinkedinIn size={12} />
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy article link"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Reveal>
      </header>

      {/* 3. Hero Cover Image */}
      <div className="mx-auto max-w-5xl px-5 sm:px-6 mt-10">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
          </div>
        </Reveal>
      </div>

      {/* 4. Optional Key Stats Strip */}
      {post.keyStats && post.keyStats.length > 0 && (
        <div className="mx-auto max-w-3xl px-5 sm:px-6 mt-10">
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 shadow-xs">
              {post.keyStats.map((stat) => (
                <div key={stat.label} className="border-b sm:border-b-0 sm:border-r last:border-0 border-slate-200/70 pb-3 sm:pb-0 sm:pr-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">{stat.change}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      )}

      {/* 5. Article Long-Form Body */}
      <main className="mx-auto max-w-3xl px-5 sm:px-6 py-12">
        <div className="space-y-6 sm:space-y-8 text-base sm:text-lg leading-[1.8] text-slate-800">
          {post.body.map((block, idx) => {
            switch (block.type) {
              case "p":
                return (
                  <p key={idx} className="leading-relaxed">
                    {block.text}
                  </p>
                );

              case "h2":
                return (
                  <h2
                    key={idx}
                    id={block.id}
                    className="display scroll-mt-24 pt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug border-t border-slate-100"
                  >
                    {block.text}
                  </h2>
                );

              case "h3":
                return (
                  <h3
                    key={idx}
                    className="display pt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900"
                  >
                    {block.text}
                  </h3>
                );

              case "quote":
                return (
                  <blockquote
                    key={idx}
                    className="my-8 rounded-2xl border-l-4 border-blue-600 bg-blue-50/40 p-6 sm:p-7 shadow-xs"
                  >
                    <p className="font-editorial text-lg sm:text-xl italic text-slate-900 leading-relaxed">
                      &ldquo;{block.text}&rdquo;
                    </p>
                    {block.citation && (
                      <cite className="mt-3 block text-xs sm:text-sm font-semibold not-italic text-slate-600">
                        — {block.citation}
                      </cite>
                    )}
                  </blockquote>
                );

              case "callout": {
                const variantClasses =
                  block.variant === "dark"
                    ? "bg-slate-900 text-white border-slate-800"
                    : block.variant === "signal"
                    ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                    : "bg-blue-50/60 text-slate-900 border-blue-200";

                return (
                  <div
                    key={idx}
                    className={`my-8 rounded-2xl border p-6 sm:p-7 shadow-xs ${variantClasses}`}
                  >
                    <div className="flex items-center gap-2">
                      <ComplianceShieldIcon
                        size={18}
                        className={
                          block.variant === "dark"
                            ? "text-blue-400"
                            : block.variant === "signal"
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }
                      />
                      <h4
                        className={`text-sm font-bold uppercase tracking-wider ${
                          block.variant === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        {block.title}
                      </h4>
                    </div>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                      {block.text}
                    </p>
                  </div>
                );
              }

              case "table":
                return (
                  <div key={idx} className="my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                          <tr>
                            <th className="py-3.5 px-4 font-bold">{block.columns[0]}</th>
                            <th className="py-3.5 px-4 font-bold">{block.columns[1]}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 font-medium text-slate-900">{row[0]}</td>
                              <td className="py-3 px-4 text-slate-600">{row[1]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );

              case "recap":
                return (
                  <div key={idx} className="my-8 rounded-2xl border border-slate-200/90 bg-slate-50 p-6 sm:p-7">
                    <h4 className="text-base font-bold text-slate-900">{block.heading}</h4>
                    <ul className="mt-4 space-y-3">
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-semibold text-slate-900">{item.bold} </strong>
                            <span className="text-slate-600">{item.rest}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              case "checklist":
                return (
                  <div key={idx} className="my-8 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 sm:p-7">
                    <h4 className="text-base font-bold text-slate-900">{block.heading}</h4>
                    <ul className="mt-4 space-y-2.5">
                      {block.items.map((item, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white text-[11px] font-bold shrink-0 mt-0.5">
                            {cIdx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* 6. Author Bio Card */}
        <div className="mt-14 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{post.author.name}</h4>
                  <p className="text-xs font-semibold text-blue-600">{post.author.role} · UnBound X</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Author Profile
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* 7. Action CTA Box */}
        <div className="mt-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg shadow-blue-600/15 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Test your market thesis on UnBound X
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-blue-100">
              Put your price targets and horizon settlement on the public ledger. Free, immutable, and verified.
            </p>
          </div>
          <AuthButton
            flow="signup"
            icon={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-slate-100 active:scale-98 shadow-md"
          >
            <span>Start your record</span>
            <ArrowRight size={14} />
          </AuthButton>
        </div>
      </main>

      {/* 8. Related Articles */}
      <RelatedArticles posts={relatedPosts} currentCategory={post.category} />

      {/* 9. Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
