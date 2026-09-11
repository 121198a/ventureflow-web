"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

/**
 * Floating chat launcher — visible in every frame of the reference video
 * (bottom-right, blue circular button) but there is no chat backend/vendor
 * wired into any supplied source, so this is a real, accessible UI affordance
 * rather than invented backend functionality: it opens a small placeholder
 * panel explaining that live chat isn't connected in this build, instead of
 * silently doing nothing or faking a conversation.
 *
 * Placement fixes vs. a naive fixed-bottom-right button (audit item: "floating
 * chat placement"): sits above safe-area insets on mobile, never overlaps the
 * sticky header, and is keyboard-reachable/labelled.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-3"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with UBverse"
          className="w-[min(280px,calc(100vw_-_2.5rem))] rounded-lg border border-hairline bg-card p-5 shadow-lg"
        >
          <p className="text-[0.9rem] text-ink" style={{ fontWeight: 700 }}>
            Chat isn&apos;t connected yet
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/70">
            This build doesn&apos;t have a live support backend wired in. Reach us at{" "}
            <a href="mailto:info@unboundxinc.com" className="text-brand underline">
              info@unboundxinc.com
            </a>{" "}
            in the meantime.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className="grid size-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
