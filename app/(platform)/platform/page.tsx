import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { OfferingCard } from "@/components/site/offering-card";
import { offerings, getDynamicOfferings } from "@/lib/offerings-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Startup Directory | VentureFlow by Veyron X",
  description:
    "Explore startup profiles, follow founder updates, and continue the conversation with introductions, messages and shared documents.",
  alternates: {
    canonical: "/platform",
  },
  openGraph: {
    title: "Startup Directory | VentureFlow by Veyron X",
    description:
      "A workspace to discover startups and collaborate with founders on VentureFlow by Veyron X.",
    url: `${SITE_URL}/platform`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Directory | VentureFlow by Veyron X",
    description:
      "A workspace to discover startups and collaborate with founders on VentureFlow by Veyron X.",
    images: ["/brand/og-image.png"],
  },
};

// NOTE: the dedicated Home.mp4 recording (higher quality than the earlier
// general walkthrough) shows the 4th offering is NOT a wide "featured"
// variant — it's a normal grid card that simply wraps to row 2, alone,
// left-aligned. Correcting the earlier (wrong) inference here.

export default async function Home() {
  const dynamicOfferings = await getDynamicOfferings();
  const list = dynamicOfferings.length > 0 ? dynamicOfferings : offerings;

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
            Discover startups and collaborate with{" "}
            <span className="text-brand">founders in one workspace.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mx-auto mt-7 max-w-[520px] text-[0.95rem] leading-[1.75] text-ink/70"
          >
            One workspace to explore startup profiles, follow founder updates, and keep introductions, notes and documents together.
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:py-20">
          <Reveal as="p" className="text-xs font-semibold text-brand tracking-wider text-center">
            Sample Profiles
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-4 text-center font-editorial text-[2rem] sm:text-[2.4rem]"
          >
            Startup profiles in the workspace
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((o, i) => (
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
