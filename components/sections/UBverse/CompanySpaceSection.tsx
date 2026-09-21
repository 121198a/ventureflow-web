"use client";

import { useState } from "react";
import { Lock, CheckSquare, Briefcase, Database, Search } from "lucide-react";
import { DocumentFilingIcon } from "@/components/ui/CustomIcons";
import { cn } from "@/lib/utils";

const tabs = ["Updates", "Milestones", "Team", "Materials"];

const pillItems = [
  { label: "Investor updates", icon: DocumentFilingIcon },
  { label: "Milestones", icon: CheckSquare },
  { label: "Hiring", icon: Briefcase },
  { label: "Deck", icon: DocumentFilingIcon },
  { label: "Data room", icon: Database },
  { label: "Diligence", icon: Search },
];

const tabContentMap: Record<string, { tag: string; title: string; desc: string; metrics: { label: string; value: string }[] }> = {
  Updates: {
    tag: "Investor updates",
    title: "First hospital contract signed",
    desc: "Eighteen months of validation work, and the pilot converted.",
    metrics: [
      { label: "Sites live", value: "3" },
      { label: "Tests run", value: "4,120" },
      { label: "Team", value: "14" },
    ],
  },
  Milestones: {
    tag: "Milestones",
    title: "Commercial pipeline expanding",
    desc: "3 new clinical research trials onboarded this quarter.",
    metrics: [
      { label: "Trials", value: "7" },
      { label: "Pipeline", value: "$1.2M" },
    ],
  },
  Team: {
    tag: "Hiring",
    title: "Key engineering roles open",
    desc: "Looking for Senior Biomedical Systems Engineer & Lead Bio-analyst.",
    metrics: [
      { label: "Open roles", value: "3" },
      { label: "Location", value: "Remote / SF" },
    ],
  },
  Materials: {
    tag: "Deck & Data Room",
    title: "Series A Institutional Deck",
    desc: "Verified financial projections, unit economics, and clinical data.",
    metrics: [{ label: "Access", value: "Verified Only" }],
  },
};

export function CompanySpaceSection() {
  const [activeTab, setActiveTab] = useState("Updates");
  const [activePill, setActivePill] = useState("Investor updates");
  const currentCard = tabContentMap[activeTab] || tabContentMap.Updates;

  return (
    <section id="the-company-space" className="scroll-mt-32 relative z-10 w-full bg-white pt-20 pb-10 lg:pt-28 lg:pb-14 overflow-hidden transition-all duration-300">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 text-center">

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center rounded-pill border border-slate-200/90 bg-white px-4 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
            The company Space
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]">
          Give investors more than a pitch deck. <br />
          <span className="text-blue-600">Give them a company they can understand.</span>
        </h2>

        {/* ========================================================================= */}
        {/* 1. 6 PILLS SELECTOR GRID (Active <= 1060px) */}
        {/* ========================================================================= */}
        <div className="block min-[1061px]:hidden mt-8 max-w-[640px] mx-auto px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {pillItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activePill === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActivePill(item.label)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs font-semibold text-left shadow-2xs",
                    isSelected
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-blue-600" : "text-slate-600")} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN BROWSER MOCKUP CARD */}
        {/* ========================================================================= */}
        <div className="mt-4 min-[1061px]:mt-12 mx-auto max-w-[760px] rounded-lg border border-slate-200/90 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] overflow-hidden text-left">

          {/* Top Browser Bar */}
          <div className="relative flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3 sm:px-5 py-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="h-2.5 w-2.5 rounded-pill bg-slate-300" />
              <div className="h-2.5 w-2.5 rounded-pill bg-slate-300" />
              <div className="h-2.5 w-2.5 rounded-pill bg-slate-300" />
            </div>

            <div className="min-w-0 flex-1 mx-2 sm:mx-4 truncate rounded-pill bg-white border border-slate-200/90 px-3 sm:px-4 py-0.5 text-xs font-medium text-slate-600 shadow-2xs text-center">
              unboundx.co/spaces/<span className="font-bold text-slate-700">halden-diagnostics</span>
            </div>

            <div className="w-10 shrink-0 hidden sm:block" />
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-base border border-emerald-100 shadow-2xs">
                  HD
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">Halden Diagnostics</h3>
                  <p className="text-xs text-slate-600 mt-1 truncate">Point of care testing &middot; Series A &middot; 14 people</p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-pill bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100 shrink-0">
                Startup
              </span>
            </div>

            {/* 3 Actions */}
            <div className="mt-6 grid grid-cols-1 min-[440px]:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-2.5 sm:p-3.5 text-center">
                <span className="block text-xs font-bold text-slate-900">Invest</span>
                <span className="text-xs text-slate-600 mt-0.5 block">Accredited only</span>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 sm:p-3.5 text-center">
                <span className="block text-xs font-bold text-blue-600">Join the team</span>
                <span className="text-xs text-blue-600 mt-0.5 block">3 open roles</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-2.5 sm:p-3.5 text-center">
                <span className="block text-xs font-bold text-slate-900">Advise</span>
                <span className="text-xs text-slate-600 mt-0.5 block">Regulatory help</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-7 flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div role="tablist" className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold sm:gap-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "cursor-pointer transition-colors pb-3 -mb-3 flex items-center gap-1 whitespace-nowrap focus-ring",
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {tab === "Materials" && <Lock className="h-3 w-3" />}
                    {tab}
                  </button>
                ))}
              </div>

              <span className="self-start rounded-pill bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 border border-blue-100 tracking-wide sm:self-auto">
                Verified only
              </span>
            </div>

            {/* Post Card */}
            <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50/40 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-blue-100 text-blue-700 font-bold text-xs">
                  NR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Nadia Rahman</h4>
                  <p className="text-xs text-slate-600">Founder &middot; 2 weeks ago</p>
                </div>
              </div>

              <h5 className="mt-3.5 text-sm font-bold text-slate-900">{currentCard.title}</h5>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                {currentCard.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentCard.metrics.map((m) => (
                  <span key={m.label} className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                    {m.label} <b className="text-slate-900 ml-1">{m.value}</b>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 6-Dash Indicators */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-pill transition-all duration-300",
                i === 0 ? "w-10 bg-blue-600" : "w-6 bg-slate-200"
              )}
            />
          ))}
        </div>

        <p className="mt-3.5 text-xs text-slate-600 font-medium">
          Your company stays current. Your raise stops being a second job.
        </p>

      </div>
    </section>
  );
}
