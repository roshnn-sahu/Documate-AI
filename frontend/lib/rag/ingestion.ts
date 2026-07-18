import { chunkDocument } from "./chunking";
import { addChunks, type Scope } from "./vector-store";

interface IngestOptions {
  text: string;
  fileName?: string;
  filePath?: string;
  scope?: Scope;
}

export async function ingestDocument({
  text,
  fileName,
  filePath,
  scope,
}: IngestOptions) {
  // split into chunks
  const chunks = await chunkDocument({ text, fileName, filePath });

  // persist to Supabase (scoped to user + session)
  if (scope) {
    await addChunks(chunks, scope);
  }

  return { chunks };
}
