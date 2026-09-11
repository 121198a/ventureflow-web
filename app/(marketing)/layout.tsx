"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteNav } from "@/components/layout/SiteShell";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Chrome for the UnBound X marketing site (Home, About, UBverse teaser,
 * Careers/Blog/Press, Legal, Login, Get Started). Split out of the root
 * layout so it applies ONLY to this route group — the separate UBverse
 * platform app under app/platform/** has its own header/footer
 * (components/platform/PlatformShell.tsx) and must not also render this
 * marketing nav/footer around it.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname?.startsWith("/login");

  if (isLoginPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <>
      <SiteNav />
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
    </>
  );
}
