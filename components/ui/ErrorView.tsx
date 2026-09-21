"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  RotateCcw,
  HelpCircle,
  ShieldAlert,
  Lock,
  AlertTriangle,
  ServerCrash,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

export type ErrorAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon | React.ReactNode;
};

export type PopularDestination = {
  label: string;
  href: string;
  icon?: LucideIcon | React.ReactNode;
};

export interface ErrorViewProps {
  /**
   * HTTP error code or short label (e.g. 404, 403, 401, 500, 503)
   */
  code?: number | string;
  /**
   * Text for the small upper pill badge, e.g. "404 - PAGE NOT FOUND"
   */
  badgeText?: string;
  /**
   * Semantic title / heading
   */
  title?: string;
  /**
   * Explanatory text beneath the gradient number
   */
  description?: string;
  /**
   * Primary action button (e.g. Back to Home, Try Again)
   */
  primaryAction?: ErrorAction;
  /**
   * Secondary action button (e.g. Legal Hub, Support)
   */
  secondaryAction?: ErrorAction | null;
  /**
   * Whether to show the "POPULAR DESTINATIONS" links section
   */
  showPopularDestinations?: boolean;
  /**
   * Custom list of popular destinations
   */
  popularDestinations?: PopularDestination[];
  /**
   * Optional error digest / id for 500 troubleshooting
   */
  errorDigest?: string;
  /**
   * Optional custom className for outer wrapper
   */
  className?: string;
  /**
   * If true, strips min-h-screen for embedded cards
   */
  isEmbedded?: boolean;
}

const DEFAULT_POPULAR_DESTINATIONS: PopularDestination[] = [
  { label: "Home", href: "/" },
  { label: "UBverse", href: "/ubverse", icon: ExternalLink },
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Condition", href: "/legal/terms-condition" },
];

function getDefaultConfig(code: number | string): {
  badge: string;
  title: string;
  description: string;
  badgeIcon: LucideIcon;
  primaryAction: ErrorAction;
  secondaryAction?: ErrorAction;
} {
  const codeNum = typeof code === "number" ? code : parseInt(String(code), 10);

  switch (codeNum) {
    case 403:
      return {
        badge: "403 - ACCESS FORBIDDEN",
        title: "Access Restricted",
        description:
          "You don't have permission to access this area or document. If you believe this is an error, please sign in or contact support.",
        badgeIcon: ShieldAlert,
        primaryAction: {
          label: "Back to Home",
          href: "/",
          icon: Home,
        },
        secondaryAction: {
          label: "Sign In",
          href: "/login",
          icon: Lock,
        },
      };

    case 401:
      return {
        badge: "401 - AUTHORIZATION REQUIRED",
        title: "Authentication Required",
        description:
          "You need to be signed in to view this page or perform this action. Please log in or return to the main portal.",
        badgeIcon: Lock,
        primaryAction: {
          label: "Sign In",
          href: "/login",
          icon: Lock,
        },
        secondaryAction: {
          label: "Back to Home",
          href: "/",
          icon: Home,
        },
      };

    case 500:
      return {
        badge: "500 - SERVER ERROR",
        title: "Something Went Wrong",
        description:
          "Our system encountered an unexpected error while processing your request. Please try again or return home.",
        badgeIcon: ServerCrash,
        primaryAction: {
          label: "Try Again",
          onClick: () => {
            if (typeof window !== "undefined") window.location.reload();
          },
          icon: RotateCcw,
        },
        secondaryAction: {
          label: "Back to Home",
          href: "/",
          icon: Home,
        },
      };

    case 503:
      return {
        badge: "503 - SERVICE UNAVAILABLE",
        title: "System Maintenance",
        description:
          "We're currently undergoing scheduled maintenance or experiencing high traffic. Please check back in a few moments.",
        badgeIcon: AlertTriangle,
        primaryAction: {
          label: "Refresh Page",
          onClick: () => {
            if (typeof window !== "undefined") window.location.reload();
          },
          icon: RotateCcw,
        },
        secondaryAction: {
          label: "Back to Home",
          href: "/",
          icon: Home,
        },
      };

    case 404:
    default:
      return {
        badge: "404 - PAGE NOT FOUND",
        title: "Page Not Found",
        description:
          "The page or document you're looking for doesn't exist, has been moved, or the link may be invalid.",
        badgeIcon: HelpCircle,
        primaryAction: {
          label: "Back to Home",
          href: "/",
          icon: Home,
        },
        secondaryAction: {
          label: "Legal Hub",
          href: "/legal",
          icon: FileText,
        },
      };
  }
}

