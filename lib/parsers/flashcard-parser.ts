export interface Flashcard {
  question: string;

  answer: string;
}

export function parseFlashcards(markdown: string): Flashcard[] {
  const cards: Flashcard[] = [];

  const sections = markdown.split("##");

  sections.forEach((section) => {
    const questionMatch = section.match(/Question:\s*(.*)/i);

    const answerMatch = section.match(/Answer:\s*(.*)/i);

    if (questionMatch && answerMatch) {
      cards.push({
        question: questionMatch[1].trim(),

        answer: answerMatch[1].trim(),
      });
    }
  });

  return cards;
}
