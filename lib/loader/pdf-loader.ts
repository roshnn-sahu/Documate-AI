import fs from "fs/promises";
import {PDFParse} from "pdf-parse";

export async function parsePdf(buffer: Buffer) {
  const data = await PDFParse(buffer);

  return {
    text: data.text,
    pages: data.numpages,
  };
}