export function ErrorView({
  code = 404,
  badgeText,
  title,
  description,
  primaryAction,
  secondaryAction,
  showPopularDestinations = true,
  popularDestinations = DEFAULT_POPULAR_DESTINATIONS,
  errorDigest,
  className = "",
  isEmbedded = false,
}: ErrorViewProps) {
  const defaults = getDefaultConfig(code);

  const finalBadgeText = badgeText ?? defaults.badge;
  const finalTitle = title ?? defaults.title;
  const finalDescription = description ?? defaults.description;
  const finalPrimary = primaryAction ?? defaults.primaryAction;
  const finalSecondary =
    secondaryAction === null ? null : (secondaryAction ?? defaults.secondaryAction);
  const BadgeIcon = defaults.badgeIcon;

  return (
    <main
      className={`w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-20 select-none ${
        isEmbedded ? "min-h-[420px]" : "min-h-[85vh] sm:min-h-screen"
      } ${className}`}
      role="region"
      aria-label={`${code} ${finalTitle}`}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 shadow-2xs">
          <BadgeIcon className="size-3.5 text-sky-600 shrink-0" aria-hidden="true" />
          <span>{finalBadgeText}</span>
        </div>

        {/* Big Rainbow Gradient Code */}
        <h1
          className="mt-6 text-[90px] min-[400px]:text-[110px] sm:text-[140px] md:text-[160px] font-black leading-none tracking-tight"
          style={{
            background:
              "linear-gradient(90deg, #F59E0B 0%, #EC4899 32%, #8B5CF6 68%, #00B4D8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {code}
        </h1>

        <span className="sr-only">{finalTitle}</span>

        {/* Friendly Subtitle / Explanation */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-md sm:max-w-lg mx-auto font-normal leading-relaxed">
          {finalDescription}
        </p>

        {/* Optional Error Digest */}
        {errorDigest && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">
            Reference ID: {errorDigest}
          </p>
        )}

        {/* Main Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {/* Primary Action Button */}
          {finalPrimary && (
            <>
              {finalPrimary.onClick ? (
                <button
                  type="button"
                  onClick={finalPrimary.onClick}
                  className="btn-pill-primary w-full sm:w-auto px-6 py-2.5 cursor-pointer"
                >
                  {renderActionIcon(finalPrimary.icon)}
                  <span>{finalPrimary.label}</span>
                </button>
              ) : (
                <Link
                  href={finalPrimary.href || "/"}
                  className="btn-pill-primary w-full sm:w-auto px-6 py-2.5"
                >
                  {renderActionIcon(finalPrimary.icon)}
                  <span>{finalPrimary.label}</span>
                </Link>
              )}
            </>
          )}

          {/* Secondary Action Button */}
          {finalSecondary && (
            <>
              {finalSecondary.onClick ? (
                <button
                  type="button"
                  onClick={finalSecondary.onClick}
                  className="btn-pill-secondary w-full sm:w-auto px-6 py-2.5 cursor-pointer"
                >
                  {renderActionIcon(finalSecondary.icon)}
                  <span>{finalSecondary.label}</span>
                </button>
              ) : (
                <Link
                  href={finalSecondary.href || "/"}
                  className="btn-pill-secondary w-full sm:w-auto px-6 py-2.5"
                >
                  {renderActionIcon(finalSecondary.icon)}
                  <span>{finalSecondary.label}</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Popular Destinations Section */}
        {showPopularDestinations && popularDestinations.length > 0 && (
          <nav
            aria-label="Popular destinations"
            className="mt-14 sm:mt-16 w-full flex flex-col items-center"
          >
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-3.5">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-xl">
              {popularDestinations.map((dest) => (
                <Link
                  key={dest.label}
                  href={dest.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  {renderActionIcon(dest.icon, "size-3 text-slate-400")}
                  <span>{dest.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}

function renderActionIcon(
  icon?: LucideIcon | React.ReactNode,
  fallbackClassName = "size-4"
) {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  const IconComponent = icon as LucideIcon;
  return <IconComponent className={fallbackClassName} aria-hidden="true" />;
}
export default ErrorView;
