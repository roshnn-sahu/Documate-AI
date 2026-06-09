import { AIToolType } from "@/types/ai-tools";

export async function runAITool({
  sessionId,
  tool,
  input = "",
}: {
  sessionId: string;

  tool: AIToolType;

  input?: string;
}) {
  const response = await fetch(`/api/tools/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      tool,

      input,
    }),
  });

  if (!response.body) {
    throw new Error("No stream found");
  }

  return response.body;
}
