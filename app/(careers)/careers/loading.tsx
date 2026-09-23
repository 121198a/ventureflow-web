export default function CareersLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 sm:py-24 animate-pulse">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        {/* Careers Hero Skeleton */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="h-6 w-36 rounded-full bg-slate-200/80" />
          <div className="h-10 sm:h-14 w-4/5 rounded-lg bg-slate-200/70" />
          <div className="h-4 w-full rounded bg-slate-200/60" />
          <div className="h-4 w-3/4 rounded bg-slate-200/60" />
        </div>

        {/* Roles List Skeleton */}
        <div className="space-y-4 max-w-4xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="h-6 w-48 sm:w-64 rounded bg-slate-200/70" />
                <div className="flex gap-3">
                  <div className="h-4 w-20 rounded bg-slate-200/50" />
                  <div className="h-4 w-24 rounded bg-slate-200/50" />
                  <div className="h-4 w-28 rounded bg-slate-200/50" />
                </div>
              </div>
              <div className="h-10 w-32 rounded-full bg-slate-200/60 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
