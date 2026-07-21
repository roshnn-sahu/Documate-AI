import { NextResponse } from "next/server";
import { generateTitle } from "@/lib/rag/generate-title";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const title = await generateTitle(message);

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Title generation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
