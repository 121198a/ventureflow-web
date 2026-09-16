import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 sm:p-7 bg-slate-50/90">
      <div className="w-full max-w-[580px] bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-8 sm:p-14 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
          <HelpCircle size={13} />
          <span>Error 404</span>
        </span>

        <h1 className="mt-5 text-[64px] min-[380px]:text-[80px] sm:text-[96px] font-extrabold tracking-tight text-slate-900 leading-none">
          404
        </h1>

        <h2 className="mt-3 text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
          The requested address does not exist or has been moved. If you believe this is an error, please reach out to our team.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 focus-ring"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/legal/support"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-95 focus-ring"
          >
            Support &amp; Help Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
