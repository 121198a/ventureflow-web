"use client";

export function EmailCaptureForm({ buttonLabel }: { buttonLabel: string }) {
  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        required
        placeholder="you@company.com"
        className="w-full min-w-0 rounded-md border border-hairline bg-background px-4 py-2.5 text-[0.85rem] outline-none focus:border-brand sm:w-56"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-brand px-5 py-2.5 text-[0.85rem] text-primary-foreground transition-colors hover:bg-brand-strong"
        style={{ fontWeight: 700 }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
