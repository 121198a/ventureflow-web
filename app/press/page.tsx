import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { Mail, Download, ArrowUpRight, Sparkles } from "lucide-react";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Press & Media Kit — " + site.name,
  description:
    "Official press resources, media assets, executive commentary, and announcements from UnBound X.",
};

const pressReleases = [
  {
    title: "UnBound X Launches Public Record-Keeping Layer for Social Investing",
    date: "Sep 2026",
    summary:
      "UnBound X introduces a verifiable platform turning social investment claims into immutable track records with targets, horizons, and outcomes.",
    category: "Product Launch",
    href: "/blog/architecture-of-a-verified-thesis",
  },
  {
    title: "Five Critical Numbers: UnBound X Releases Venture Diligence Framework",
    date: "Aug 2026",
    summary:
      "An institutional teardown of what early-stage venture investors require from founders during initial meetings and capital allocation discussions.",
    category: "Research",
    href: "/blog/five-critical-numbers",
  },
  {
    title: "Collaborative Due Diligence in Spaces: The Future of Distributed Syndicates",
    date: "Jul 2026",
    summary:
      "How institutional and retail investors are structuring deal analysis and collaborative evaluation through dedicated thesis spaces.",
    category: "Ecosystem",
    href: "/blog/collaborative-due-diligence-in-spaces",
  },
];

const fastFacts = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "New York, NY" },
  { label: "Co-Founders", value: "Maneesh Awasthi & Arnav Awasthi" },
  { label: "Industry", value: "FinTech / Capital Markets Technology" },
  { label: "Mission", value: "Turn investment claims into verifiable records" },
];

export default function PressPage() {
  return (
    <SiteShell>
      <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-6">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <Sparkles size={12} />
              <span>Media &amp; Press Room</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Press resources, brand assets, and news from{" "}
              <UnboundXBrand className="inline-block" />
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Welcome to the UnBound X press center. Find our latest announcements, executive bios,
              media kit, and direct contact details for media inquiries.
            </p>
          </div>

          {/* Quick Contact Bar */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Media Inquiries</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                For interview requests, executive commentary, or press background:
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <Mail size={16} />
                <a href="mailto:press@unboundxinc.com" className="hover:underline">
                  press@unboundxinc.com
                </a>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <a
                href="/logo/unboundx-mark.png"
                download="unboundx-logo.png"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-100 transition-colors"
              >
                <Download size={15} />
                <span>Download Media Assets</span>
              </a>
            </div>
          </div>

          {/* Fast Facts Grid */}
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Company Fast Facts</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fastFacts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {fact.label}
                  </div>
                  <div className="mt-1.5 text-sm sm:text-base font-bold text-slate-900">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Assets */}
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Official Brand Assets</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use these approved logo marks and typography when featuring UnBound X in publications or media coverage.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Mark</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5">
                    PNG
                  </span>
                </div>
                <div className="py-10 flex items-center justify-center">
                  <div className="h-16 w-16 relative">
                    <Image
                      src="/logo/unboundx-mark.png"
                      alt="UnBound X Mark"
                      width={64}
                      height={64}
                      className="rounded-full shadow-sm"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-700">unboundx-mark.png (Full resolution)</span>
                  <a
                    href="/logo/unboundx-mark.png"
                    download="unboundx-mark.png"
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Download <Download size={13} />
                  </a>
                </div>
              </div>

              {/* Asset 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Brand Lockup</span>
                  <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5">
                    Gradient Lockup
                  </span>
                </div>
                <div className="py-10 flex items-center justify-center gap-3">
                  <div className="h-10 w-10 relative">
                    <Image
                      src="/logo/unboundx-mark.png"
                      alt="UnBound X Mark"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <UnboundXBrand className="text-2xl" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-700">Official Brand Typography</span>
                  <Link href="/about" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                    About the team <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Press Releases & Briefings */}
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Recent Announcements &amp; Briefings</h2>
            <div className="mt-6 space-y-4">
              {pressReleases.map((pr) => (
                <div
                  key={pr.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {pr.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{pr.date}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    <Link href={pr.href}>{pr.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{pr.summary}</p>
                  <div className="mt-4">
                    <Link
                      href={pr.href}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
                    >
                      <span>Read briefing</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
