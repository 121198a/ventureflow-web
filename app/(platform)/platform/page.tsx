import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { OfferingCard } from "@/components/site/offering-card";
import { offerings } from "@/lib/offerings-data";

export const metadata: Metadata = {
  title: "UBverse by UnBound X — Invest in Private Markets",
  description:
    "Review structured deal pages, access founder updates, and complete investments through a registered broker-dealer — with full compliance infrastructure from day one.",
  openGraph: {
    title: "UBverse by UnBound X — Invest in Private Markets",
    description:
      "A single platform to evaluate and invest in private markets with institutional rigor.",
    type: "website",
  },
};

// NOTE: the dedicated Home.mp4 recording (higher quality than the earlier
// general walkthrough) shows the 4th offering is NOT a wide "featured"
// variant — it's a normal grid card that simply wraps to row 2, alone,
// left-aligned. Correcting the earlier (wrong) inference here.

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-hairline bg-surface">
        <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center opacity-30">
          <Image
            src="/illustrations/hero-network.svg"
            alt=""
            width={640}
            height={480}
            priority
            className="h-full w-auto max-w-none object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[820px] px-5 py-14 text-center sm:py-20">
          {/* Sans-serif, not editorial serif — confirmed against the
              dedicated Home recording, which shows no serifs on the hero
              headline (only "Active offerings..." below uses the serif). */}
          <Reveal
            as="h1"
            className="text-balance-tight text-[2.6rem] font-extrabold leading-[1.12] sm:text-[3.35rem]"
          >
            Evaluate and invest in private markets with{" "}
            <span className="text-brand">institutional rigor.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mx-auto mt-7 max-w-[520px] text-[0.95rem] leading-[1.75] text-ink/70"
          >
            A single platform to review structured deal pages, access founder updates, and complete
            investments through a registered broker-dealer — with full compliance infrastructure from
            day one.
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:py-20">
          <Reveal as="p" className="eyebrow text-center">
            Current Opportunities
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-4 text-center font-editorial text-[2rem] sm:text-[2.4rem]"
          >
            Active offerings on the platform
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o, i) => (
              <Reveal key={o.slug} delay={i * 90}>
                <OfferingCard o={o} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
