export async function parseText(buffer: Buffer) {
  const text = buffer.toString("utf-8");

  return {
    text,
  };
}