import AiInput from "@/components/chat/ai-input";

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center px-2 pb-6">
      <div className="border-b p-4">Session: {params.sessionId}</div>

      <div className="flex-1 overflow-y-auto p-4">messages here</div>

      <div className="flex w-full items-center justify-center">
        <AiInput className="mx-auto" />
      </div>
    </div>
  );
}
