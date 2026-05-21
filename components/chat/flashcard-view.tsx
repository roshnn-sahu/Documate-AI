"use client";

import { useState } from "react";

import { Flashcard } from "@/lib/parsers/flashcard-parser";

interface Props {
  cards: Flashcard[];
}

export default function FlashcardView({ cards }: Props) {
  const [index, setIndex] = useState(0);

  const [flipped, setFlipped] = useState(false);

  if (!cards.length) {
    return (
      <div className="rounded-xl border p-6 text-sm text-neutral-500">
        No flashcards generated.
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="space-y-4">
      <div
        onClick={() => setFlipped(!flipped)}
        className="flex h-72 cursor-pointer items-center justify-center rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:shadow-md"
      >
        <div>
          <p className="mb-4 text-sm text-neutral-500">
            {flipped ? "Answer" : "Question"}
          </p>

          <h2 className="text-2xl font-semibold">
            {flipped ? card.answer : card.question}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex(index - 1);

            setFlipped(false);
          }}
          className="rounded-lg border px-4 py-2"
        >
          Previous
        </button>

        <span className="text-sm text-neutral-500">
          {index + 1} / {cards.length}
        </span>

        <button
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex(index + 1);

            setFlipped(false);
          }}
          className="rounded-lg border px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
