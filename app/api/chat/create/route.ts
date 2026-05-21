import { NextResponse } from "next/server";

import { createSession } from "@/lib/chat/create-session";
import { validateFile } from "@/lib/uploads/validate-file";
import { saveFile } from "@/lib/uploads/save-file";
import { parseDocument } from "@/lib/loader/index";
import { ingestDocument } from "@/lib/rag/ingestion";
import { sessionVectorStores } from "@/lib/rag/store";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const message = formData.get("message");

    const file = formData.get("file") as File | null;

    // create session
    const session = createSession();

    let document = null;

    // if file uploaded
    if (file) {
      validateFile(file);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // save
      const saved = await saveFile(file, buffer);
      // parse
      const parsed = await parseDocument(buffer, file.type);
      // ingest into RAG
      const ingestion = await ingestDocument({
        text: parsed.text,
        fileName: file.name,
        filePath: saved.filepath,
      });

      sessionVectorStores.set(session.id, ingestion.vectorStore);

      document = {
        name: file.name,
        type: file.type,
        textLength: parsed.text.length,
        chunks: ingestion.chunks.length,
      };
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
