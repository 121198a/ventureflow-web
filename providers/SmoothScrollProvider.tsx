"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const NAVBAR_OFFSET = -80;

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// Global reference for outside-React calls
let globalLenis: Lenis | null = null;

export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: { offset?: number; immediate?: boolean; duration?: number }
) {
  const offset = options?.offset ?? NAVBAR_OFFSET;

  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset,
      immediate: options?.immediate ?? false,
      duration: options?.duration ?? 1.1,
    });
    return;
  }

  if (typeof window !== "undefined") {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: options?.immediate ? "instant" : "smooth" });
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: options?.immediate ? "instant" : "smooth" });
      }
    }
  }
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // Respect reduced motion preference
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false, // Ensures natural non-hijacked mobile touch scrolling
    });

    lenisRef.current = lenis;
    globalLenis = lenis;
    setLenisInstance(lenis);

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    // Global anchor click interception
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Check for in-page hash links like "#thesis" or "/#thesis" when on "/"
      const currentPath = pathnameRef.current;
      const isInternalHash = href.startsWith("#");
      const isHomeHash = href.startsWith("/#") && (currentPath === "/" || currentPath === "");

      if (isInternalHash || isHomeHash) {
        const hash = isInternalHash ? href : href.slice(1);
        if (hash === "#" || hash === "") return;

        const el = document.querySelector(hash);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, {
            offset: NAVBAR_OFFSET,
            duration: 1.1,
          });
          if (window.history.pushState) {
            window.history.pushState(null, "", hash);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
      setLenisInstance(null);
    };
  }, []);

  // Handle route changes and initial hash navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash && lenisRef.current) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          lenisRef.current?.scrollTo(el as HTMLElement, {
            offset: NAVBAR_OFFSET,
            immediate: false,
          });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else if (!hash && lenisRef.current) {
      // Scroll to top on clean route transition
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollTo = useCallback(
    (
      target: string | HTMLElement | number,
      options?: { offset?: number; immediate?: boolean; duration?: number }
    ) => {
      scrollToTarget(target, options);
    },
    []
  );

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
