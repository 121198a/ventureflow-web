"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, startTransition } from "react";

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

/**
 * Wraps Next.js App Router navigation in the browser's native View
 * Transition API (document.startViewTransition), so route changes get a
 * smooth cross-fade/slide instead of an abrupt swap.
 *
 * - No-op fallback (plain router.push) in browsers without support, or when
 *   the user has requested reduced motion — navigation itself is never
 *   blocked by this.
 * - Resolves the transition once the *new* route has actually committed
 *   (pathname changed), not just once router.push() was called, so the
 *   browser captures the real "after" state rather than a stale one.
 */
export function useViewTransitionRouter() {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return navigate;
}
