"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { GradientMobileMenu, gradientCtaClass } from "@/components/layout/GradientMobileMenu";

const links = [
  { label: "Why us", hash: "#why" },
  { label: "Life", hash: "#life" },
  { label: "Growth", hash: "#growth" },
  { label: "Open roles", hash: "#roles" },
  { label: "Process", hash: "#process" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const onHome = pathname === "/careers" || pathname === "/company/careers" || pathname === "/";
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Keyboard focus trap for the mobile drawer: keeps Tab/Shift+Tab cycling
  // within the drawer while it's open, and returns focus to the button
  // that opened it once it closes. Escape-to-close, body-scroll-lock, and
  // auto-close-on-navigation above are untouched.
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.offsetParent !== null
      );

    const focusables = getFocusable();
    (focusables[0] ?? drawer).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !drawer.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !drawer.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const triggerButton = menuButtonRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      triggerButton?.focus();
    };
  }, [open]);

  function go(hash: string) {
    setOpen(false);
    if (onHome) scrollToTarget(hash);
    else window.location.assign(`/careers${hash}`);
  }

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-card/85 py-3 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent py-6"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1240px] items-center justify-between px-5 sm:px-6"
        >
          <Link href="/careers" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
              <Image
                src="/logo/unboundx-mark.png"
                alt="UnBound X"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </span>
            <div className="flex items-center gap-2">
              <UnboundXBrand className="text-base tracking-tight" />
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <button
                key={l.hash}
                onClick={() => go(l.hash)}
                className="signal-underline text-sm font-semibold text-text-secondary transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go("#roles")}
              className="hidden items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex"
            >
              View roles
              <ArrowUpRight size={15} />
            </button>
            <button
              ref={menuButtonRef}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full border border-border bg-card lg:hidden"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="block h-px w-5 bg-foreground"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                className="block h-px w-5 bg-foreground"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <GradientMobileMenu
            drawerRef={drawerRef}
            ariaLabel="Mobile menu"
            onClose={() => setOpen(false)}
            brandHref="/careers"
            hideAt="lg:hidden"
            items={links.map((l) => ({ label: l.label, onSelect: () => go(l.hash) }))}
            cta={
              <button onClick={() => go("#roles")} className={gradientCtaClass}>
                See open roles
                <ArrowUpRight size={16} />
              </button>
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

