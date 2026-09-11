import { Container } from "@/components/ui/Container";
import { LegalHeader } from "@/components/legal/LegalHeader";

export default function LegalLoading() {
  return (
    <div className="legal-shell">
      <LegalHeader />
      <div className="legal-shell-body">
        <Container className="h-full max-w-none px-4 sm:px-6 lg:px-8">
          <div className="legal-shell-grid animate-pulse">
            <div className="legal-shell-sidebar hidden lg:flex">
              <div className="space-y-2 py-8 pr-5 w-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-lg bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="legal-shell-content-col">
              <main className="legal-shell-main">
                <div className="min-w-0 space-y-4 py-6 sm:py-8 lg:pl-10 lg:pr-8">
                  <div className="h-9 w-2/3 rounded-lg bg-slate-200/70" />
                  <div className="h-4 w-full rounded bg-slate-200/60" />
                  <div className="h-4 w-11/12 rounded bg-slate-200/60" />
                  <div className="h-4 w-5/6 rounded bg-slate-200/60" />
                  <div className="h-4 w-full rounded bg-slate-200/60" />
                  <div className="h-4 w-2/3 rounded bg-slate-200/60" />
                </div>
              </main>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
