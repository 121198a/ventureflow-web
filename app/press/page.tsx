import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { VentureFlowBrand } from "@/components/ui/VentureFlowBrand";
import { Mail, Download, ArrowUpRight, Newspaper } from "lucide-react";
import { ComplianceShieldIcon } from "@/components/ui/CustomIcons";
import { SITE_URL } from "@/lib/constants";
import {
  pressReleases,
  companyBoilerplate,
  brandColors,
  fastFacts,
} from "@/lib/press-data";
import { CopyBoilerplateButton, ColorSwatch } from "@/components/press/PressClientControls";

export const metadata: Metadata = {
  title: "Press & Media Kit",
  description:
    "Official press releases, brand assets, executive commentary, and announcements from VentureFlow.",
  alternates: {
    canonical: "/press",
  },
  openGraph: {
    title: "Press & Media Kit | VentureFlow",
    description:
      "Official press releases, brand assets, executive commentary, and announcements from VentureFlow.",
    url: `${SITE_URL}/press`,
    type: "website",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "VentureFlow Press Kit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media Kit | VentureFlow",
    description:
      "Official press releases, brand assets, executive commentary, and announcements from VentureFlow.",
    images: ["/brand/og-image.png"],
  },
};

export default function PressPage() {
  return (
    <SiteShell>
      <main id="main-content" className="pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-6">
          {/* Distinct Newsroom Hero Banner (Strictly Light-Mode) */}
          <header className="press-hero-banner">
            {/* Subtle background grid & ambient light */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
                <Newspaper size={13} className="text-blue-600" />
                <span>VentureFlow Press Room &amp; Media Kit</span>
                <span className="h-1 w-1 rounded-full bg-blue-600" />
                <span className="text-blue-700 font-normal">Official Disclosures</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Press resources, official statements, and brand assets from{" "}
                <VentureFlowBrand className="inline-block" />
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
                The public record-keeping layer for social investing and venture diligence. Access our
                latest company briefings, executive commentary, verified brand assets, and direct press contacts.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#media-contact"
                  className="btn-pill-primary px-6 py-3 text-xs sm:text-sm"
                >
                  <Mail size={15} />
                  <span>Contact Press Desk</span>
                </a>
                <a
                  href="#brand-assets"
                  className="btn-pill-secondary px-5 py-3 text-xs sm:text-sm"
                >
                  <Download size={15} />
                  <span>Brand Assets &amp; Guidelines</span>
                </a>
              </div>
            </div>

            {/* Live Press Metadata Strip */}
            <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-4">
              <div>
                <span className="block text-[12px] font-bold tracking-[0.08em] text-slate-500">Press contact</span>
                <span className="mt-1 block text-xs sm:text-sm font-bold text-slate-900">press@ventureflow.example</span>
              </div>
              <div>
                <span className="block text-[12px] font-bold tracking-[0.08em] text-slate-500">Response SLA</span>
                <span className="mt-1 block text-xs sm:text-sm font-bold text-emerald-600">&lt; 24 Business Hours</span>
              </div>
              <div>
                <span className="block text-[12px] font-bold tracking-[0.08em] text-slate-500">Headquarters</span>
                <span className="mt-1 block text-xs sm:text-sm font-bold text-slate-900">New York, NY</span>
              </div>
              <div>
                <span className="block text-[12px] font-bold tracking-[0.08em] text-slate-500">Media kit version</span>
                <span className="mt-1 block text-xs sm:text-sm font-bold text-blue-700">v2026.1 (Current)</span>
              </div>
            </div>
          </header>

          {/* Quick Contact Bar */}
          <aside aria-label="Media inquiries" className="mt-10 rounded-md border border-slate-200 bg-slate-50/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Media Inquiries</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                For interview requests, executive commentary, or press background:
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <Mail size={16} />
                <a href="mailto:press@ventureflow.example" className="hover:underline">
                  press@ventureflow.example
                </a>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <a
                href="/logo/vf-mark.png"
                download="vf-mark.png"
                className="btn-pill-secondary px-5 py-2.5 text-xs sm:text-sm"
              >
                <Download size={15} />
                <span>Download Media Assets</span>
              </a>
            </div>
          </aside>

          {/* Fast Facts Grid */}
          <section aria-labelledby="fast-facts-title" className="mt-16">
            <h2 id="fast-facts-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Company Fast Facts</h2>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              {fastFacts.map((fact) => (
                <div key={fact.label} className="bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm sm:text-base font-bold text-slate-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Brand Assets */}
          <section id="brand-assets" aria-labelledby="brand-assets-title" className="mt-16 scroll-mt-28">
            <h2 id="brand-assets-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Official Brand Assets</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use these approved logo marks and typography when featuring VentureFlow in publications or media coverage.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset 1 */}
              <article className="rounded-md border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 tracking-[0.08em]">Primary mark</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5">
                    PNG (512x512)
                  </span>
                </div>
                <div className="py-10 flex items-center justify-center">
                  <div className="h-16 w-16 relative">
                    <Image
                      src="/logo/vf-mark.png"
                      alt="VentureFlow Mark"
                      width={64}
                      height={64}
                      className="rounded-full shadow-sm"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-700">vf-mark.png</span>
                  <a
                    href="/logo/vf-mark.png"
                    download="vf-mark.png"
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Download <Download size={13} />
                  </a>
                </div>
              </article>

              {/* Asset 2 */}
              <article className="rounded-md border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 tracking-[0.08em]">Full brand lockup</span>
                  <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5">
                    Vector SVG
                  </span>
                </div>
                <div className="py-10 flex items-center justify-center gap-3">
                  <div className="h-10 w-32 relative flex items-center justify-center">
                    <Image
                      src="/logo/ventureflow-logo.svg"
                      alt="VentureFlow Mark"
                      width={120}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-700">ventureflow-logo.svg</span>
                  <a
                    href="/logo/ventureflow-logo.svg"
                    download="ventureflow-logo.svg"
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Download <Download size={13} />
                  </a>
                </div>
              </article>
            </div>

            {/* Brand Usage Rules */}
            <div className="mt-6 rounded-md border border-slate-200/80 bg-slate-50/60 p-5">
              <h3 className="text-xs font-bold tracking-[0.08em] text-slate-600">
                Asset usage &amp; spacing rules
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <strong className="block text-slate-900 mb-0.5">Clear Space</strong>
                  Maintain a minimum clearance equal to 50% of the mark&apos;s height on all four sides.
                </div>
                <div>
                  <strong className="block text-slate-900 mb-0.5">Minimum Size</strong>
                  Never render the mark smaller than 24px in digital media or 0.35 inches in print.
                </div>
                <div>
                  <strong className="block text-slate-900 mb-0.5">Integrity</strong>
                  Do not distort, rotate, stretch, or alter the color values of the official marks.
                </div>
              </div>
            </div>

            {/* Brand Color Reference */}
            <div className="mt-8">
              <h3 className="text-xs font-bold tracking-[0.08em] text-slate-500">
                Official brand colors
              </h3>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {brandColors.map((color) => (
                  <ColorSwatch
                    key={color.hex}
                    name={color.name}
                    hex={color.hex}
                    usage={color.usage}
                    colorClass={color.class}
                  />
                ))}
              </div>
            </div>

            {/* Boilerplate Text for Media Attribution */}
            <div className="mt-8 rounded-md border border-slate-200 bg-slate-50/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-bold tracking-[0.08em] text-slate-500">
                  Boilerplate Description (About VentureFlow)
                </h3>
                <CopyBoilerplateButton text={companyBoilerplate} />
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 font-normal select-all bg-white p-4 rounded-md border border-slate-200">
                {companyBoilerplate}
              </p>
            </div>
          </section>

          {/* Media Mentions Empty State */}
          <section aria-labelledby="media-mentions-title" className="mt-16">
            <h2 id="media-mentions-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Media Mentions &amp; Editorial Coverage
            </h2>
            <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
              <Newspaper className="mx-auto size-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-bold text-slate-800">
                No press mentions yet
              </h3>
              <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-slate-500">
                Published profiles and editorial commentary will be indexed here as they are released. For press review copies or quote requests, contact our press desk below.
              </p>
            </div>
          </section>

          {/* Recent Press Releases & Briefings */}
          <section aria-labelledby="announcements-title" className="mt-16">
            <h2 id="announcements-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Recent Announcements &amp; Briefings
            </h2>
            <div className="mt-6 divide-y divide-slate-200/80 rounded-md border border-slate-200 bg-white p-2 sm:p-6 shadow-xs">
              {pressReleases.map((pr) => (
                <article
                  key={pr.title}
                  className="py-6 first:pt-2 last:pb-2 px-3 transition-colors hover:bg-slate-50/50 rounded-sm"
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
                </article>
              ))}
            </div>
          </section>

          {/* Media Contact Section */}
          <section id="media-contact" aria-labelledby="media-contact-title" className="mt-16 scroll-mt-28">
            <div className="rounded-md border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/50 p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-0.5 text-xs font-bold text-blue-800">
                  <ComplianceShieldIcon size={14} />
                  <span>Media &amp; Press Contact</span>
                </div>
                <h2 id="media-contact-title" className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Media Inquiries &amp; Executive Commentary
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Our team provides verified background briefings, quantitative venture datasets, and executive commentary on social investing and capital markets.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:press@ventureflow.example"
                    className="btn-pill-primary px-6 py-3 text-sm"
                  >
                    <Mail size={16} />
                    <span>press@ventureflow.example</span>
                  </a>
                  <a
                    href="/logo/vf-mark.png"
                    download="vf-mark.png"
                    className="btn-pill-secondary px-5 py-3 text-sm"
                  >
                    <Download size={15} />
                    <span>Download Media Kit</span>
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-blue-100/80 flex flex-wrap gap-6 text-xs text-slate-500">
                  <span>General press: <strong>press@ventureflow.example</strong></span>
                  <span>Operating hours: <strong>Mon–Fri, 9am–6pm ET</strong></span>
                  <span>Response time: <strong>Within 24 business hours</strong></span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
