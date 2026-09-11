"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Resolver = () => void;
let pending: Resolver | null = null;

export function registerPendingTransition(resolve: Resolver) {
  
  pending?.();
  pending = resolve;
}

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    pending?.();
    pending = null;
  }, [pathname]);

  return <>{children}</>;
}
