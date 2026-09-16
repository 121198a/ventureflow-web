"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogoLink } from "./brand-logo";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/platform", label: "Home" },
  { href: "/for-founders", label: "For Founders" },
  { href: "/newsletter", label: "Newsletter" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[62px] w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-5">
        <BrandLogoLink />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 sm:flex">
          {nav.map((item) => {
            const isActive = item.href === "/platform" ? pathname === "/platform" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "relative text-[0.9rem] text-brand pb-[3px] after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-brand"
                    : "group relative text-[0.9rem] text-ink/80 pb-[3px] transition-colors hover:text-brand"
                }
                style={{ fontWeight: 500 }}
              >
                {item.label}
                {!isActive && (
                  <span className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
          <Button href="/signup" size="sm" className="shadow-sm">
            Sign Up / Log In
          </Button>
        </nav>

        {/* Mobile: sign-up stays visible + hamburger toggle */}
        <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 sm:hidden">
          <Button href="/signup" size="sm" className="px-2.5 py-1.5 text-xs min-[360px]:px-3.5 min-[360px]:text-[0.8rem] shadow-sm">
            Sign Up / Log In
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-md text-ink/80 transition-colors hover:bg-accent"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="border-t border-hairline bg-surface px-5 py-4 sm:hidden">
          <ul className="space-y-1">
            {nav.map((item) => {
              const isActive = item.href === "/platform" ? pathname === "/platform" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={
                      isActive
                        ? "block rounded-md px-3 py-2.5 text-[0.95rem] text-brand bg-accent"
                        : "block rounded-md px-3 py-2.5 text-[0.95rem] text-ink/85 hover:bg-accent"
                    }
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
