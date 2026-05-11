"use client";

import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./conversation";

import Message from "./message";

import AiInput from "./ai-input";

interface Props {
  sessionId: string;
}

interface ChatMessage {
  role: "user" | "assistant";

  content: string;
}

export default function ChatView({ sessionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      // add user + assistant placeholder
      setMessages((prev) => [
        ...prev,

        {
          role: "user",
          content: message,
        },

        {
          role: "assistant",
          content: "",
        },
      ]);

      const response = await fetch(`/api/chat/${sessionId}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let done = false;

      let accumulated = "";

      while (!done) {
        const result = await reader.read();

        done = result.done;

        const chunk = decoder.decode(result.value);

        accumulated += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",

            content: accumulated,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start conversation"
              description="Ask questions about your uploaded documents"
            />
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                role={message.role}
                content={message.content}
              />
            ))
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-4">
        <AiInput isLoading={loading} onSend={sendMessage} />
      </div>
    </div>
  );
}
