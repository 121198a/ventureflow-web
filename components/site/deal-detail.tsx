"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import type { Offering } from "@/lib/offerings-data";
import { StatRow } from "./stat-row";
import { Button } from "@/components/ui/button";
import { ShareDealModal } from "./share-deal-modal";
import { LoginRequiredModal } from "./login-required-modal";
import {
  FundingTargetIcon,
  WalletInvestmentIcon,
  GrowthChartIcon,
  PartnershipRingsIcon,
  CompanyBuildingIcon,
  DocumentFilingIcon,
} from "@/components/ui/CustomIcons";

function GatedRow({ items }: { items: { label: string; hint?: boolean }[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <p className="flex items-center gap-1.5 text-[0.9rem] text-ink/70">
            {item.label}
            {item.hint && <Info className="size-3.5 shrink-0 text-muted-foreground" />}
          </p>
          {/* Permanently blurred placeholder — matches the reference, where
              these fields stay blurred behind auth regardless of how long you
              wait; there's no real figure to reveal here without a backend. */}
          <div aria-hidden className="mt-2 h-4 w-4/5 rounded bg-brand/10 blur-[3px]" />
        </div>
      ))}
    </div>
  );
}

export function DealDetail({ offering }: { offering: Offering }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const longDescription = offering.description.length > 220;
  const shownDescription =
    longDescription && !expanded ? offering.description.slice(0, 220).trimEnd() + "…" : offering.description;

  const sidebarStats = [
    { value: offering.goal, label: "Funding Goal", icon: <FundingTargetIcon size={14} /> },
    { value: offering.min, label: "Min. Investment", icon: <WalletInvestmentIcon size={14} /> },
    { value: offering.stats.interestIndicated ?? "--", label: "Interest Indicated", icon: <GrowthChartIcon size={14} /> },
    { value: offering.stats.committed ?? "--", label: "Committed", icon: <PartnershipRingsIcon size={14} /> },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1180px] px-5 py-10">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[oklch(0.93_0.06_150)] px-3 py-1 text-[0.78rem] text-[oklch(0.4_0.1_150)]" style={{ fontWeight: 700 }}>
              {offering.status}
            </span>
            <span className="rounded-full border border-brand/40 px-3 py-1 text-[0.78rem] text-brand" style={{ fontWeight: 600 }}>
              {offering.filing}
            </span>
          </div>
          <ShareDealModal slug={offering.slug} />
        </div>

        {/* Hero */}
        <div className="mt-5 grid gap-6 rounded-lg border border-hairline p-5 sm:grid-cols-[1.3fr_1fr] sm:items-center sm:gap-8 sm:p-8">
          <div>
            <h1 className="text-[1.9rem] leading-tight sm:text-[2.1rem]" style={{ fontWeight: 800 }}>
              Welcome to <span className="text-brand">{offering.name}</span>
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/75">
              {shownDescription}
              {longDescription && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="ml-2 text-brand underline"
                  style={{ fontWeight: 600 }}
                >
                  {expanded ? "View Less" : "View More"}
                </button>
              )}
            </p>
            <Button variant="outline" size="sm" className="mt-6" onClick={() => setLoginOpen(true)}>
              Indicate Interest
            </Button>
          </div>
          <div
            className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md"
            style={{ background: offering.art }}
          >
            <span className="text-5xl text-white/90" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
              {offering.initials}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Capital Raise Overview (gated) */}
            <section>
              <h2 className="text-[1.3rem]" style={{ fontWeight: 800 }}>
                Capital Raise Overview
              </h2>
              <div className="mt-4 border-t border-hairline pt-6">
                <GatedRow items={[{ label: "Funding Goal" }, { label: "Funding Instrument" }]} />
              </div>
            </section>

            {/* Investors (gated) */}
            <section className="mt-10">
              <h2 className="text-[1.3rem]" style={{ fontWeight: 800 }}>
                Investors
              </h2>
              <div className="mt-4 border-t border-hairline pt-6">
                <GatedRow
                  items={[
                    { label: "Total" },
                    { label: "New This Round", hint: true },
                    { label: "Lead Investor" },
                    { label: "Average Check Size", hint: true },
                  ]}
                />
              </div>
            </section>

            {/* About */}
            <section className="mt-10">
              <h2 className="text-[1.3rem]" style={{ fontWeight: 800 }}>
                About
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-8 border-t border-hairline pt-6 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1.5 text-[0.9rem] text-ink/70">
                    <CompanyBuildingIcon size={15} className="text-muted-foreground" />
                    <span>Legal Offeror</span>
                  </p>
                  <p className="mt-1 text-[0.95rem] text-ink" style={{ fontWeight: 600 }}>
                    {offering.legalOfferor}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[0.9rem] text-ink/70">
                    <DocumentFilingIcon size={15} className="text-muted-foreground" />
                    <span>Law Firm</span>
                  </p>
                  <p className="mt-1 text-[0.95rem] text-ink" style={{ fontWeight: 600 }}>
                    {offering.lawFirm}
                  </p>
                </div>
              </div>

              <h3 className="mt-8 text-[1.1rem] text-brand" style={{ fontWeight: 700 }}>
                What is {offering.name}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/75">{offering.aboutBody}</p>

              {offering.categories.length > 0 && (
                <>
                  <h3 className="mt-8 text-[1.1rem] text-brand" style={{ fontWeight: 700 }}>
                    Categories:
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offering.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-surface-alt px-3.5 py-1.5 text-[0.82rem] text-ink/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-lg border border-hairline p-6 lg:sticky lg:top-24">
            <p className="text-[0.9rem] text-ink/70">
              Current Funding Round:{" "}
              <span className="text-brand" style={{ fontWeight: 700 }}>
                {offering.round}
              </span>
            </p>
            <div className="mt-5 border-t border-hairline pt-5">
              <StatRow items={sidebarStats.slice(0, 2)} />
              <div className="mt-5">
                <StatRow items={sidebarStats.slice(2, 4)} />
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[0.78rem] text-muted-foreground">Funded</p>
              <p className="mt-1 text-[0.95rem] text-ink" style={{ fontWeight: 800 }}>
                {offering.stats.funded ?? "--"}
              </p>
            </div>
            <Button className="mt-6 w-full rounded-md" variant="outline" onClick={() => setLoginOpen(true)}>
              Indicate Interest
            </Button>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="rounded-md border border-brand/50 px-3 py-2.5 text-[0.82rem] text-brand transition-colors hover:bg-brand/5"
                style={{ fontWeight: 600 }}
              >
                Deal Deck
              </button>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="rounded-md border border-brand/50 px-3 py-2.5 text-[0.82rem] text-brand transition-colors hover:bg-brand/5"
                style={{ fontWeight: 600 }}
              >
                Data Room
              </button>
            </div>
          </aside>
        </div>
      </div>

      <LoginRequiredModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
