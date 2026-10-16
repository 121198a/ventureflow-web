/* eslint-disable @next/next/no-img-element */
"use client";

import {
  motion,
  useAnimationControls,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  ChevronDown,
  Menu,
  Search,
  Bell,
  ThumbsUp,
  MessageCircle,
  Plus,
} from "lucide-react";
import {
  ComplianceShieldIcon,
  FundingTargetIcon,
  GrowthChartIcon,
  PartnershipRingsIcon,
} from "@/components/ui/CustomIcons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiTesla } from "react-icons/si";
import { ImAppleinc } from "react-icons/im";

import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import { scrollToTarget } from "@/providers/SmoothScrollProvider";
import { AmbientLight } from "@/components/motion/AmbientLight";
import { Magnetic } from "@/components/motion/Magnetic";

const cardBase = "hero-proof-card";

type Card = {
  key: string;
  desktop: string;
  side: "left" | "right";
  body: ReactNode;
};

// Precise emergence configuration mapping cards back to their physical depth plane on the phone
const cardEmergeConfig: Record<
  string,
  {
    originX: number;
    originY: number;
    rotateY: number;
    rotateZ: number;
    delay: number;
  }
> = {
  // Phase 2: First LEFT card emerges from phone's left depth plane
  google: { originX: 120, originY: 20, rotateY: 14, rotateZ: -2, delay: 0.28 },
  // Phase 3: First RIGHT card emerges from phone's right depth plane
  apple: { originX: -120, originY: 20, rotateY: -14, rotateZ: 2, delay: 0.48 },
  // Phase 4: Second LEFT card emerges
  tesla: { originX: 130, originY: -5, rotateY: 13, rotateZ: -1.5, delay: 0.68 },
  // Phase 5: Second RIGHT card emerges
  research: { originX: -130, originY: -5, rotateY: -13, rotateZ: 1.5, delay: 0.88 },
  // Phase 6: Third LEFT card emerges
  space: { originX: 140, originY: -20, rotateY: 12, rotateZ: -1.5, delay: 1.08 },
  // Phase 7: Third RIGHT card emerges
  rank: { originX: -120, originY: -20, rotateY: -12, rotateZ: 1.5, delay: 1.28 },
};

const cards: Card[] = [
  {
    key: "google",
    side: "left",
    desktop: "top-4 lg:-left-28 xl:-left-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified Hit</p>
          <GrowthChartIcon size={13} className="text-emerald-700" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <FcGoogle size={15} />
          ALPHABET
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$185.00</span>
        </p>
        <p className="text-xs text-slate-600">Horizon: 180d</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-700">
          <span>+24.8% reached</span>
        </p>
      </>
    ),
  },
  {
    key: "apple",
    side: "right",
    desktop: "top-3 lg:-right-28 xl:-right-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Active Call</p>
          <FundingTargetIcon size={13} className="text-blue-700" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <ImAppleinc size={14} />
          APPLE
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$235.00</span>
        </p>
        <p className="text-xs text-slate-600">Horizon: 120d</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-blue-700">
          <span>Benchmarked Live</span>
        </p>
      </>
    ),
  },
  {
    key: "tesla",
    side: "left",
    desktop: "top-1/3 lg:-left-28 xl:-left-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Analyst Space</p>
          <PartnershipRingsIcon size={14} className="text-slate-600" />
        </div>
        <p className="mt-1 text-xs font-bold text-slate-900 truncate">Horizon Capital</p>
        <p className="mt-1 text-xs text-slate-600 leading-snug">
          18 analysts reviewing 4 open valuation models
        </p>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-800">
            <SiTesla className="text-red-500" size={12} aria-hidden="true" />
            TSLA Thesis
          </span>
          <span className="text-slate-600 font-medium">Active</span>
        </div>
      </>
    ),
  },
  {
    key: "research",
    side: "right",
    desktop: "top-1/3 lg:-right-28 xl:-right-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <p className="text-xs font-bold text-blue-700">Filing Analysis</p>
        </div>
        <p className="mt-1 text-xs font-medium text-slate-700 leading-tight">
          Hyperscaler capex guidance confirms sustained accelerator procurement through Q4.
        </p>
      </>
    ),
  },
  {
    key: "space",
    side: "left",
    desktop: "bottom-6 lg:-left-28 xl:-left-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Space Activity</p>
        <p className="mt-1 text-xs font-bold text-blue-700">Bravo Investment Club</p>
        <p className="text-xs text-slate-600 mt-0.5">New semiconductor thesis submitted for committee review</p>
      </>
    ),
  },
  {
    key: "rank",
    side: "right",
    desktop: "bottom-5 lg:-right-28 xl:-right-24 hidden lg:block w-36 xl:w-40",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Public Record</p>
          <ComplianceShieldIcon size={14} className="text-blue-700" />
        </div>
        <p className="text-xs text-slate-600 mt-0.5">Audited accuracy</p>
        <p className="text-xl font-extrabold text-blue-700 tracking-tight leading-none my-1.5">68.4%</p>
        <p className="text-xs text-slate-600">Across 38 closed theses</p>
      </>
    ),
  },
];

