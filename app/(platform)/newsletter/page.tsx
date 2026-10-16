import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { NewsletterList } from "@/components/site/newsletter-list";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Fundraising Playbook",
  description:
    "A weekly playbook on the mechanics of private raises: closes, data rooms, investor conditions, and the operational discipline institutional counterparties expect.",
  alternates: {
    canonical: "/newsletter",
  },
  openGraph: {
    title: "The Fundraising Playbook — VentureFlow Newsletter",
    description: "Weekly briefings on the mechanics of private raises — one playbook at a time.",
    type: "website",
    url: `${SITE_URL}/newsletter`,
    siteName: site.fullBrand,
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fundraising Playbook — VentureFlow Newsletter",
    description: "Weekly briefings on the mechanics of private raises — one playbook at a time.",
    images: ["/brand/og-image.png"],
  },
};

export default function Newsletter() {
  const periodicalJsonLd = {
    "@context": "https://schema.org",
    "@type": "Periodical",
    name: "The Fundraising Playbook",
    description: "Weekly briefings on the mechanics of private raises.",
    url: `${SITE_URL}/newsletter`,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: `${SITE_URL}/logo/vf-mark.png`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Newsletter", item: `${SITE_URL}/newsletter` },
    ],
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(periodicalJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-[1180px] px-5">
        <NewsletterList />
      </main>
      <div className="relative z-10 mt-16">
        <SiteFooter />
      </div>
    </div>
  );
}
