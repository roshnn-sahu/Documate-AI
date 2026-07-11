import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";

export const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
 baseURL: "https://openrouter.ai/api/v1",
  }
});

export const ChatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.3,
  streaming: true,
});