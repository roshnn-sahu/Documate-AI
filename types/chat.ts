import { SourceItem } from "./source";

export interface ChatSession {
  id: string;

  title: string;

  createdAt: string;

  documents?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
}
