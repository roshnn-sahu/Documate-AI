"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { ChatMessage, MessageAttachment } from "@/types/chat";
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
import { ToolsResults } from "@/types/tools-results";
import { BotIcon } from "lucide-react";
import { HeroGradient } from "../hero-gradient";
import { LoaderOne } from "../ui/loader";

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

  const sendMessage = async (message: string, files?: File[]) => {
    if (loading) return;
    if (!message.trim() && (!files || files.length === 0)) return;
    const userMessageId = uuid();

    const assistantMessageId = uuid();
    try {
      setLoading(true);

      // Convert files to data URLs for display
      let messageAttachments: MessageAttachment[] | undefined;
      if (files && files.length > 0) {
        messageAttachments = await Promise.all(
          files.map(async (file, i) => {
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            return {
              id: `att-${userMessageId}-${i}`,
              filename: file.name,
              mediaType: file.type,
              url: dataUrl,
            };
          }),
        );
      }

      // add user + empty assistant
      setMessages((prev) => [
        ...prev,
        {
          id: userMessageId,
          role: "user",
          content: message,
          attachments: messageAttachments,
        },
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]);

      // Send files via FormData if there are attachments, otherwise JSON
      let response: Response;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("message", message);
        files.forEach((file) => {
          formData.append("files", file);
        });
        response = await fetch(`/api/chat/${sessionId}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`/api/chat/${sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
      }

      if (!response.ok) {
        let serverMessage = "Failed to send message";
        try {
          const errData = await response.json();
          if (errData?.error) serverMessage = errData.error;
        } catch {
          // response wasn't JSON — keep the default message
        }
        throw new Error(serverMessage);
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
    } catch (error: any) {
      console.error("Streaming error:", error);

      const detail =
        error?.message || "Something went wrong while generating response.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,

                content: detail,
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
        setToolResult(null);
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
        }
      } catch (error) {
        console.error(error);
      } finally {
        setToolLoading(false);
      }
    },
    [sessionId],
  );

  // Auto-send initial message passed via URL query param (?message=...)
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (initialMessageSent.current) return;

    const params = new URLSearchParams(window.location.search);
    const initialMsg = params.get("message");

    if (initialMsg) {
      initialMessageSent.current = true;
      // Clean the URL so refreshing doesn't re-send
      window.history.replaceState({}, "", `/chat/${sessionId}`);
      sendMessage(initialMsg);
    }
  }, [sessionId, sendMessage]);

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
        <HeroGradient />
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
          <ConversationContent className="pb-40">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start conversation"
                description="Upload documents or chat directly with AI"
                icon={<BotIcon />}
              />
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    sources={message.sources}
                    attachments={message.attachments}
                  />
                ))}

                {loading && (
                  <div className="px-2">
                    <span className="flex gap-2">
                      <BotIcon size={16} /> <LoaderOne />
                    </span>
                    <span className="text-sm text-neutral-500">
                      AI is thinking...
                    </span>
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
