import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { titleModel } from "./model";

export async function generateTitle(message: string): Promise<string> {
  const response = await titleModel.invoke([
    new SystemMessage(
      "You are a chat title generator. Summarize the user message into a clean, concise Title Case title. Rules: Maximum 2-5 words. Do not include quotes, punctuation, prefixes like 'Title:', or markdown.",
    ),
    new HumanMessage(message),
  ]);

  return (response.content as string).trim();
}
