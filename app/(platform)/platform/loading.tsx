import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function PlatformLoading() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-hairline bg-surface py-14 sm:py-20 text-center animate-pulse">
        <div className="mx-auto max-w-[820px] px-5 space-y-4">
          <div className="h-10 sm:h-14 w-3/4 mx-auto rounded-lg bg-slate-200/70" />
          <div className="h-4 sm:h-5 w-1/2 mx-auto rounded bg-slate-200/60" />
        </div>
      </section>

      <section className="bg-background py-14 sm:py-20 animate-pulse">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="h-4 w-36 mx-auto rounded bg-slate-200/60 mb-3" />
          <div className="h-8 w-64 mx-auto rounded bg-slate-200/70 mb-12" />

          {/* Offerings Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-hairline bg-surface-alt p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-slate-200/70 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-5 w-3/4 rounded bg-slate-200/70" />
                    <div className="h-3 w-1/2 rounded bg-slate-200/50" />
                  </div>
                </div>
                <div className="h-12 w-full rounded bg-slate-200/50" />
                <div className="h-2 w-full rounded-full bg-slate-200/60" />
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
                  <div className="h-4 w-20 rounded bg-slate-200/50" />
                  <div className="h-4 w-20 rounded bg-slate-200/50 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
