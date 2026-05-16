import { NextResponse } from "next/server";

import { sessionVectorStores } from "@/lib/rag/store";

import { retrieveContext } from "@/lib/rag/retrieval";
import { streamAnswer } from "@/lib/rag/stream";

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { sessionId } = await params;
    const { message } = await req.json();

    const vectorStore = sessionVectorStores.get(sessionId);
    console.log("VECTORSTORE", vectorStore);
    if (!vectorStore) {
      return NextResponse.json(
        {
          error: "Session not found",
        },
        {
          status: 404,
        },
      );
    }

    // retrieve relevant chunks
    const docs = await retrieveContext(vectorStore, message);
    const sources = docs.map((doc: any) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    }));

    const stream = await streamAnswer(docs, message);

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
