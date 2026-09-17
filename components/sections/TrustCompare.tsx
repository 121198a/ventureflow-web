"use client";

import { CheckCircle2, MoreVertical, ThumbsUp, MessageCircle } from "lucide-react";
import { ComplianceShieldIcon, GrowthChartIcon } from "@/components/ui/CustomIcons";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export function TrustCompare() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-y border-slate-200/80 px-5 py-20 sm:py-28">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl" />

      <Reveal className="relative z-10 mx-auto max-w-[900px] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-4 py-1.5 text-xs font-semibold text-blue-800 shadow-2xs">
          <GrowthChartIcon size={14} className="text-blue-600" />
          <span>The Accountability Gap</span>
        </span>

        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
          <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <CountUp value={61} suffix="%" />
          </span>{" "}
          of investors under 35 source investment ideas from social feeds.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-500">
          FINRA Investor Education Foundation,{" "}
          <a
            href="https://www.finra.org/media-center/newsreleases/2025/finra-foundation-releases-sixth-wave-national-financial-capability"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-blue-600 font-medium"
          >
            National Financial Capability Study, 2025
          </a>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg font-normal text-slate-600 leading-relaxed">
          When market calls are detached from entry points and deadlines, accuracy is impossible to verify. UnBound X fixes the missing ledger.
        </p>
      </Reveal>

      <div className="relative mx-auto mt-16 grid grid-cols-1 max-w-[1100px] items-stretch gap-8 md:grid-cols-2">
        {/* Without Track Record (Left Side) */}
        <Reveal direction="left" className="w-full min-w-0 flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unverified Social Discourse
            </p>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-micro font-semibold text-slate-600">
              Zero Accountability
            </span>
          </div>

          <div className="flex-1 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                  MM
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight">MarketMaverick</p>
                  <p className="text-xs text-slate-500">@mavmarkets</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-medium">2h ago</span>
            </div>

            <p className="mt-3 text-sm text-slate-700 leading-snug">
              Semiconductors are set to explode into earnings. Loaded calls at open, up 312% on the quarter. Never bet against momentum.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
              <span>1,204 likes</span>
              <span>212 reposts</span>
              <span>89 replies</span>
              <span>84.2K views</span>
            </div>

            <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-micro font-bold text-slate-600 shrink-0">
                DR
              </span>
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">@d_reyes: </span>
                <span className="text-slate-500">what was your entry price, target price, and closing date?</span>
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/60 p-4 text-center">
            <p className="text-xs font-bold text-rose-700 tracking-wide">No Verification Mechanism</p>
            <p className="mt-0.5 text-xs text-slate-600 font-normal">No locked target, no fixed timeframe, no recorded outcome history.</p>
          </div>
        </Reveal>

        {/* With Track Record (Right Side - UnBound X) */}
        <Reveal direction="right" className="gb-interactive-card gb-animated-line relative w-full min-w-0 flex flex-col rounded-2xl border-2 border-blue-600 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(30,64,175,0.08)]">
          <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            <ComplianceShieldIcon size={12} />
            <span>UnBound X Verified</span>
          </span>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Audited Public Ledger
            </p>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-micro font-bold text-blue-700 border border-blue-100">
              Immutable
            </span>
          </div>

          <div className="flex-1 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs shrink-0">
                  JM
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight">Jacob Martin</p>
                  <p className="text-xs text-slate-500">@jmartin &middot; Verified Analyst</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0">
                90d ago <MoreVertical size={13} />
              </span>
            </div>

            <p className="mt-3 text-sm font-bold text-slate-900 leading-snug">
              Semiconductor valuation rerates as data center capacity commitments expand through Q4
            </p>

            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Foundry capacity reservations and hyperscaler capex guidance point to sustained gross margin expansion. Target reflects a 28x multiple on consensus forward earnings.
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-100 shadow-2xs">
              <span>Target <b className="text-slate-900 font-bold">$280</b></span>
              <span className="text-slate-300">|</span>
              <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-3 text-slate-500 font-medium">
                <span className="flex items-center gap-1"><ThumbsUp size={13} /> 100</span>
                <span className="flex items-center gap-1"><MessageCircle size={13} /> 734</span>
              </span>

              <span className="flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200 text-micro">
                  <CheckCircle2 size={12} /> Hit
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 text-micro">
                  $NVDA
                </span>
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs shrink-0">
                JM
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 leading-tight">Jacob&apos;s Audited Record</p>
                <p className="text-xs text-slate-500 truncate sm:whitespace-normal">41 published theses &middot; 24 confirmed hits &middot; 17 misses publicly archived</p>
              </div>
            </div>

            <div className="shrink-0 text-right pl-3">
              <p className="text-xl font-black text-slate-900 leading-none">
                <CountUp value={58.5} decimals={1} suffix="%" />
              </p>
              <p className="text-micro font-bold text-slate-500 mt-0.5">Hit rate</p>
            </div>
          </div>
        </Reveal>

        {/* Floating "vs" Divider */}
        <span className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-black uppercase text-slate-500 shadow-md md:flex z-20">
          vs
        </span>
      </div>
    </section>
  );
}