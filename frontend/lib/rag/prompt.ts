export function buildPrompt(context: string, question: string) {
  return `
You are an AI document assistant.

Answer ONLY using the provided context.

If the answer is not in context,
say you don't know.

Context:
${context}

Question:
${question}
`;
}
