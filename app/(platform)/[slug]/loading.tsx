import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function LoadingOffering() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader />
      <main className="mx-auto max-w-[1180px] px-5 py-10 sm:py-16 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-40 rounded bg-slate-200/70 mb-8" />

        {/* Company Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-hairline">
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-slate-200/70 shrink-0" />
            <div className="space-y-2">
              <div className="h-7 w-48 sm:w-64 rounded-md bg-slate-200/70" />
              <div className="h-4 w-32 rounded bg-slate-200/50" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-full bg-slate-200/60" />
            <div className="h-10 w-32 rounded-full bg-slate-200/60" />
          </div>
        </div>

        {/* Grid content and card skeleton */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div className="space-y-6">
            <div className="h-10 w-full max-w-md rounded-lg bg-slate-200/60" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full rounded bg-slate-200/60" />
              <div className="h-4 w-11/12 rounded bg-slate-200/60" />
              <div className="h-4 w-4/5 rounded bg-slate-200/60" />
              <div className="h-4 w-full rounded bg-slate-200/60" />
              <div className="h-4 w-3/4 rounded bg-slate-200/60" />
            </div>
            <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200/60 mt-8" />
          </div>

          {/* Sticky Investment Card Skeleton */}
          <div className="rounded-2xl border border-hairline bg-surface-alt p-6 space-y-5">
            <div className="h-5 w-32 rounded bg-slate-200/70" />
            <div className="h-10 w-44 rounded bg-slate-200/70" />
            <div className="h-3 w-full rounded-full bg-slate-200/60" />
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-hairline">
              <div className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-200/50" />
                <div className="h-5 w-24 rounded bg-slate-200/70" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-200/50" />
                <div className="h-5 w-24 rounded bg-slate-200/70" />
              </div>
            </div>
            <div className="h-12 w-full rounded-full bg-slate-200/80 pt-2" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
