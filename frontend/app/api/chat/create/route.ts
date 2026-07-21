import { NextResponse } from "next/server";
import { generateChatTitle } from "@/lib/services/chat";
import { processFile } from "@/lib/uploads/process-file";
import { createClient } from "@/lib/supabase/server";

// Vision/OCR + embedding on the free tier can take a while.
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const message = (formData.get("message") as string) || "";
    const file = formData.get("file") as File | null;
    let title = "New chat";

    try {
      if (file && file.size > 0 && file.name) {
        title = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      } else if (message.trim()) {
        title = await generateChatTitle(message);
      }
    } catch (titleError) {
      console.error(
        "Failed to generate custom title, using fallback:",
        titleError,
      );
      title = "New chat"; 
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (sessionError || !session) {
      throw new Error(sessionError?.message || "Failed to create session");
    }

    let document = null;

    if (file && file.size > 0) {
      const result = await processFile(file, {
        userId: user.id,
        sessionId: session.id,
      });
      document = result.document;
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message,
      document,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create chat" },
      { status: 500 },
    );
  }
}
