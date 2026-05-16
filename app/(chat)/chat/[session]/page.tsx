import ChatView from "@/components/chat/chat-view";

interface Props {
  params: Promise<{
    session: string;
  }>;
}

export default async function SessionPage({ params }: Props) {
  const { session } = await params;
  return <ChatView sessionId={session} />;
}