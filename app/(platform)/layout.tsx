import { RevealInit } from "@/components/site/reveal";
import { ChatLauncher } from "@/components/site/chat-launcher";
import { PageTransition } from "@/components/motion/PageTransition";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-website2 min-h-screen flex flex-col font-sans overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <RevealInit />
      <PageTransition>{children}</PageTransition>
      <ChatLauncher />
    </div>
  );
}
