"use client";

import { UserRoundCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Auth-gate modal shown when a signed-out visitor tries to see full deal
 * details or take a gated action (Indicate Interest, expand blurred
 * sections). Matches the reference exactly: person-check icon, "Login
 * Required," one line of copy, Login / Signup buttons.
 */
export function LoginRequiredModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center text-brand">
          <UserRoundCheck className="size-9" strokeWidth={1.75} />
        </div>
        <DialogTitle className="mt-3 text-[1.15rem]">Login Required</DialogTitle>
        <DialogDescription>Please log in to view the full details of this deal.</DialogDescription>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Button href="/investor/login" className="w-full sm:w-auto">Go to Login</Button>
          <Button href="/investor/signup" variant="outline" className="w-full sm:w-auto">
            Go to Signup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
