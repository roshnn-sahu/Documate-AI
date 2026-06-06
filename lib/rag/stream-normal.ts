import { ChatModel } from "./model";

export async function streamNormalChat(message: string) {
  const stream = await ChatModel.stream(message);

  return stream;
}
