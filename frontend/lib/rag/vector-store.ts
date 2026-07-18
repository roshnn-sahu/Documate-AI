import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import type { Document } from "@langchain/core/documents";
import { model as embeddings } from "./model";
import { createAdminClient } from "@/lib/supabase/admin";

export interface Scope {
  userId: string;
  sessionId: string;
  documentId?: string | null;
}

// Supabase-backed vector store. Uses the service-role client (RLS bypassed);
// isolation is enforced by the user_id/session_id we stamp into every chunk's
// metadata and pass as the retrieval filter.
export function getVectorStore() {
  const client = createAdminClient();
  return new SupabaseVectorStore(embeddings, {
    client,
    tableName: "document_chunks",
    queryName: "match_documents",
  });
}

// Persist chunks, stamping scope into metadata so match_documents can filter.
export async function addChunks(chunks: Document[], scope: Scope) {
  const store = getVectorStore();
  const stamped = chunks.map((c) => ({
    ...c,
    metadata: {
      ...c.metadata,
      user_id: scope.userId,
      session_id: scope.sessionId,
      document_id: scope.documentId ?? null,
    },
  }));
  await store.addDocuments(stamped);
  return store;
}