export function Hero() {
  const reduce = useReducedMotion();
  const phoneControls = useAnimationControls();
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = mounted && Boolean(reduce);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Scroll synchronization using smooth Lenis integration
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const scrollTranslateY = useTransform(smoothScroll, [0, 1], [0, -32]);

  // Subtle 3D card layer parallax across scroll
  const topCardsParallax = useTransform(smoothScroll, [0, 1], [0, -12]);
  const midCardsParallax = useTransform(smoothScroll, [0, 1], [0, -22]);
  const btmCardsParallax = useTransform(smoothScroll, [0, 1], [0, -32]);

  const scrollYOffset = useTransform(scrollTranslateY, (val) => (!isDesktop || reducedMotion ? 0 : val));

  useEffect(() => {
    if (!mounted) return;
    if (reduce) {
      phoneControls.set({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
      });
      return;
    }

    let active = true;
    async function sequence() {
      if (isDesktop) {
        // Desktop: Smooth entrance settling at true 1:1 pixel grid for razor-sharp text
        await phoneControls.start({
          opacity: [0, 1],
          y: [32, 0],
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        });

        if (!active) return;

        // Clean, subtle vertical float without 3D rotation texture rasterization
        phoneControls.start({
          y: [0, -6, 0],
          transition: {
            y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          },
        });
      } else {
        // Mobile / Tablet: Controlled vertical fade-up with gentle float
        await phoneControls.start({
          opacity: [0, 1],
          y: [24, 0],
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        });

        if (!active) return;

        phoneControls.start({
          y: [0, -6, 0],
          transition: {
            y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
          },
        });
      }
    }

    sequence();

    return () => {
      active = false;
    };
  }, [phoneControls, reduce, mounted, isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="hero-section-hero"
    >
      {/* Dynamic Ambient Responsive Lighting */}
      <AmbientLight color="rgba(37, 99, 235, 0.08)" size={650} intensity={1} />

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-sky-50/50 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-blue-50/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2 lg:gap-14">
        {/* Left Intro Copy */}
        <Reveal as="header" className="relative z-20 text-center lg:text-left">
          <span className="badge-fintech">
            <ComplianceShieldIcon size={14} className="text-blue-700" />
            <span>Startup–Investor Workspace</span>
          </span>

          <h1 className="mt-5 text-[clamp(2.35rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900">
            One workspace for <br />
            <span className="text-blue-700">
              founders and investors.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600 lg:mx-0">
            Keep startup profiles, messages, and documents in one shared workspace. Every conversation has the context it needs.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
            <Magnetic strength={0.2}>
              <AuthButton
                flow="signup"
                ariaLabel="Get started with VentureFlow"
                className="px-8 focus-visible:ring-offset-2"
              >
                Get started
              </AuthButton>
            </Magnetic>

            <button
              type="button"
              onClick={() => {
                scrollToTarget("#thesis");
              }}
              className="btn-pill-secondary group cursor-pointer"
              aria-label="See how it works"
            >
              <span>See how it works</span>
              <ChevronDown
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </button>
          </div>

          <ul role="list" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs font-medium text-slate-600 lg:justify-start list-none p-0">
            <li className="flex items-center gap-1.5 text-slate-700">
              <ComplianceShieldIcon size={14} className="text-blue-600 shrink-0" />
              Profiles and documents in one place
            </li>
            <li className="flex items-center gap-1.5 text-slate-700">
              <GrowthChartIcon size={14} className="text-emerald-600 shrink-0" />
              Owner-controlled sharing
            </li>
            <li className="flex items-center gap-1.5 text-slate-700">
              <PartnershipRingsIcon size={14} className="text-blue-600 shrink-0" />
              Introductions and messages
            </li>
          </ul>
        </Reveal>

        {/* Right Phone Frame & Floating Widgets */}
        <figure aria-label="Interactive workspace preview" className="relative flex h-auto flex-col items-center py-4 sm:py-6 lg:h-[560px] lg:min-h-[560px] lg:py-0 w-full m-0">
          {/* Subtle Ambient Device Pod (Matching reference image depth) */}
          <div
            aria-hidden="true"
            className="hero-device-pod"
          >
            <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
          </div>

          {/* Staging Rig with crisp 1:1 pixel rendering */}
          <motion.div
            style={{
              y: scrollYOffset,
            }}
            className="relative flex items-center justify-center w-full"
          >
            {/* Phone Physical Unit */}
            <motion.div
              initial={{
                opacity: 0.9,
                y: 20,
                scale: 1,
              }}
              animate={phoneControls}
              className="relative z-40 [transform:translateZ(0)] [backface-visibility:hidden]"
            >
              {/* Realistic Ambient Floor Shadow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-8 w-[84%] rounded-full bg-slate-950/20 blur-xl"
              />

              {/* Phone Frame */}
              <PhoneFrame
                theme="hero"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={false}
                className="w-[230px] min-[380px]:w-[245px] sm:w-[260px] lg:w-[275px] xl:w-[280px]"
              >
                <FeedPreview />
              </PhoneFrame>
            </motion.div>

            {/* Desktop Surrounding Cards (Emerging directly from phone depth plane) */}
            {cards.map((card, index) => {
              const cfg = cardEmergeConfig[card.key] || {
                originX: index % 2 === 0 ? 120 : -120,
                originY: 0,
                rotateY: index % 2 === 0 ? 14 : -14,
                rotateZ: index % 2 === 0 ? -2 : 2,
                delay: 0.3 + index * 0.2,
              };

              const parallaxY =
                index < 2
                  ? topCardsParallax
                  : index < 4
                  ? midCardsParallax
                  : btmCardsParallax;

              return (
                <motion.article
                  key={card.key}
                  className={`${cardBase} absolute ${card.desktop} z-30 [transform-style:preserve-3d]`}
                  initial={{
                    opacity: 0,
                    x: cfg.originX,
                    y: cfg.originY,
                    z: -35,
                    scale: 0.72,
                    rotateY: cfg.rotateY,
                    rotateZ: cfg.rotateZ,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    scale: 1,
                    rotateY: 0,
                    rotateZ: 0,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.92,
                    delay: reducedMotion ? 0 : cfg.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    y: reducedMotion ? 0 : parallaxY,
                  }}
                >
                  {/* Sleek Horizontal Connector Line towards Phone */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center ${
                      card.side === "left"
                        ? "-right-4 xl:-right-6 flex-row"
                        : "-left-4 xl:-left-6 flex-row-reverse"
                    }`}
                  >
                    <div className="h-[2px] w-4 xl:w-6 bg-slate-900/85" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  </div>

                  {card.body}
                </motion.article>
              );
            })}
          </motion.div>

          {/* Mobile & Tablet Dedicated Proof Cards Grid */}
          <ul role="list" className="mt-8 sm:mt-10 grid w-full max-w-2xl grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5 lg:hidden list-none p-0">
            {cards.map((card, index) => (
              <motion.li
                key={card.key}
                className={
                  index % 3 === 0
                    ? "proof-card-emerald"
                    : index % 3 === 1
                    ? "proof-card-blue"
                    : "proof-card-slate"
                }
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : 0.08 + index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {card.body}
              </motion.li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}

function FeedPreview() {
  const stories = [
    {
      id: "all",
      name: "All",
      time: "For you",
      isAll: true,
    },
    {
      id: "maneesh",
      name: "Alex",
      time: "Just now",
      badge: "1",
      image: "/image/about/1.jpg",
    },
    {
      id: "arnav",
      name: "Arnav",
      time: "1m ago",
      badge: "3",
      image: "/image/about/2.jpg",
    },
    {
      id: "gaurav",
      name: "Taylor",
      time: "30m ago",
      badge: "2",
      image: "/image/about/3.jpg",
    },
    {
      id: "dinesh",
      name: "Riley",
      time: "1h ago",
      badge: "1",
      image: "/image/about/3.jpg",
    },
  ];

  return (
    <div aria-hidden="true" className="relative flex h-full flex-col justify-between bg-white text-slate-900 select-none overflow-hidden">
      {/* Scrollable feed area */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Top App Header */}
        <header className="flex items-center justify-between px-3 pt-1 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Menu size={15} className="text-slate-800" />
            <span className="text-xs font-bold text-slate-900 tracking-tight">Home</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Search size={14} className="hover:text-slate-900" />
            <Bell size={14} className="hover:text-slate-900" />
          </div>
        </header>

        {/* Tab Pills: Market Feed, Spaces, Saved */}
        <nav aria-label="Feed channels" className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-100">
          <span className="rounded-full bg-blue-100/80 px-3 py-0.5 text-[10px] font-bold text-blue-700 shadow-2xs">
            Market Feed
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:text-slate-900">
            Spaces
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:text-slate-900">
            Saved
          </span>
        </nav>

        {/* Stories / User Avatars Ribbon */}
        <ul role="list" className="story-ribbon list-none p-0 m-0">
          {stories.map((story) => (
            <li key={story.id} className="flex shrink-0 flex-col items-center gap-0.5 text-center">
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
              <span className="text-[10px] font-bold text-slate-900 leading-none">{story.name}</span>
              <span className="text-[8.5px] text-slate-600 font-medium leading-none">{story.time}</span>
            </li>
          ))}
        </ul>

        {/* Feed Posts */}
        <div className="space-y-2.5 p-2.5">
          {/* Post 1 - Alex Carter ($BTC Bullish / On track) */}
          <article className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/image/about/1.jpg"
                  alt="Alex Carter"
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Alex Carter</p>
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">@maneesh</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-600 font-semibold">
                <span>2h</span>
                <span className="text-slate-600">⋮</span>
              </div>
            </header>

            <p className="mt-1.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
              Bitcoin institutional treasury accumulation accelerates through spot ETFs&hellip;
            </p>
            <p className="mt-0.5 text-xs text-slate-700 leading-relaxed line-clamp-2">
              Treasury reserves and spot ETF inflows continue to absorb newly mined bitcoin supply each day.
            </p>

            {/* Target & Horizon Bar */}
            <figure className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-200/90 text-[10px] m-0">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <span>Target <b className="text-slate-900 font-bold">$105,000</b></span>
                <span className="text-slate-400">|</span>
                <span>Horizon <b className="text-slate-900 font-bold">180d</b></span>
              </div>
              <FundingTargetIcon size={13} className="text-blue-700" />
            </figure>

            {/* Stats Row */}
            <footer className="mt-2 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp size={11} className="text-slate-600" /> 142
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle size={11} className="text-slate-600" /> 318
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded">
                  <span className="size-1.5 rounded-full bg-emerald-600" /> On track
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-900">
                  $BTC
                </span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                  Bullish
                </span>
              </div>
            </footer>
          </article>

          {/* Post 2 - Jordan Lee ($NVDA Bearish / Off track) */}
          <article className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/image/about/2.jpg"
                  alt="Jordan Lee"
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Jordan Lee</p>
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">@arnav</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-600 font-semibold">
                <span>2h</span>
                <span className="text-slate-600">⋮</span>
              </div>
            </header>

            <p className="mt-1.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
              Hyperscaler capex digestion poses near-term margin risk across hardware suppliers&hellip;
            </p>
            <p className="mt-0.5 text-xs text-slate-700 leading-relaxed line-clamp-2">
              Cloud data centers are keeping existing servers longer, slowing near-term hardware orders through year-end.
            </p>

            {/* Target & Horizon Bar */}
            <figure className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-200/90 text-[10px] m-0">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <span>Target <b className="text-slate-900 font-bold">$145</b></span>
                <span className="text-slate-400">|</span>
                <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
              </div>
              <FundingTargetIcon size={13} className="text-blue-700" />
            </figure>

            {/* Stats Row */}
            <footer className="mt-2 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp size={11} className="text-slate-600" /> 89
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle size={11} className="text-slate-600" /> 245
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.5 rounded">
                  <span className="size-1.5 rounded-full bg-amber-600" /> Off track
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-900">
                  $NVDA
                </span>
                <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                  Bearish
                </span>
              </div>
            </footer>
          </article>
        </div>
      </div>

      {/* Floating Action Button (FAB) with gradient glow */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Create new thesis"
        className="fab-trigger hover:bg-slate-900 focus-ring"
      >
        <Plus size={15} strokeWidth={2.6} />
      </button>

      {/* Bottom Phone Navigation */}
      <nav aria-label="Phone navigation" className="relative z-10 shrink-0 border-t border-slate-100 bg-white py-1.5 px-2">
        <div className="grid grid-cols-4 text-center items-center">
          <div className="flex flex-col items-center gap-[1px] text-blue-600">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span className="text-[10px] font-bold">Social</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-600">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
            <span className="text-[10px] font-semibold">Invest</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-600">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
            <span className="text-[10px] font-semibold">Compete</span>
          </div>
          <div className="flex flex-col items-center gap-[1px] text-slate-600">
            <img
              src="/image/about/1.jpg"
              alt="Profile"
              className="size-3 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-[9px] font-medium">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
}