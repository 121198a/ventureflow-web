import { LegalShell } from "@/components/legal/LegalShell";
import { ErrorView } from "@/components/ui/ErrorView";

export default function LegalDocumentNotFound() {
  return (
    <LegalShell>
      <ErrorView
        code={404}
        badgeText="404 - DOCUMENT NOT FOUND"
        title="Legal Document Not Found"
        description="The requested legal document could not be found. It may have been renamed or moved to another section."
        secondaryAction={{
          label: "Legal Hub",
          href: "/legal",
        }}
        isEmbedded
      />
    </LegalShell>
  );
}
