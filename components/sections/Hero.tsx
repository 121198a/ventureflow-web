"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Home,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
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
  "gb-interactive-card rounded-lg border border-slate-200/90 bg-white/95 p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]";

type Card = {
  key: string;
  desktop: string;
  body: ReactNode;
};

const avatar = (id: number) => ({
  backgroundImage: `url(https://i.pravatar.cc/120?img=${id})`,
});

const cards: Card[] = [
  {
    key: "google",
    desktop: "left-[-150px] lg:left-[-110px] xl:left-[-165px] 2xl:left-[-190px] top-10 hidden w-[145px] md:block",
    body: (
      <>
        <p className="text-xs font-semibold text-slate-600">Bullish Thesis</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <FcGoogle size={17} />
          GOOGLE
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$150.00</span>
        </p>
        <p className="text-xs text-slate-600">by @AlexM</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-700">
          <TrendingUp size={12} />
          42.1%
        </p>
      </>
    ),
  },
  {
    key: "apple",
    desktop: "right-[-140px] lg:right-[-90px] xl:right-[-150px] 2xl:right-[-175px] top-6 hidden w-[140px] md:block",
    body: (
      <>
        <p className="text-xs font-semibold text-slate-600">Thesis Missed</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <ImAppleinc size={16} />
          APPLE
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Target <span className="font-bold text-slate-900">$350.00</span>
        </p>
        <p className="text-xs text-slate-600">by @AlexH</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-600">
          <TrendingDown size={12} />
          -2.34%
        </p>
      </>
    ),
  },
  {
    key: "tesla",
    desktop: "left-[-160px] 2xl:left-[-185px] top-[40%] hidden xl:block w-[155px]",
    body: (
      <>
        <p className="text-xs font-semibold text-slate-600">People are discussing</p>
        <div className="mt-1.5 flex -space-x-1.5">
          {[31, 32, 33].map((id) => (
            <span
              key={id}
              className="h-5 w-5 rounded-pill border-2 border-white bg-cover bg-center shadow-xs"
              style={avatar(id)}
            />
          ))}
          <span className="grid h-5 w-5 place-items-center rounded-pill border-2 border-white bg-slate-100 text-xs font-bold text-slate-600">
            +53
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-800">
            <SiTesla className="text-red-500" size={13} aria-hidden="true" />
            TESLA
          </span>
          <span className="text-slate-600 font-normal">185</span>
        </div>
      </>
    ),
  },
  {
    key: "zenith",
    desktop: "right-[-160px] 2xl:right-[-185px] top-[38%] hidden xl:block w-[155px]",
    body: (
      <>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-pill bg-blue-600 animate-pulse" />
          <p className="text-xs font-bold text-blue-600">Zenith AI</p>
        </div>
        <p className="mt-1 text-xs font-medium text-slate-700 leading-tight">
          Market sentiment for NVDA is{" "}
          <span className="font-bold text-emerald-700">Bullish</span>
        </p>
      </>
    ),
  },
  {
    key: "space",
    desktop: "left-[-180px] 2xl:left-[-220px] bottom-16 hidden 2xl:block w-[210px]",
    body: (
      <>
        <p className="text-xs font-semibold text-slate-600">New in your Space</p>
        <p className="mt-1 text-xs font-bold text-blue-600">Bravo Investment Club</p>
        <p className="text-xs text-slate-600 mt-0.5">@Sarah just shared a new thesis</p>
      </>
    ),
  },
  {
    key: "rank",
    desktop: "right-[-135px] lg:right-[-85px] xl:right-[-140px] 2xl:right-[-165px] bottom-14 hidden w-[150px] md:block",
    body: (
      <>
        <p className="text-xs font-semibold text-slate-600">Track Record</p>
        <p className="text-xs text-slate-600 mt-0.5">Your rank</p>
        <p className="text-lg font-black text-blue-600 tracking-tight leading-none my-1">Top 3%</p>
        <p className="text-xs text-slate-600">this month</p>
      </>
    ),
  },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-blue-100 to-white border-slate-200 px-5 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
      {/* Background radial atmosphere */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-pill bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-pill bg-emerald-100/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-pill bg-blue-50/50 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Intro Copy */}
        <div className="relative z-20 text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center rounded-pill border border-slate-200/80 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-xs">
              Post an investment idea. The market tracks it.
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.12] tracking-tight text-slate-900">
              Become someone <br />
              <span className="text-blue-600">worth listening to.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-md text-base sm:text-lg leading-relaxed text-slate-600 lg:mx-0">
              On social media, follower counts make you credible. Here, it&apos;s how often your calls actually land.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
              <AuthButton
                flow="signup"
                className="rounded-pill bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-[0.98]"
              >
                Start your record
              </AuthButton>

              <button
                type="button"
                onClick={() => {
                  scrollToTarget("#thesis");
                }}
                className="group inline-flex items-center gap-1.5 rounded-pill py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:text-blue-600 cursor-pointer"
                aria-label="See how it works"
              >
                <span>See how it works</span>
                <ChevronDown
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 lg:justify-start">
              <span className="flex items-center gap-1 text-slate-600">✓ Track every thesis</span>
              <span className="flex items-center gap-1 text-slate-600">✓ Build credibility</span>
              <span className="flex items-center gap-1 text-slate-600">✓ Learn from outcomes</span>
            </div>
          </Reveal>
        </div>

        {/* Right Phone Frame & Floating Widgets */}
        <div className="relative flex flex-col items-center py-6 lg:py-0">
          <Reveal direction="none" delay={0.15} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.8,
                delay: reduce ? 0 : 0.15,
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

          {/* Mobile Fallback Grid */}
          <div className="mt-8 grid w-full max-w-sm grid-cols-1 min-[360px]:grid-cols-2 gap-3 md:hidden">
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

  const stories = [
    ["Riley", 12],
    ["Casey", 25],
    ["Jordan", 14],
    ["Avery", 47],
  ] as const;

  const navigation = [
    { label: "Social", icon: Home, active: true },
    { label: "Invest", icon: WalletCards, active: false },
    { label: "Complete", icon: CheckCircle2, active: false },
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
          <span className="text-xs font-bold text-slate-900">Home</span>
          <span className="text-xs text-slate-600 flex items-center gap-2">
            <span>⌕</span>
            <span>🔔</span>
          </span>
        </motion.div>

        {/* Tab Headers */}
        <div className="flex gap-4 border-slate-200 px-4 pb-2 text-xs font-semibold text-slate-600">
          <span className="relative text-blue-600">
            For You
            <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-pill bg-blue-600" />
          </span>
          <span>Spaces</span>
          <span>Saved</span>
        </div>

        {/* Stories Ribbon */}
        <div className="flex gap-3 overflow-hidden px-4 py-2.5">
          {stories.map(([name, id], index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.4 + index * 0.06,
                duration: reduce ? 0 : 0.35,
              }}
              className="flex shrink-0 flex-col items-center gap-1"
            >
              <span className="rounded-pill bg-gradient-to-tr from-yellow-400 via-pink-500 to-blue-600 p-[1.5px]">
                <span
                  className="block h-8 w-8 rounded-pill border-2 border-white bg-cover bg-center"
                  style={avatar(id)}
                />
              </span>
              <span className="text-xs font-medium text-slate-600">{name}</span>
            </motion.div>
          ))}
        </div>

        {/* Feed Card — an illustrative example post, not real content, so
            it's hidden from assistive tech rather than treated as body copy. */}
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
            <span
              className="h-6 w-6 rounded-pill bg-cover bg-center shadow-xs"
              style={avatar(68)}
            />
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Marcelo Hernandez</p>
              <p className="text-xs text-slate-600">@marcelohernandez</p>
            </div>
          </div>

          <p className="mt-2 text-xs leading-snug text-slate-600">
            I&apos;ve been reflecting on the ongoing discussions about the A.I. Bubble, and here&apos;s my perspective on retail investor flows into the market&hellip;
          </p>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-xs border border-slate-100">
            <span>Target <b className="text-slate-900 font-bold">$280</b></span>
            <span className="text-slate-300">|</span>
            <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
            <span className="rounded-pill bg-emerald-50 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-100">
              Bullish
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