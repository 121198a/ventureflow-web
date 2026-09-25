import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { ConsultationForm } from "./ConsultationForm";

export const metadata: Metadata = {
  title: "Schedule Consultation — UBverse Newsletter",
  description:
    "Book a twenty-minute working session with the UBverse capital markets team. Pressure-test your round terms, dilution math, and closing rails.",
  alternates: { canonical: "/newsletter/book-call" },
  openGraph: {
    title: "Schedule Consultation — UBverse Newsletter",
    description: "20 minutes · Confidential · Capital markets working session.",
    url: "/newsletter/book-call",
  },
};

export default function BookCallPage() {
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

        <p className="eyebrow mt-8 text-brand">Capital Markets Advisory</p>
        <Reveal as="h1" className="mt-3 font-editorial text-[2.2rem] leading-tight text-ink sm:text-[2.8rem]">
          Schedule a Capital Markets Working Session
        </Reveal>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/80">
          A twenty-minute, focused working session with our capital markets team.
          We review your five critical numbers, model your post-round dilution,
          and structure an institutional closing ledger for your current raise.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-xl border border-hairline bg-surface-alt p-6 sm:p-8">
            <h2 className="font-editorial text-[1.4rem] leading-tight text-ink">
              Reserve Your Working Session
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Direct consultation with our deal leads. No pitch decks required.
            </p>

            <ConsultationForm />
          </div>

          {/* Highlights & Scope */}
          <div className="space-y-6">
            <div className="rounded-xl border border-hairline bg-surface p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand">
                <Calendar className="size-4" />
                Session Format
              </h3>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-ink/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">1.</span>
                  <span><strong>Five Numbers Audit:</strong> Burn, runway, unit economics, revenue, and ownership math.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">2.</span>
                  <span><strong>Cap Table Modeling:</strong> SAFE conversion, pre vs post-money caps, and pool expansion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">3.</span>
                  <span><strong>Closing Ledger Plan:</strong> Setting clear allocation deadlines to prevent soft circles from decaying.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-hairline bg-navy p-6 text-white">
              <div className="flex items-center gap-2 text-brand">
                <ShieldCheck className="size-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Strict Confidentiality
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                All deal terms and financial figures discussed remain strictly confidential.
                You keep the customized dilution model and closing roadmap either way.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
