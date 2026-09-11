"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DealTypeModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-[13px] text-brand underline">
          Don&apos;t see your deal type?
        </button>
      </DialogTrigger>
      <DialogContent className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-brand text-brand">
          <Send className="size-6" strokeWidth={2} />
        </div>
        <DialogTitle className="mt-5">More Offering Types Coming Soon!</DialogTitle>
        <DialogDescription>
          We are expanding deal types to match your stage. Need something else? Contact us and we
          will review.
        </DialogDescription>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href="/issuer/login"
            className="w-full sm:w-auto text-center rounded-full border border-brand px-6 py-[10px] text-[0.9rem] text-brand transition-colors hover:bg-brand/5"
            style={{ fontWeight: 600 }}
          >
            Login
          </Link>
          <a
            href="mailto:info@unboundxinc.com"
            className="w-full sm:w-auto text-center rounded-full bg-brand px-6 py-[10px] text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong"
            style={{ fontWeight: 800 }}
          >
            Contact Us
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
