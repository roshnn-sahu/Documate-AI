import { SourceItem } from "@/types/source";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileTextIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface Props {
  sources: SourceItem[];
}

export default function MessageSources({ sources }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Deduplicate sources by content
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.content === source.content)
  );

  if (!uniqueSources?.length) return null;

  return (
    <div className="mt-2 w-full max-w-2xl">
      {/* Compact collapsed view */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-lg",
          "text-[11px] text-muted-foreground hover:text-foreground",
          "hover:bg-muted/50 transition-colors duration-150",
          "w-full"
        )}
      >
        <FileTextIcon className="size-3" />
        <span className="font-medium">
          {uniqueSources.length} source{uniqueSources.length > 1 ? "s" : ""}
        </span>
        {isExpanded ? (
          <ChevronUpIcon className="size-3 ml-auto" />
        ) : (
          <ChevronDownIcon className="size-3 ml-auto" />
        )}
      </button>

      {/* Expanded view */}
      {isExpanded && (
        <div className="mt-1 space-y-1 pl-1">
          {uniqueSources.map((source, index) => {
            const isSourceExpanded = expandedIndex === index;
            const previewText = source.content.slice(0, 120);
            const hasMore = source.content.length > 120;

            return (
              <div
                key={index}
                className="group rounded-lg border border-border/50 bg-muted/20 overflow-hidden"
              >
                <div
                  className="flex items-center gap-1.5 px-2 py-1.5 cursor-pointer select-none hover:bg-muted/30"
                  onClick={() => setExpandedIndex(isSourceExpanded ? null : index)}
                >
                  <span className="text-[11px] font-medium text-foreground truncate flex-1">
                    {source.metadata?.fileName || "Document"}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono">
                    §{source.metadata?.chunkIndex ?? 0}
                  </span>
                  {hasMore && (
                    <div className="text-muted-foreground">
                      {isSourceExpanded ? (
                        <ChevronUpIcon className="size-3" />
                      ) : (
                        <ChevronDownIcon className="size-3" />
                      )}
                    </div>
                  )}
                </div>
                {isSourceExpanded && (
                  <div className="px-2 pb-2">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {source.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}