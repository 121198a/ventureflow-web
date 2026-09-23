 "use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Lock, X, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { AuthButton } from "@/components/ui/AuthButton";
import styles from "./AboutSection.module.css";

const ABOUT_PHOTOS = [
  "/image/about/1.jpg",
  "/image/about/2.jpg",
  "/image/about/3.jpg",
  "/image/about/4.jpg",
  "/image/about/5.jpg",
] as const;

const HERO_AVATARS = [
  { src: ABOUT_PHOTOS[0], className: "left-[8%] top-[6%] h-14 w-14 sm:h-16 sm:w-16" },
  { src: ABOUT_PHOTOS[1], className: "right-[9%] top-[8%] h-14 w-14 sm:h-16 sm:w-16" },
  { src: ABOUT_PHOTOS[2], className: "right-[4%] top-[46%] h-11 w-11 sm:h-12 sm:w-12" },
  { src: ABOUT_PHOTOS[3], className: "left-[14%] bottom-[10%] h-12 w-12 sm:h-14 sm:w-14" },
  { src: ABOUT_PHOTOS[4], className: "right-[16%] bottom-[6%] h-11 w-11 sm:h-12 sm:w-12" },
] as const;

const COMPARISON_ROWS: [string, boolean | "soon", boolean | "soon", boolean | "soon"][] = [
  ["Standardized Entry & Target Pricing", true, false, true],
  ["Structured Thesis & Research Context", false, true, true],
  ["Fixed Time Horizon Commitment", false, false, true],
  ["Permanent, Unalterable Outcome History", false, false, true],
  ["Audited Credibility & Verified Hit Rate", false, false, true],
  ["Integrated Brokerage Execution", true, false, true],
];

const FOUNDERS = [
  {
    name: "Maneesh Awasthi",
    role: "Co-Founder & CEO",
    photo: ABOUT_PHOTOS[0],
    bio: "Over 20 years in institutional finance across global stocks, derivatives, and market trading systems.",
  },
  {
    name: "Arnav Awasthi",
    role: "Co-Founder, COO, Head of Product",
    photo: ABOUT_PHOTOS[1],
    bio: "Fintech product builder and engineer focused on verified track records for everyday investors and private markets.",
  },
] as const;

const TEAM = [
  { name: "Gaurav Madhogaria", role: "Engineering Lead", photo: ABOUT_PHOTOS[2] },
  { name: "Dinesh Pathak", role: "Systems Architecture", photo: ABOUT_PHOTOS[3] },
  { name: "Rama Rao", role: "Market Operations", photo: ABOUT_PHOTOS[4] },
  { name: "Chetan Chauhan", role: "Investment Research", photo: ABOUT_PHOTOS[0] },
  { name: "Dhruvi Turakhia", role: "Product Strategy", photo: ABOUT_PHOTOS[1] },
  { name: "Nimisha Pathar", role: "Product Design", photo: ABOUT_PHOTOS[2] },
] as const;

function Mark({ value }: { value: boolean | "soon" }) {
  if (value === "soon") {
    return (
      <span className="inline-block rounded-pill bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold text-blue-600 border border-blue-200/80">
        COMING SOON
      </span>
    );
  }
  if (value)
    return (
      <Check
        size={18}
        strokeWidth={2.5}
        className="mx-auto align-middle text-emerald-600"
        aria-label="Yes"
      />
    );
  return (
    <X
      size={18}
      strokeWidth={2.5}
      className="mx-auto align-middle text-slate-400"
      aria-label="No"
    />
  );
}

