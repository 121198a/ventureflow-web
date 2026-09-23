import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "@/components/motion/ViewTransitions";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { site, SITE_URL, socialLinks } from "@/lib/constants";

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.name + " — " + site.tagline, template: "%s — " + site.name },
  description: site.description,
  openGraph: {
    title: site.name + " — " + site.tagline,
    description: site.description,
    type: "website",
    url: SITE_URL,
    siteName: site.name,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name + " — " + site.tagline,
    description: site.description,
    images: ["/brand/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

/**
 * Document shell ONLY — no nav/footer here. This wraps every route in the
 * project, including:
 *   - app/(marketing)/**  (adds its own SiteNav/SiteFooter — see that layout)
 *   - app/platform/**     (adds its own PlatformShell header/footer)
 *   - app/legal/**        (self-contained LegalShell, its own header/footer)
 * Putting marketing chrome here as well would stack it underneath each of
 * those route-specific shells — that was a real, live bug (every
 * /platform/* page rendered with the marketing nav+footer AND the
 * platform header+footer at once) that this split fixes.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization + WebSite JSON-LD, built only from real values already in
  // lib/constants.ts (name, tagline, description, live social profile URLs).
  // No ratings, review counts, or other fields we don't have real data for.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: SITE_URL,
    description: site.description,
    logo: `${SITE_URL}/logo/unboundx-mark.png`,
    sameAs: Object.values(socialLinks),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: SITE_URL,
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body id="top" className={`font-sans antialiased bg-white text-slate-900 selection:bg-blue-600 selection:text-white ${sourceSerif4.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <SmoothScrollProvider>
          <ViewTransitions>{children}</ViewTransitions>
        </SmoothScrollProvider>
        <CookieConsent />
      </body>
    </html>
  );
}