import { SiteFooter } from "@/components/layout/SiteShell";
import { BlogNav } from "@/components/blog/BlogNav";
import { PageTransition } from "@/components/motion/PageTransition";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <BlogNav />
      <PageTransition>
        <div className="flex-1 w-full pt-20 sm:pt-24">{children}</div>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