export default function AboutSection() {
  return (
    <div className="bg-slate-50/80 border-slate-100 font-sans text-slate-900 antialiased">
      {/* HERO */}
      <section className={`relative flex min-h-[85vh] flex-col justify-center overflow-hidden to-blue-400 ${styles.dotGrid || ""}`}>
        {HERO_AVATARS.map((a, i) => (
          <span
            key={a.src + i}
            className={`absolute z-10 hidden overflow-hidden rounded-pill border-2 border-white shadow-md sm:block ${a.className}`}
            aria-hidden="true"
          >
            <Image src={a.src} alt="" width={64} height={64} className="h-full w-full object-cover" />
          </span>
        ))}
        <Reveal className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-32">
          <h1 className="font-about-display text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight">
            Credibility in investing should be earned <br />
            <span className="text-blue-600">through outcomes, not follower counts.</span>
          </h1>

          <p className="font-about-display mt-7 text-lg font-semibold">
            We built the verifiable record-keeping protocol for market research.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-base text-slate-600">
            Every thesis includes a locked entry point, an explicit target price, and a fixed time horizon. The market then decides whether the call was right.
          </p>

          <div className="mt-9 flex items-center justify-center">
            <AuthButton
              flow="signup"
              className="btn-pill-primary px-7 py-3.5"
              icon={false}
            >
              <span>Start your record</span>
              <ArrowRight size={15} />
            </AuthButton>
          </div>
        </Reveal>
      </section>

      {/* HARD TO KNOW */}
      <section id="hard-to-know" className="bg-blue-50/70 py-24 border-y border-slate-200/80">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold leading-tight tracking-tight">
            Why Traditional Social Investing <br className="hidden sm:block" /> Suffers From an Accountability Problem
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-600">
            Audience size can be bought. Bad calls can be deleted. Screenshots can be edited to fit a story. None of that proves whether someone is consistently right.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          <Reveal delay={0} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="mb-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="mb-2 h-2.5 w-3/4 rounded bg-slate-200" />
              <div className="mb-2 h-2.5 w-1/2 rounded bg-slate-200" />
              <div className="mb-4 h-2.5 w-2/3 rounded bg-slate-200" />
              <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-600 border border-slate-200">
                <Lock size={11} strokeWidth={2.5} /> Subscription paywall
              </span>
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              Paywalls obscure historical accuracy.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Many trading groups charge upfront fees before you can check whether their past calls were actually right.
            </p>
          </Reveal>

          <Reveal delay={0.08} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="relative mb-6 flex h-[104px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="text-center">
                <CountUp value={312} prefix="+" suffix="%" className="font-mono text-3xl font-bold text-emerald-600" />
                <p className="mt-1 text-micro text-slate-500">Isolated trade capture</p>
              </div>
              <span className="absolute right-6 top-2 bottom-2 border-r border-dashed border-slate-300" aria-hidden="true" />
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              Selective wins conceal broader risk.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              One winning trade tells you nothing about risk control or long-term investing skill.
            </p>
          </Reveal>

          <Reveal delay={0.16} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="mb-6 flex h-[104px] items-center justify-center gap-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="text-center">
                <div className="font-mono text-lg font-bold"><CountUp value={500} /></div>
                <div className="text-micro text-slate-600">followers</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <div className="font-mono text-lg font-bold"><CountUp value={500000} /></div>
                <div className="text-micro text-slate-600">followers</div>
              </div>
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              Audience scale is not performance.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A disciplined analyst with 500 followers often does deeper, better research than a popular account with 500,000.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOUNDERS NOTE */}
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-12 shadow-xs">
          <Reveal>
            <span className="mb-4 block h-[3px] w-8 bg-blue-600 rounded-full" />
            <span className="font-mono text-xs font-semibold tracking-[0.02em] text-blue-600">
              A note from the founders
            </span>
            <h2 className="font-about-display mt-4 text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-snug">
              Investing is hard for two honest reasons.
              <span className="mt-3 block text-[0.85em] font-semibold text-slate-600">
                Nobody knows the future, and nobody has time to do all the work.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="mt-7 max-w-[62ch] space-y-5 text-sm leading-relaxed text-slate-700">
            <p>
              Those two problems are old, and we cannot fix them. What we can change is what got built around them.
            </p>
            <p>
              Right now, deciding who to listen to means reading screenshots with nothing behind them. Follower counts stand in for skill. Calls quietly disappear when they miss. The one thing that would actually help you judge someone is the thing you never get to see.
            </p>
            <p>
              So we started with a simple idea. Write down what you believe before the outcome is known. Give it a price, a target, and a deadline. Leave it there. Let the market build the record.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <blockquote className="mt-8 rounded-xl border-l-4 border-blue-600 bg-slate-50 px-6 py-5">
              <p className="font-about-display text-lg font-semibold leading-snug">
                &ldquo;We wanted a way for good work to become visible without asking anyone to take your word for it.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-slate-700">
              That idea does not stop with individual investors. A student with no audience and a company nobody has met yet hit the same wall. Being good is not the same as being seen. Everything we are building starts there.
            </p>
          </Reveal>

          <Reveal delay={0.26} className="mt-10 flex flex-wrap gap-6 sm:gap-10 border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3">
              <span className="inline-block h-11 w-11 shrink-0 overflow-hidden rounded-pill shadow-xs">
                <Image src={FOUNDERS[0].photo} alt={FOUNDERS[0].name} width={44} height={44} className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold">Maneesh Awasthi</div>
                <div className="text-sm text-slate-600">Co‑Founder &amp; CEO</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block h-11 w-11 shrink-0 overflow-hidden rounded-pill shadow-xs">
                <Image src={FOUNDERS[1].photo} alt={FOUNDERS[1].name} width={44} height={44} className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold">Arnav Awasthi</div>
                <div className="text-sm text-slate-600">Co‑Founder, COO, Head of Product</div>
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT YOU ACTUALLY GET */}
      <section className="py-24 bg-blue-50/70 border-y border-slate-200/80">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold tracking-tight">
            What you actually get.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Most platforms give you somewhere to trade or somewhere to talk. We built the record in between.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl px-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="w-[42%] py-4 pl-6 pr-4 font-medium text-slate-600">
                      <span className="sr-only">Comparison aspect</span>
                    </th>
                    <th className="px-4 py-4 text-center font-semibold text-slate-600">
                      Trading apps
                    </th>
                    <th className="px-4 py-4 text-center font-semibold text-slate-600">
                      Paid groups
                    </th>
                    <th className="bg-blue-50 py-4 pl-4 pr-6 text-center font-bold text-blue-600">
                      UnBound X
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMPARISON_ROWS.map(([label, a, b, c]) => (
                    <tr key={label} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 pl-6 pr-3 font-medium text-slate-800">{label}</td>
                      <td className="px-3 py-4 text-center align-middle"><Mark value={a} /></td>
                      <td className="px-3 py-4 text-center align-middle"><Mark value={b} /></td>
                      <td className="bg-blue-50/40 py-4 pl-3 pr-6 text-center align-middle"><Mark value={c} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* THE PEOPLE BUILDING IT */}
      <section className="py-24 bg-white border-t border-slate-100">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold tracking-tight">
            The people building it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Built by people from institutional finance, engineering, and investing.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 px-6 sm:grid-cols-2">
          {FOUNDERS.map((f, i) => (
            <Reveal
              key={f.name}
              delay={i * 0.08}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-xl shadow-xs">
                  <Image src={f.photo} alt={f.name} width={48} height={48} className="h-full w-full object-cover" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 text-base">{f.name}</p>
                  <p className="text-xs font-semibold text-blue-600">{f.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{f.bio}</p>
            </Reveal>
          ))}
        </div>

        {/* THE TEAM */}
        <div className="mx-auto mt-16 max-w-4xl px-6">
          <p className="border-t border-slate-200 pt-8 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Core Team &amp; Architecture
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 0.05}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <Image src={t.photo} alt={t.name} width={40} height={40} className="h-full w-full object-cover" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-600">{t.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-20 mt-24 sm:mt-28">
        <div className="absolute inset-x-0 top-0 z-20 -translate-y-1/2 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="card-fintech mx-auto flex w-full max-w-[1120px] flex-col items-center gap-8 p-6 md:p-10 shadow-xl md:flex-row md:justify-between"
          >
            <div className="text-center md:text-left">
              <h2 className="font-about-display text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold tracking-tight text-slate-900">
                See what we&rsquo;re building.
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                The best way to understand UnBound X is to use it. Put an idea on the record and see where it goes.
              </p>
              <div className="mt-5">
                <AuthButton
                  flow="signup"
                  className="btn-pill-primary px-6 py-3.5"
                  icon={false}
                >
                  Explore UnBound X <ArrowRight size={15} />
                </AuthButton>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3.5 rounded-lg border border-slate-200 bg-white p-4">
              <Image
                src="/image/QR.webp"
                width={72}
                height={72}
                alt="Scan to open UnBound X on your phone"
                className="h-[72px] w-[72px] rounded-sm object-contain"
              />
              <div className="text-xs">
                <p className="text-sm font-semibold text-slate-900">Take it with you.</p>
                <p className="mt-0.5 text-slate-600">Scan to open UnBound X on your phone.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}