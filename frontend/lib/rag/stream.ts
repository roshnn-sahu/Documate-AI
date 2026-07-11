import { ChatModel } from "./model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { buildPrompt } from "./prompt";

export async function streamAnswer(docs: any[], question: string) {
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const prompt = buildPrompt(context, question);

  const stream = await ChatModel.stream([
    new SystemMessage(
      "You are Documate AI — an intelligent document assistant. Answer questions conversationally and helpfully.",
    ),
    new HumanMessage(prompt),
  ]);

  return stream;
}
