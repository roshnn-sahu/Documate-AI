import { chunkDocument } from "./chunking";

import { createVectorStore } from "./vector-store";

interface IngestOptions {
  text: string;

  fileName?: string;

  filePath?: string;
}

export async function ingestDocument({
  text,
  fileName,
  filePath,
}: IngestOptions) {
  // split into chunks
  const chunks = await chunkDocument({
    text,

    fileName,

    filePath,
  });

  // create vector DB
  const vectorStore = await createVectorStore(chunks);

  return {
    chunks,

    vectorStore,
  };
}
