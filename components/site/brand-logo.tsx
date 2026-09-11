import Image from "next/image";
import Link from "next/link";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-2xs">
        <Image
          src="/logo/unboundx-mark.png"
          alt="UBverse"
          width={32}
          height={32}
          className="h-full w-full object-cover rounded-full"
          priority
        />
      </div>
      <span className="truncate text-[1.05rem] sm:text-[1.15rem] font-bold flex items-center gap-1.5 text-slate-900 tracking-tight">
        <span className="text-[#162447] font-extrabold">UBverse</span>
        <span className="text-slate-400 text-xs font-normal">by</span>
        <UnboundXBrand className="text-[1.05rem] sm:text-[1.15rem]" />
      </span>
    </span>
  );
}

export function BrandLogoLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/platform" aria-label="UBverse by UnBound X home" className="min-w-0 shrink flex items-center">
      <BrandLogo className={className} />
    </Link>
  );
}
