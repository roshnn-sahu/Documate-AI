"use client";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ToolProvider } from "@/context/tool-context";

// Wrapping sidebar in ToolProvider

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToolProvider>
      <ChatSidebar>{children}</ChatSidebar>
    </ToolProvider>
  );
}
