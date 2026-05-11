import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function chunkDocument(
  text: string
) {
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

  const chunks =
    await splitter.createDocuments([
      text,
    ]);

  return chunks;
}