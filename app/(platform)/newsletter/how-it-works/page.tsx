import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, FileText, Users, Send, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "How the Workspace Works — VentureFlow",
  description:
    "Explore the five parts of the VentureFlow workspace: profiles, documents, pipeline, updates and introductions.",
  alternates: { canonical: "/newsletter/how-it-works" },
  openGraph: {
    title: "How the Workspace Works — VentureFlow",
    description: "How founders and investors use profiles, documents, notes and messages together.",
    url: "/newsletter/how-it-works",
  },
};

const MODULES = [
  {
    step: "01",
    title: "Startup & Investor Profiles",
    subtitle: "A clear starting point for every relationship",
    icon: ShieldCheck,
    points: [
      "Structured startup profiles with story, product and team",
      "Investor profiles that describe focus areas and interests",
      "Owners choose which sections each person can see",
    ],
  },
  {
    step: "02",
    title: "Documents & Access Control",
    subtitle: "Keep the right files in front of the right people",
    icon: FileText,
    points: [
      "One place for decks, one-pagers and supporting files",
      "Per-document access, with a record of who opened what",
      "Notes attached to each document for context",
    ],
  },
  {
    step: "03",
    title: "Pipeline & Saved Startups",
    subtitle: "Track conversations without a separate spreadsheet",
    icon: Users,
    points: [
      "Saved lists to organise startups you want to follow",
      "Simple stages to see where each conversation stands",
      "Reminders tied to the next step you set",
    ],
  },
  {
    step: "04",
    title: "Workspace Updates",
    subtitle: "Regular updates that keep everyone on the same page",
    icon: Send,
    points: [
      "Short, consistent updates: highlights, challenges, next steps",
      "Choose who receives each update",
      "A searchable history of everything shared",
    ],
  },
  {
    step: "05",
    title: "Introductions & Messages",
    subtitle: "Start conversations with context",
    icon: CheckCircle2,
    points: [
      "Request introductions directly from a profile",
      "Keep messages next to the documents they refer to",
      "Everything stays inside the workspace",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-[840px] px-5 py-12 sm:py-16">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-[0.85rem] text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Newsletter
        </Link>

        <p className="eyebrow mt-8 text-brand">Workspace Overview</p>
        <Reveal as="h1" className="mt-3 font-editorial text-[2.2rem] leading-tight text-ink sm:text-[2.8rem]">
          How the VentureFlow Workspace Works
        </Reveal>
        <p className="mt-4 text-[1.1rem] leading-relaxed text-ink/80">
          Good relationships get lost between inboxes, drives and spreadsheets.
          VentureFlow keeps profiles, documents, notes and messages together, so
          every conversation has the context it needs.
        </p>

        {/* Modules List */}
        <div className="mt-12 space-y-6">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.step}
                className="rounded-xl border border-hairline bg-surface-alt p-6 sm:p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-primary-foreground font-bold">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-editorial text-[1.35rem] leading-tight text-ink">
                        {m.title}
                      </h2>
                      <span className="font-editorial text-[1rem] font-bold text-brand">
                        {m.step}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.88rem] font-medium text-brand">
                      {m.subtitle}
                    </p>
                    <ul className="mt-4 space-y-2 text-[0.92rem] text-ink/80">
                      {m.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand font-bold">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action card */}
        <div className="mt-12 rounded-xl border border-hairline bg-navy p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h3 className="font-editorial text-[1.5rem] leading-tight text-white">
              Raising in the next six months?
            </h3>
            <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-md">
              A twenty-minute working session with our capital markets team. Your five numbers,
              dilution model, and closing rails pressure-tested with institutional rigor.
            </p>
          </div>
          <div className="mt-6 sm:mt-0 shrink-0">
            <Link
              href="/newsletter/book-call"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-strong transition-colors"
            >
              Schedule Consultation
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
