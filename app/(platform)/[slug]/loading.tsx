import { SiteHeader } from "@/components/site/site-header";

export default function LoadingOffering() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center gap-4 py-40">
        <div
          aria-hidden
          className="size-8 animate-spin rounded-full border-2 border-brand/25 border-t-brand"
        />
        <p className="text-[0.9rem] text-muted-foreground">Loading Company Details...</p>
      </div>
    </div>
  );
}
