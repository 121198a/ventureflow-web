import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Workspace Capabilities | VentureFlow",
  description: "See what founders and investors can do in a VentureFlow workspace: profiles, introductions, messages, notes and documents.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Workspace Capabilities | VentureFlow",
    description: "See what founders and investors can do in a VentureFlow workspace: profiles, introductions, messages, notes and documents.",
    url: `${SITE_URL}/services`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workspace Capabilities | VentureFlow",
    description: "See what founders and investors can do in a VentureFlow workspace: profiles, introductions, messages, notes and documents.",
    images: ["/brand/og-image.png"],
  },
};

const tierColumns = [
  { name: "Founder", audience: "Startup teams", limit: "Workspace role" },
  { name: "Investor", audience: "Individuals & firms", limit: "Workspace role" },
  { name: "Team member", audience: "Invited collaborators", limit: "Workspace role" },
];

const serviceFeatures = [
  {
    category: "Profiles",
    items: [
      { name: "Startup profile", tiers: [true, false, true] },
      { name: "Investor profile", tiers: [false, true, false] },
      { name: "Milestone & progress updates", tiers: [true, false, true] },
    ],
  },
  {
    category: "Collaboration",
    items: [
      { name: "Introduction requests", tiers: [true, true, true] },
      { name: "Messages", tiers: [true, true, true] },
      { name: "Shared notes", tiers: [true, true, true] },
    ],
  },
  {
    category: "Documents & Discovery",
    items: [
      { name: "Document sharing with access control", tiers: [true, true, true] },
      { name: "Startup discovery & saved lists", tiers: [false, true, false] },
      { name: "Pipeline tracking", tiers: [false, true, false] },
    ],
  },
];

export default function Services() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        <p className="eyebrow">Workspace Capabilities</p>
        <h1 className="mt-4 text-[2rem] sm:text-[2.4rem] text-slate-900" style={{ fontWeight: 800 }}>
          What each role can do
        </h1>
        <p className="mt-4 max-w-[620px] text-[0.95rem] leading-[1.75] text-ink/70">
          VentureFlow keeps startup profiles, introductions, messages, notes and documents in one workspace. Here is how each role uses it.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-hairline bg-white shadow-xs">
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.9rem]">
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
                    colSpan={4}
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
            <h3 className="font-bold text-slate-900 text-base">Ready to set up your workspace?</h3>
            <p className="text-sm text-ink/70 mt-1">Create an account to build your profile and start collaborating.</p>
          </div>
          <Button href="/signup" size="md">
            Get started <ArrowRight className="size-4 ml-1.5 inline" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
