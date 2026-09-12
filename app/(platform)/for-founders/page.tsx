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

export const metadata: Metadata = {
  title: "For Founders — Close Your Round Faster | UBverse",
  description:
    "Run your raise end-to-end on UBverse: investor discovery, smart deal pages, document flows, and guidance at every step.",
  openGraph: {
    title: "For Founders — Close Your Round Faster | UBverse",
    description: "Investor discovery, smart deal pages, document flows, and guidance at every step.",
    type: "website",
  },
};

const steps: Step[] = [
  { n: 1, label: "Start Your\nApplication" },
  { n: 2, label: "Review Capital\nRaise Details" },
  { n: 3, label: "Craft Your Deal\nPage" },
  { n: 4, label: "Upload\nOffering Docs" },
  { n: 5, label: "Launch Your\nOffering" },
];

const dealTypes: RegPathway[] = [
  {
    title: "Reg CF",
    cta: "Get started with Reg CF",
    points: [
      { text: "Raise up to ", highlight: "$5 million", rest: " annually" },
      { text: "Accessible to all investor types" },
      { text: "Designed for early-stage startups and community-driven campaigns" },
      { text: "Fast-track launch through a registered funding portal" },
    ],
  },
  {
    title: "Reg A+",
    cta: "Get started with Reg A+",
    points: [
      { text: "Raise up to ", highlight: "$75 million", rest: " per year" },
      { text: "Market your raise to the general public" },
      { text: "Available to a wide investor base with SEC qualification" },
      { text: "Ideal for scaling companies seeking visibility and broader tech" },
    ],
  },
  {
    title: "Reg D \u2013 Rule 506(c)",
    cta: "Get started with Reg D, 506(c)",
    points: [
      { highlight: "No fundraising limit" },
      { text: "Publicly promote your offering to accredited investors" },
      { text: "No limit on accredited participants" },
      { text: "Built for fast-moving raises and targeted investor outreach" },
    ],
  },
];

export default function ForFounders() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <Reveal as="h1" className="text-[38px] leading-[1.12] sm:text-[44px]">
              <span className="text-brand" style={{ fontWeight: 800 }}>
                Close your round faster.
              </span>
              <br />
              <span style={{ fontWeight: 800 }}>
                We streamline every step so you can focus on building.
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={100}
              className="mt-6 max-w-[430px] text-[15px] leading-[1.65] text-ink/80"
            >
              Run your raise end-to-end on UBverse: investor discovery, smart deal pages, document
              flows, and guidance at every step.
            </Reveal>

            <Reveal delay={180} className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/services" variant="outline" size="md">
                View Services
              </Button>
              <Button href="#journey" variant="primary" size="md" className="group">
                Start Your Raise{" "}
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
              alt="UBverse founder dashboard shown on a laptop with an open capital raise and featured start-ups"
            />
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        <Reveal as="h2" className="text-[27px]">
          <span style={{ fontWeight: 800 }}>Start to Launch: Your Fundraising Journey on UBverse</span>
        </Reveal>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.75fr_1fr]">
          <Stepper steps={steps} />

          <div className="rounded-lg border border-hairline bg-card p-6 text-center shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(16,24,40,0.08)]">
            <p className="text-[13.5px] leading-[1.6] text-ink/85">
              With UBverse, fundraising is simple and guided. You focus on your vision, we handle the
              process.
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
            Fundraising built around you
          </h2>
          <DealTypeModal />
        </div>

        <RegPathwayGrid deals={dealTypes} />
      </section>

      <SiteFooter />
    </div>
  );
}
