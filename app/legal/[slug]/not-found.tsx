import { FileQuestion } from "lucide-react";
import { LegalShell } from "@/components/legal/LegalShell";
import { TransitionLink } from "@/components/ui/TransitionLink";

export default function LegalDocumentNotFound() {
  return (
    <LegalShell>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
        <FileQuestion size={28} className="mx-auto text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Legal document not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The requested document could not be found. It may have been renamed or removed.
        </p>
        <TransitionLink
          href="/legal"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#0a1226] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Back to Legal Hub
        </TransitionLink>
      </div>
    </LegalShell>
  );
}
