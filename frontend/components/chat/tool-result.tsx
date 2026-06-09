import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FlashcardView from "./flashcard-view";

import { parseFlashcards } from "@/lib/parsers/flashcard-parser";

interface Props {
  title: string;

  content: string;
  onClose?: () => void;
}

export default function ToolResult({ title, content, onClose }: Props) {
  if (!content) return null;

  return (
    <div className="relative rounded-lg border bg-white p-5 shadow-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-3 pr-8">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="prose prose-sm max-w-none text-neutral-700">
        {title === "flashcards" ? (
          <FlashcardView cards={parseFlashcards(content)} />
        ) : (
          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
