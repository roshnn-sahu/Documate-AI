import { NextResponse } from "next/server";

import { createSession } from "@/lib/chat/create-session";
import { processFile } from "@/lib/uploads/process-file";
import { sessionVectorStores } from "@/lib/rag/store";

// Vision/OCR + embedding on the free tier can take a while.
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const message = formData.get("message");

    const file = formData.get("file") as File | null;

    // create session
    const session = createSession();

    let document = null;

    // if file uploaded
    if (file && file.size > 0) {
      const result = await processFile(file);

      sessionVectorStores.set(session.id, result.ingestion.vectorStore);

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
      {
        error: error.message || "Failed to create chat",
      },
      {
        status: 500,
      },
    );
  }
}
