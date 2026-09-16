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
    <section className="bg-slate-50/50 px-5 py-20 sm:py-28 border-t border-slate-200/80">
      {/* Brokerage Trading Block */}
      <div className="mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="order-2 lg:order-1 lg:pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <WalletInvestmentIcon size={14} className="text-blue-600" />
            <span>Execution Protocol</span>
          </span>

          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Integrated Brokerage Execution
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Transition seamlessly from thesis formulation to capital allocation. Every portfolio trade ties directly to its recorded thesis, executed through registered broker-dealer MARV Capital, Inc.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="gb-interactive-card order-1 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card hover:shadow-elevated transition-shadow lg:order-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900 text-base">Buy 20 AMD</p>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Market Order
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 border-t border-slate-100 pt-5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Shares</dt>
              <dd className="font-bold text-slate-900">20</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Order type</dt>
              <dd className="font-bold text-slate-900">Market</dd>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6">
              <dt className="shrink-0 text-slate-500">Tied to</dt>
              <dd className="text-right font-medium text-slate-800 text-xs">
                AMD expands data center accelerator market share
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-slate-900 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-slate-800 transition-colors focus-ring cursor-pointer"
          >
            Review order
          </button>

          <p className="mt-3 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <ComplianceShieldIcon size={12} className="text-blue-600 inline" />
            <span>Execution through MARV Capital, Inc. &middot; Member FINRA/SIPC</span>
            <Info size={12} className="inline ml-0.5 align-middle shrink-0" />
          </p>
        </Reveal>
      </div>

      {/* Competitions / Research League Block */}
      <div className="mx-auto mt-24 grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="gb-interactive-card rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card hover:shadow-elevated transition-shadow">
          <p className="mb-5 flex items-center gap-2 font-bold text-slate-900 text-base">
            <Trophy size={18} className="text-amber-500" /> Research League Leaderboard
          </p>

          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 sm:gap-x-6 gap-y-4 text-xs sm:text-sm border-t border-slate-100 pt-4">
            <span className="text-micro font-bold uppercase tracking-wider text-slate-400">RANK</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-400">CLUB</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-400 text-right">HIT RATE</span>

            {leaderboard.map((row) => (
              <Fragment key={row.rank}>
                <span className={"font-bold " + (row.active ? "text-blue-600" : "text-slate-500")}>
                  {row.rank}
                </span>
                <span className={"font-semibold " + (row.active ? "text-blue-600" : "text-slate-800")}>
                  {row.club}
                </span>
                <span className={"text-right font-bold " + (row.active ? "text-blue-600" : "text-slate-900")}>
                  {row.rate}
                </span>
              </Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <Trophy size={13} className="text-amber-500" />
            <span>Collegiate &amp; Fund Leagues</span>
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Analyst Tournaments &amp; Competitions
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Test your research against peer funds and collegiate societies. Tournament theses are benchmarked using the same locked horizons and audited scoring standards.
          </p>
        </Reveal>
      </div>
    </section>
  );
}