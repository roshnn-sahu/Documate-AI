import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function saveFile(file: File, buffer: Buffer) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const filename = `${uuid()}-${file.name}`;

  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, buffer);

  return {
    filename,
    filepath,
  };
}
