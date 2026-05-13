import { NextResponse } from "next/server";
import { sessionVectorStores } from "@/lib/rag/store";
import { retrieveContext } from "@/lib/rag/retrieval";
import { executeAITool } from "@/lib/rag/tool-executor";

interface Props {
  params: {
    sessionId: string;
  };
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { tool, input } = await req.json();

    const vectorStore = sessionVectorStores.get(params.sessionId);

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

    // retrieve docs
    const docs = await retrieveContext(vectorStore, input || "document");

    // execute AI tool
    const stream = await executeAITool({
      tool,
      docs,
      input,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const token = chunk.content;

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
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Tool failed",
      },
      {
        status: 500,
      },
    );
  }
}
