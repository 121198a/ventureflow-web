"use client";

import { useEffect, useState } from "react";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export function ApplyClientCTA() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget("#apply")}
      className="mt-6 block w-full rounded-full bg-brand px-6 py-4 text-center text-sm font-semibold text-brand-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
    >
      Apply for this role ↓
    </button>
  );
}

export function MobileApplyBar({ roleTitle }: { roleTitle: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("apply");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => scrollToTarget("#apply")}
        className="block w-full truncate rounded-full bg-brand px-6 py-4 text-center text-sm font-semibold text-brand-foreground transition-all duration-200 active:scale-[0.99]"
      >
        Apply — {roleTitle}
      </button>
    </div>
  );
}
