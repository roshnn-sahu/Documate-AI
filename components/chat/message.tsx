import { cn } from "@/lib/utils";
import MessageSources from "./message-sources";
import { SourceItem } from "@/types/source";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
}

export default function Message({ role, content, sources }: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-3xl rounded-2xl px-4 py-3 whitespace-pre-wrap",

          role === "user" ? "bg-black text-white" : "bg-background border",
        )}
      >
        {content}
      </div>
      {role === "assistant" && sources && <MessageSources sources={sources} />}
    </div>
  );
}
