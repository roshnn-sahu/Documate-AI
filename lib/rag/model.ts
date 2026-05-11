import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,

  model: "gpt-4o-mini",

  temperature: 0.3,

  streaming: true,
});
