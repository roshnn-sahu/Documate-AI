import { FaissStore } from "@langchain/community/vectorstores/faiss";

import { embeddings } from "./embeddings";

export async function createVectorStore(docs: any[]) {
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings);

  return vectorStore;
}
