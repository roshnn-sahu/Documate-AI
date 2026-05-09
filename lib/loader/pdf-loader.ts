import fs from "fs/promises";
import {pdfParse} from "pdf-parse";

export async function parsePdf(filepath: string) {
  const buffer = await fs.readFile(filepath);

  const data = await pdfParse(buffer);

  return {
    text: data.text,
    pages: data.numpages,
  };
}
