import { ChatModel } from "./model";

import { buildPrompt } from "./prompt";

export async function generateAnswer(docs: any[], question: string) {
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const prompt = buildPrompt(context, question);

  const response = await ChatModel.stream(prompt);

  return response;
}
