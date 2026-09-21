"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Loader2, Send } from "lucide-react";
import Link from "next/link";

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && !connected && !connecting) {
      setConnecting(true);
      fetch("/api/support-chat", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setConnected(true);
          }
        })
        .catch(() => {})
        .finally(() => setConnecting(false));
    }
  }, [open, connected, connecting]);

  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-3"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(var(--chat-bottom, 1.25rem), env(safe-area-inset-bottom))",
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with UBverse Support"
          className="w-[min(320px,calc(100vw_-_2.5rem))] rounded-xl border border-hairline bg-card p-5 shadow-elevated animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-ink">UBverse Support</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="my-4 text-xs text-ink/75 leading-relaxed">
            {connecting ? (
              <div className="flex items-center gap-2 py-4 text-muted-foreground justify-center">
                <Loader2 className="size-4 animate-spin text-brand" />
                <span>Connecting to support desk...</span>
              </div>
            ) : connected ? (
              <div className="space-y-2">
                <p className="font-medium text-ink">Session active</p>
                <p>An operator will respond to your inquiry shortly.</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border border-hairline px-3 py-1.5 text-xs focus:border-brand focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="rounded-md bg-brand p-1.5 text-white hover:bg-brand-strong"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-ink mb-1">Live Capital Markets Support</p>
                <p className="mb-2">
                  For immediate assistance with allocations or issuer filings, reach us directly at{" "}
                  <a href="mailto:info@unboundxinc.com" className="text-brand underline font-medium">
                    info@unboundxinc.com
                  </a>.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Registered members can also{" "}
                  <Link href="/login" className="text-brand underline">
                    sign in
                  </Link>{" "}
                  to access dedicated deal chat.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className="grid size-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-brand-strong focus-ring cursor-pointer"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
