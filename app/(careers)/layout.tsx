import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function CareersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="theme-careers min-h-screen flex flex-col font-sans bg-[#f7f9fc]">
      <SmoothScroll />
      <SiteNav />
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
    </div>
  );
}
