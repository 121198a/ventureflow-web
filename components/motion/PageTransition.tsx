"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || shouldReduceMotion) {
    return <div className="w-full flex-1">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.85, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
