import { PageTransition } from "@/components/motion/PageTransition";

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
