import ChatView from "@/components/chat/chat-view";

interface Props {
  params: {
    sessionId: string;
  };
}

export default function SessionPage({
  params,
}: Props) {
  return (
    <ChatView
      sessionId={params.sessionId}
    />
  );
}