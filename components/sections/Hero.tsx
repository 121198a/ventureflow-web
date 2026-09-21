"use client";

import {
  motion,
  useAnimationControls,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Home,
} from "lucide-react";
import {
  ComplianceShieldIcon,
  FundingTargetIcon,
  GrowthChartIcon,
  PartnershipRingsIcon,
  WalletInvestmentIcon,
} from "@/components/ui/CustomIcons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiTesla } from "react-icons/si";
import { ImAppleinc } from "react-icons/im";

import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import { scrollToTarget } from "@/providers/SmoothScrollProvider";
import { AmbientLight } from "@/components/motion/AmbientLight";
import { Magnetic } from "@/components/motion/Magnetic";

const cardBase =
  "card-fintech-interactive p-3.5 bg-white/95 backdrop-blur-xs select-none";

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
    desktop: "left-[-125px] xl:left-[-150px] top-6 hidden w-[155px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified Hit</p>
          <GrowthChartIcon size={13} className="text-emerald-600" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <FcGoogle size={15} />
          ALPHABET
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$185.00</span>
        </p>
        <p className="text-xs text-slate-500">Horizon: 180d</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-700">
          <span>+24.8% reached</span>
        </p>
      </>
    ),
  },
  {
    key: "apple",
    side: "right",
    desktop: "right-[-120px] xl:right-[-145px] top-4 hidden w-[150px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Active Call</p>
          <FundingTargetIcon size={13} className="text-blue-600" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <ImAppleinc size={14} />
          APPLE
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$235.00</span>
        </p>
        <p className="text-xs text-slate-500">Horizon: 120d</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-blue-700">
          <span>Benchmarked Live</span>
        </p>
      </>
    ),
  },
  {
    key: "tesla",
    side: "left",
    desktop: "left-[-135px] xl:left-[-160px] top-[38%] hidden xl:block w-[165px]",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Analyst Space</p>
          <PartnershipRingsIcon size={14} className="text-slate-500" />
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
          <span className="text-slate-500 font-normal">Active</span>
        </div>
      </>
    ),
  },
  {
    key: "research",
    side: "right",
    desktop: "right-[-135px] xl:right-[-160px] top-[36%] hidden xl:block w-[165px]",
    body: (
      <>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <p className="text-xs font-bold text-blue-600">Filing Analysis</p>
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
    desktop: "left-[-140px] xl:left-[-165px] bottom-10 hidden 2xl:block w-[190px]",
    body: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Space Activity</p>
        <p className="mt-1 text-xs font-bold text-blue-600">Bravo Investment Club</p>
        <p className="text-xs text-slate-600 mt-0.5">New semiconductor thesis submitted for committee review</p>
      </>
    ),
  },
  {
    key: "rank",
    side: "right",
    desktop: "right-[-120px] xl:right-[-145px] bottom-8 hidden w-[150px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Public Record</p>
          <ComplianceShieldIcon size={14} className="text-blue-600" />
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Audited accuracy</p>
        <p className="text-xl font-extrabold text-blue-600 tracking-tight leading-none my-1.5">68.4%</p>
        <p className="text-[11px] text-slate-500">Across 38 closed theses</p>
      </>
    ),
  },
];

