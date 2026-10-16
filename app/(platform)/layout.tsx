import { RevealInit } from "@/components/site/reveal";
import { ChatLauncher } from "@/components/site/chat-launcher";
import { PageTransition } from "@/components/motion/PageTransition";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="platform-shell">
      <RevealInit />
      <PageTransition>{children}</PageTransition>
      <ChatLauncher />
    </div>
  );
}
