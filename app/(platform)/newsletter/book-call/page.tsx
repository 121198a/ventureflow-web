import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck, Users } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { ConsultationForm } from "./ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Walkthrough — VentureFlow",
  description:
    "Book a twenty-minute walkthrough of the VentureFlow workspace: profiles, documents, introductions and notes.",
  alternates: { canonical: "/newsletter/book-call" },
  openGraph: {
    title: "Book a Walkthrough — VentureFlow",
    description: "20 minutes · Workspace walkthrough.",
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
          Book a Workspace Walkthrough
        </Reveal>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/80">
          A twenty-minute, focused walkthrough of the VentureFlow workspace.
          We show how profiles, documents, notes and introductions fit together
          and answer questions about your setup.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-xl border border-hairline bg-surface-alt p-6 sm:p-8">
            <h2 className="font-editorial text-[1.4rem] leading-tight text-ink">
              Reserve Your Walkthrough
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              A short call with the VentureFlow team. No preparation required.
            </p>

            <ConsultationForm />
          </div>

          {/* Highlights & Scope */}
          <div className="space-y-6">
            {/* Who It Is For */}
            <div className="rounded-xl border border-hairline bg-surface p-6">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                <Users className="size-4" />
                Who It Is For
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/80">
                Founders, investors and teams who want to see how a shared workspace could replace scattered inboxes, drives and spreadsheets.
              </p>
            </div>

            {/* What to Expect */}
            <div className="rounded-xl border border-hairline bg-surface p-6">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                <Calendar className="size-4" />
                What to Expect
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">1.</span>
                  <span><strong>Workspace Tour:</strong> Profiles, documents, messages and notes, shown with sample data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">2.</span>
                  <span><strong>Setup Guidance:</strong> How to structure your profile and which documents to add first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand font-bold">3.</span>
                  <span><strong>Next Steps:</strong> A simple plan for inviting collaborators and starting introductions.</span>
                </li>
              </ul>
            </div>

            {/* Confidentiality */}
            <div className="rounded-xl border border-hairline bg-navy p-6 text-white">
              <div className="flex items-center gap-2 text-brand">
                <ShieldCheck className="size-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Confidential
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                Anything you share on the call stays confidential.
                You keep the setup notes either way.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
