"use client";

import { Fragment } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Info, Trophy } from "lucide-react";
import { WalletInvestmentIcon, ComplianceShieldIcon } from "@/components/ui/CustomIcons";

const leaderboard = [
  { rank: 1, club: "Summit Investing Society", rate: "59%", active: false },
  { rank: 2, club: "Hawk Investment Club", rate: "57%", active: true },
  { rank: 3, club: "Blue Harbor Capital Club", rate: "52%", active: false },
];

export function TradeCompete() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/70 px-5 py-20 sm:py-28 border-t border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Brokerage Trading Block */}
      <div className="relative z-10 mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="order-2 lg:order-1 lg:pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
            <WalletInvestmentIcon size={14} className="text-blue-600" />
            <span>Execution Protocol</span>
          </span>

          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Integrated Brokerage Execution
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Transition seamlessly from thesis formulation to capital allocation. Every portfolio trade ties directly to its recorded thesis, executed through registered broker-dealer MARV Capital, Inc.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="card-fintech order-1 p-6 sm:p-8 lg:order-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-bold text-slate-900 text-base">Buy 20 AMD</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80">
              Market Order
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 border-t border-slate-100 pt-5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Shares</dt>
              <dd className="font-bold text-slate-900 tabular-numbers">20</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Order type</dt>
              <dd className="font-bold text-slate-900">Market</dd>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6">
              <dt className="shrink-0 text-slate-500 font-medium">Tied to</dt>
              <dd className="text-right font-medium text-slate-800 text-xs">
                AMD expands data center accelerator market share
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className="btn-pill-primary mt-6 w-full py-3"
          >
            Review order
          </button>

          <p className="mt-3.5 text-center text-xs text-slate-500 flex items-center justify-center gap-1 font-normal">
            <ComplianceShieldIcon size={12} className="text-blue-600 inline" />
            <span>Execution through MARV Capital, Inc. &middot; Member FINRA/SIPC</span>
            <Info size={12} className="inline ml-0.5 align-middle shrink-0" />
          </p>
        </Reveal>
      </div>

      {/* Competitions / Research League Block */}
      <div className="relative z-10 mx-auto mt-24 grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="card-fintech p-6 sm:p-8">
          <p className="mb-5 flex items-center gap-2 font-bold text-slate-900 text-base">
            <Trophy size={18} className="text-amber-500" /> Research League Leaderboard
          </p>

          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 sm:gap-x-6 gap-y-4 text-xs sm:text-sm border-t border-slate-100 pt-4">
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">RANK</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">CLUB</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600 text-right">HIT RATE</span>

            {leaderboard.map((row) => (
              <Fragment key={row.rank}>
                <span className={"font-bold tabular-numbers " + (row.active ? "text-blue-600 font-extrabold" : "text-slate-500")}>
                  {row.rank}
                </span>
                <span className={"font-semibold " + (row.active ? "text-blue-600" : "text-slate-800")}>
                  {row.club}
                  {row.active && <span className="ml-1.5 text-micro rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 font-bold">You</span>}
                </span>
                <span className={"text-right font-bold tabular-numbers " + (row.active ? "text-blue-600 font-extrabold" : "text-slate-900")}>
                  {row.rate}
                </span>
              </Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/70 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-2xs">
            <Trophy size={13} className="text-amber-600" />
            <span>Collegiate &amp; Fund Leagues</span>
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Analyst Tournaments &amp; Competitions
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Test your research against peer funds and collegiate societies. Tournament theses are benchmarked using the same locked horizons and audited scoring standards.
          </p>
        </Reveal>
      </div>
    </section>
  );
}