"use client";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { toast } from "sonner";
import { createSession } from "@/lib/services/chat";

// Types accepted end-to-end: parsed to text (docs) or read via vision (images).
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ACCEPT_ATTR = ".pdf,.docx,.xlsx,.txt,.csv,.png,.jpg,.jpeg,.webp";

export const title = "AI with Voice";
interface Props {
  onSend?: (message: string, files: File[]) => void;
  loading?: boolean;
}

export interface AiInputHandle {
  addFiles: (files: File[]) => void;
}

const AiInput = forwardRef<
  AiInputHandle,
  Props & {
    className?: string;
    onSend?: (message: string, files: File[]) => void;
    isLoading?: boolean;
  }
>(({ className = "", onSend, isLoading }, ref) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global drag-and-drop via window-level listeners
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer?.files || []);
      if (droppedFiles.length > 0) {
        const accepted = droppedFiles.filter((f) =>
          ACCEPTED_TYPES.includes(f.type),
        );
        const rejected = droppedFiles.filter(
          (f) => !ACCEPTED_TYPES.includes(f.type),
        );

        if (rejected.length > 0) {
          toast.error(
            `Unsupported file type: ${rejected.map((f) => f.name).join(", ")}. Supported: PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP.`,
          );
        }

        if (accepted.length > 0) {
          setFiles((prev) => [...prev, ...accepted]);
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

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
        onSend(message, files);
        setMessage("");
        setFiles([]);
        return;
      }

      const formData = new FormData();
      formData.append("message", message);
      files.forEach((file) => {
        formData.append("file", file);
      });

      const data = await createSession(formData);

      setMessage("");
      setFiles([]);
      router.push(
        `/chat/${data.sessionId}?message=${encodeURIComponent(message)}`,
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  // Expose addFiles so the parent chat-view can push dropped files in
  useImperativeHandle(ref, () => ({
    addFiles: (newFiles: File[]) => {
      const accepted = newFiles.filter((f) => ACCEPTED_TYPES.includes(f.type));
      const rejected = newFiles.filter((f) => !ACCEPTED_TYPES.includes(f.type));

      if (rejected.length > 0) {
        toast.error(
          `Unsupported file type: ${rejected
            .map((f) => f.name)
            .join(
              ", ",
            )}. Supported: PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP.`,
        );
      }

      if (accepted.length > 0) {
        setFiles((prev) => [...prev, ...accepted]);
      }
    },
  }));

  const addFiles = useCallback((newFiles: File[]) => {
    const accepted = newFiles.filter((f) => ACCEPTED_TYPES.includes(f.type));
    const rejected = newFiles.filter((f) => !ACCEPTED_TYPES.includes(f.type));

    if (rejected.length > 0) {
      toast.error(
        `Unsupported file type: ${rejected.map((f) => f.name).join(", ")}. Supported: PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP.`,
      );
    }

    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
  }, []);

  // Expose addFiles so the parent chat-view can push dropped files in
  useImperativeHandle(ref, () => ({ addFiles }));

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-2xl flex-col gap-4",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept={ACCEPT_ATTR}
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          e.target.value = "";

          if (selectedFiles.length === 0) return;

          const accepted = selectedFiles.filter((f) =>
            ACCEPTED_TYPES.includes(f.type),
          );
          const rejected = selectedFiles.filter(
            (f) => !ACCEPTED_TYPES.includes(f.type),
          );

          if (rejected.length > 0) {
            toast.error(
              `Unsupported file type: ${rejected
                .map((f) => f.name)
                .join(
                  ", ",
                )}. Supported: PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP.`,
            );
          }

          if (accepted.length > 0) {
            setFiles((prev) => [...prev, ...accepted]);
          }
        }}
      />
      <InputGroup className="bg-background has-[[data-slot=attachments]]:flex-col has-[[data-slot=attachments]]:items-start">
        {attachments.length > 0 && (
          <Attachments
            variant="grid"
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
                className="text-md cursor-pointer rounded-full border"
                variant="ghost"
              >
                <Plus />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon />
                Attach File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            className="ml-auto cursor-pointer"
          >
            <SpeechInput mode="speech-recognition" className="p-0" />
          </InputGroupButton>

          <Separator className="!h-4" orientation="vertical" />
          <InputGroupButton
            className="cursor-pointer rounded-full"
            size="icon-sm"
            variant="default"
            onClick={handleSubmit}
          >
            <ArrowUpIcon className="size-4" />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Drag-and-drop overlay — matches upload page theme */}
      {isDragging && (
       <ChatDropZone/>
      )}

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
});

AiInput.displayName = "AiInput";

export default AiInput;


const ChatDropZone =()=>{
  return(
     <div className="absolute inset-x-0 bottom-0 z-50 flex justify-center p-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-2xl duration-200">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-blue-400 bg-white p-12 text-center shadow-xl dark:border-rose-500 dark:bg-neutral-900">
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-500 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-500 dark:text-rose-400">
                    Drop files here
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP &mdash; Max 10 MB
                    per file
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}