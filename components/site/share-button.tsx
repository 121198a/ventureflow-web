"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard API unavailable — fail silently rather than throw.
        }
      }}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[0.85rem] text-ink/80 transition-colors hover:border-brand hover:text-brand"
      style={{ fontWeight: 600 }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
