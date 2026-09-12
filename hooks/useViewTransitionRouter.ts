"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Wraps Next.js App Router navigation.
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
