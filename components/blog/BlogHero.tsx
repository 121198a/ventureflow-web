"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { ComplianceShieldIcon } from "@/components/ui/CustomIcons";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/constants";

interface BlogHeroProps {
  totalArticles: number;
}

export function BlogHero({ totalArticles }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14">
      {/* Background ambient lighting matching UnBound X brand */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="gb-subtle-grid absolute inset-0 opacity-40" />
        <div className="gb-gradient-blob absolute -top-24 left-1/2 -translate-x-1/2 h-[340px] w-[500px] rounded-full bg-blue-500/15" />
        <div className="gb-gradient-blob absolute top-20 right-10 h-[280px] w-[280px] rounded-full bg-emerald-500/10" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Eyebrow Pill */}
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-700 uppercase backdrop-blur-md shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>UnBound X Editorial · Market Intelligence</span>
          </div>
        </Reveal>

        {/* Hero Title */}
        <Reveal delay={0.08}>
          <h1 className="display mt-6 text-[clamp(2.3rem,6vw,4.5rem)] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Where investment ideas
            <br />
            meet <span className="text-blue-600">verified records.</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Deep-dive briefings on thesis-driven investing, cap table math,
            venture mechanics, and market signals—written by the operators and
            analysts building {site.name}.
          </p>
        </Reveal>

        {/* Trust & Signal Highlights */}
        <Reveal delay={0.24}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-y border-slate-200/70 py-4 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ComplianceShieldIcon size={16} className="text-emerald-600" />
              <span>Immutable Public Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span>Zero Hindsight Revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              <span>{totalArticles} In-Depth Briefings</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
