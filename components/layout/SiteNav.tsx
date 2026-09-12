"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";

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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-border bg-card/85 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
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
              <span className="ml-1 hidden text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:inline">
                Careers
              </span>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-white/95 p-4 sm:p-6 text-slate-900 lg:hidden overflow-y-auto backdrop-blur-2xl"
          >
            {/* Top Bar inside Overlay */}
            <div className="relative z-10 mx-auto flex h-[54px] sm:h-[58px] w-full max-w-lg items-center justify-between px-4 sm:px-5 rounded-full bg-white border border-slate-200/80 text-slate-900 shadow-xl backdrop-blur-md">
              <Link
                href="/careers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 font-display text-sm sm:text-base font-bold text-slate-900"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
                  <Image
                    src="/logo/unboundx-mark.png"
                    width={28}
                    height={28}
                    alt="UnBound X"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <UnboundXBrand className="text-base" />
              </Link>

              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-transform active:scale-90 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Centered Navigation Links List */}
            <div className="relative z-10 my-auto flex flex-col w-full max-w-lg mx-auto py-8">
              {links.map((l, i) => (
                <motion.button
                  key={l.hash}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(l.hash)}
                  className="w-full border-b border-slate-100 py-4 text-left text-xl sm:text-2xl font-bold tracking-tight text-slate-900 transition-all hover:text-blue-600 hover:translate-x-1"
                >
                  {l.label}
                </motion.button>
              ))}
            </div>

            {/* Bottom Action CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg mx-auto pb-4"
            >
              <button
                onClick={() => go("#roles")}
                className="w-full rounded-full bg-blue-600 hover:bg-blue-700 py-3.5 sm:py-4 text-center text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                See open roles
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

