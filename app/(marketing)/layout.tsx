"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteNav } from "@/components/layout/SiteShell";
import { PageTransition } from "@/components/motion/PageTransition";


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
