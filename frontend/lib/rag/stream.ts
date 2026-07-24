import { ChatModel } from "./model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { buildPrompt } from "./prompt";

export async function streamAnswer(docs: any[], question: string) {
  const context = docs
    .map((doc, i) => `[Document ${i + 1}]:\n${doc.pageContent}`)
    .join("\n\n");

  const prompt = buildPrompt(context, question);

  const stream = await ChatModel.stream([
    new SystemMessage(
      "You are Documate AI. You have been given document context to answer the user's question. Always use the provided context to help the user.",
    ),
    new HumanMessage(prompt),
  ]);

  return stream;
}
