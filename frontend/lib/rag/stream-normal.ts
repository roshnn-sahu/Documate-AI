import { ChatModel } from "./model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function streamNormalChat(message: string) {
  const stream = await ChatModel.stream([
    new SystemMessage("You are Documate AI — an intelligent document assistant. Answer questions conversationally and helpfully."),
    new HumanMessage(message),
  ]);

  return stream;
}