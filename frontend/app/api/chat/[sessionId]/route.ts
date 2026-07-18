import { NextResponse } from "next/server";

import { retrieveContext } from "@/lib/rag/retrieval";
import { streamNormalChat } from "@/lib/rag/stream-normal";
import { streamAnswer } from "@/lib/rag/stream";
import { processFile } from "@/lib/uploads/process-file";
import { createClient } from "@/lib/supabase/server";

// Vision/OCR + embedding on the free tier can take a while.
export const maxDuration = 120;

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the session belongs to this user.
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id, title")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Support both FormData (with files) and JSON (text only).
    let message: string;
    let files: File[] = [];

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      message = (formData.get("message") as string) || "";
      const allFiles = formData.getAll("files") as File[];
      files = allFiles.filter((f) => f instanceof File && f.size > 0);
    } else {
      const body = await req.json();
      message = body.message || "";
    }

    // Ingest any uploaded files into this session's vector store.
    for (const file of files) {
      await processFile(file, { userId: user.id, sessionId });
    }

    // Persist the user message.
    if (message.trim()) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        user_id: user.id,
        role: "user",
        content: message,
      });
    }

    // Retrieve context scoped to this user + session.
    const docs = await retrieveContext(message, {
      userId: user.id,
      sessionId,
    });

    const sources = docs.map((doc: any) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    }));

    const stream =
      docs.length > 0
        ? await streamAnswer(docs, message)
        : await streamNormalChat(message);

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        let assistantText = "";
        for await (const chunk of stream) {
          const token = chunk.content;

          // Handle both string and array content formats from LangChain.
          const text =
            typeof token === "string"
              ? token
              : token
                  .filter((block: any) => block.type === "text")
                  .map((block: any) => block.text)
                  .join("");

          assistantText += text;
          controller.enqueue(encoder.encode(text));
        }

        // Persist the assistant reply + bump the session (best-effort).
        try {
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            user_id: user.id,
            role: "assistant",
            content: assistantText,
            sources,
          });

          const update: Record<string, any> = {
            updated_at: new Date().toISOString(),
          };
          if (!session.title || session.title === "New chat") {
            update.title = message.slice(0, 60) || "New chat";
          }
          await supabase
            .from("chat_sessions")
            .update(update)
            .eq("id", sessionId);
        } catch {
          // Streaming already succeeded — don't fail the response on a
          // persistence hiccup.
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "x-sources": encodeURIComponent(JSON.stringify(sources)),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Chat failed" },
      { status: 500 },
    );
  }
}
