"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { ChatMessage } from "@/types/chat";
import ToolResult from "./tool-result";
import { runAITool } from "@/lib/client/run-ai-tools";
import { AIToolType } from "@/types/ai-tools";
import { useTool } from "@/context/tool-context";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./conversation";

import Message from "./message";
import AiInput from "./ai-input";
import { ToolsResults } from "@/types/tools-resultsults";

interface Props {
  sessionId: string;
}

export default function ChatView({ sessionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolResult, setToolResult] = useState<ToolsResults | null>(null);
  const [activeTool, setActiveTool] = useState<AIToolType | null>(null);

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

  const handleTool = useCallback(
    async (tool: AIToolType) => {
      try {
        setToolLoading(true);
        setToolResult("");
        setActiveTool(tool);

        const body = await runAITool({
          sessionId,

          tool,
        });

        const reader = body.getReader();
        const decoder = new TextDecoder();

        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          accumulated += chunk;
          setToolResult({
            tool,
            content: accumulated,
          });
          setToolResult(accumulated);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setToolLoading(false);
      }
    },
    [sessionId],
  );

  const { registerRunTool } = useTool();

  useEffect(() => {
    registerRunTool(handleTool);
    return () =>
      registerRunTool(() => {
        console.warn("No tool runner registered");
      });
  }, [registerRunTool, handleTool]);

  return (
    <>
      <div className="relative flex h-full min-h-0 flex-1 flex-col">
        {activeTool && (
          <div className="shrink-0 border-b p-4">
            <ToolResult
              title={activeTool}
              content={
                toolLoading ? "Generating..." : toolResult?.content || ""
              }
              onClose={() => setActiveTool(null)}
            />
          </div>
        )}
        <Conversation className="relative min-h-0 flex-1 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
          <ConversationContent className="pb-38">
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
                    sources={message.sources}
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4">
          <div className="pointer-events-auto">
            <AiInput isLoading={loading} onSend={sendMessage} />
          </div>
        </div>
      </div>
    </>
  );
}
