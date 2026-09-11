"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText } from "lucide-react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LEGAL_PAGES } from "@/lib/cms";

const SIDEBAR_PAGES = LEGAL_PAGES;

export function LegalSidebar({ activeSlug }: { activeSlug?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHubActive = pathname === "/legal" || pathname === "/legal/";
  const activeLabel =
    SIDEBAR_PAGES.find((p) => p.slug === activeSlug)?.label ??
    (isHubActive ? "UnBound X Legal Hub" : "Legal");

  const list = (
    <nav aria-label="Legal documents" className="flex flex-col gap-0.5">
      <TransitionLink
        href="/legal"
        onClick={() => setMobileOpen(false)}
        aria-current={isHubActive ? "page" : undefined}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium leading-snug transition-colors ${
          isHubActive
            ? "bg-[#edf5fe] font-semibold text-blue-600"
            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        UnBound X Legal Hub
      </TransitionLink>

      <ul className="flex flex-col gap-0.5">
        {SIDEBAR_PAGES.map((page) => {
          const isActive = page.slug === activeSlug;
          return (
            <li key={page.slug}>
              <TransitionLink
                href={`/legal/${page.slug}`}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-xl px-4 py-2.5 text-sm leading-snug transition-colors ${
                  isActive
                    ? "bg-[#edf5fe] font-semibold text-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {page.label}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile: collapsible current-document selector, sits above the content */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="legal-mobile-nav"
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileText size={16} className="shrink-0 text-blue-600" />
            {activeLabel}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-slate-500 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          />
        </button>
        {mobileOpen && (
          <div
            id="legal-mobile-nav"
            className="mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            {list}
          </div>
        )}
      </div>

      {/* Desktop: persistent sidebar pane with its own independent scroll region. */}
      <aside className="legal-shell-sidebar hidden lg:flex">
        <div className="legal-shell-sidebar-scroll">{list}</div>
      </aside>
    </>
  );
}
