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
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const attachments = useMemo(
    () =>
      files.map((f, i) => ({
        id: `file-${i}`,
        type: "file" as const,
        filename: f.name,
        mediaType: f.type,
        url: previewUrls[i],
      })),
    [files, previewUrls],
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
      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("/api/chat/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      router.push(`/chat/${data.sessionId}?message=${encodeURIComponent(message)}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("mx-auto flex w-full max-w-2xl flex-col gap-4", className)}
    >
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept=".pdf,.docx,.xlsx,.txt,.csv,.png,.jpeg,.webp,.mp3,.wav,.mp4,.avi,.mov,.wmv"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);

          if (selectedFiles.length > 0) {
            setFiles((prev) => [...prev, ...selectedFiles]);
            e.target.value = "";
          }
        }}
      />
      <InputGroup className="bg-background has-[[data-slot=attachments]]:flex-col has-[[data-slot=attachments]]:items-start">
        {attachments.length > 0 && (
          <Attachments
            variant="inline"
            data-slot="attachments"
            className="w-full border-b p-3"
          >
            {attachments.map((attachment, index) => (
              <AttachmentHoverCard key={attachment.id}>
                <AttachmentHoverCardTrigger asChild>
                  <Attachment
                    data={attachment}
                    onRemove={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <AttachmentPreview />

                    <AttachmentRemove />
                  </Attachment>
                </AttachmentHoverCardTrigger>
                <AttachmentHoverCardContent className="w-48">
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <p className="text-sm font-medium break-all">
                      {attachment.filename}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {attachment.mediaType}
                    </p>
                  </div>
                </AttachmentHoverCardContent>
              </AttachmentHoverCard>
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
