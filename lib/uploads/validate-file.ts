const allowedMimeTypes = [
  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "text/plain",

  "text/csv",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function validateFile(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  return true;
}
