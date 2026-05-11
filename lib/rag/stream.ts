import { model } from "./model";

import { buildPrompt } from "./prompt";

export async function streamAnswer(docs: any[], question: string) {
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const prompt = buildPrompt(context, question);

  const stream = await model.stream(prompt);

  return stream;
}
