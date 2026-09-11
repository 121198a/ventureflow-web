import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { NewsletterList } from "@/components/site/newsletter-list";

export const metadata: Metadata = {
  title: "The Fundraising Playbook — UBverse Newsletter",
  description:
    "A weekly playbook on the mechanics of private raises: closes, data rooms, investor conditions, and the operational discipline institutional counterparties expect.",
  openGraph: {
    title: "The Fundraising Playbook — UBverse Newsletter",
    description: "Weekly briefings on the mechanics of private raises — one playbook at a time.",
    type: "website",
  },
};

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1180px] px-5">
        <NewsletterList />
      </main>
      <div className="mt-16">
        <SiteFooter />
      </div>
    </div>
  );
}
