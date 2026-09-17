import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Service Tiers & Pathways | UBverse",
  description: "Compare UBverse capital raise pathways and operational services for founders.",
};

const tierColumns = [
  { name: "Reg CF", audience: "Community & Retail", limit: "Up to $5M/yr" },
  { name: "Reg A+", audience: "Public & Accredited", limit: "Up to $75M/yr" },
  { name: "Reg D 506(b)", audience: "Pre-existing Network", limit: "No statutory cap" },
  { name: "Reg D 506(c)", audience: "Accredited Public", limit: "No statutory cap" },
];

const serviceFeatures = [
  {
    category: "Offering Infrastructure",
    items: [
      { name: "Dedicated Company Space", tiers: [true, true, true, true] },
      { name: "Structured Term Sheet & Deal Page", tiers: [true, true, true, true] },
      { name: "Gated Data Room & Document Flow", tiers: [true, true, true, true] },
      { name: "Milestone & Progress Updates", tiers: [true, true, true, true] },
    ],
  },
  {
    category: "Compliance & Broker Coordination",
    items: [
      { name: "SEC Filing Exemption Alignment", tiers: [true, true, true, true] },
      { name: "Accredited Investor Verification", tiers: [false, true, true, true] },
      { name: "Brokerage Execution via MARV Capital", tiers: [true, true, true, true] },
      { name: "Investor Accreditation Certification", tiers: [false, false, true, true] },
    ],
  },
  {
    category: "Investor Communication",
    items: [
      { name: "Direct Investor Inquiries", tiers: [true, true, true, true] },
      { name: "Shareable Deal Presentation Cards", tiers: [true, true, true, true] },
      { name: "Weekly Newsletter Inclusion Opportunity", tiers: [true, true, true, true] },
    ],
  },
];

export default function Services() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        <p className="eyebrow">Capital Raise Pathways</p>
        <h1 className="mt-4 text-[2rem] sm:text-[2.4rem] text-slate-900" style={{ fontWeight: 800 }}>
          Compare Offering Pathways
        </h1>
        <p className="mt-4 max-w-[620px] text-[0.95rem] leading-[1.75] text-ink/70">
          Every capital round requires the right regulatory exemption and investor flow. Compare UBverse pathways designed to support private market offerings through SEC-compliant frameworks and registered broker-dealer execution.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-hairline bg-white shadow-xs">
          <table className="w-full min-w-[760px] border-collapse text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                <th className="px-6 py-5 w-[34%]" style={{ fontWeight: 600 }}>
                  Service &amp; Capability
                </th>
                {tierColumns.map((t) => (
                  <th key={t.name} className="px-4 py-5 text-center" style={{ fontWeight: 600 }}>
                    <span className="block font-bold text-slate-900 text-sm">{t.name}</span>
                    <span className="block text-micro text-slate-600 font-normal mt-0.5">{t.audience}</span>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-pill">
                      {t.limit}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {serviceFeatures.map((group) => (
              <tbody key={group.category} className="divide-y divide-hairline">
                <tr className="bg-slate-50/80">
                  <td
                    colSpan={5}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600"
                  >
                    {group.category}
                  </td>
                </tr>
                {group.items.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800 text-sm">{item.name}</td>
                    {item.tiers.map((supported, idx) => (
                      <td key={idx} className="px-4 py-3.5 text-center align-middle">
                        {supported ? (
                          <Check className="mx-auto size-4 text-emerald-600" />
                        ) : (
                          <span className="text-slate-300 font-bold">&mdash;</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Ready to structure your round?</h3>
            <p className="text-sm text-ink/70 mt-1">Submit your company application to evaluate offering readiness and regulatory pathways.</p>
          </div>
          <Button href="/signup" size="md">
            Start Founder Application <ArrowRight className="size-4 ml-1.5 inline" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
