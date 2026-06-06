import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
  temperature: 0.3,
  streaming: true,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
export const ChatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  model: "nvidia/nemotron-3-ultra-550b-a55b:free",
  temperature: 0.3,
  streaming: true,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});