import Image from "next/image";
import Link from "next/link";
import { FULL_BRAND, PRODUCT_NAME, COMPANY_NAME } from "@/lib/constants";
import { VentureFlowBrand } from "@/components/ui/VentureFlowBrand";

export function BrandLogo({
  className = "",
  showParent = true,
}: {
  className?: string;
  showParent?: boolean;
}) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-2xs border border-slate-200/80 bg-blue-600">
        <Image
          src="/logo/vf-mark.png"
          alt={PRODUCT_NAME}
          width={32}
          height={32}
          className="h-full w-full object-cover rounded-full"
          priority
        />
      </div>
      <span className="truncate text-[1.05rem] sm:text-[1.15rem] font-bold flex items-baseline gap-1.5 text-slate-900 tracking-tight">
        <VentureFlowBrand className="text-[1.05rem] sm:text-[1.15rem]" />
        {showParent && (
          <>
            <span className="text-slate-400 text-xs font-normal">by</span>
            <span className="text-slate-900 font-bold">{COMPANY_NAME}</span>
          </>
        )}
      </span>
    </span>
  );
}

export function BrandLogoLink({
  className = "",
  href = "/platform",
  showParent = true,
}: {
  className?: string;
  href?: string;
  showParent?: boolean;
}) {
  return (
    <Link href={href} aria-label={`${FULL_BRAND} home`} className="min-w-0 shrink flex items-center">
      <BrandLogo className={className} showParent={showParent} />
    </Link>
  );
}
