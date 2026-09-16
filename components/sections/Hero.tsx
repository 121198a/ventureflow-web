"use client";

import { motion, useReducedMotion } from "framer-motion";
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
import type { ReactNode } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiTesla } from "react-icons/si";
import { ImAppleinc } from "react-icons/im";

import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import { scrollToTarget } from "@/providers/SmoothScrollProvider";

const cardBase =
  "gb-interactive-card rounded-xl border border-slate-200/90 bg-white/95 p-3.5 shadow-card backdrop-blur-md transition-all duration-300 hover:shadow-elevated hover:border-blue-500/30";

type Card = {
  key: string;
  desktop: string;
  body: ReactNode;
};

const cards: Card[] = [
  {
    key: "google",
    desktop: "left-[-110px] xl:left-[-165px] 2xl:left-[-190px] top-10 hidden w-[155px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-micro font-bold uppercase tracking-wider text-emerald-700">Verified Hit</p>
          <GrowthChartIcon size={13} className="text-emerald-600" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <FcGoogle size={16} />
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
    desktop: "right-[-90px] xl:right-[-150px] 2xl:right-[-175px] top-6 hidden w-[150px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-micro font-bold uppercase tracking-wider text-slate-600">Active Call</p>
          <FundingTargetIcon size={13} className="text-blue-600" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <ImAppleinc size={15} />
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
    desktop: "left-[-160px] 2xl:left-[-185px] top-[40%] hidden xl:block w-[165px]",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-micro font-bold uppercase tracking-wider text-slate-600">Analyst Space</p>
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
    desktop: "right-[-160px] 2xl:right-[-185px] top-[38%] hidden xl:block w-[165px]",
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
    desktop: "left-[-180px] 2xl:left-[-220px] bottom-16 hidden 2xl:block w-[215px]",
    body: (
      <>
        <p className="text-micro font-bold uppercase tracking-wider text-slate-500">Space Activity</p>
        <p className="mt-1 text-xs font-bold text-blue-600">Bravo Investment Club</p>
        <p className="text-xs text-slate-600 mt-0.5">New semiconductor thesis submitted for committee review</p>
      </>
    ),
  },
  {
    key: "rank",
    desktop: "right-[-85px] xl:right-[-140px] 2xl:right-[-165px] bottom-14 hidden w-[155px] lg:block",
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-micro font-bold uppercase tracking-wider text-slate-600">Public Record</p>
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

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-50/40 border-b border-slate-200/80 px-5 pb-16 pt-24 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl" />
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
              <span className="text-blue-600">Tracked to the outcome.</span>
            </h1>
            
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600 lg:mx-0">
              State your price target, horizon, and underlying rationale. UnBound X benchmarks every call against live market pricing to turn opinion into verifiable credibility.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-start">
              <AuthButton
                flow="signup"
                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] focus-ring"
              >
                Start your record
              </AuthButton>

              <button
                type="button"
                onClick={() => {
                  scrollToTarget("#thesis");
                }}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 focus-ring cursor-pointer"
                aria-label="See how it works"
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
                <PartnershipRingsIcon size={14} className="text-indigo-600 shrink-0" />
                Collaborative research Spaces
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right Phone Frame & Floating Widgets */}
        <div className="relative flex flex-col items-center py-6 lg:py-0">
          <Reveal direction="none" delay={0.12} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.8,
                delay: reduce ? 0 : 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative"
            >
              <PhoneFrame>
                <FeedPreview />
              </PhoneFrame>
            </motion.div>

            {/* Desktop Floating Badges */}
            {cards.map((card, index) => (
              <Reveal
                key={card.key}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={0.45 + index * 0.08}
                className={`${cardBase} absolute ${card.desktop}`}
              >
                <motion.div
                  animate={
                    reduce
                      ? undefined
                      : {
                          y: [0, -6, 0],
                        }
                  }
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 5.5 + index * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.25,
                        }
                  }
                >
                  {card.body}
                </motion.div>
              </Reveal>
            ))}
          </Reveal>

          {/* Mobile & Tablet Fallback Grid */}
          <div className="mt-8 grid w-full max-w-md grid-cols-1 min-[380px]:grid-cols-2 gap-3.5 lg:hidden">
            {cards.slice(0, 4).map((card, index) => (
              <Reveal key={card.key} delay={index * 0.06} className={cardBase}>
                {card.body}
              </Reveal>
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
    { name: "Elena", tag: "ES", color: "bg-indigo-100 text-indigo-800" },
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
          className="flex items-center justify-between px-4 pb-2.5 pt-2"
        >
          <span className="text-xs font-bold text-slate-900">UnBound X</span>
          <span className="text-xs text-slate-600 flex items-center gap-2">
            <span>Live Record</span>
          </span>
        </motion.div>

        {/* Tab Headers */}
        <div className="flex gap-4 border-slate-200 px-4 pb-2 text-xs font-semibold text-slate-600">
          <span className="relative text-blue-600">
            For You
            <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-pill bg-blue-600" />
          </span>
          <span>Spaces</span>
          <span>Tracked</span>
        </div>

        {/* Analyst Avatars Ribbon */}
        <div className="flex gap-3 overflow-hidden px-4 py-2.5">
          {mockUsers.map((u, index) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.4 + index * 0.06,
                duration: reduce ? 0 : 0.35,
              }}
              className="flex shrink-0 flex-col items-center gap-1"
            >
              <span className={`grid h-8 w-8 place-items-center rounded-pill border border-slate-200 font-bold text-[11px] ${u.color}`}>
                {u.tag}
              </span>
              <span className="text-xs font-medium text-slate-600">{u.name}</span>
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
          className="mx-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-pill bg-blue-600 text-[10px] font-bold text-white shadow-xs">
              MV
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Marcus Vance</p>
              <p className="text-xs text-slate-600">@marcusvance · 90d Horizon</p>
            </div>
          </div>

          <p className="mt-2 text-xs leading-snug text-slate-600">
            Semiconductor foundry capacity expansion confirms supplier pricing strength through year-end. Target reflects multiple expansion to historical peak.
          </p>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-xs border border-slate-100">
            <span>Target <b className="text-slate-900 font-bold">$280</b></span>
            <span className="text-slate-300">|</span>
            <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
            <span className="rounded-pill bg-emerald-50 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-100">
              Verified
            </span>
          </div>

          <div className="mt-2 h-9 overflow-hidden rounded-lg bg-white px-1 border border-slate-100">
            <svg viewBox="0 0 180 36" className="h-full w-full" fill="none" aria-hidden="true">
              <path
                d="M2 29 C20 25 23 27 38 20 S57 23 72 15 S91 18 108 12 S131 14 151 7 S166 10 178 4"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500"
              />
            </svg>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <FaRegHeart size={11} className="text-slate-600" /> 100
              </span>
              <span className="inline-flex items-center gap-1">
                <BiMessageRounded size={12} className="text-slate-600" /> 734
              </span>
              <span className="inline-flex">
                <Bookmark size={11} className="text-slate-600" />
              </span>
            </div>
            <span className="text-xs text-slate-600">2h ago</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Phone Navigation */}
      <div className="relative z-10 shrink-0 border-t border-slate-100 bg-white px-2 pb-3 pt-2">
        <div className="grid grid-cols-4 items-end">
          {navigation.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 text-[10px] sm:text-xs font-semibold transition-colors ${
                active ? "text-blue-600" : "text-slate-600"
              }`}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-20 -translate-x-1/2 rounded-pill bg-slate-900/80" />
      </div>
    </div>
  );
}