"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { ArrowUpIcon, File, MicIcon, PaperclipIcon, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Attachment,
  Attachments,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
} from "./attachments";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SpeechInput } from "./speech-input";

export const title = "AI with Voice";
interface Props {
  onSend?: (message: string) => void;

  loading?: boolean;
}

const AiInput = ({
  className = "",
  onSend,
  isLoading,
}: Props & {
  className?: string;
  onSend?: (message: string) => void;
  isLoading?: boolean;
}) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl("");
    }
  }, [files]);

  const attachments = useMemo(
    () =>
      files.map((f, i) => ({
        id: `file-${i}`,
        type: "file" as const,
        filename: f.name,
        mediaType: f.type,
        url: i === 0 ? previewUrl : URL.createObjectURL(f),
      })),
    [files, previewUrl],
  );

  const handleSubmit = async () => {
    if (!message.trim() && files.length === 0) return;
    try {
      setLoading(true);

      if (onSend) {
        onSend(message);
        setMessage("");
        setFiles([]);
        return;
      }

      const formData = new FormData();
      formData.append("message", message);
      if (files.length > 0) {
        formData.append("file", files[0]);
      }

      const response = await fetch("/api/chat/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(attachments, files);
  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".pdf,.docx,.xlsx,.txt,.csv"
        onChange={(e) => {
          const selected = e.target.files?.[0];

          if (selected) {
            setFiles([selected]);
            e.target.value = "";
          }
        }}
      />
      <InputGroup className="bg-background has-[[data-slot=attachments]]:flex-col has-[[data-slot=attachments]]:items-start">
        {attachments.length > 0 && (
          <Attachments
            variant="list"
            data-slot="attachments"
            className="w-full border-b p-3"
          >
            {attachments.map((attachment) => (
              <Attachment
                key={attachment.id}
                data={attachment}
                onRemove={() => setFiles([])}
              >
                <AttachmentPreview />
                <AttachmentInfo showMediaType />
                <AttachmentRemove />
              </Attachment>
            ))}
          </Attachments>
        )}
        <InputGroupTextarea
          placeholder="Type or speak your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <InputGroupAddon align="block-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                className="text-md rounded-full border"
                variant="ghost"
              >
                <Plus />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <PaperclipIcon />
                Attach File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton size="icon-xs" variant="ghost" className="ml-auto">
            <SpeechInput mode="speech-recognition" className="p-0" />
          </InputGroupButton>

          <Separator className="!h-4" orientation="vertical" />
          <InputGroupButton
            className="rounded-full"
            size="icon-sm"
            variant="default"
            onClick={handleSubmit}
          >
            <ArrowUpIcon className="size-4" />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <small className="text-muted-foreground relative z-10 text-center">
        AI generated answers are derived from your indexed documents{" "}
        <a
          className="underline"
          href="https://docs.pinecone.io/docs/ai-generated-answers"
          target="_blank"
          rel="noopener noreferrer"
        >
          verify critical information.
        </a>
      </small>
    </div>
  );
};

export default AiInput;
