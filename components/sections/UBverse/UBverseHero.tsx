"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function UBverseHero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center items-center pt-28 pb-14 lg:pt-36 lg:pb-20 overflow-hidden bg-blue-50">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
        style={{
          backgroundImage: "radial-gradient(#64748b 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, #000 60%, transparent 100%)",
        }}
      />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-blue-400/10 blur-[100px] rounded-pill pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1140px] px-4 sm:px-6 text-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center justify-center"
        >
          <span className="inline-flex items-center rounded-pill border border-slate-200/90 bg-white/95 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-600 shadow-2xs backdrop-blur-xs">
            Private markets
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 min-[380px]:text-4xl sm:text-6xl lg:text-7xl leading-[1.08]"
        >
          Become a company <br />
          <span className="text-blue-600">worth backing.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mx-auto mt-6 max-w-[620px] text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal"
        >
          One place for your story, traction, and materials. Built so investors can understand your company and engage with it.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          {/* Primary Glow CTA — "Start your Company Space" routes to /platform */}
          <TransitionLink
            href="/platform"
            className="btn-pill-primary group w-full sm:w-auto pl-5 pr-2 min-[360px]:pl-7 min-[360px]:pr-2.5 py-2 text-xs min-[360px]:text-sm cursor-pointer"
          >
            <span>Start your Company Space</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-white/20 group-hover:bg-white/30 transition-colors">
              <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </span>
          </TransitionLink>

          {/* Secondary Down Arrow Link — in-page scroll to the company Space preview, not the dashboard */}
          <Link
            href="/ubverse#raising"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 group"
          >
            <span>Explore companies</span>
            <ArrowDown className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-900 group-hover:translate-y-0.5 transition-all" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}