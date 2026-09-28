import { PageTransition } from "@/components/motion/PageTransition";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
