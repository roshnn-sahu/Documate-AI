import AiInput from "@/components/chat/ai-input";

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <div className="flex h-full flex-col py-2">
      <div className="border-b p-4">
        Session: {params.sessionId}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        messages here
      </div>

      <div className=" flex items-center justify-center w-full">
        <AiInput className="mx-auto" />
      </div>
    </div>
  );
}