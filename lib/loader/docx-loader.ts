import fs from "fs/promises";
import mammoth from "mammoth";

export async function parseDocx(filepath: string) {
  const buffer = await fs.readFile(filepath);

  const result = await mammoth.extractRawText({
    buffer,
  });

  return {
    text: result.value,
  };
}
