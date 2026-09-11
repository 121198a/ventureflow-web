"use client";

import { useEffect, useState } from "react";
import { Eye, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const closes = ["up", "down", "up", "up", "down", "up", "down", "up", "up", "down"] as const;

const fullAiResponse =
  "It rests on data center orders staying tight through year end. Watch the Q3 print and hyperscaler capex guidance; both need to hold the pace for the target to be live.";

export function BeyondFeed() {
  return (
    <section id="beyond-the-feed" className="scroll-mt-24 gb-subtle-grid relative overflow-hidden bg-slate-50/70 px-5 py-20 sm:py-28 border-b border-slate-100">
      <Reveal className="mx-auto max-w-[900px] text-center">
        <span className="inline-flex items-center rounded-pill border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-xs">
          Beyond the feed
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
          Where a thesis <span className="text-blue-600">goes to work.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-600 leading-relaxed">
          Everything below starts from the same object: a call with a target, a horizon, and your name on it.
        </p>
      </Reveal>

      {/* Track Record Section */}
      <div className="mx-auto mt-16 grid max-w-[1100px] items-stretch gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Your record</h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Every closed thesis becomes part of your public record, including misses. Your hit rate, past calls, and results stay available on your profile.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="gb-interactive-card rounded-lg border border-slate-200 bg-white p-5 sm:p-7 shadow-lg shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="h-10 w-10 rounded-pill bg-cover bg-center shadow-xs shrink-0"
                style={{ backgroundImage: "url(https://i.pravatar.cc/100?img=11)" }}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-tight">Jacob Martin</p>
                <p className="text-xs text-slate-600">@jmartin</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-slate-200/80 bg-slate-50/50 px-3 py-1 text-xs font-medium text-slate-600 shrink-0">
              <Eye size={12} className="text-slate-600" /> Open to anyone
            </span>
          </div>

          <div className="mt-6">
            <CountUp value={58} suffix="%" className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mt-1">Hit Rate</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-100 pt-5 text-left">
            <div>
              <CountUp value={42} className="text-lg sm:text-xl font-bold text-slate-900" />
              <p className="text-xs text-slate-600 mt-0.5">Theses closed</p>
            </div>
            <div>
              <CountUp value={24} className="text-lg sm:text-xl font-bold text-emerald-600" />
              <p className="text-xs text-slate-600 mt-0.5">Hit</p>
            </div>
            <div>
              <CountUp value={14} className="text-lg sm:text-xl font-bold text-rose-500" />
              <p className="text-xs text-slate-600 mt-0.5">Missed, all readable</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-micro font-bold uppercase tracking-wider text-slate-600">
              Last 10 closes
            </p>
            <div className="mt-2.5 flex gap-2">
              {closes.map((c, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-pill ${c === "up" ? "bg-emerald-500" : "bg-rose-500"}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Zenith AI Live Typing Section */}
      <div className="mx-auto mt-20 grid max-w-[1100px] items-stretch gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="flex flex-col justify-center">
          <ZenithTypewriterCard />
        </Reveal>

        <Reveal direction="right" delay={0.1} className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Zenith</h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Ask Zenith about a filing, earnings report, company, or market event. Use the response to research an idea before turning it into a thesis.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ZenithTypewriterCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
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
  }, [isInView]);

  return (
    <div ref={cardRef} className="w-full">
      <div className="inline-flex max-w-full items-center gap-1.5 rounded-2xl sm:rounded-pill bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100/60 mb-3 shadow-2xs">
        <span className="break-words">Analyze this NVDA thesis. What needs to hold?</span>
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
              10-Q
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
              Q2 earnings call
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}