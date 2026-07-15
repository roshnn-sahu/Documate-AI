// Document types we can parse to text directly.
export const documentMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

// Image types we process via the vision model.
export const imageMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const allowedMimeTypes = [...documentMimeTypes, ...imageMimeTypes];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function isImage(mimeType: string) {
  return imageMimeTypes.includes(mimeType);
}

export function validateFile(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Unsupported file type: ${file.type || "unknown"}. Supported: PDF, DOCX, XLSX, TXT, CSV, PNG, JPEG, WEBP.`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 10MB)");
  }

  return true;
}
