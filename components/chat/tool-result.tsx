interface Props {
  title: string;

  content: string;
}

export default function ToolResult({
  title,
  content,
}: Props) {
  if (!content) return null;

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      </div>

      <div className="prose prose-sm max-w-none text-neutral-700">
        {content}
      </div>
    </div>
  );
}