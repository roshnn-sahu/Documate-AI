import { AIToolType } from "@/types/ai-tools";

/**
 * Execute an AI tool (summary, flashcards, quiz, etc.) and return a
 * ReadableStream response. Uses native fetch because axios doesn't
 * support streaming in the browser.
 */
export async function runAITool({
  sessionId,
  tool,
  input = "",
}: {
  sessionId: string;
  tool: AIToolType;
  input?: string;
}): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`/api/tools/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, input }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error || `Tool request failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error("No stream found");
  }

  return response.body;
}
