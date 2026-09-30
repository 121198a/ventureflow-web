"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import { VentureFlowFullBrand } from "@/components/ui/VentureFlowBrand";
import { AuthButton } from "@/components/ui/AuthButton";
import { GradientMobileMenu, gradientCtaClass } from "@/components/layout/GradientMobileMenu";

const blogNavLinks = [
  { label: "Home", href: "/blog" },
  { label: "Theses", href: "/blog#explore" },
  { label: "Playbooks", href: "/blog#playbooks" },
  { label: "Archive", href: "/blog#all-articles" },
] as const;

export function BlogNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
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

  // Route change cleanup: unconditionally release scroll lock and close drawer
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, [pathname]);

  // Lock body scroll when mobile menu is open without layout shift
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    triggerRef.current?.focus();
  }, []);

  // Focus trap and Escape key listener for accessible drawer
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = drawer.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && focusableElements.length > 0) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <motion.div
          initial={{ maxWidth: scrolled ? 920 : 1080 }}
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
          className="pointer-events-auto mx-auto flex h-[54px] sm:h-[58px] w-full max-w-[1080px] items-center justify-between px-4 sm:px-7 border backdrop-blur-md backdrop-saturate-[180%]"
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
              <Image
                src="/logo/vf-mark.png"
                width={32}
                height={32}
                alt="VentureFlow"
                className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <VentureFlowFullBrand className="text-base sm:text-lg" />
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
              ref={triggerRef}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/90 bg-white/90 text-slate-800 transition-transform active:scale-95 sm:hidden cursor-pointer shadow-2xs"
            >
              <Menu size={18} />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Full-screen gradient mobile menu */}
      <AnimatePresence>
        {open && (
          <GradientMobileMenu
            drawerRef={drawerRef}
            ariaLabel="Blog navigation"
            onClose={handleClose}
            brandHref="/blog"
            items={blogNavLinks.map((item) => ({
              label: item.label,
              href: item.href,
              active: pathname === item.href,
            }))}
            cta={
              <AuthButton
                flow="signup"
                icon={false}
                onClick={handleClose}
                className={gradientCtaClass}
              >
                <span>Get started</span>
                <ArrowRight size={16} />
              </AuthButton>
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
