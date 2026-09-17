import type { Metadata } from "next";
import { Suspense } from "react";
import { InvestorDashboardClient } from "@/components/dashboard/InvestorDashboardClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Investor Dashboard | UBverse by UnBound X",
  description:
    "Review real structured opportunities, track investment theses, and access verified private market offerings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvestorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
          <Loader2 className="size-8 animate-spin text-blue-600 mb-3" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Loading Investor Workspace...
          </p>
        </div>
      }
    >
      <InvestorDashboardClient />
    </Suspense>
  );
}
