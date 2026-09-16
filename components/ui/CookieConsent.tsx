"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ub_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access restricted (e.g. strict iframe or private browsing)
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("ub_cookie_consent", "accepted");
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("ub_cookie_consent", "essential");
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and privacy preferences"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-elevated backdrop-blur-xl transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">Privacy &amp; Data Preferences</p>
          We use essential browser storage to support secure authentication, rate-limiting, and platform navigation. For details, please review our{" "}
          <Link href="/legal/cookie-policy" className="text-blue-600 underline hover:text-blue-800">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy-policy" className="text-blue-600 underline hover:text-blue-800">
            Privacy Policy
          </Link>.
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Close cookie notice"
          className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-ring cursor-pointer shrink-0"
        >
          <X size={15} />
        </button>
      </div>
      <div className="mt-3.5 flex flex-wrap items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-ring cursor-pointer"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus-ring cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
