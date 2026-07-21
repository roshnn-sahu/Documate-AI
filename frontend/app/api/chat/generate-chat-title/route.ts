import { NextResponse } from "next/server";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { titleModel } from "@/lib/rag/model"; 

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const response = await titleModel.invoke([
      new SystemMessage(
        "You are a chat title generator. Summarize the user message into a clean, concise Title Case title. Rules: Maximum 2-5 words. Do not include quotes, punctuation, prefixes like 'Title:', or markdown.",
      ),
      new HumanMessage(message),
    ]);

    const title = (response.content as string).trim();

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Title generation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
