"use client";

import { useEffect, useState } from "react";
import { Eye, Sparkles } from "lucide-react";
import { GrowthChartIcon } from "@/components/ui/CustomIcons";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const closes = ["up", "down", "up", "up", "down", "up", "down", "up", "up", "down"] as const;

const fullAiResponse =
  "Thesis validation depends on data center gross margins staying above 74% and hyperscaler backlog delivery tracking through Q4. Watch the forthcoming 10-Q filing and supplier commentary; both must confirm sustained capacity allocation for the target price to remain viable.";

export function BeyondFeed() {
  return (
    <section id="beyond-the-feed" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-50/80 px-5 py-20 sm:py-28 border-b border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-indigo-100/30 blur-3xl" />

      <Reveal className="relative z-10 mx-auto max-w-[900px] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-4 py-1.5 text-xs font-semibold text-blue-800 shadow-2xs">
          <GrowthChartIcon size={14} className="text-blue-600" />
          <span>Beyond Social Feeds</span>
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
          Where investment theses <br />
          <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            stand on verifiable data.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Every call is tied to a concrete security, a transparent price target, a fixed timeline, and an uneditable record.
        </p>
      </Reveal>

      {/* Track Record Section */}
      <div className="relative z-10 mx-auto mt-16 grid max-w-[1100px] items-stretch gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-3 self-start">
            <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Permanent Ledger</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Audited Track Record
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Every closed thesis commits directly to your permanent public track record, including misses. Your accuracy rate, historical calls, and percentage variance are permanently verifiable by any observer.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="gb-interactive-card rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_45px_rgba(15,23,42,0.09)] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                JM
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-tight">Jacob Martin</p>
                <p className="text-xs text-slate-500 mt-0.5">@jmartin &middot; Verified Analyst</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 shrink-0">
              <Eye size={12} className="text-slate-500" /> Public Record
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <CountUp value={58} suffix="%" className="tabular-numbers text-4xl sm:text-5xl font-black text-slate-900 tracking-tight" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Verified Hit Rate</p>
              <p className="text-[11px] text-emerald-600 font-semibold">+14.2% vs Benchmark</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-100 pt-5 text-left">
            <div>
              <CountUp value={42} className="tabular-numbers text-lg sm:text-xl font-bold text-slate-900" />
              <p className="text-xs text-slate-500 mt-0.5">Theses closed</p>
            </div>
            <div>
              <CountUp value={24} className="tabular-numbers text-lg sm:text-xl font-bold text-emerald-600" />
              <p className="text-xs text-slate-500 mt-0.5">Target reached</p>
            </div>
            <div>
              <CountUp value={14} className="tabular-numbers text-lg sm:text-xl font-bold text-rose-500" />
              <p className="text-xs text-slate-500 mt-0.5">Missed, archived</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-micro font-bold uppercase tracking-wider text-slate-500">
              Outcome History (Last 10 Closes)
            </p>
            <div className="mt-2.5 flex gap-2">
              {closes.map((c, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${c === "up" ? "bg-emerald-500 shadow-xs shadow-emerald-500/30" : "bg-rose-500 shadow-xs shadow-rose-500/30"}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Catalyst & Research Section */}
      <div className="relative z-10 mx-auto mt-20 grid max-w-[1100px] items-stretch gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="flex flex-col justify-center">
          <CatalystTypewriterCard />
        </Reveal>

        <Reveal direction="right" delay={0.1} className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3 self-start">
            <Sparkles size={12} className="text-indigo-600" />
            <span>AI Diligence Engine</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Catalyst &amp; Filing Intelligence
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Correlate SEC filings, quarterly earnings disclosures, and operational catalysts with your valuation framework. Validate each core driver before committing your thesis to the permanent ledger.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CatalystTypewriterCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDisplayedText(fullAiResponse);
      setIsFinished(true);
      return;
    }
    if (!isInView) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullAiResponse.length) {
        setDisplayedText(fullAiResponse.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 18); 

    return () => clearInterval(interval);
  }, [isInView, reduce]);

  return (
    <div ref={cardRef} className="w-full">
      <div className="inline-flex max-w-full items-center gap-1.5 rounded-2xl sm:rounded-pill bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100/60 mb-3 shadow-2xs">
        <span className="break-words">Stress-test thesis: What key operating metrics must hold?</span>
      </div>

      <div className="flex gap-3 sm:gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-6 shadow-lg shadow-slate-900/5 min-h-[160px]">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-600">
          <Sparkles size={18} />
        </span>
        <div className="flex-1 flex flex-col justify-between">
          <p className="text-sm leading-relaxed text-slate-700 min-h-[72px]">
            {displayedText}
            {!isFinished && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 animate-pulse align-middle" />
            )}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: isFinished ? 1 : 0.4, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex gap-2"
          >
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
              SEC 10-Q Filing
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
              Earnings Call Transcript
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}