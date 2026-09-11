"use client";

import { Fragment } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Info, Trophy } from "lucide-react";

const leaderboard = [
  { rank: 1, club: "Summit Investing Society", rate: "59%", active: false },
  { rank: 2, club: "Hawk Investment Club", rate: "57%", active: true },
  { rank: 3, club: "Blue Harbor Capital Club", rate: "52%", active: false },
];

export function TradeCompete() {
  return (
    <section className="bg-blue-50 px-5 py-20 sm:py-28 border-t border-slate-100">
      {/* Brokerage Trading Block */}
      <div className="mx-auto grid max-w-[1100px] items-start gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="order-2 lg:order-1 lg:pt-6">
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Brokerage trading
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Every trade links back to the thesis behind it. Orders run through MARV Capital, a registered broker-dealer.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="gb-interactive-card order-1 rounded-lg border border-slate-200 bg-white p-5 sm:p-7 shadow-lg shadow-slate-900/5 lg:order-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900 text-base">Buy 20 AMD</p>
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              Market Order
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 border-t border-slate-100 pt-5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Shares</dt>
              <dd className="font-bold text-slate-900">20</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Order type</dt>
              <dd className="font-bold text-slate-900">Market</dd>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6">
              <dt className="shrink-0 text-slate-600">Tied to</dt>
              <dd className="text-right font-medium text-slate-800 text-xs">
                AMD closes the gap in data center accelerators
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            Review order
          </button>

          <p className="mt-3 text-center text-xs text-slate-600">
            Execution through MARV Capital, a registered broker-dealer <Info size={12} className="inline ml-0.5 align-middle shrink-0" />
          </p>
        </Reveal>
      </div>

      {/* Competitions / Fall Invitation Block */}
      <div className="mx-auto mt-24 grid max-w-[1100px] items-center gap-10 lg:grid-cols-2">
        <Reveal direction="left" className="gb-interactive-card rounded-lg border border-slate-200 bg-white p-5 sm:p-7 shadow-lg shadow-slate-900/5">
          <p className="mb-5 flex items-center gap-2 font-bold text-slate-900 text-base">
            <Trophy size={18} className="text-amber-500" /> Fall Invitation
          </p>

          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 sm:gap-x-6 gap-y-4 text-xs sm:text-sm">
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">RANK</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">CLUB</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600 text-right">HIT RATE</span>

            {leaderboard.map((row) => (
              <Fragment key={row.rank}>
                <span className={"font-bold " + (row.active ? "text-blue-600" : "text-slate-600")}>
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
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Competitions
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Compete using the same tracked theses you publish on UnBound X. Competition results are scored separately and do not change your main track record.
          </p>
        </Reveal>
      </div>
    </section>
  );
}