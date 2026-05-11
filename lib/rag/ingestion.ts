import { chunkDocument } from "./chunking";

import { createVectorStore } from "./vector-store";

export async function ingestDocument(
  text: string
) {
  // split into chunks
  const chunks =
    await chunkDocument(text);

  // create vector DB
  const vectorStore =
    await createVectorStore(chunks);

  return {
    chunks,
    vectorStore,
  };
}