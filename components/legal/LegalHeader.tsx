import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Container } from "@/components/ui/Container";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { MAIN_SITE_URL } from "@/lib/constants";

export function LegalHeader() {
  return (
    <header className="h-16 shrink-0 border-b border-slate-200 bg-white">
      <Container className="h-full max-w-none px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <TransitionLink
            href={MAIN_SITE_URL}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
              <Image
                src="/logo/unboundx-mark.png"
                width={32}
                height={32}
                alt="UnBound X"
                className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
                priority
              />
            </div>

            <UnboundXBrand className="text-base sm:text-lg" />
          </TransitionLink>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-full px-3.5 py-1.5 hover:bg-slate-50 shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}