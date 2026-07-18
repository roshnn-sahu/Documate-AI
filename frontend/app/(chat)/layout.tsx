import { redirect } from "next/navigation";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ToolProvider } from "@/context/tool-context";
import { createClient } from "@/lib/supabase/server";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let sidebarUser = {
    name: "Guest",
    email: "",
    avatar: "",
  };
  let sessions: { id: string; title: string }[] = [];

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    sidebarUser = {
      name: profile?.full_name || user.email?.split("@")[0] || "User",
      email: user.email || "",
      avatar: profile?.avatar_url || "",
    };

    const { data: sessionRows } = await supabase
      .from("chat_sessions")
      .select("id, title")
      .order("updated_at", { ascending: false })
      .limit(30);

    sessions = sessionRows || [];
  }

  return (
    <ToolProvider>
      <ChatSidebar user={sidebarUser} sessions={sessions as never}>
        {children}
      </ChatSidebar>
    </ToolProvider>
  );
}