export function Hero() {
  const reduce = useReducedMotion();
  const phoneControls = useAnimationControls();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = mounted && Boolean(reduce);

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

  // Phone subtle scroll-driven tilt & parallax
  const scrollRotateY = useTransform(smoothScroll, [0, 1], [0, 5.5]);
  const scrollRotateX = useTransform(smoothScroll, [0, 1], [0, 3.5]);
  const scrollTranslateY = useTransform(smoothScroll, [0, 1], [0, -32]);

  // Subtle 3D card layer parallax across scroll
  const topCardsParallax = useTransform(smoothScroll, [0, 1], [0, -12]);
  const midCardsParallax = useTransform(smoothScroll, [0, 1], [0, -22]);
  const btmCardsParallax = useTransform(smoothScroll, [0, 1], [0, -32]);

  // Desktop Pointer parallax (subtle, non-conflicting)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 85, damping: 22 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 85, damping: 22 });
  const pointerTiltY = useTransform(smoothPointerX, [-1, 1], [-2.2, 2.2]);
  const pointerTiltX = useTransform(smoothPointerY, [-1, 1], [1.8, -1.8]);

  // Combined smooth rotation for 3D staging
  const combinedTiltX = useTransform(
    [pointerTiltX, scrollRotateX],
    ([p, s]) => (reducedMotion ? 0 : ((p as number) || 0) + ((s as number) || 0))
  );
  const combinedTiltY = useTransform(
    [pointerTiltY, scrollRotateY],
    ([p, s]) => (reducedMotion ? 0 : ((p as number) || 0) + ((s as number) || 0))
  );
  const scrollYOffset = useTransform(scrollTranslateY, (val) => (reducedMotion ? 0 : val));

  useEffect(() => {
    setMounted(true);
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
      // 1. Cinematic entrance with controlled rotation & settling
      await phoneControls.start({
        opacity: [0.85, 1, 1, 1],
        y: [40, 8, -2, 0],
        scale: [0.96, 0.99, 1.004, 1],
        rotateY: [-18, 22, -8, 0],
        rotateX: [5, -2, 1, 0],
        rotateZ: [-1.2, 0.4, -0.15, 0],
        transition: {
          duration: 2.2,
          times: [0, 0.35, 0.72, 1],
          ease: [0.16, 1, 0.3, 1],
        },
      });

      if (!active) return;

      // 2. Calm, subtle floating product-showcase motion
      phoneControls.start({
        y: [0, -5, 0],
        rotateY: [-2.2, 2.2, -2.2],
        rotateX: [0.6, -0.6, 0.6],
        transition: {
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
          rotateX: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
        },
      });
    }

    sequence();

    return () => {
      active = false;
    };
  }, [phoneControls, reduce]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !mounted) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerX.set(Math.max(-1, Math.min(1, x)));
    pointerY.set(Math.max(-1, Math.min(1, y)));
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-50/40 border-b border-slate-200/80 px-5 pb-16 pt-24 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36"
    >
      {/* Dynamic Ambient Responsive Lighting */}
      <AmbientLight color="rgba(37, 99, 235, 0.08)" size={650} intensity={1} />

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-sky-50/50 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-blue-50/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2 lg:gap-14">
        {/* Left Intro Copy */}
        <div className="relative z-20 text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/95 px-4 py-1.5 text-xs font-semibold text-blue-800 shadow-2xs">
              <ComplianceShieldIcon size={14} className="text-blue-600" />
              <span>Verifiable Investment Record Architecture</span>
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[clamp(2.35rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900">
              Every thesis on record. <br />
              <span className="text-blue-600">
                Tracked to the outcome.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600 lg:mx-0">
              Write down your target, the time horizon, and the reason behind the call. UnBound X measures each thesis against live market prices to turn opinion into something you can verify.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
              <Magnetic strength={0.2}>
                <AuthButton
                  flow="signup"
                  className="btn-pill-primary px-8 focus-visible:ring-offset-2"
                >
                  Start your record
                </AuthButton>
              </Magnetic>

              <button
                type="button"
                onClick={() => {
                  scrollToTarget("#thesis");
                }}
                className="btn-pill-secondary group cursor-pointer focus-visible:ring-offset-2"
                aria-label="Review Methodology"
              >
                <span>Review Methodology</span>
                <ChevronDown
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs font-medium text-slate-600 lg:justify-start">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ComplianceShieldIcon size={14} className="text-blue-600 shrink-0" />
                Target &amp; horizon locked at publish
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <GrowthChartIcon size={14} className="text-emerald-600 shrink-0" />
                Audited hit &amp; miss accuracy
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <PartnershipRingsIcon size={14} className="text-blue-600 shrink-0" />
                Collaborative research Spaces
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right Phone Frame & Floating Widgets */}
        <div
          className="relative flex h-auto flex-col items-center py-6 lg:h-[560px] lg:min-h-[560px] lg:py-0 w-full"
          style={{ perspective: 1400 }}
        >
          {/* Subtle Ambient Device Pod (Matching reference image depth) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 sm:-inset-10 -z-10 rounded-xl overflow-hidden bg-gradient-to-b from-sky-50/40 via-white/20 to-slate-50/30 border border-slate-200/50 shadow-sm"
          >
            <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
          </div>

          {/* 3D Staging Rig (handles pointer tilt, scroll parallax, and perspective anchor) */}
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              rotateX: combinedTiltX,
              rotateY: combinedTiltY,
              y: scrollYOffset,
            }}
            className="relative flex items-center justify-center w-full"
          >
            {/* Phone Physical Unit & Cinematic Motion */}
            <motion.div
              initial={{
                opacity: 0.85,
                y: 40,
                scale: 0.96,
                rotateY: -18,
                rotateX: 5,
                rotateZ: -1.2,
              }}
              animate={phoneControls}
              className="relative z-40 [transform-style:preserve-3d]"
            >
              {/* 3D Physical Chassis Side Depth (visible when phone rotates in perspective) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-xl sm:rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-[#0a1226] to-slate-900 shadow-[0_24px_60px_-15px_rgba(10,18,38,0.30)]"
                style={{
                  transform: "translateZ(-8px)",
                }}
              />

              {/* Realistic Ambient Floor Shadow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-8 w-[84%] rounded-full bg-slate-950/25 blur-xl"
                style={{
                  transform: "translateZ(-25px)",
                }}
              />

              {/* Phone Frame */}
              <div className="relative">
                <PhoneFrame theme="hero" showWifi={true} showStatusBar={true} showHomeIndicator={false}>
                  <FeedPreview />
                </PhoneFrame>

                {/* Glass Specular Reflection Highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[34px] sm:rounded-[38px]"
                >
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent opacity-70" />
                </div>
              </div>
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
                <motion.div
                  key={card.key}
                  className={`${cardBase} absolute ${card.desktop} z-30 [transform-style:preserve-3d] select-none`}
                  initial={{
                    opacity: 0,
                    x: cfg.originX,
                    y: cfg.originY,
                    z: -35,
                    scale: 0.72,
                    rotateY: cfg.rotateY,
                    rotateZ: cfg.rotateZ,
                  }}
                  animate={reducedMotion ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    scale: 1,
                    rotateY: 0,
                    rotateZ: 0,
                  } : {
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
                  {/* Sleek Horizontal Connector Line towards Phone (Image 1) */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center ${
                      card.side === "left"
                        ? "-right-5 xl:-right-6 flex-row"
                        : "-left-5 xl:-left-6 flex-row-reverse"
                    }`}
                  >
                    <div className="h-[2px] w-5 xl:w-6 bg-slate-900/85" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  </div>

                  {card.body}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile & Tablet Fallback Grid */}
          <div className="mt-8 grid w-full max-w-md grid-cols-1 min-[380px]:grid-cols-2 gap-3.5 lg:hidden">
            {cards.slice(0, 4).map((card, index) => (
              <motion.div
                key={card.key}
                className={cardBase}
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.55,
                  delay: reducedMotion ? 0 : 0.12 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {card.body}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedPreview() {
  const reduce = useReducedMotion();

  const mockUsers = [
    { name: "Marcus", tag: "MV", color: "bg-blue-100 text-blue-800" },
    { name: "Elena", tag: "ES", color: "bg-sky-100 text-sky-800" },
    { name: "David", tag: "DK", color: "bg-slate-100 text-slate-800" },
    { name: "Priya", tag: "PR", color: "bg-emerald-100 text-emerald-800" },
  ] as const;

  const navigation = [
    { label: "Feed", icon: Home, active: true },
    { label: "Invest", icon: WalletInvestmentIcon, active: false },
    { label: "Verified", icon: CheckCircle2, active: false },
    { label: "Profile", icon: CircleUserRound, active: false },
  ];

  return (
    <div aria-hidden="true" className="flex h-full min-h-0 flex-col bg-white text-slate-900 select-none">
      <div className="min-h-0 flex-1 overflow-hidden">
        {/* Top App Header */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.2 }}
          className="flex items-center justify-between px-3.5 pb-2 pt-1.5"
        >
          <span className="text-xs font-bold text-slate-900 tracking-tight">UnBound X</span>
          <span className="text-xs text-slate-500 font-medium">Live Record</span>
        </motion.div>

        {/* Tab Headers */}
        <div className="flex gap-4 border-b border-slate-100 px-3.5 pb-2 text-xs font-semibold text-slate-600">
          <span className="relative text-blue-600 font-bold">
            For You
            <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-pill bg-blue-600" />
          </span>
          <span className="hover:text-slate-800 transition-colors">Spaces</span>
          <span className="hover:text-slate-800 transition-colors">Tracked</span>
        </div>

        {/* Analyst Avatars Ribbon */}
        <div className="flex gap-2.5 overflow-hidden px-3.5 py-2">
          {mockUsers.map((u, index) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.4 + index * 0.06,
                duration: reduce ? 0 : 0.35,
              }}
              className="flex shrink-0 flex-col items-center gap-0.5"
            >
              <span className={`grid h-7 w-7 place-items-center rounded-pill border border-slate-200/80 font-bold text-[10px] ${u.color}`}>
                {u.tag}
              </span>
              <span className="text-[10px] font-medium text-slate-600">{u.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Feed Card */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduce ? 0 : 0.6,
            duration: reduce ? 0 : 0.4,
          }}
          className="mx-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-pill bg-blue-600 text-[10px] font-bold text-white shadow-xs">
              MV
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Marcus Vance</p>
              <p className="text-[10px] text-slate-500">@marcusvance · 90d Horizon</p>
            </div>
          </div>

          <p className="mt-1.5 text-[11px] leading-snug text-slate-600">
            Semiconductor foundry capacity expansion confirms supplier pricing strength through year-end. Target reflects multiple expansion to historical peak.
          </p>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-2 py-1 text-[10px] sm:text-xs font-semibold text-slate-700 shadow-xs border border-slate-100">
            <span>Target <b className="text-slate-900 font-bold">$280</b></span>
            <span className="text-slate-300">|</span>
            <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
            <span className="rounded-pill bg-emerald-50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-700 border border-emerald-200/80">
              Verified
            </span>
          </div>

          <div className="mt-1.5 h-8 overflow-hidden rounded-lg bg-white px-1 border border-slate-100">
            <svg viewBox="0 0 180 32" className="h-full w-full" fill="none" aria-hidden="true">
              <path
                d="M4 26 C22 24 30 22 45 17 S68 20 84 13 S105 15 122 9 S145 11 162 5 S172 6 176 3"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1">
                <FaRegHeart size={10} className="text-slate-500" /> 100
              </span>
              <span className="inline-flex items-center gap-1">
                <BiMessageRounded size={11} className="text-slate-500" /> 734
              </span>
              <span className="inline-flex">
                <Bookmark size={10} className="text-slate-500" />
              </span>
            </div>
            <span className="text-[10px] text-slate-500">2h ago</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Phone Navigation */}
      <div className="relative z-10 shrink-0 border-t border-slate-100 bg-white px-2 pb-2 pt-1.5">
        <div className="grid grid-cols-4 items-end">
          {navigation.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                active ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-0.5 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-pill bg-slate-900/70" />
      </div>
    </div>
  );
}