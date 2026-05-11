import { NextResponse } from "next/server";

import { sessionVectorStores } from "@/lib/rag/store";

import { retrieveContext } from "@/lib/rag/retrieval";

import { generateAnswer } from "@/lib/rag/generate";

interface Props {
  params: {
    sessionId: string;
  };
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { message } = await req.json();

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

    // retrieve relevant chunks
    const docs = await retrieveContext(vectorStore, message);

    // generate AI answer
    const answer = await generateAnswer(docs, message);

    return NextResponse.json({
      success: true,

      answer,

      sources: docs,
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
