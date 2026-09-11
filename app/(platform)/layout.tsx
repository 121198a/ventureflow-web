import { RevealInit } from "@/components/site/reveal";
import { ChatLauncher } from "@/components/site/chat-launcher";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-website2 min-h-screen flex flex-col font-sans">
      <RevealInit />
      {children}
      <ChatLauncher />
    </div>
  );
}
