import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import MessageSources from "./message-sources";
import { SourceItem } from "@/types/source";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
}

export default function Message({ role, content, sources }: MessageProps) {
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
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      {content && (
        <div
          className={cn(
            "max-w-3xl rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",

            role === "user" ? "bg-black text-white" : "bg-background border",
          )}
        >
          {content}
        </div>
      )}
      {role === "assistant" && sources && <MessageSources sources={sources} />}
    </motion.div>
  );
}
