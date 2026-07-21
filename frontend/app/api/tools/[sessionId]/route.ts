import { NextResponse } from "next/server";
import { retrieveContext } from "@/lib/rag/retrieval";
import { executeAITool } from "@/lib/rag/tool-executor";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session ownership
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { tool, input } = await req.json();

    // Retrieve docs scoped to this user + session
    const docs = await retrieveContext(input || "document", {
      userId: user.id,
      sessionId,
    });

    // Execute AI tool
    const stream = await executeAITool({
      tool,
      docs,
      input,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk?.content;

            if (token == null) {
              continue;
            }

            const text =
              typeof token === "string"
                ? token
                : Array.isArray(token)
                  ? token
                      .filter((block: any) => block?.type === "text")
                      .map((block: any) => block?.text ?? "")
                      .join("")
                  : String(token);

            controller.enqueue(encoder.encode(text));
          }
        } catch (streamError: any) {
          console.error("[Tools API] Stream error:", streamError);
          controller.enqueue(encoder.encode("\n\n⚠️ Error generating response. Please try again."));
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Tool failed" },
      { status: 500 },
    );
  }
}
