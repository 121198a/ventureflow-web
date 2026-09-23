/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Bell,
  ThumbsUp,
  MessageCircle,
  Compass,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { AmbientLight } from "@/components/motion/AmbientLight";
import { cn } from "@/lib/utils";

const phrases = [
  "semiconductor capex cycles.",
  "energy infrastructure demand.",
  "enterprise cloud adoption.",
  "central bank rate shifts.",
  "commercial aerospace backlogs.",
];

export function StartRecord() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activePhoneIndex, setActivePhoneIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const speed = isDeleting ? 30 : 65;
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  const phones = [
    {
      id: "feed",
      label: "Thesis Feed",
      theme: "feed" as const,
      time: "12:26",
      content: <FeedMini />,
    },
    {
      id: "verdict",
      label: "Audited Record",
      theme: "thesis" as const,
      time: "12:27",
      content: <VerdictMini />,
    },
    {
      id: "invest",
      label: "Execution",
      theme: "invest" as const,
      time: "12:28",
      content: <InvestMini />,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-5 pt-20 sm:pt-28 pb-28 sm:pb-36 lg:pb-44 border-t border-slate-200/80">
      {/* Ambient background lighting */}
      <AmbientLight color="rgba(37, 99, 235, 0.07)" size={550} intensity={0.9} />

      <div className="relative z-10 mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Three-Phone Mockup Showcase (Balanced Row on Desktop, Real Carousel on Mobile/Tablet) */}
        <Reveal direction="left" className="relative order-2 flex flex-col items-center py-6 lg:order-1">
          {/* Desktop Balanced 3-Phone Triptych (>= lg) */}
          <div
            className="relative hidden lg:flex items-center justify-center w-full h-[490px] xl:h-[515px]"
            style={{ perspective: 1200 }}
          >
            {/* Ambient Multi-layer Floating Floor Shadows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 left-1/2 h-16 w-[380px] -translate-x-1/2 rounded-full bg-slate-900/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-[280px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-xl"
            />

            {/* Left Phone (Audited Record / Verdict) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotateZ: [-6, -4.5, -6],
              }}
              transition={{
                y: { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 },
                rotateZ: { duration: 7.0, repeat: Infinity, ease: "easeInOut", delay: 0.1 },
              }}
              className="absolute left-4 xl:left-8 z-10 opacity-95"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(10deg) rotateX(6deg) rotateZ(-5.5deg) translateZ(-35px) scale(0.92)",
              }}
            >
              <PhoneFrame
                theme="thesis"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:26"
                batteryPercentage="92%"
                className="w-[220px] xl:w-[235px]"
              >
                <VerdictMini />
              </PhoneFrame>
            </motion.div>

            {/* Center Phone (Foreground Thesis Formulation Feed) */}
            <motion.div
              animate={{
                y: [0, -7, 0],
                rotateZ: [0, 0.5, 0],
              }}
              transition={{
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative z-20"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-2deg) rotateX(4deg) translateZ(15px)",
              }}
            >
              <PhoneFrame
                theme="feed"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:26"
                batteryPercentage="92%"
                className="w-[230px] xl:w-[245px] shadow-2xl"
              >
                <FeedMini />
              </PhoneFrame>
            </motion.div>

            {/* Right Phone (Invest & Execution Performance) */}
            <motion.div
              animate={{
                y: [0, -9, 0],
                rotateZ: [6, 7.5, 6],
              }}
              transition={{
                y: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
                rotateZ: { duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
              }}
              className="absolute right-4 xl:right-8 z-10 opacity-95"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-10deg) rotateX(6deg) rotateZ(6deg) translateZ(-35px) scale(0.92)",
              }}
            >
              <PhoneFrame
                theme="invest"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:26"
                batteryPercentage="92%"
                className="w-[220px] xl:w-[235px]"
              >
                <InvestMini />
              </PhoneFrame>
            </motion.div>
          </div>

          {/* Mobile & Tablet Interactive Carousel (< lg) */}
          <div className="flex flex-col items-center w-full lg:hidden">
            {/* Carousel Active Phone */}
            <div className="relative flex items-center justify-center w-full py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phones[activePhoneIndex].id}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20 flex justify-center"
                >
                  <PhoneFrame
                    theme={phones[activePhoneIndex].theme}
                    showWifi={true}
                    showStatusBar={true}
                    showHomeIndicator={true}
                    time={phones[activePhoneIndex].time}
                    className="w-[220px] min-[380px]:w-[240px] sm:w-[260px] shadow-xl"
                  >
                    {phones[activePhoneIndex].content}
                  </PhoneFrame>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Arrows for Tablet & Mobile Touch Navigation */}
              <button
                type="button"
                onClick={() =>
                  setActivePhoneIndex((prev) => (prev === 0 ? phones.length - 1 : prev - 1))
                }
                className="absolute left-0 sm:left-4 z-30 grid size-9 place-items-center rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus-ring cursor-pointer"
                aria-label="Previous phone preview"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePhoneIndex((prev) => (prev === phones.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-0 sm:right-4 z-30 grid size-9 place-items-center rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus-ring cursor-pointer"
                aria-label="Next phone preview"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Interactive Carousel Pagination Tabs & Dots */}
            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80">
                {phones.map((phone, idx) => (
                  <button
                    key={phone.id}
                    type="button"
                    onClick={() => setActivePhoneIndex(idx)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                      activePhoneIndex === idx
                        ? "bg-white text-blue-700 shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {phone.label}
                  </button>
                ))}
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 mt-1">
                {phones.map((phone, idx) => (
                  <button
                    key={phone.id}
                    type="button"
                    onClick={() => setActivePhoneIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all cursor-pointer",
                      activePhoneIndex === idx ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    )}
                    aria-label={`Go to ${phone.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Live Auto-Typing Dynamic Heading */}
        <Reveal direction="right" delay={0.1} className="order-1 text-center lg:order-2 lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs mb-4">
            <span>Instant Thesis Formulation</span>
          </span>

          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            Your first thesis could be about <br />
            <span className="inline-block text-blue-600 font-black min-h-[1.25em]">
              {text}
              <span className="animate-pulse text-blue-600 font-normal">|</span>
            </span>
          </h2>

          <p className="mt-4 max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            You do not need capital under management to build an institutional track record. You need an underlying argument, a target price, and a timeframe.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <Magnetic strength={0.2}>
              <AuthButton
                flow="signup"
                icon={false}
                className="btn-pill-primary px-8"
              >
                <span>Start your record</span>
                <ArrowRight size={16} />
              </AuthButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeedMini() {
  const stories = [
    {
      id: "all",
      name: "All",
      time: "For you",
      isAll: true,
    },
    {
      id: "riley",
      name: "Riley",
      time: "Just now",
      badge: "1",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "casey",
      name: "Casey",
      time: "1m ago",
      badge: "3",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "jordan",
      name: "Jordan",
      time: "30m ago",
      badge: "2",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "avery",
      name: "Avery",
      time: "1h ago",
      badge: "1",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between bg-white text-slate-900 select-none overflow-hidden">
      {/* Scrollable feed area */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Top App Header */}
        <div className="flex items-center justify-between px-3 pt-1 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Menu size={15} className="text-slate-800 cursor-pointer" />
            <span className="text-xs font-bold text-slate-900 tracking-tight">Home</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Search size={14} className="cursor-pointer hover:text-slate-900" />
            <Bell size={14} className="cursor-pointer hover:text-slate-900" />
          </div>
        </div>

        {/* Tab Pills: For You, Spaces, Saved */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-100">
          <span className="rounded-full bg-blue-100/80 px-3 py-0.5 text-[10px] font-bold text-blue-700 shadow-2xs">
            For You
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:text-slate-900">
            Spaces
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:text-slate-900">
            Saved
          </span>
        </div>

        {/* Stories / User Avatars Ribbon */}
        <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-slate-100/60">
          {stories.map((story) => (
            <div key={story.id} className="flex shrink-0 flex-col items-center gap-0.5 text-center">
              {story.isAll ? (
                <div className="relative size-7 rounded-full p-[1.5px] ring-2 ring-blue-600">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d2247] text-white">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3">
                      <rect x="2" y="2" width="5" height="5" rx="1" />
                      <rect x="9" y="2" width="5" height="5" rx="1" />
                      <rect x="2" y="9" width="5" height="5" rx="1" />
                      <rect x="9" y="9" width="5" height="5" rx="1" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="relative size-7 rounded-full ring-1 ring-slate-200">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="h-full w-full rounded-full object-cover"
                    loading="lazy"
                  />
                  {story.badge && (
                    <span className="absolute -bottom-0.5 -right-0.5 grid size-3.5 place-items-center rounded-full bg-blue-600 text-[8px] font-bold text-white ring-1 ring-white">
                      {story.badge}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-900 leading-none">{story.name}</span>
              <span className="text-[7.5px] text-slate-500 leading-none">{story.time}</span>
            </div>
          ))}
        </div>

        {/* Feed Posts */}
        <div className="space-y-2 p-2.5">
          {/* Post 1 - Marcelo Hernandez ($BTC Bullish / On track) */}
          <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Marcelo Hernandez"
                  className="size-5 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-[10px] font-bold text-slate-900 leading-tight">Marcelo Hernandez</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">@marcelohernandez</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-slate-400">
                <span>2h</span>
                <span className="text-slate-500">⋮</span>
              </div>
            </div>

            <p className="mt-1 text-[10px] font-bold text-slate-900 leading-snug line-clamp-1">
              I&apos;ve been reflecting on the ongoing discussions about the A.I. Bubble, and here&apos;s my perspective&hellip;
            </p>
            <p className="mt-0.5 text-[8.5px] text-slate-600 leading-snug line-clamp-2">
              In the past five years, we&apos;ve seen an unprecedented influx of retail investors into the market, driven by a desire for n&hellip;
            </p>

            {/* Target & Horizon Bar */}
            <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1 border border-slate-100 text-[9px]">
              <div className="flex items-center gap-2">
                <span>Target <b className="text-slate-900 font-bold">$280</b></span>
                <span className="text-slate-300">|</span>
                <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
              </div>
              <Compass size={11} className="text-blue-500" />
            </div>

            {/* Stats Row */}
            <div className="mt-1.5 flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp size={9} /> 100
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle size={9} /> 734
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[8.5px] font-semibold text-emerald-600">
                  <span className="size-1 rounded-full bg-emerald-500" /> On track
                </span>
                <span className="rounded bg-slate-100 px-1 py-0.2 text-[8px] font-bold text-slate-700">
                  $BTC
                </span>
                <span className="rounded bg-emerald-50 border border-emerald-200/80 px-1 py-0.2 text-[8px] font-bold text-emerald-700">
                  Bullish
                </span>
              </div>
            </div>
          </div>

          {/* Post 2 - Marcelo Hernandez ($BTC Bearish / Off track) */}
          <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Marcelo Hernandez"
                  className="size-5 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-[10px] font-bold text-slate-900 leading-tight">Marcelo Hernandez</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">@marcelohernandez</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-slate-400">
                <span>2h</span>
                <span className="text-slate-500">⋮</span>
              </div>
            </div>

            <p className="mt-1 text-[10px] font-bold text-slate-900 leading-snug line-clamp-1">
              I&apos;ve been reflecting on the ongoing discussions about the A.I. Bubble, and here&apos;s my perspective&hellip;
            </p>
            <p className="mt-0.5 text-[8.5px] text-slate-600 leading-snug line-clamp-2">
              In the past five years, we&apos;ve seen an unprecedented influx of retail investors into the market, driven by a desire for n&hellip;
            </p>

            {/* Target & Horizon Bar */}
            <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1 border border-slate-100 text-[9px]">
              <div className="flex items-center gap-2">
                <span>Target <b className="text-slate-900 font-bold">$280</b></span>
                <span className="text-slate-300">|</span>
                <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
              </div>
              <Compass size={11} className="text-blue-500" />
            </div>

            {/* Stats Row */}
            <div className="mt-1.5 flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp size={9} /> 100
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle size={9} /> 734
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[8.5px] font-semibold text-amber-600">
                  <span className="size-1 rounded-full bg-amber-500" /> Off track
                </span>
                <span className="rounded bg-slate-100 px-1 py-0.2 text-[8px] font-bold text-slate-700">
                  $BTC
                </span>
                <span className="rounded bg-rose-50 border border-rose-200/80 px-1 py-0.2 text-[8px] font-bold text-rose-700">
                  Bearish
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) with gradient glow */}
      <div className="absolute bottom-11 right-2.5 z-20">
        <div className="relative flex size-8 items-center justify-center rounded-full bg-[#0a0f1d] text-white shadow-lg ring-2 ring-orange-500/80 shadow-orange-500/25 cursor-pointer">
          <Plus size={15} strokeWidth={2.6} />
        </div>
      </div>

      {/* Bottom Phone Navigation */}
      <div className="relative z-10 shrink-0 border-t border-slate-100 bg-white py-1 px-2">
        <div className="grid grid-cols-4 text-center items-center">
          <div className="flex flex-col items-center gap-[1px] text-blue-600">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span className="text-[9px] font-bold">Social</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
            <span className="text-[9px] font-medium">Invest</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
            <span className="text-[9px] font-medium">Compete</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
              alt="Profile"
              className="size-3 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-[9px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestMini() {
  return (
    <div className="relative flex h-full flex-col justify-between bg-white text-slate-900 select-none overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-slate-900 tracking-tight">Portfolio Execution</p>
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-semibold text-slate-600">
            Live
          </span>
        </div>

        {/* Portfolio Value Card with Curve */}
        <div className="mt-2 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-2 shadow-xs">
          <p className="text-[9px] text-slate-500 font-medium">Total Execution Value</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <p className="text-lg font-black text-slate-900 tracking-tight">$142,500.00</p>
            <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
              +28.4%
            </span>
          </div>

          <div className="mt-1 h-12 w-full overflow-hidden">
            <svg viewBox="0 0 180 50" className="h-full w-full" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M2 42 C20 38 32 35 48 30 S72 32 88 22 S112 25 128 14 S152 16 165 9 S174 8 178 4"
                stroke="#2563eb"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 42 C20 38 32 35 48 30 S72 32 88 22 S112 25 128 14 S152 16 165 9 S174 8 178 4 L178 50 L2 50 Z"
                fill="url(#investGrad)"
              />
            </svg>
          </div>
        </div>

        {/* Active Positions */}
        <div className="mt-2 space-y-1.5">
          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="font-bold text-slate-900">$AMD &middot; Advanced Micro</span>
              <span className="font-bold text-emerald-600">+60.00%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[8px] text-slate-500">
              <span>Entry $500.00 &rarr; Target $800.00</span>
              <span className="rounded bg-emerald-50 text-emerald-700 font-semibold px-1">Reached</span>
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="font-bold text-slate-900">$NVDA &middot; NVIDIA</span>
              <span className="font-bold text-emerald-600">+20.00%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[8px] text-slate-500">
              <span>Entry $115.00 &rarr; Target $145.00</span>
              <span className="rounded bg-blue-50 text-blue-700 font-semibold px-1">On Track</span>
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-slate-100">
              <div className="h-full w-[72%] rounded-full bg-blue-600" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="font-bold text-slate-900">$BTC &middot; Bitcoin</span>
              <span className="font-bold text-emerald-600">+10.32%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[8px] text-slate-500">
              <span>Entry $62,000 &rarr; Target $75,000</span>
              <span className="rounded bg-blue-50 text-blue-700 font-semibold px-1">Active</span>
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-slate-100">
              <div className="h-full w-[50%] rounded-full bg-blue-600" />
            </div>
          </div>
        </div>

        {/* Smart Order Routing Seal */}
        <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 flex items-center justify-between text-[8px] text-slate-500">
          <span>Smart Order Routed</span>
          <span className="font-semibold text-slate-700">Zero Slippage</span>
        </div>
      </div>

      {/* Bottom Phone Navigation */}
      <div className="relative z-10 shrink-0 border-t border-slate-100 bg-white py-1 px-2">
        <div className="grid grid-cols-4 text-center items-center">
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span className="text-[9px] font-medium">Social</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-blue-600">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
            <span className="text-[9px] font-bold">Invest</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
            <span className="text-[9px] font-medium">Compete</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
              alt="Profile"
              className="size-3 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-[9px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerdictMini() {
  return (
    <div className="relative flex h-full flex-col justify-between bg-white text-slate-900 select-none overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-900 tracking-tight">Public Record</p>
          <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-emerald-700 font-bold text-[9px] flex items-center gap-1">
            <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
            Audited
          </span>
        </div>

        {/* Accuracy Banner Card */}
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/90 p-2 text-center shadow-xs">
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Hit Accuracy</p>
          <p className="text-2xl font-black text-blue-600 leading-tight my-0.5">68.4%</p>
          <p className="text-[9px] text-slate-500 font-medium">38 closed theses &middot; +32.4% avg alpha</p>
          
          {/* Mini monthly performance bar chart */}
          <div className="mt-1.5 flex items-end justify-center gap-1.5 h-5">
            <div className="w-2 bg-blue-500 rounded-t-sm h-[60%]" title="May: 60%" />
            <div className="w-2 bg-blue-500 rounded-t-sm h-[75%]" title="Jun: 75%" />
            <div className="w-2 bg-blue-500 rounded-t-sm h-[68%]" title="Jul: 68%" />
            <div className="w-2 bg-emerald-500 rounded-t-sm h-[82%]" title="Aug: 82%" />
            <div className="w-2 bg-blue-500 rounded-t-sm h-[70%]" title="Sep: 70%" />
            <div className="w-2 bg-emerald-500 rounded-t-sm h-[88%]" title="Oct: 88%" />
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="mt-2 space-y-1.5">
          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-[8px] font-bold text-white shadow-2xs">
                ✓
              </span>
              <div>
                <p className="text-[9.5px] font-bold text-slate-900 leading-tight">$NVDA Call &middot; MV</p>
                <p className="text-[8.5px] text-emerald-600 font-semibold">+24.8% Outcome</p>
              </div>
            </div>
            <span className="rounded bg-slate-100 px-1 py-0.5 text-[8px] font-medium text-slate-500">Locked</span>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-[8px] font-bold text-white shadow-2xs">
                ✓
              </span>
              <div>
                <p className="text-[9.5px] font-bold text-slate-900 leading-tight">$AMD Cycle &middot; AA</p>
                <p className="text-[8.5px] text-emerald-600 font-semibold">+60.0% Outcome</p>
              </div>
            </div>
            <span className="rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-200/60">Audited</span>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-blue-600 text-[8px] font-bold text-white shadow-2xs">
                ✓
              </span>
              <div>
                <p className="text-[9.5px] font-bold text-slate-900 leading-tight">TSLA Thesis &middot; ER</p>
                <p className="text-[8.5px] text-slate-500 font-semibold">Active &middot; 90d horizon</p>
              </div>
            </div>
            <span className="rounded bg-slate-100 px-1 py-0.5 text-[8px] font-medium text-slate-500">Tracking</span>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-[8px] font-bold text-white shadow-2xs">
                ✓
              </span>
              <div>
                <p className="text-[9.5px] font-bold text-slate-900 leading-tight">$PLTR Cloud &middot; PP</p>
                <p className="text-[8.5px] text-emerald-600 font-semibold">+22.4% Outcome</p>
              </div>
            </div>
            <span className="rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-200/60">Audited</span>
          </div>
        </div>

        {/* Cryptographic Ledger Seal */}
        <div className="mt-2 rounded-lg bg-blue-50/70 border border-blue-100 p-1 text-center">
          <p className="text-[8px] font-bold uppercase tracking-wider text-blue-800">SHA-256 Merkle Settlement</p>
          <p className="text-[7.5px] font-mono text-slate-500">Root: 0x8f4c9b2...3e19a4</p>
        </div>
      </div>

      {/* Bottom Phone Navigation */}
      <div className="relative z-10 shrink-0 border-t border-slate-100 bg-white py-1 px-2">
        <div className="grid grid-cols-4 text-center items-center">
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span className="text-[9px] font-medium">Social</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-blue-600">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
            <span className="text-[9px] font-bold">Invest</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
            <span className="text-[9px] font-medium">Compete</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-500">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
              alt="Profile"
              className="size-3 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-[9px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}