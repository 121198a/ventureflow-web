import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Clock } from "lucide-react";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/careers" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
              <Image
                src="/logo/unboundx-mark.png"
                width={28}
                height={28}
                alt="UnBound X"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <UnboundXBrand className="text-lg font-bold" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
            Building the record-keeping layer for retail investing — with a
            small, senior team that ships in public.
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          <p className="eyebrow">Talent</p>
          <a
            href="mailto:careers@unboundxinc.com"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-foreground hover:text-brand"
          >
            <Mail size={15} className="shrink-0 text-brand" aria-hidden />
            <span className="break-all">careers@unboundxinc.com</span>
          </a>
          <p className="mt-2 flex items-center gap-2">
            <Clock size={15} className="text-brand" aria-hidden />
            Answered within five working days.
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          <p className="eyebrow">Where we work</p>
          <p className="mt-4 flex items-center gap-2">
            <MapPin size={15} className="text-brand" aria-hidden />
            Remote-first · India
          </p>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UnBound X. All rights reserved.
      </div>
    </footer>
  );
}
