import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";

  content: string;
}

export default function Message({ role, content }: MessageProps) {
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
    </div>
  );
}
