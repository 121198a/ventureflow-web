/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { FundingTargetIcon } from "@/components/ui/CustomIcons";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

const steps = [
  {
    title: "Formulate a thesis with a target and fixed horizon.",
    body: "State the core idea, the exact target price, and the deadline for proving it out.",
    chip: "Target $195.00 · Horizon 180d",
  },
  {
    title: "Benchmark progress against live market pricing.",
    body: "As trading days unfold, the community tracks whether key business catalysts play out as predicted.",
    chip: "Live Price Tracking Active",
  },
  {
    title: "Immutable verdict recorded upon horizon close.",
    body: "Hits and misses stay permanently on your public track record. Your reputation is built on real, audited results.",
    chip: "Verified Hit Recorded · +36.8%",
  },
];

export function ThesisJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActive(0);
    } else if (latest < 0.7) {
      setActive(1);
    } else {
      setActive(2);
    }
  });

  return (
    <div
      id="thesis"
      ref={containerRef}
      className="relative scroll-mt-24 h-[420vh] bg-white border-y border-slate-100"
    >
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 flex h-dvh w-full flex-col justify-between overflow-hidden px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-[86px] pb-3 sm:pb-5">
        {/* Header */}
        <div className="mx-auto max-w-[1120px] text-center shrink-0">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
              <FundingTargetIcon size={13} className="text-blue-600" />
              <span>One Thesis &middot; Start to Finish</span>
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-1.5 sm:mt-2 max-w-[800px] text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-tight text-slate-900 tracking-tight">
              Online, ideas never get a verdict. <br />
              <span className="text-blue-600">This one will</span>.
            </h2>
          </Reveal>
        </div>

        {/* Stepper + Phone Container */}
        <div className="mx-auto w-full max-w-[1020px] my-auto">
          {/* Mobile Stepper Tabs (< lg) */}
          <div className="flex flex-col items-center gap-1.5 lg:hidden mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    active === i
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <span>{i + 1}</span>
                  <span className="hidden min-[360px]:inline">{i === 0 ? "Argument" : i === 1 ? "Track" : "Verdict"}</span>
                </button>
              ))}
            </div>
            <div className="text-center px-2 max-w-sm">
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                {steps[active].title}
              </p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-pill border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-micro font-medium text-slate-600">
                {active === 1 && <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500 animate-pulse" />}
                {steps[active].chip}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-12 items-center">
            {/* Left Stepper (Desktop >= lg) */}
            <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between h-[280px] pl-2">
              <div
                className="absolute left-[15px] top-[14px] bottom-[18px] w-[2px] border-l-2 border-dotted border-slate-300 pointer-events-none"
                aria-hidden="true"
              />
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute left-[15px] top-[14px] bottom-[18px] w-[2px] bg-blue-600 origin-top pointer-events-none"
                aria-hidden="true"
              />

              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className="relative z-10 flex w-full items-start gap-4 text-left cursor-pointer group rounded-lg p-1 transition-colors focus-ring"
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  aria-pressed={active === i}
                >
                  <div className="flex items-center justify-center pt-1">
                    <span
                      className={cn(
                        "h-3.5 w-3.5 rounded-pill border-2 transition-all duration-300",
                        active >= i
                          ? "scale-125 border-blue-600 bg-blue-600 ring-4 ring-blue-100"
                          : "border-slate-300 bg-white group-hover:border-slate-400"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "transition-all duration-300 flex-1",
                      active === i ? "translate-x-0" : ""
                    )}
                  >
                    <h3
                      className={cn(
                        "text-base sm:text-lg font-bold tracking-tight leading-snug transition-colors",
                        active === i ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-0.5 max-w-md text-xs sm:text-sm leading-relaxed transition-colors",
                        active === i ? "text-slate-600" : "text-slate-500 group-hover:text-slate-600"
                      )}
                    >
                      {step.body}
                    </p>

                    {active === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-2"
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-pill border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                          {i === 1 && <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500 animate-pulse" />}
                          {step.chip}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Standard PhoneFrame with Thesis Theme */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <PhoneFrame
                theme="thesis"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:26"
                batteryPercentage="92%"
                className="w-[215px] min-[380px]:w-[230px] sm:w-[245px] lg:w-[255px] xl:w-[265px] shadow-2xl"
              >
                <div className="relative z-10 h-full w-full overflow-hidden bg-white flex flex-col justify-between">
                  {/* Top Action Bar (< and 3-dots) */}
                  <div className="flex h-[20px] shrink-0 items-center justify-between px-3 text-slate-900 pt-0.5">
                    <svg className="h-[13px] w-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 6-6 6 6 6" />
                    </svg>
                    <span className="flex h-[13px] w-[13px] flex-col items-center justify-center gap-[1.5px] text-slate-600">
                      <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                      <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                      <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                    </span>
                  </div>

                  {/* Article Content */}
                  <div className="px-3 pt-0.5 pb-2 text-left flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-xs font-medium text-slate-600"
                      >
                        Asset Thesis &middot; {active === 2 ? "6mo ago" : active === 1 ? "3mo ago" : "4h ago"}
                      </motion.div>
                    </AnimatePresence>

                    <h4 className="mt-0.5 text-xs font-bold leading-tight tracking-tight text-slate-900">
                      The Monopoly Tax: Why the Biggest Buyers on Earth Are Funding AMD&apos;s Rise
                    </h4>

                    <div className="mt-1 flex gap-1">
                      <span className="inline-flex items-center rounded-pill border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-800">
                        $AMD
                      </span>
                      <span className="inline-flex items-center rounded-pill border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Bullish
                      </span>
                    </div>

                    {/* Author Info Row */}
                    <div className="mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1">
                      <div>
                        <b className="block text-xs font-bold text-slate-900 leading-none">Arnav Awasthi</b>
                        <span className="text-xs text-slate-600">@arnav</span>
                      </div>
                      <div className="relative size-[22px] shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs">
                        <img
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                          alt="Arnav Awasthi profile avatar"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Editorial Paragraphs */}
                    <div className="mt-1.5 space-y-1 text-xs text-slate-600 leading-relaxed">
                      <p className="m-0">
                        On August 4, <span className="font-semibold text-blue-600">$AMD</span> reported the best quarter in the company&apos;s 57-year history. Revenue rose 50 percent to a record $11.5 billion. The data center business more than doubled. Adjusted earnings per share grew 82 percent.
                      </p>

                      <p className="m-0 flex items-center gap-1 font-semibold text-slate-900">
                        <i className="block h-[11px] w-[2px] shrink-0 rounded-pill bg-blue-600" />
                        <span>The stock fell 9 percent</span>
                      </p>

                      <p className="m-0">
                        That single sentence is the entire investment case, and the entire risk, compressed into one trading session. A company does not get punished for doubling its largest business unless the market has already paid for the doubling. Which means the only way to make money in <span className="font-semibold text-blue-600">$AMD</span> from here is to be right about something the crowd is not yet paying for.
                      </p>

                      <p className="m-0 text-xs text-slate-600">
                        There is exactly one such thing, and it is not a chip. It is the moment a monopoly becomes a duopoly, and it is worth more than any product cycle in this story.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Area (Action / Sheet / Navigation) */}
                  <div className="relative shrink-0">
                    {/* Step 0 Action Bar */}
                    <AnimatePresence>
                      {active === 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 bg-white px-3 py-1.5 flex items-center justify-between">
                            <div>
                              <span className="block text-[10px] font-medium text-slate-600">Since published</span>
                              <b className="block text-xs font-bold text-emerald-700">+5.00%</b>
                            </div>
                            <span className="inline-flex h-[24px] px-3 items-center justify-center rounded-pill bg-sky-50 text-[11px] font-bold text-sky-600 shadow-2xs">
                              View Price Target
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom Navigation */}
                    <div className="flex w-full justify-center bg-white pt-1 pb-1.5 border-t border-slate-100">
                      <div className="grid w-full grid-cols-4 px-2 text-center items-center">
                        <div className="flex flex-col items-center gap-[1px] text-blue-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                          <span className="text-[10px] font-bold">Social</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
                          <span className="text-[10px] font-semibold">Invest</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
                          <span className="text-[10px] font-semibold">Compete</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <div className="relative size-[14px] shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            <img
                              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                              alt="Profile avatar"
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-[10px] font-semibold">Profile</span>
                        </div>
                      </div>
                    </div>

                    {/* Sliding Bottom Sheet for Step 1 and 2 (Image 2 and Image 3) */}
                    <div
                      className={cn(
                        "sheet absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-2xl shadow-xl transition-transform duration-500 ease-out flex flex-col text-left px-3 pt-1.5 pb-2.5 border-t border-slate-200/90",
                        active > 0 ? "translate-y-0" : "translate-y-[105%]"
                      )}
                    >
                      {/* Drag handle */}
                      <div className="w-8 h-1 rounded-full bg-slate-300 mx-auto mb-1.5 mt-0.5 shrink-0" />

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          {/* AMD Bullish + Current Price */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                                AMD <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Bullish</span>
                              </p>
                              <p className="text-[10px] text-slate-600 leading-none mt-0.5">Advanced Micro Devices</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-600 leading-tight">Current price</p>
                              <p className="text-xs font-bold text-slate-900 leading-tight">
                                ${active === 2 ? "800.00" : "620.00"}
                              </p>
                            </div>
                          </div>

                          {/* Banner (Price Moving With Thesis or Target Reached, Thesis Closed) */}
                          <div
                            className={cn(
                              "mt-1.5 flex items-center justify-center gap-1.5 rounded-lg py-1 px-2 text-xs font-bold",
                              active === 2
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            )}
                          >
                            <span className="grid size-3.5 place-items-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shrink-0">
                              {active === 2 ? "✓" : "↑"}
                            </span>
                            <span className="text-[11px] leading-tight font-bold">
                              {active === 2 ? "Target Reached, Thesis Closed" : "Price Moving With Thesis"}
                            </span>
                          </div>

                          {/* Progress bar section: Entry $500.00 - Target $800.00 */}
                          <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-700">
                            <span>Entry $500.00</span>
                            <span>Target $800.00</span>
                          </div>

                          <div className="relative mt-1 h-1.5 w-full rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                              style={{ width: active === 2 ? "100%" : "42%" }}
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-emerald-600 ring-2 ring-white transition-all duration-700 ease-out"
                              style={{ left: active === 2 ? "calc(100% - 6px)" : "42%" }}
                            />
                          </div>

                          <div className="mt-1 flex justify-between text-[9px] text-slate-600">
                            <span>Published Aug 14</span>
                            <span>{active === 2 ? "6 of 6 mo elapsed" : "3 of 6 months elapsed"}</span>
                          </div>

                          {/* Two stat cards */}
                          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                            <div className="rounded-lg bg-slate-50 border border-slate-100 p-1.5">
                              <p className="text-[9px] text-slate-600 leading-tight">Return since publish</p>
                              <p className="text-xs font-bold text-emerald-700 leading-tight mt-0.5">
                                +{active === 2 ? "60.00" : "24.00"}%
                              </p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-100 p-1.5">
                              <p className="text-[9px] text-slate-600 leading-tight">{active === 2 ? "Result" : "Distance to target"}</p>
                              <p className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
                                {active === 2 ? "Reached" : "60.00% left"}
                              </p>
                            </div>
                          </div>

                          {/* View $AMD Button */}
                          <div className="mt-2 w-full rounded-xl bg-slate-950 py-1.5 text-center text-xs font-bold text-white shadow-xs hover:bg-slate-900 transition-colors cursor-pointer">
                            View $AMD
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </div>
        </div>

        {/* Bottom safety gap */}
        <div className="h-1 shrink-0" />
      </div>
    </div>
  );
}