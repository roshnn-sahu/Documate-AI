import { redirect } from "next/navigation";
import ChatView from "@/components/chat/chat-view";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    session: string;
  }>;
}

export default async function SessionPage({ params }: Props) {
  const { session: sessionId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify session ownership and fetch messages
  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) redirect("/chat/new");

  // Fetch persisted messages
  const { data: messageRows } = await supabase
    .from("chat_messages")
    .select("id, role, content, sources")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const initialMessages = (messageRows || []).map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    sources: m.sources || undefined,
  }));

  return <ChatView sessionId={sessionId} initialMessages={initialMessages} />;
}
