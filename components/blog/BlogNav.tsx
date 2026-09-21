"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { AuthButton } from "@/components/ui/AuthButton";

const blogNavLinks = [
  { label: "Home", href: "/blog" },
  { label: "Theses", href: "/blog#explore" },
  { label: "Playbooks", href: "/blog#playbooks" },
  { label: "Archive", href: "/blog#all-articles" },
] as const;

export function BlogNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <motion.div
          animate={{
            maxWidth: scrolled ? 920 : 1080,
            borderRadius: 9999,
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.82)",
            borderColor: scrolled ? "rgba(226, 232, 240, 0.95)" : "rgba(226, 232, 240, 0.75)",
            boxShadow: scrolled
              ? "0 12px 35px -8px rgba(15, 23, 42, 0.12)"
              : "0 4px 20px -4px rgba(15, 23, 42, 0.05)",
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="pointer-events-auto mx-auto flex h-[54px] sm:h-[58px] w-full items-center justify-between px-4 sm:px-7 border backdrop-blur-md backdrop-saturate-[180%]"
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
              <Image
                src="/logo/unboundx-mark.png"
                width={32}
                height={32}
                alt="UnBound X"
                className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <UnboundXBrand className="text-base sm:text-lg" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-7 text-sm font-medium sm:flex">
            {blogNavLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 transition-colors duration-200 hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-semibold" : "text-slate-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeBlogNavTab"
                      className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-blue-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AuthButton
              flow="signup"
              icon={false}
              className="hidden sm:inline-flex btn-pill-primary px-5 py-2.5 text-xs sm:text-sm"
            >
              <span>Get started</span>
              <ArrowRight size={14} />
            </AuthButton>

            <button
              aria-label="Toggle navigation menu"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/90 bg-white/90 text-slate-800 transition-transform active:scale-95 sm:hidden cursor-pointer shadow-2xs"
            >
              <Menu size={18} />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0f172a] p-4 sm:p-6 text-white sm:hidden overflow-y-auto backdrop-blur-xl"
          >
            {/* Top Bar inside Overlay */}
            <div className="relative z-10 mx-auto flex h-14 w-full max-w-lg items-center justify-between px-5 rounded-full bg-slate-800/90 border border-slate-700 text-white shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="relative h-7 w-7 overflow-hidden rounded-full flex items-center justify-center">
                  <Image
                    src="/logo/unboundx-mark.png"
                    width={28}
                    height={28}
                    alt="UnBound X"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <UnboundXBrand className="text-base" />
              </div>

              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-transform active:scale-90 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-7 py-8 my-auto">
              {blogNavLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <AuthButton
                  flow="signup"
                  icon={false}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-8 py-3.5 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                  <span>Get started</span>
                  <ArrowRight size={14} />
                </AuthButton>
              </motion.div>
            </nav>

            <div className="text-center text-xs font-medium text-slate-400 tracking-wide pb-4">
              UnBound X Editorial & Market Intelligence
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
