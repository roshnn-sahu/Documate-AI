import fs from "fs/promises";

export async function parseText(
  filepath: string
) {
  const text = await fs.readFile(
    filepath,
    "utf-8"
  );

  return {
    text,
  };
}