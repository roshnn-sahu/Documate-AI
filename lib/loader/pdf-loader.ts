import fs from "fs/promises";
import {PDFParse} from "pdf-parse";

export async function parsePdf(buffer: Buffer) {
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();

  return {
    text: data.text,
    pages: data.total,
  };
}
