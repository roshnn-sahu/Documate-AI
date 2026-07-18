import { AIToolType } from "@/types/ai-tools";

export function buildToolPrompt(
  tool: AIToolType,
  context: string,
  input: string,
): string {
  switch (tool) {
    case "summary":
      return `Generate a concise summary of the following document.

  STRICT FORMAT:

  # Summary

  ## Overview
  A brief 2-3 sentence overview of the document's main topic and purpose.

  ## Key Points
  - Point 1
  - Point 2
  - Point 3

  ## Details
  Expanded explanation of the most important concepts.

  Context:
  ${context}
  `;

    case "flashcards":
      return `Generate study flashcards from the following document.

  STRICT FORMAT:

  # Flashcards

  ## Card 1
  Question: What is ...?
  Answer: ...

  ## Card 2
  Question: ...
  Answer: ...

  Create 5-10 flashcards covering the most important concepts.
  Make questions clear and specific.
  Keep answers concise but complete.

  Context:
  ${context}
  `;

    case "quiz":
      return `
  Generate a markdown quiz from the following document.

  Format:

  # Quiz

  ## Question 1
  - A
  - B
  - C
  - D

  Answer: ...

  Create 5-10 questions with 4 options each (A, B, C, D).
  Include the correct answer after each question.

  Context:
  ${context}
  `;

    case "notes":
      return `
  Generate structured notes from the following document.

  Format:

  # Notes

  ## Topic 1
  - Key concept
  - Supporting detail

  ## Topic 2
  - Key concept
  - Supporting detail

  Organize the content into clear topics with bullet points.
  Highlight important terms and definitions.

  Context:
  ${context}
  `;

    case "insights":
      return `
  Extract key insights and important findings from the following document.

  Format:

  # Key Insights

  ## Finding 1
  Description of the insight and its significance.

  ## Finding 2
  Description of the insight and its significance.

  Focus on actionable insights, trends, and important conclusions.

  Context:
  ${context}
  `;

    case "translate":
      return `
  Translate the following document into simple, clear English.

  Maintain the original structure and meaning.
  Use plain language that anyone can understand.
  Preserve headings and formatting.

  Context:
  ${context}
  `;

    case "compare":
      return `
  Compare the uploaded documents.

  Format:

  # Document Comparison

  ## Similarities
  - Shared point 1
  - Shared point 2

  ## Differences
  - Document 1: ...
  - Document 2: ...

  ## Recommendation
  Summary of which document is more relevant for the given purpose.

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
