import { SourceItem } from "./source";

export interface ChatSession {
  id: string;

  title: string;

  createdAt: string;

  documents?: string[];
}

export interface MessageAttachment {
  id: string;
  filename: string;
  mediaType: string;
  url: string; // base64 data URL for display
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  attachments?: MessageAttachment[];
}
