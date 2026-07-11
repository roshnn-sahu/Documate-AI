import { Document } from "@langchain/core/documents";

/**
 * Create a LangChain Document from a text chunk with metadata.
 * Used internally by the chunking pipeline.
 */
export function createDocument({
  chunk,
  fileName,
  filePath,
  index,
}: {
  chunk: string;
  fileName?: string;
  filePath?: string;
  index: number;
}) {
  return new Document({
    pageContent: chunk,
    metadata: {
      fileName,
      source: filePath,
      chunkIndex: index,
    },
  });
}
