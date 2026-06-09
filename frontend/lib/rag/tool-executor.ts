import { model } from "./model";

import { buildToolPrompt } from "./tool-prompts";

import { AIToolType } from "@/types/ai-tools";

export async function executeAITool({tool,docs,input,
}: {
  tool: AIToolType;
  docs: any[];
  input: string;
}) {
  const context = docs
    .map((doc) => doc.pageContent)
    .join("\n\n");

  const prompt =
    buildToolPrompt(
      tool,
      context,
      input
    );

  const stream =
    await model.stream(prompt);

  return stream;
}