export async function retrieveContext(vectorStore: any, query: string) {
  const retriever = vectorStore.asRetriever({
    k: 4,
  });

  const docs = await retriever.invoke(query);

  return docs;
}
