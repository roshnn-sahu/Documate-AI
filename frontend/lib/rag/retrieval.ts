import { getVectorStore, type Scope } from "./vector-store";

// Retrieve the top-k chunks for a query, scoped to one user + session.
// The filter is forwarded to match_documents and matched via jsonb containment.
export async function retrieveContext(
  query: string,
  scope: Pick<Scope, "userId" | "sessionId">,
) {
  const store = getVectorStore();
  const retriever = store.asRetriever({
    k: 4,
    filter: {
      user_id: scope.userId,
      session_id: scope.sessionId,
    },
  });

  return retriever.invoke(query || "document");
}
