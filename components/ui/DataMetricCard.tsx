import React from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/CountUp";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface DataMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
  animated?: boolean;
}

export function DataMetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  change,
  changeLabel,
  trend,
  icon,
  subtitle,
  animated = true,
  className = "",
  ...props
}: DataMetricCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.-]+/g, ""));
  const isNumeric = !isNaN(numericValue) && animated;
  const isPositive = trend === "up" || (trend === undefined && (change ?? 0) >= 0);

  return (
    <div
      className={cn(
        "card-fintech-interactive p-5",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="tabular-numbers text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {prefix}
          {isNumeric ? (
            <CountUp value={numericValue} />
          ) : (
            <span>{value}</span>
          )}
          {suffix}
        </div>

        {change !== undefined && (
          <span
            className={cn(
              "badge-fintech py-0.5 px-2 text-micro",
              isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}
          >
            {isPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </span>
        )}
      </div>

      {(subtitle || changeLabel) && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal">
          {changeLabel ? `${changeLabel} · ` : ""}
          {subtitle}
        </p>
      )}
    </div>
  );
}
