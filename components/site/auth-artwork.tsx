"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * UBverse "pedestal" artwork (city + glass U emblem + iridescent ribbon road).
 *
 * The bitmap is pre-faded on its top and right edges so it melts into the page
 * background, and it bleeds off the left / bottom edges of the viewport. The
 * "SECURE • PRIVATE • BUILT FOR THE FUTURE" trust line is rendered as live text
 * on top of the artwork so it stays crisp and translatable.
 */
export function AuthArtwork({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none relative select-none", className)}
      style={{ aspectRatio: "806 / 561" }}
    >
      <Image
        src="/images/auth-artwork.webp"
        alt=""
        width={1612}
        height={1122}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover object-left-bottom"
        aria-hidden="true"
      />

      <div className="absolute bottom-[8.6%] left-[10.9%] flex items-center gap-[clamp(0.5rem,1.1vw,1rem)] whitespace-nowrap text-[length:clamp(0.5rem,0.66vw,0.72rem)] font-semibold uppercase tracking-[0.2em] text-white/95 lg:tracking-[0.235em]">
        <ShieldCheck className="size-[clamp(0.95rem,1.3vw,1.4rem)] shrink-0" strokeWidth={1.6} aria-hidden="true" />
        <span>Secure</span>
        <span aria-hidden="true">&bull;</span>
        <span>Private</span>
        <span aria-hidden="true">&bull;</span>
        <span>Built for the future</span>
      </div>
    </div>
  );
}
