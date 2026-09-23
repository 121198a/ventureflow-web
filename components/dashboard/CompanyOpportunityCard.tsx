import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import type { BackendCompanySummary } from "@/lib/ubverse-api";

export function CompanyOpportunityCard({ company }: { company: BackendCompanySummary }) {
  const [imgError, setImgError] = useState(false);
  const slug = company.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const plannedAmount = company.valueTotalAmountPlaning || company.totalAmountPlaning;
  const formattedPlanned =
    plannedAmount && !isNaN(Number(plannedAmount))
      ? Number(plannedAmount) >= 1_000_000
        ? `$${(Number(plannedAmount) / 1_000_000).toFixed(0)}M`
        : `$${(Number(plannedAmount) / 1_000).toFixed(0)}K`
      : plannedAmount || "Active";

  const minAmount = company.minimuminvestmentAmount;
  const formattedMin =
    minAmount && !isNaN(Number(minAmount))
      ? `$${Number(minAmount).toLocaleString()}`
      : minAmount || "$5";

  const showImage = Boolean(company.image) && !imgError;

  return (
    <Link
      href={`/${slug}`}
      className="group block rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-start gap-3.5">
        <div className="relative size-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
          {showImage && company.image ? (
            <Image
              src={company.image}
              alt={company.name}
              fill
              sizes="48px"
              className="object-contain p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <Building2 className="size-6 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {company.name}
            </h3>
            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </div>
          <p className="text-xs text-slate-500 capitalize mt-0.5">
            Round: {company.fundingRoundStage ? company.fundingRoundStage.replace(/-/g, " ") : "Private"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Planned
          </span>
          <span className="font-bold text-slate-800">{formattedPlanned}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Min. Invest
          </span>
          <span className="font-bold text-slate-800">{formattedMin}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Filing
          </span>
          <span className="font-bold text-slate-800 truncate block">
            {company.securitiesFiling || "Reg D"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 17L17 7M17 7H7M17 7V17"
      />
    </svg>
  );
}
