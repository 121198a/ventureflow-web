"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { socialLinks } from "@/lib/constants";

export type MobileMenuItem = {
  label: string;
  /** Internal route. Omit when using onSelect (e.g. in-page hash scrolling). */
  href?: string;
  onSelect?: () => void;
  active?: boolean;
};

export type MobileMenuSecondaryItem = { label: string; href: string };

type Props = {
  drawerRef?: RefObject<HTMLDivElement | null>;
  ariaLabel: string;
  onClose: () => void;
  brandHref?: string;
  items: MobileMenuItem[];
  /** Small pill links shown under the main list (e.g. "Explore"). */
  secondary?: MobileMenuSecondaryItem[];
  secondaryLabel?: string;
  /** Primary call-to-action, rendered as-is (pass gradientCtaClass for the look). */
  cta?: ReactNode;
  /** Tailwind class that hides the overlay at desktop widths, e.g. "sm:hidden". */
  hideAt?: string;
};

/** Class string for the gradient pill "Get started" style button. */
export const gradientCtaClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_-8px_rgba(168,32,190,0.7)] transition-transform active:scale-95 bg-[linear-gradient(135deg,#c02bd6,#8f3be0)]";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen gradient mobile menu shared by every site nav.
 * Focus trap / Escape / scroll-lock stay in each nav (they pass drawerRef);
 * this component is presentation + entrance motion only. It is portalled to
 * <body> so ancestor backdrop-filter/transform can't shrink the "fixed" box.
 */
export function GradientMobileMenu({
  drawerRef,
  ariaLabel,
  onClose,
  brandHref = "/",
  items,
  secondary,
  secondaryLabel = "Explore",
  cta,
  hideAt = "sm:hidden",
}: Props) {
  const reduce = useReducedMotion();
  if (typeof document === "undefined") return null;

  const itemMotion = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : 0.06 * i + 0.1, duration: reduce ? 0.01 : 0.45, ease: EASE },
  });

  const itemClass = (active?: boolean) =>
    `block w-full py-1.5 text-center text-[clamp(1.75rem,7.5vw,2.25rem)] font-extrabold leading-tight tracking-tight transition-colors ${
      active ? "text-white" : "text-white/55 hover:text-white"
    }`;

  return createPortal(
    <motion.div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      initial={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
      transition={{ duration: reduce ? 0.01 : 0.3, ease: EASE }}
      className={`fixed inset-0 z-[100] flex flex-col overflow-y-auto p-4 text-white ${hideAt}`}
      style={{
        background:
          "linear-gradient(135deg, #c8952a 0%, #9c3d5c 22%, #7b1a90 52%, #5148b0 78%, #1595cc 100%)",
      }}
    >
      {/* Decorative arcs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full border border-white/15" />
        <div className="absolute -bottom-40 -left-32 h-[560px] w-[560px] rounded-full border border-white/15" />
        <div className="absolute -bottom-24 left-1/3 h-[760px] w-[760px] rounded-full border border-white/10" />
      </div>

      {/* Pill header */}
      <div
        className="relative z-10 mx-auto flex h-14 w-full max-w-lg shrink-0 items-center justify-between rounded-full px-4 shadow-xl"
        style={{
          background: "linear-gradient(90deg, rgba(255,244,230,0.96), rgba(246,224,240,0.96))",
        }}
      >
        <Link href={brandHref} onClick={onClose} className="flex items-center gap-2.5 font-bold">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/logo/unboundx-mark.png"
              width={32}
              height={32}
              alt="UnBound X logo"
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <UnboundXBrand className="text-base" />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-800 transition-transform active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Centered links */}
      <nav className="relative z-10 mx-auto my-auto flex w-full max-w-lg flex-col items-center gap-[clamp(1rem,3.2vh,1.75rem)] py-[clamp(1rem,4vh,2rem)]">
        <div className="flex w-full flex-col items-center gap-0.5">
        {items.map((item, i) => (
          <motion.div key={item.label} className="w-full" {...itemMotion(i)}>
            {item.href ? (
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={item.active ? "page" : undefined}
                className={itemClass(item.active)}
              >
                {item.label}
              </Link>
            ) : (
              <button type="button" onClick={item.onSelect} className={itemClass(item.active)}>
                {item.label}
              </button>
            )}
          </motion.div>
        ))}
        </div>

        {secondary && secondary.length > 0 && (
          <motion.div className="w-full" {...itemMotion(items.length)}>
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-white/60">
              {secondaryLabel}
            </p>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2.5">
              {secondary.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-4 text-[13px] font-semibold leading-none text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {cta && (
          <motion.div className="pt-1" {...itemMotion(items.length + 1)}>
            {cta}
          </motion.div>
        )}
      </nav>

      {/* Social icons */}
      <div className="relative z-10 mx-auto flex shrink-0 items-center justify-center gap-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 text-white/70">
        <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on X" className="p-2 transition-colors hover:text-white">
          <FaTwitter size={18} />
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on LinkedIn" className="p-2 transition-colors hover:text-white">
          <FaLinkedinIn size={18} />
        </a>
        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on Facebook" className="p-2 transition-colors hover:text-white">
          <FaFacebookF size={18} />
        </a>
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="UnBound X on Instagram" className="p-2 transition-colors hover:text-white">
          <FaInstagram size={18} />
        </a>
      </div>
    </motion.div>,
    document.body
  );
}
