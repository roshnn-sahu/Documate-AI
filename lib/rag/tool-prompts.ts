import { AIToolType } from "@/types/ai-tools";

export function buildToolPrompt(
  tool: AIToolType,
  context: string,
  input: string,
): string {
  switch (tool) {
    case "summary":
      return `Summarize the following document clearly.
      Context:${context}`;
 case "flashcards":
      return `
Generate study flashcards from the document.

Return question-answer pairs.

Context:
${context}
`;

    case "quiz":
      return `
Generate multiple choice questions from the document.

Context:
${context}
`;

    case "notes":
      return `
Generate structured notes from the document.

Context:
${context}
`;

    case "insights":
      return `
Extract key insights and important findings.

Context:
${context}
`;

    case "translate":
      return `
Translate the document into simple English.

Context:
${context}
`;

    case "compare":
      return `
Compare the uploaded documents.

Context:
${context}
`;

    default:
      return `
You are an AI document assistant.

Answer ONLY using provided context.

Context:
${context}

Question:
${input}
`;
  }
}
