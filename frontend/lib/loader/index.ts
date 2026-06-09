import { parsePdf } from "./pdf-loader";
import { parseDocx } from "./docx-loader";
import { parseExcel } from "./excel-loader";
import { parseText } from "./text-loader";

export async function parseDocument(buffer: Buffer, mimeType: string) {
  switch (mimeType) {
    case "application/pdf":
      return parsePdf(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return parseDocx(buffer);

    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return parseExcel(buffer);

    case "text/plain":
      return parseText(buffer);

    default:
      throw new Error("Unsupported document type");
  }
}
