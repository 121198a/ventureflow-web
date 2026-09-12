import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#7bb4ec] via-[#a3a2ee] to-[#cb9bd6]">
      <div className="w-full max-w-[700px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-16 text-center">
        <h1 className="text-[76px] min-[380px]:text-[100px] sm:text-[140px] font-extrabold tracking-tight select-none bg-gradient-to-r from-[#b690d5] via-[#979be6] to-[#79bee8] bg-clip-text text-transparent leading-none">
          404
        </h1>
        <h2 className="mt-6 text-xl sm:text-2xl font-extrabold text-[#475569] tracking-wider uppercase">
          OOPS! PAGE NOT FOUND
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. If you think something is broken, report a problem.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#649ec4] px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#5289ad] active:scale-95"
          >
            RETURN HOME
          </Link>
          <Link
            href="/legal/support"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-[#649ec4] bg-transparent px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#649ec4] shadow-sm transition-all hover:bg-[#649ec4]/10 active:scale-95"
          >
            REPORT PROBLEM
          </Link>
        </div>
      </div>
    </div>
  );
}
