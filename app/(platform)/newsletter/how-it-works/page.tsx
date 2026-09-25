import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, FileText, Users, Send, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "How the Platform Works — UBverse Newsletter",
  description:
    "Explore the five institutional modules UBverse provides to close private funding rounds with speed and discipline.",
  alternates: { canonical: "/newsletter/how-it-works" },
  openGraph: {
    title: "How the Platform Works — UBverse Newsletter",
    description: "The complete workflow for private rounds: closing rails, data rooms, and escrow clearing.",
    url: "/newsletter/how-it-works",
  },
};

const MODULES = [
  {
    step: "01",
    title: "Closing Rails & Allocation Ledger",
    subtitle: "Turn soft circles into funded capital in days, not months",
    icon: ShieldCheck,
    points: [
      "Pre-drafted, standardized SAFE notes and convertible debt agreements",
      "One-click investor electronic signatures with accredited verification",
      "Real-time allocation ledger preventing overselling and cap table drift",
    ],
  },
  {
    step: "02",
    title: "Diligence Data Room & Cap Table",
    subtitle: "Audit-ready disclosures that establish immediate conviction",
    icon: FileText,
    points: [
      "Clean, encrypted virtual data rooms with granular access logs",
      "Dynamic scenario cap table modeling for options, SAFEs, and priced rounds",
      "Pre-assembled risk disclosure frameworks that satisfy institutional counsel",
    ],
  },
  {
    step: "03",
    title: "Investor Pipeline & Round Capacity",
    subtitle: "Manage round momentum with continuous counter-party visibility",
    icon: Users,
    points: [
      "Centralized tracker for committed, soft-circled, and wired capital",
      "Clear deadlines and round close countdowns that create factual urgency",
      "Automated follow-up reminders keyed to business progress milestones",
    ],
  },
  {
    step: "04",
    title: "Predictable LP Communications",
    subtitle: "Monthly updates that convert casual observers into lead investors",
    icon: Send,
    points: [
      "Standard 4-line institutional updates: Highlights, Lowlights, Runway, Asks",
      "Automated LP engagement metrics and document viewer tracking",
      "Consistently builds investor trust between financings",
    ],
  },
  {
    step: "05",
    title: "Broker-Dealer Escrow & Settlement",
    subtitle: "Institutional capital clearing and compliant closing rails",
    icon: CheckCircle2,
    points: [
      "Segregated escrow accounts through registered broker-dealers",
      "Seamless wire, ACH, and automated banking rails",
      "Instant subscription counter-signatures and security issuances",
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

        <p className="eyebrow mt-8 text-brand">Institutional Infrastructure</p>
        <Reveal as="h1" className="mt-3 font-editorial text-[2.2rem] leading-tight text-ink sm:text-[2.8rem]">
          How the UBverse Platform Works
        </Reveal>
        <p className="mt-4 text-[1.1rem] leading-relaxed text-ink/80">
          Private raises fail in the administrative gap between commitment and wire.
          UBverse provides the operational rail that eliminates closing friction,
          standardizes diligence, and tracks every committed dollar in real time.
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
