import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import MessageSources from "./message-sources";
import { SourceItem } from "@/types/source";
import { MessageAttachment } from "@/types/chat";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
} from "./attachments";
import MarkdownRenderer from "./markdown-renderer";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  attachments?: MessageAttachment[];
}

export default function Message({ role, content, sources, attachments }: MessageProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
        x: role === "user" ? 20 : -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      transition={{
        duration: 0.1,
        ease: "easeOut",
      }}
      className={cn(
        "flex w-full flex-col gap-1.5",
        role === "user" ? "items-end" : "items-start",
      )}
    >
      {/* Render attachments above the message bubble */}
      {role === "user" && attachments && attachments.length > 0 && (
        <Attachments variant="inline" className="flex-wrap justify-end">
          {attachments.map((att) => (
            <AttachmentHoverCard key={att.id}>
              <AttachmentHoverCardTrigger asChild>
                <Attachment
                  data={{
                    id: att.id,
                    type: "file",
                    filename: att.filename,
                    mediaType: att.mediaType,
                    url: att.url,
                  }}
                >
                  <AttachmentPreview />
                  <AttachmentInfo />
                </Attachment>
              </AttachmentHoverCardTrigger>
              <AttachmentHoverCardContent className="w-48">
                <div className="flex flex-col gap-1 overflow-hidden">
                  <p className="text-sm font-medium break-all">
                    {att.filename}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {att.mediaType}
                  </p>
                </div>
              </AttachmentHoverCardContent>
            </AttachmentHoverCard>
          ))}
        </Attachments>
      )}

      <div className="flex w-full" style={{ justifyContent: role === "user" ? "flex-end" : "flex-start" }}>
        {content && (
          <div
            className={cn(
              "max-w-3xl rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",

              role === "user" ? "bg-black text-white" : "bg-background border",
            )}
          >
           <MarkdownRenderer content={content} />
          </div>
        )}
        {role === "assistant" && sources && <MessageSources sources={sources} />}
      </div>
    </motion.div>
  );
}
