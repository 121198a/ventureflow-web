import type { Metadata } from "next";
import { Suspense } from "react";
import { FounderDashboardClient } from "@/components/dashboard/FounderDashboardClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Founder & Issuer Dashboard | UBverse by UnBound X",
  description:
    "Manage your capital raise, track real investor inquiries, and review SEC compliance filings on UBverse.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FounderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
          <Loader2 className="size-8 animate-spin text-blue-600 mb-3" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Loading Founder Workspace...
          </p>
        </div>
      }
    >
      <FounderDashboardClient />
    </Suspense>
  );
}
