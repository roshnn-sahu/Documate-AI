import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}

// PATCH /api/chat/sessions/[sessionId] — rename a session
export async function PATCH(req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("chat_sessions")
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to rename session" },
      { status: 500 },
    );
  }
}

// DELETE /api/chat/sessions/[sessionId] — delete a session, messages, documents, and embeddings
export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use admin client to bypass RLS for embedding cleanup
    const admin = createAdminClient();

    // 1. Delete document chunks (embeddings) for this session
    //    Chunks are stored with session_id in metadata, not as a FK
    const { error: chunksError } = await admin
      .from("document_chunks")
      .delete()
      .eq("metadata->>session_id", sessionId);

    if (chunksError) throw chunksError;

    // 2. Delete documents for this session
    //    After migration 0003, this will cascade to the session
    const { error: docsError } = await supabase
      .from("documents")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id);

    if (docsError) throw docsError;

    // 3. Delete messages for this session
    const { error: messagesError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id);

    if (messagesError) throw messagesError;

    // 4. Delete the session itself
    const { error: sessionError } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (sessionError) throw sessionError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete session" },
      { status: 500 },
    );
  }
}
