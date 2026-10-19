import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { CmsErrorState } from "@/components/legal/CmsErrorState";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { getNavigation } from "@/lib/cms/server";
import type { NavGroup } from "@/lib/cms/types";

import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Legal Hub",
  description: "Terms, privacy and policies for the VentureFlow workspace.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal Hub | VentureFlow",
    description: "Terms, privacy and policies for the VentureFlow workspace.",
    url: `${SITE_URL}/legal`,
    type: "website",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "VentureFlow Legal Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Hub | VentureFlow",
    description: "Terms, privacy and policies for the VentureFlow workspace.",
    images: ["/brand/og-image.png"],
  },
};

export default async function LegalHubPage() {
  let groups: NavGroup[] = [];
  let failed = false;
  try {
    groups = await getNavigation();
  } catch {
    failed = true;
  }

  return (
    <LegalShell>
      {failed ? (
        <CmsErrorState />
      ) : (
        <article className="space-y-6">
          <header>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">VentureFlow Legal Hub</h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              Terms, privacy and policies for the VentureFlow workspace. VentureFlow is a collaboration tool for founders and
              investors. It does not provide financial services or advice.
            </p>
          </header>
          {groups.length === 0 && <p className="mt-8 text-sm text-slate-500">No documents have been published yet.</p>}
          {groups.map((g) => (
            <section key={g.category} aria-labelledby={`legal-category-${g.category}`} className="mt-7">
              <h2 id={`legal-category-${g.category}`} className="text-base sm:text-lg font-bold text-slate-900">{g.name}</h2>
              <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-slate-700">
                {g.items.map((item) => (
                  <li key={item.id}>
                    <TransitionLink href={item.href} className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                      {item.label}
                    </TransitionLink>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </article>
      )}
    </LegalShell>
  );
}
