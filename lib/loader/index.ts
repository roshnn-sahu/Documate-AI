import { parsePdf } from "./pdf-loader";
import { parseDocx } from "./docx-loader";
import { parseExcel } from "./excel-loader";
import { parseText } from "./text-loader";

export async function parseDocument(
  filepath: string,
  mimeType: string
) {
  switch (mimeType) {
    case "application/pdf":
      return parsePdf(filepath);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return parseDocx(filepath);

    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return parseExcel(filepath);

    case "text/plain":
      return parseText(filepath);

    default:
      throw new Error(
        "Unsupported document type"
      );
  }
}