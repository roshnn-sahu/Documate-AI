import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { model as embeddings } from "./model";

export async function createVectorStore(docs: any[]) {
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings);

  return vectorStore;
}
