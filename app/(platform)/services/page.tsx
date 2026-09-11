import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Service Tiers | UBverse",
  description: "Compare UBverse service tiers for founders raising capital.",
};

const tierColumns = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        <p className="eyebrow">Service tiers</p>
        <h1 className="mt-4 text-[2rem] sm:text-[2.4rem]" style={{ fontWeight: 800 }}>
          Compare service tiers
        </h1>
        <p className="mt-4 max-w-[560px] text-[0.95rem] leading-[1.75] text-ink/70">
          This page is still being finalized — the reference recording shows it in an unfinished
          state on the live product as well. Below is the confirmed table structure with placeholder
          columns; real tier names, pricing, and feature rows still need to be supplied.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                <th className="px-6 py-4" style={{ fontWeight: 600 }}>
                  Feature
                </th>
                {tierColumns.map((t) => (
                  <th key={t} className="px-6 py-4 text-center" style={{ fontWeight: 600 }}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-10 text-muted-foreground" colSpan={5}>
                  Feature comparison rows pending — not available in the supplied source material.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
