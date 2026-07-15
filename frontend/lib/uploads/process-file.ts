import { validateFile, isImage } from "./validate-file";
import { saveFile } from "./save-file";
import { parseDocument } from "@/lib/loader/index";
import { describeImage } from "@/lib/rag/vision";
import { ingestDocument } from "@/lib/rag/ingestion";

// Validate, persist, extract text (document parser or vision model),
// and ingest a single uploaded file into the RAG pipeline.
export async function processFile(file: File) {
  validateFile(file);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const saved = await saveFile(file, buffer);

  const text = isImage(file.type)
    ? await describeImage(buffer, file.type, file.name)
    : (await parseDocument(buffer, file.type)).text;

  if (!text || !text.trim()) {
    throw new Error(`No readable text could be extracted from ${file.name}`);
  }

  const ingestion = await ingestDocument({
    text,
    fileName: file.name,
    filePath: saved.filepath,
  });

  return {
    text,
    ingestion,
    document: {
      name: file.name,
      type: file.type,
      textLength: text.length,
      chunks: ingestion.chunks.length,
    },
  };
}
