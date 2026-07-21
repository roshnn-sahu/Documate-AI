import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";

// Document embeddings — OpenRouter / Nvidia Nemotron
// NOTE: encodingFormat must be "float" because the default "base64" is
// rejected by the Nvidia model on OpenRouter.
export const model = new OpenAIEmbeddings({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
  encodingFormat: "float",
  configuration: {  
    baseURL: "https://openrouter.ai/api/v1",  
  },
});

// Chat model — Groq / Llama 3.1 8B
export const ChatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.3,
  streaming: true,
});

export const titleModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  streaming: true,
});