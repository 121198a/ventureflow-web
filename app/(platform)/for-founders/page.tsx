import type { Metadata } from "next";
import Link from "next/link";
import { LaptopFrame } from "@/components/ui/LaptopFrame";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DealTypeModal } from "@/components/site/deal-type-modal";
import { Reveal } from "@/components/site/reveal";
import { Stepper, type Step } from "@/components/site/stepper";
import { RegPathwayGrid, type RegPathway } from "@/components/site/reg-pathway";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "For Founders — Your Startup Workspace | VentureFlow",
  description:
    "Build your startup profile on VentureFlow, share documents, request introductions and keep every conversation in one workspace.",
  alternates: {
    canonical: "/for-founders",
  },
  openGraph: {
    title: "For Founders — Your Startup Workspace | VentureFlow",
    description: "Startup profile, document sharing, introductions and messages in one workspace.",
    url: `${SITE_URL}/for-founders`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Founders — Your Startup Workspace | VentureFlow",
    description: "Startup profile, document sharing, introductions and messages in one workspace.",
    images: ["/brand/og-image.png"],
  },
};

const steps: Step[] = [
  { n: 1, label: "Create Your\nAccount" },
  { n: 2, label: "Build Your\nProfile" },
  { n: 3, label: "Add Your\nDocuments" },
  { n: 4, label: "Invite\nCollaborators" },
  { n: 5, label: "Request\nIntroductions" },
];

const dealTypes: RegPathway[] = [
  {
    title: "Startup profile",
    cta: "Create your profile",
    points: [
      { text: "Tell your story with a clear, structured page" },
      { text: "Share milestones and updates as they happen" },
      { text: "Choose which sections are visible to whom" },
    ],
  },
  {
    title: "Documents & notes",
    cta: "Set up your workspace",
    points: [
      { text: "Keep decks and files in one place" },
      { text: "Control who can open each document" },
      { text: "Add shared notes next to every conversation" },
    ],
  },
  {
    title: "Introductions & messages",
    cta: "Start collaborating",
    points: [
      { text: "Request introductions with context" },
      { text: "Message investors and collaborators in the workspace" },
      { text: "Follow a searchable history of every relationship" },
    ],
  },
];

export default function ForFounders() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <Reveal as="h1" className="text-[38px] leading-[1.12] sm:text-[44px]">
              <span className="text-brand" style={{ fontWeight: 800 }}>
                Your startup workspace.
              </span>
              <br />
              <span style={{ fontWeight: 800 }}>
                Profiles, documents and introductions, in one place.
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={100}
              className="mt-6 max-w-[430px] text-[15px] leading-[1.65] text-ink/80"
            >
              Build your startup profile, share documents, request introductions and keep every conversation in one workspace.
            </Reveal>

            <Reveal delay={180} className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/services" variant="outline" size="md">
                View Services
              </Button>
              <Button href="#journey" variant="primary" size="md" className="group">
                Get Started{" "}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Reveal>
            <p className="mt-4 text-[12px] text-muted-foreground">
              Already a member?{" "}
              <Link href="/issuer/login" className="text-brand underline">
                Log in
              </Link>
            </p>
          </div>

          <Reveal delay={120}>
            <LaptopFrame
              priority
              alt="VentureFlow founder workspace shown on a laptop with a startup profile, documents and messages"
            />
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        <Reveal as="h2" className="text-[27px]">
          <span style={{ fontWeight: 800 }}>From sign-up to first introduction on VentureFlow</span>
        </Reveal>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.75fr_1fr]">
          <Stepper steps={steps} />

          <div className="card-fintech p-6 text-center">
            <p className="text-[13.5px] leading-[1.6] text-ink/85">
              With VentureFlow, collaboration is simple. You focus on your vision, we keep the workspace organised.
            </p>
            <Button href="/signup" variant="primary" size="md" className="mt-5 w-full rounded-md">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Deal types */}
      <section id="deal-types" className="mx-auto max-w-[1180px] px-5 pb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[27px]" style={{ fontWeight: 800 }}>
            A workspace built around you
          </h2>
          <DealTypeModal />
        </div>

        <RegPathwayGrid deals={dealTypes} />
      </section>

      <SiteFooter />
    </div>
  );
}
