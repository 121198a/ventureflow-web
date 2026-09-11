import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LegalHeader } from "@/components/legal/LegalHeader";
import { LegalSidebar } from "@/components/legal/LegalSidebar";

export function LegalShell({
  activeSlug,
  children,
}: {
  activeSlug?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-shell">
      {/* ================= HEADER ================= */}
      <LegalHeader />

      {/* ================= BODY ================= */}
      <div className="legal-shell-body">
        <Container className="h-full max-w-none px-4 sm:px-6 lg:px-8">
          <div className="legal-shell-grid">
            {/* ================= SIDEBAR ================= */}
            <LegalSidebar activeSlug={activeSlug} />

            {/* ================= RIGHT COLUMN ================= */}
            <div className="legal-shell-content-col">
              {/* ================= CONTENT ================= */}
              <main className="legal-shell-main">
                <div className="min-h-full flex flex-col justify-between py-6 sm:py-8 lg:pl-10 lg:pr-8">
                  <div className="w-full max-w-4xl">{children}</div>

                  {/* ================= FOOTER ================= */}
                  <footer className="mt-16 w-full max-w-4xl border-t border-slate-200 pt-6 pb-6 text-xs text-slate-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                      <div>
                        <span>All rights reserved. </span>
                        <Link
                          href="/legal/privacy-policy"
                          className="text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                        >
                          UnBound X Privacy Policy.
                        </Link>
                      </div>

                      <span className="font-normal text-slate-500">
                        Copyright © 2026 by UnBound X
                      </span>
                    </div>
                  </footer>
                </div>
              </main>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}