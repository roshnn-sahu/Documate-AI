import { validateFile, isImage } from "./validate-file";
import { saveFile } from "./save-file";
import { parseDocument } from "@/lib/loader/index";
import { describeImage } from "@/lib/rag/vision";
import { ingestDocument } from "@/lib/rag/ingestion";
import type { Scope } from "@/lib/rag/vector-store";
import { uploadToCloudinary, cloudinaryEnabled } from "./cloudinary";

// Validate, persist, extract text (document parser or vision model),
// and ingest a single uploaded file into the RAG pipeline (scoped to a
// user + session).
export async function processFile(
  file: File,
  scope: Pick<Scope, "userId" | "sessionId"> & { documentId?: string },
) {
  validateFile(file);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary if configured, otherwise save locally
  let cloudinaryUrl: string | null = null;
  let cloudinaryPublicId: string | null = null;

  if (cloudinaryEnabled) {
    const upload = await uploadToCloudinary(buffer, file.name, file.type);
    if (upload) {
      cloudinaryUrl = upload.url;
      cloudinaryPublicId = upload.publicId;
    }
  }

  // Always save locally as fallback (needed for document parsing)
  const saved = await saveFile(file, buffer);

  const text = isImage(file.type)
    ? await describeImage(buffer, file.type, file.name)
    : (await parseDocument(buffer, file.type)).text;

  if (!text || !text.trim()) {
    throw new Error(`No readable text could be extracted from ${file.name}`);
  }

  const { chunks } = await ingestDocument({
    text,
    fileName: file.name,
    filePath: saved.filepath,
    scope: {
      userId: scope.userId,
      sessionId: scope.sessionId,
      documentId: scope.documentId,
    },
  });

  return {
    text,
    chunks,
    cloudinaryUrl,
    cloudinaryPublicId,
    document: {
      name: file.name,
      type: file.type,
      textLength: text.length,
      chunks: chunks.length,
    },
  };
}
