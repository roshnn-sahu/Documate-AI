import fs from "fs/promises";
import {PDFParse} from "pdf-parse";

export async function parsePdf(filepath: string) {
  const buffer = await fs.readFile(filepath);

  const data = await PDFParse(buffer);

  return {
    text: data.text,
    pages: data.numpages,
  };
}
