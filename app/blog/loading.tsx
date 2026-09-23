export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-20 animate-pulse">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        {/* Header Skeleton */}
        <div className="max-w-2xl space-y-4 mb-12">
          <div className="h-6 w-32 rounded-full bg-slate-200/80" />
          <div className="h-10 sm:h-12 w-3/4 rounded-lg bg-slate-200/70" />
          <div className="h-4 w-full rounded bg-slate-200/60" />
        </div>

        {/* Featured Card Skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 mb-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 sm:h-80 rounded-2xl bg-slate-200/70" />
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-4 w-28 rounded bg-slate-200/60" />
            <div className="h-8 w-5/6 rounded-lg bg-slate-200/70" />
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full rounded bg-slate-200/50" />
              <div className="h-3.5 w-4/5 rounded bg-slate-200/50" />
            </div>
            <div className="h-4 w-32 rounded bg-slate-200/50 pt-4" />
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xs">
              <div className="h-44 rounded-xl bg-slate-200/60" />
              <div className="h-4 w-24 rounded bg-slate-200/50" />
              <div className="h-6 w-5/6 rounded bg-slate-200/70" />
              <div className="h-3.5 w-full rounded bg-slate-200/50" />
              <div className="h-3 w-28 rounded bg-slate-200/40 pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
