import Link from "next/link";
import { AlertCircle, FileX, ServerCrash } from "lucide-react";

export type CmsErrorType = "503" | "config" | "empty" | "404";

interface CmsErrorStateProps {
  type?: CmsErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * Visually and technically distinct error states for CMS content.
 * Differentiates 404, 503, Empty content, and Configuration failures.
 */
export function CmsErrorState({
  type = "503",
  title,
  message,
}: CmsErrorStateProps) {
  const configs: Record<CmsErrorType, {
    title: string;
    message: string;
    icon: typeof ServerCrash;
    badge: string;
    badgeColor: string;
  }> = {
    "503": {
      title: "Content Service Temporarily Unavailable",
      message: "The document service is experiencing high load or connection maintenance. Please refresh or try again shortly.",
      icon: ServerCrash,
      badge: "503 - SERVICE UNAVAILABLE",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    config: {
      title: "Content Service Configuration Pending",
      message: "The content management configuration is being initialized. Documents are being served from static failover where available.",
      icon: AlertCircle,
      badge: "CONFIGURATION NOTICE",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    empty: {
      title: "Document Content Coming Soon",
      message: "This legal document exists in the registry but has not been published with body content yet.",
      icon: FileX,
      badge: "EMPTY DOCUMENT",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    },
    "404": {
      title: "Legal Document Not Found",
      message: "The document you requested does not exist or may have been permanently archived.",
      icon: FileX,
      badge: "404 - NOT FOUND",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const current = configs[type] || configs["503"];
  const heading = title || current.title;
  const description = message || current.message;
  const Icon = current.icon;

  return (
    <div
      role="alert"
      className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 text-center shadow-xs max-w-xl mx-auto my-8"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 mb-4">
        <Icon className="h-6 w-6 text-slate-600" />
      </div>

      <span className={`inline-block px-3 py-1 rounded-full border text-micro font-bold tracking-wider mb-3 ${current.badgeColor}`}>
        {current.badge}
      </span>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        {heading}
      </h1>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/legal"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
        >
          Back to Legal Hub
        </Link>
      </div>
    </div>
  );
}
