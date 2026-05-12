import { SourceItem } from "@/types/source";

interface Props {
  sources: SourceItem[];
}

export default function MessageSources({
  sources,
}: Props) {
  if (!sources?.length)
    return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium text-neutral-500">
        Sources
      </p>

      {sources.map(
        (source, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-neutral-50 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold">
                {
                  source.metadata
                    ?.fileName
                }
              </span>

              <span className="text-[10px] text-neutral-400">
                Chunk #
                {
                  source.metadata
                    ?.chunkIndex
                }
              </span>
            </div>

            <p className="line-clamp-4 text-sm text-neutral-600">
              {source.content}
            </p>
          </div>
        )
      )}
    </div>
  );
}