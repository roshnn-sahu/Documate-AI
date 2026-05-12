"use client";

import { useEffect, useRef, useState } from "react";

import { v4 as uuid } from "uuid";

import { ChatMessage } from "@/types/chat";

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

export default function ChatView({ sessionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const userMessageId = uuid();

    const assistantMessageId = uuid();

    try {
      setLoading(true);

      // add user + empty assistant
      setMessages((prev) => [
        ...prev,
        {
          id: userMessageId,
          role: "user",
          content: message,
        },
        {
          id: assistantMessageId,
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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader
        ? JSON.parse(decodeURIComponent(sourcesHeader))
        : [];

      if (!response.body) {
        throw new Error("No response stream found");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, {
          stream: true,
        });

        if (!chunk) continue;
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,

                  content: accumulated,
                  sources,
                }
              : msg,
          ),
        );
      }
    } catch (error) {
      console.error("Streaming error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,

                content: "Something went wrong while generating response.",
              }
            : msg,
        ),
      );
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
            <div className="space-y-6">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {loading && (
                <div className="px-2 text-sm text-neutral-500">
                  AI is thinking...
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-white p-4">
        <AiInput isLoading={loading} onSend={sendMessage} />
      </div>
    </div>
  );
}
