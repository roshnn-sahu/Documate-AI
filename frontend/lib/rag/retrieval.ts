import { getVectorStore, type Scope } from "./vector-store";
import { Document } from "@langchain/core/documents";

// Retrieve the top-k chunks for a query, scoped to one user + session.
// The filter is forwarded to match_documents and matched via jsonb containment.
export async function retrieveContext(
  query: string,
  scope: Pick<Scope, "userId" | "sessionId">,
) {
  const store = getVectorStore();
  const retriever = store.asRetriever({
    k: 6,
    filter: {
      user_id: scope.userId,
      session_id: scope.sessionId,
    },
  });

  const docs = await retriever.invoke(query || "document");

  // Deduplicate by content to avoid showing the same chunk multiple times
  const seen = new Set<string>();
  const uniqueDocs: Document[] = [];

  for (const doc of docs) {
    const content = doc.pageContent?.trim();
    if (content && !seen.has(content)) {
      seen.add(content);
      uniqueDocs.push(doc);
    }
  }

  return uniqueDocs.slice(0, 4); // Return max 4 unique chunks
}
