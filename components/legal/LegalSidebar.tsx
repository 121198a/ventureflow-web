"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DocumentFilingIcon } from "@/components/ui/CustomIcons";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { NavGroup, NavTreeItem } from "@/lib/cms/types";

export function LegalSidebar({ activeSlug, groups = [] }: { activeSlug?: string; groups?: NavGroup[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHubActive = pathname === "/legal" || pathname === "/legal/";
  const flat = (items: NavTreeItem[]): NavTreeItem[] => items.flatMap((i) => [i, ...flat(i.children)]);
  const allItems = groups.flatMap((g) => flat(g.items));
  const activeLabel =
    allItems.find((p) => p.slug === activeSlug)?.label ??
    (isHubActive ? "VentureFlow Legal Hub" : "Legal");

  const list = (
    <nav aria-label="Legal documents" className="flex flex-col gap-0.5">
      <TransitionLink
        href="/legal"
        onClick={() => setMobileOpen(false)}
        aria-current={isHubActive ? "page" : undefined}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium leading-snug transition-colors ${
          isHubActive
            ? "bg-blue-50 font-semibold text-blue-700"
            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        VentureFlow Legal Hub
      </TransitionLink>

      {groups.map((group) => (
        <div key={group.category} className="mt-4">
          <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500" id={`legal-group-${group.category}`}>
            {group.name}
          </p>
          <ul className="flex flex-col gap-0.5" aria-labelledby={`legal-group-${group.category}`}>
            {group.items.map((page) => (
              <NavItem key={page.id} item={page} activeSlug={activeSlug} depth={0} onNavigate={() => setMobileOpen(false)} />
            ))}
          </ul>
        </div>
      ))}
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
            <DocumentFilingIcon size={16} className="shrink-0 text-blue-600" />
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

function NavItem({ item, activeSlug, depth, onNavigate }: { item: NavTreeItem; activeSlug?: string; depth: number; onNavigate: () => void }) {
  const isActive = item.slug !== undefined && item.slug === activeSlug;
  return (
    <li>
      <TransitionLink
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        style={{ marginLeft: depth * 12 }}
        className={`block rounded-xl px-4 py-2.5 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
          isActive ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {item.label}
      </TransitionLink>
      {item.children.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {item.children.map((c) => (
            <NavItem key={c.id} item={c} activeSlug={activeSlug} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}
