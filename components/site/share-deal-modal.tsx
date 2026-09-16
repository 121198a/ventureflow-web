"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Brand-colored circular social icons matching the reference (WhatsApp
    green, LinkedIn blue, X black) — inline SVG, no external icon set needed
    for these three brand marks. */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.11h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.18 8.18 0 0 1-1.26-4.32c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.7 8.18-8.22 8.18Zm4.51-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[16px]" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" aria-hidden>
      <path d="M13.6 10.62 20.1 3h-1.54l-5.64 6.62L8.4 3H3l6.82 9.94L3 21h1.54l5.96-6.98L15.6 21H21l-7.4-10.38Zm-2.11 2.47-.69-.98-5.5-7.86h2.36l4.44 6.35.69.98 5.77 8.25h-2.36l-4.71-6.74Z" />
    </svg>
  );
}

export function ShareDealModal({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/${slug}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[0.82rem] text-ink/80 transition-colors hover:border-brand hover:text-brand"
          style={{ fontWeight: 600 }}
        >
          <Share2 className="size-3.5" />
          Share Deal
        </button>
      </DialogTrigger>
      <DialogContent className="text-center">
        <DialogTitle className="text-[1.1rem]">Share This Deal</DialogTitle>

        <div className="mt-6 text-left">
          <p className="text-[0.8rem] text-ink/70" style={{ fontWeight: 600 }}>
            Share
          </p>
          <div className="mt-3 flex gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out this offering on UBverse: ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border border-hairline text-[#25D366] transition-colors hover:border-[#25D366]"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="flex size-9 items-center justify-center rounded-full border border-hairline text-[#0A66C2] transition-colors hover:border-[#0A66C2]"
            >
              <LinkedInIcon />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Check out this offering on UBverse:")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="flex size-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-ink"
            >
              <XIcon />
            </a>
          </div>

          <p className="mt-6 text-[0.8rem] text-ink/70" style={{ fontWeight: 600 }}>
            Copy link
          </p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={url}
              className="w-full min-w-0 rounded-md border border-hairline bg-surface-alt px-3 py-2 text-[0.8rem] text-ink/70 outline-none"
            />
            <button
              type="button"
              aria-label="Copy link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // Clipboard API unavailable — fail silently.
                }
              }}
              className="flex shrink-0 items-center justify-center rounded-md border border-hairline px-3 text-ink/70 transition-colors hover:border-brand hover:text-brand"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
