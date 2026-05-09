"use client";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SpeechInput } from "../ui/speech-input";
import { useRef, useState } from "react";

export const title = "AI with Voice";

const AiInput = ({ className = "" }: { className: String }) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("message", message);

      if (file) {
        formData.append("file", file);
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

  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-4", { className })}>
      <InputGroup className="bg-background">
        <InputGroupTextarea placeholder="Type or speak your message..." />

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
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf,.docx,.xlsx,.txt,.csv"
                onChange={(e) => {
                  const selected = e.target.files?.[0];

                  if (selected) {
                    setFile(selected);
                  }
                }}
              />
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
