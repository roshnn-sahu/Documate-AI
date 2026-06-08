import { NextResponse } from "next/server";

import { sessionVectorStores } from "@/lib/rag/store";

import { retrieveContext } from "@/lib/rag/retrieval";
import { streamAnswer } from "@/lib/rag/stream";
import { validateFile } from "@/lib/uploads/validate-file";
import { saveFile } from "@/lib/uploads/save-file";
import { parseDocument } from "@/lib/loader/index";
import { ingestDocument } from "@/lib/rag/ingestion";

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}
export async function POST(req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    // Support both FormData (with files) and JSON (text only)
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

    // If files were uploaded, process them into the session's vector store
    if (files.length > 0) {
      for (const file of files) {
        validateFile(file);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const saved = await saveFile(file, buffer);
        const parsed = await parseDocument(buffer, file.type);
        const ingestion = await ingestDocument({
          text: parsed.text,
          fileName: file.name,
          filePath: saved.filepath,
        });

        // Merge into existing vector store or create new one
        const existingStore = sessionVectorStores.get(sessionId);
        if (existingStore) {
          // Add documents to existing store
          await existingStore.addDocuments(ingestion.chunks);
        } else {
          sessionVectorStores.set(sessionId, ingestion.vectorStore);
        }
      }
    }

    const vectorStore = sessionVectorStores.get(sessionId);

    let stream;
    let sources: any[] = [];

    if (vectorStore) {
      const docs = await retrieveContext(vectorStore, message);
      sources = docs.map((doc: any) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      }));

      stream = await streamAnswer(docs, message);
    } else {
      const { streamNormalChat } = await import("@/lib/rag/stream-normal");

      stream = await streamNormalChat(message);
    }

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const token = chunk.content;

          // Handle both string and array content formats from LangChain
          const text =
            typeof token === "string"
              ? token
              : token
                  .filter((block: any) => block.type === "text")
                  .map((block: any) => block.text)
                  .join("");

          controller.enqueue(encoder.encode(text));
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
      {
        error: error.message || "Chat failed",
      },
      {
        status: 500,
      },
    );
  }
}
