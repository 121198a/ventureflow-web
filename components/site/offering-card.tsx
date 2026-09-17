"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StatRow } from "./stat-row";
import type { Offering } from "@/lib/offerings-data";
import {
  FundingTargetIcon,
  WalletInvestmentIcon,
  DocumentFilingIcon,
} from "@/components/ui/CustomIcons";

export function OfferingCard({ o }: { o: Offering }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(o.imageUrl) && !imgError;

  const stats = [
    { value: o.goal, label: "Funding goal", icon: <FundingTargetIcon size={14} /> },
    { value: o.min, label: "Min. Invest...", icon: <WalletInvestmentIcon size={14} /> },
    { value: o.filing, label: "Security Filing", icon: <DocumentFilingIcon size={14} /> },
  ];

  return (
    <Link
      href={`/${o.slug}`}
      className="group block cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
    >
      <div
        className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
        style={{ background: showImage ? "#ffffff" : o.art }}
      >
        {showImage && o.imageUrl ? (
          <div className="relative h-full w-full p-4 flex items-center justify-center">
            <Image
              src={o.imageUrl}
              alt={o.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <span
            className="text-4xl text-white/90 transition-transform duration-300 ease-out group-hover:scale-110"
            style={{ fontWeight: 800, letterSpacing: "-0.04em" }}
          >
            {o.initials}
          </span>
        )}
      </div>
      <h3
        className="mt-5 text-[1.25rem] sm:text-[1.35rem] font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-600"
      >
        {o.name}
      </h3>
      <p className="mt-1 text-xs sm:text-[0.875rem] text-slate-500 font-medium">Funding Round: {o.round}</p>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <StatRow items={stats} />
      </div>
    </Link>
  );
}
