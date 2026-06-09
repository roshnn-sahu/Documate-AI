import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

interface ChunkOptions {
  text: string;

  fileName?: string;

  filePath?: string;
}

export async function chunkDocument({
  text,
  fileName,
  filePath,
}: ChunkOptions) {
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,

      chunkOverlap: 200,
    });

  const chunks =
    await splitter.splitDocuments([
      new Document({
        pageContent: text,

        metadata: {
          fileName,

          source: filePath,
        },
      }),
    ]);

  // append chunk index
  return chunks.map(
    (chunk, index) => {
      chunk.metadata = {
        ...chunk.metadata,

        chunkIndex: index,
      };

      return chunk;
    }
  );
}