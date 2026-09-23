"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site, socialLinks } from "@/lib/constants";
import { AuthButton } from "@/components/ui/AuthButton";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login");
  const isPlatformRoute = pathname?.startsWith("/platform");
  const isLegalRoute = pathname?.startsWith("/legal");

  if (isPlatformRoute || isLegalRoute) {
    return <>{children}</>;
  }

  if (isAuthPage) {
    return (
      <main className="min-h-dvh w-full bg-[#f8fafc] flex flex-col justify-center items-center relative overflow-hidden">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <SiteNav />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
    </div>
  );
}

const exploreLinks = [
  { label: "Market Intelligence", href: "/blog", desc: "Briefings, playbooks & theses" },
  { label: "Careers & Culture", href: "/careers", desc: "Join our senior remote team" },
  { label: "Press Room", href: "/press", desc: "Official releases & media kit" },
  { label: "Private Markets Platform", href: "/platform", desc: "Browse active offerings & deals" },
  { label: "For Founders", href: "/for-founders", desc: "Capital raise infrastructure" },
  { label: "Service Tiers", href: "/services", desc: "Offering pathway matrix" },
  { label: "Legal Hub", href: "/legal", desc: "Disclosures, CRS & compliance" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-close menus on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Route change cleanup: unconditionally release scroll lock and close drawer
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, [pathname]);

  // Lock body scroll when mobile menu is open without causing layout shift
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

    // Focus the first element (close button)
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

  // The Login page must never render the shared navbar
  if (pathname === "/login" || pathname?.startsWith("/login")) {
    return null;
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: reduceMotion ? 0.01 : 0.24,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.04,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.25, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <motion.div
          animate={{
            maxWidth: scrolled ? 940 : 1080,
            borderRadius: 9999,
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.94)" : "rgba(255, 255, 255, 0.85)",
            borderColor: scrolled ? "rgba(226, 232, 240, 0.95)" : "rgba(226, 232, 240, 0.75)",
            boxShadow: scrolled
              ? "0 12px 35px -8px rgba(15, 23, 42, 0.12)"
              : "0 4px 20px -4px rgba(15, 23, 42, 0.05)",
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="pointer-events-auto mx-auto flex h-[54px] sm:h-[58px] w-full items-center justify-between px-4 sm:px-7 border backdrop-blur-md backdrop-saturate-[180%]"
        >
          {/* Brand Logo */}
          <TransitionLink href="/" aria-label={`${site.name} home`} className="flex items-center gap-2.5 font-display text-sm sm:text-base font-bold text-slate-900 group focus-ring rounded-full">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full flex items-center justify-center shadow-2xs border border-slate-200/60">
              <Image
                src="/logo/unboundx-mark.png"
                width={32}
                height={32}
                alt=""
                className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <UnboundXBrand className="text-base sm:text-lg" />
          </TransitionLink>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-7 text-sm font-medium sm:flex">
            {nav.map(([label, href]) => {
              const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <TransitionLink
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-1 transition-colors duration-200 hover:text-blue-600 focus-ring rounded-md ${
                    isActive ? "text-blue-600 font-semibold" : "text-slate-600"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-x-0 -bottom-1 h-[2px] rounded-pill bg-blue-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </TransitionLink>
              );
            })}

            {/* Explore Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="Toggle explore navigation menu"
                className={`inline-flex items-center gap-1 py-1 transition-colors duration-200 focus-ring rounded-md cursor-pointer ${
                  dropdownOpen ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <span>Explore</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute top-full mt-3 -left-12 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-elevated backdrop-blur-xl z-50"
                  >
                    <div className="space-y-0.5">
                      {exploreLinks.map((item) => (
                        <TransitionLink
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex flex-col rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-50 focus-ring"
                        >
                          <span className="text-xs font-bold text-slate-900">{item.label}</span>
                          <span className="text-micro text-slate-500">{item.desc}</span>
                        </TransitionLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 transition-transform active:scale-95 sm:hidden cursor-pointer shadow-2xs focus-ring"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Accessible Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] sm:hidden">
            {/* Backdrop: fades in, clicking it closes drawer */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
              onClick={handleClose}
              aria-hidden="true"
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              className="absolute top-0 right-0 bottom-0 w-full max-w-[340px] min-[400px]:max-w-[360px] bg-white flex flex-col justify-between p-5 sm:p-6 shadow-2xl border-l border-slate-200/80 overflow-y-auto"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full flex items-center justify-center shadow-2xs border border-slate-200">
                    <Image
                      src="/logo/unboundx-mark.png"
                      width={28}
                      height={28}
                      alt=""
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <UnboundXBrand className="text-base" />
                </div>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={handleClose}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer focus-ring"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Staggered Navigation Content */}
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="my-auto flex flex-col gap-5 py-5"
              >
                <div className="space-y-2">
                  <p className="text-micro font-bold uppercase tracking-wider text-slate-400">Core</p>
                  {nav.map(([label, href]) => {
                    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
                    return (
                      <motion.div key={href} variants={itemVariants}>
                        <TransitionLink
                          onClick={handleClose}
                          href={href}
                          className={cn(
                            "block text-xl font-extrabold tracking-tight py-1 transition-colors",
                            isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
                          )}
                        >
                          {label}
                        </TransitionLink>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div variants={itemVariants} className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-micro font-bold uppercase tracking-wider text-slate-400">Explore</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {exploreLinks.map((item) => (
                      <TransitionLink
                        key={item.href}
                        href={item.href}
                        onClick={handleClose}
                        className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 transition-colors hover:bg-blue-50/60 hover:border-blue-200/60 focus-ring"
                      >
                        <p className="text-xs font-bold text-slate-900 leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.desc}</p>
                      </TransitionLink>
                    ))}
                  </div>
                </motion.div>

                {/* Primary CTA after links */}
                <motion.div variants={itemVariants} className="pt-2">
                  <AuthButton
                    flow="signup"
                    icon={false}
                    onClick={handleClose}
                    className="w-full justify-center inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 shadow-md shadow-blue-600/20 transition-transform active:scale-95"
                  >
                    <span>Get started</span>
                    <ArrowRight size={15} />
                  </AuthButton>
                </motion.div>
              </motion.nav>

              {/* Bottom Social Icons */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-slate-500">
                <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on X" className="p-1.5 hover:text-blue-600 transition-colors focus-ring rounded-full">
                  <FaTwitter size={14} />
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on LinkedIn" className="p-1.5 hover:text-blue-600 transition-colors focus-ring rounded-full">
                  <FaLinkedinIn size={14} />
                </a>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on Facebook" className="p-1.5 hover:text-blue-600 transition-colors focus-ring rounded-full">
                  <FaFacebookF size={14} />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on Instagram" className="p-1.5 hover:text-blue-600 transition-colors focus-ring rounded-full">
                  <FaInstagram size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const footerColumns = [
  {
    heading: "Product",
    links: [
      ["Thesis Journey", "/#thesis"],
      ["Collaborative Spaces", "/#spaces"],
      ["Beyond Social Feeds", "/#beyond-the-feed"],
    ],
  },
  {
    heading: "UBverse Platform",
    links: [
      ["Deal Marketplace", "/platform"],
      ["For Founders", "/for-founders"],
      ["Service Tiers", "/services"],
      ["Playbook Newsletter", "/newsletter"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About Us", "/about#top"],
      ["Careers & Culture", "/careers"],
      ["Market Blog", "/blog"],
      ["Press & Media Kit", "/press"],
    ],
  },
  {
    heading: "Legal & Regulatory",
    links: [
      ["Legal Hub", "/legal"],
      ["Form CRS", "/legal/crs"],
      ["Reg BI Disclosure", "/legal/reg-bi-disclosure"],
      ["Investment Disclaimers", "/legal/investment-disclaimers"],
      ["Support", "/legal/support"],
    ],
  },
] as const;

export function SiteFooter() {
  const [showTop, setShowTop] = useState(false);
  const pathname = usePathname();

  const showRecordCard = pathname === "/";
  const hasOwnOverlapCard = pathname === "/ubverse" || pathname === "/about";

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 450);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The Login page must never render the shared footer
  if (pathname === "/login" || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <footer
        className={`relative bg-slate-50 border-t border-slate-200/90 pb-10 text-slate-700 ${
          hasOwnOverlapCard ? "mt-0 pt-24 sm:pt-28" : "mt-20 pt-0 sm:mt-28 md:mt-32"
        }`}
      >
        {showRecordCard && (
        <div className="relative z-20 mx-auto px-4 -translate-y-10 sm:-translate-y-16 md:-translate-y-1/2 -mb-10 sm:-mb-16 md:-mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="card-fintech mx-auto flex max-w-[1120px] flex-col items-center gap-8 p-6 sm:p-8 md:p-10 shadow-lg md:flex-row md:justify-between"
          >
            <div className="w-full max-w-[280px] shrink-0 rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-xs">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>NVDA</span>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-micro font-bold text-blue-700">
                  LONG
                </span>
              </div>
              <dl className="mt-3 space-y-1.5 text-xs md:text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 font-medium">Entered</dt>
                  <dd className="font-semibold text-slate-800 tabular-numbers">$219.86</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 font-medium">Target</dt>
                  <dd className="font-semibold text-slate-800 tabular-numbers">$260.00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 font-medium">By</dt>
                  <dd className="font-semibold text-slate-800">Dec 2026</dd>
                </div>
              </dl>
              <div className="mt-4" aria-hidden="true">
                <div className="relative mx-1 h-[2px] rounded-full bg-slate-200">
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600" />
                  <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-[1.5px] border-slate-400/60 bg-white" />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-micro font-medium">
                <span className="text-blue-600 font-semibold">Published</span>
                <span className="text-slate-500">Settled</span>
              </div>
            </div>

            <div className="text-center md:text-left flex-1 max-w-lg">
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
                Turn market theses into verified credibility.
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                Publish your price target and time horizon before events unfold. Build an immutable, public track record evaluated by real market results.
              </p>
              <AuthButton
                flow="signup"
                icon={false}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
              >
                <span>Start your record</span>
                <ArrowRight size={15} />
              </AuthButton>
            </div>

            {/* QR code */}
            <div className="hidden shrink-0 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:flex">
              <Image
                src="/image/QR.webp"
                width={64}
                height={64}
                alt="Scan QR code"
                className="h-16 w-16 object-contain shadow-2xs rounded-lg"
              />
              <div className="text-xs text-left">
                <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">Take UnBound X with you.</p>
                <p className="text-slate-500 mt-0.5 text-xs">Scan to get started on your phone.</p>
              </div>
            </div>
          </motion.div>
        </div>
        )}

        <div className="mx-auto grid max-w-[1180px] gap-x-8 gap-y-10 px-6 pt-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-full shadow-2xs flex items-center justify-center border border-slate-200">
                <Image
                  src="/logo/unboundx-mark.png"
                  width={32}
                  height={32}
                  alt=""
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>
                <UnboundXBrand className="text-lg font-bold text-slate-900" />
                <p className="text-xs text-blue-600 font-semibold">{site.brandLine}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-[240px]">
              The verifiable record-keeping layer for investment ideas and private market offerings.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <a
                href="mailto:info@unboundxinc.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
              >
                <Mail size={13} className="text-blue-600 shrink-0" />
                <span>info@unboundxinc.com</span>
              </a>
            </div>
            <div className="flex gap-2.5 pt-2">
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UnBound X on X"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 focus-ring shadow-2xs"
              >
                <FaTwitter size={13} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UnBound X on LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 focus-ring shadow-2xs"
              >
                <FaLinkedinIn size={13} />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UnBound X on Facebook"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 focus-ring shadow-2xs"
              >
                <FaFacebookF size={13} />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UnBound X on Instagram"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 focus-ring shadow-2xs"
              >
                <FaInstagram size={13} />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-slate-900">{col.heading}</h3>
              <ul className="space-y-2.5 text-xs">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <TransitionLink href={href} className="text-slate-600 transition-colors hover:text-blue-600 focus-ring rounded-xs">
                      {label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-[1180px] border-t border-slate-200 px-6 pt-6">
          <p className="text-[11px] leading-relaxed text-slate-500 mb-4">
            Securities transactions executed through MARV Capital, Inc., SEC-registered broker-dealer &middot; Member FINRA/SIPC (CRD #104390).
          </p>
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2026 {site.name} Inc. All rights reserved.</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <TransitionLink href="/legal/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</TransitionLink>
              <TransitionLink href="/legal/terms-condition" className="hover:text-blue-600 transition-colors">Terms &amp; Condition</TransitionLink>
              <TransitionLink href="/legal/investment-disclaimers" className="hover:text-blue-600 transition-colors">Disclaimers</TransitionLink>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showTop && (
            <motion.a
              href="#top"
              aria-label="Back to top"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-40 grid h-10 w-10 place-items-center rounded-pill bg-white text-slate-800 shadow-xl border border-slate-200/80 transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <ArrowUpRight size={16} className="-rotate-45" />
            </motion.a>
          )}
        </AnimatePresence>
      </footer>
    </>
  );
}