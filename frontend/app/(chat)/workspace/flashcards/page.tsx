"use client";

import React, { useState, useCallback } from "react";
import {
  GraduationCap,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BarChart3,
  BrainCircuit,
  Sparkles,
  BookOpen,
  Search,
  X,
  Target,
  Zap,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionPicker } from "@/components/workspace/session-picker";
import { runAITool } from "@/lib/client/run-ai-tools";
import { Skeleton } from "@/components/ui/skeleton";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

// Parse markdown flashcard format into structured data
function parseFlashcards(markdown: string): Flashcard[] {
  const cards: Flashcard[] = [];
  // Match "## Card N" or "## Question N" blocks
  const cardRegex = /(?:^|\n)##\s+(?:Card|Question)\s+\d+\s*\n([\s\S]*?)(?=(?:\n##\s+(?:Card|Question)\s+\d+)|$)/gi;
  let match;

  while ((match = cardRegex.exec(markdown)) !== null) {
    const block = match[1];
    const questionMatch = block.match(/Question:\s*(.+?)(?:\n|$)/i);
    const answerMatch = block.match(/Answer:\s*([\s\S]*?)(?=(?:\n##|\nQuestion:|$))/i);

    if (questionMatch && answerMatch) {
      cards.push({
        id: String(cards.length + 1),
        question: questionMatch[1].trim(),
        answer: answerMatch[1].trim(),
        category: "Document",
        difficulty: cards.length % 3 === 0 ? "easy" : cards.length % 3 === 1 ? "medium" : "hard",
      });
    }
  }

  // Fallback: try simpler pattern if no cards found
  if (cards.length === 0) {
    const lines = markdown.split("\n");
    let currentQ = "";
    let currentA = "";
    let collectingAnswer = false;

    for (const line of lines) {
      const qMatch = line.match(/^[-*]?\s*\*?\*?Question\*?\*?:\s*(.+)/i);
      const aMatch = line.match(/^[-*]?\s*\*?\*?Answer\*?\*?:\s*(.+)/i);

      if (qMatch) {
        if (currentQ && currentA) {
          cards.push({
            id: String(cards.length + 1),
            question: currentQ,
            answer: currentA,
            category: "Document",
            difficulty: cards.length % 3 === 0 ? "easy" : cards.length % 3 === 1 ? "medium" : "hard",
          });
        }
        currentQ = qMatch[1].trim();
        currentA = "";
        collectingAnswer = false;
      } else if (aMatch) {
        currentA = aMatch[1].trim();
        collectingAnswer = true;
      } else if (collectingAnswer && line.trim() && !line.startsWith("#")) {
        currentA += " " + line.trim();
      }
    }
    // Push last card
    if (currentQ && currentA) {
      cards.push({
        id: String(cards.length + 1),
        question: currentQ,
        answer: currentA,
        category: "Document",
        difficulty: cards.length % 3 === 0 ? "easy" : cards.length % 3 === 1 ? "medium" : "hard",
      });
    }
  }

  return cards;
}

const difficultyColors = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};

const difficultyFilters = [
  { label: "All", value: "all", icon: BrainCircuit },
  { label: "Easy", value: "easy", icon: Sparkles },
  { label: "Medium", value: "medium", icon: Target },
  { label: "Hard", value: "hard", icon: Zap },
];

export default function FlashcardsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleGenerate = async () => {
    if (!sessionId) return;
    setIsGenerating(true);
    setFlashcards([]);
    setRawMarkdown("");
    setError(null);

    try {
      const body = await runAITool({ sessionId, tool: "flashcards" });
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulated += chunk;
        setRawMarkdown(accumulated);
      }

      // Parse the final markdown into flashcard objects
      const parsed = parseFlashcards(accumulated);
      if (parsed.length === 0) {
        setError("No flashcards could be parsed from the AI response. The document may not have enough content.");
      } else {
        setFlashcards(parsed);
        setCurrentIndex(0);
      }
    } catch (err: any) {
      console.error("Failed to generate flashcards:", err);
      setError(err.message || "Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredFlashcards = flashcards.filter((card) => {
    const matchesDifficulty = difficultyFilter === "all" || card.difficulty === difficultyFilter;
    const matchesSearch =
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const currentCard = filteredFlashcards[Math.min(currentIndex, filteredFlashcards.length - 1)];
  const progress = filteredFlashcards.length > 0 ? ((currentIndex + 1) / filteredFlashcards.length) * 100 : 0;

  const handleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredFlashcards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleKnow = useCallback(() => {
    setStudiedCards((prev) => new Set(prev).add(currentCard.id));
    setKnownCards((prev) => new Set(prev).add(currentCard.id));
    handleNext();
  }, [currentCard, handleNext]);

  const handleDontKnow = useCallback(() => {
    setStudiedCards((prev) => new Set(prev).add(currentCard.id));
    setUnknownCards((prev) => new Set(prev).add(currentCard.id));
    handleNext();
  }, [currentCard, handleNext]);

  const handleShuffle = useCallback(() => {
    setFlashcards((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setShowResults(false);
  }, []);

  const isLastCard = currentIndex === filteredFlashcards.length - 1;
  const allStudied = studiedCards.size === filteredFlashcards.length;

  // Results view
  if (showResults) {
    const accuracy = studiedCards.size > 0 ? Math.round((knownCards.size / studiedCards.size) * 100) : 0;
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50">
              <BarChart3 className="size-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <h2 className="font-bricolage text-xl font-bold text-neutral-900">Study Session Complete!</h2>
              <p className="mt-1 text-sm text-neutral-500">Here&apos;s how you performed</p>
            </div>
            <div className="flex w-full gap-4">
              <div className="flex flex-1 flex-col items-center rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-2xl font-bold text-emerald-600">{accuracy}%</span>
                <span className="text-xs font-medium text-emerald-700/70">Accuracy</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-blue-50 px-4 py-3">
                <span className="text-2xl font-bold text-blue-600">{studiedCards.size}</span>
                <span className="text-xs font-medium text-blue-700/70">Studied</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-rose-50 px-4 py-3">
                <span className="text-2xl font-bold text-rose-600">{unknownCards.size}</span>
                <span className="text-xs font-medium text-rose-700/70">Review</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Study Again
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const unknownList = flashcards.filter((f) => unknownCards.has(f.id));
                setFlashcards(unknownList);
                setCurrentIndex(0);
                setShowResults(false);
                setStudiedCards(new Set());
                setKnownCards(new Set());
                setUnknownCards(new Set());
              }}>
                <BrainCircuit className="mr-1.5 size-3.5" />
                Review Unknown
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
            <GraduationCap className="size-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">Flashcards</h1>
            <p className="text-xs text-neutral-500">Study and review key concepts from your documents</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flashcards.length > 0 && (
            <>
              <Button size="xs" variant="ghost" onClick={handleShuffle}>
                <Shuffle className="mr-1.5 size-3.5" />
                Shuffle
              </Button>
              <Button size="xs" variant="outline" onClick={() => { if (allStudied) setShowResults(true); }} disabled={studiedCards.size === 0}>
                <BarChart3 className="mr-1.5 size-3.5" />
                Results
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Session Picker & Generate */}
      {flashcards.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50">
              <GraduationCap className="size-7 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="font-bricolage text-lg font-semibold text-neutral-800">Generate Flashcards</h3>
              <p className="mt-1 text-sm text-neutral-500">Select a session with documents to create flashcards</p>
            </div>
            <SessionPicker selectedSessionId={sessionId} onSelect={setSessionId} />
            <Button
              className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50"
              onClick={handleGenerate}
              disabled={!sessionId}
            >
              <Sparkles className="mr-2 size-4" />
              Generate Flashcards
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col items-center gap-3 py-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
              <XCircle className="size-5 text-red-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-red-700">Generation Failed</p>
              <p className="mt-1 text-sm text-red-600/80">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isGenerating && (
        <>
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Loader2 className="size-8 animate-spin text-emerald-400" />
              <div className="text-center">
                <p className="font-medium text-neutral-700">Generating flashcards...</p>
                <p className="mt-0.5 text-xs text-neutral-400">AI is analyzing your documents</p>
              </div>
            </CardContent>
          </Card>
          {/* Skeleton flashcard placeholder */}
          <Card className="border-2 border-dashed border-neutral-200">
            <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-6 p-8">
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="w-full space-y-3 text-center">
                <Skeleton className="mx-auto h-4 w-16" />
                <Skeleton className="mx-auto h-7 w-3/4" />
                <Skeleton className="mx-auto h-7 w-1/2" />
              </div>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        </>
      )}

      {/* Flashcard Study UI */}
      {flashcards.length > 0 && !isGenerating && (
        <>
          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-8 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X className="size-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>
            <Tabs value={difficultyFilter} onValueChange={(v: string) => { setDifficultyFilter(v); setCurrentIndex(0); setIsFlipped(false); }}>
              <TabsList>
                {difficultyFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <TabsTrigger key={filter.value} value={filter.value}>
                      <Icon className="mr-1.5 size-3.5" />
                      {filter.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{filteredFlashcards.length > 0 ? `Card ${currentIndex + 1} of ${filteredFlashcards.length}` : "No cards match"}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <motion.div className="h-full rounded-full bg-(image:--color-theme-gradient)" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {/* Study Stats */}
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">{knownCards.size} Known</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5">
              <XCircle className="size-3.5 text-rose-500" />
              <span className="text-xs font-medium text-rose-700">{unknownCards.size} Review</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5">
              <BookOpen className="size-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-700">{filteredFlashcards.length - studiedCards.size} Remaining</span>
            </div>
          </div>

          {/* Flashcard */}
          {currentCard && (
            <div className="flex flex-1 items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={currentCard.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.2 }} className="w-full max-w-2xl">
                  <div className="group relative cursor-pointer" onClick={handleFlip}>
                    <div className="transition-all duration-500 [transform-style:preserve-3d]" style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                      {/* Front - Question */}
                      <Card className={`border-2 transition-all duration-200 ${isFlipped ? "pointer-events-none opacity-0 [backface-visibility:hidden]" : ""}`}>
                        <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-6 p-8">
                          <Badge variant="outline" className={cn("border text-xs", difficultyColors[currentCard.difficulty])}>
                            <BrainCircuit className="mr-1 size-3" />
                            {currentCard.difficulty}
                          </Badge>
                          <div className="text-center">
                            <p className="mb-2 text-xs font-medium text-neutral-400">{currentCard.category}</p>
                            <h2 className="font-bricolage text-xl leading-relaxed text-neutral-900 md:text-2xl">{currentCard.question}</h2>
                          </div>
                          <p className="text-xs text-neutral-400">Click to reveal answer</p>
                        </CardContent>
                      </Card>
                      {/* Back - Answer */}
                      <Card className={`absolute inset-0 border-2 border-amber-200/50 transition-all duration-200 ${isFlipped ? "" : "pointer-events-none opacity-0 [backface-visibility:hidden]"}`}>
                        <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-6 p-8 [transform:rotateY(180deg)]">
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            <Sparkles className="mr-1 size-3" />
                            Answer
                          </Badge>
                          <div className="text-center">
                            <p className="text-base leading-relaxed text-neutral-700 md:text-lg">{currentCard.answer}</p>
                          </div>
                          <p className="text-xs text-neutral-400">Click to see question</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  {isFlipped && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-center gap-4">
                      <Button variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800" onClick={handleDontKnow}>
                        <XCircle className="mr-2 size-4" /> Didn&apos;t Know
                      </Button>
                      <Button className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800" variant="outline" onClick={handleKnow}>
                        <CheckCircle2 className="mr-2 size-4" /> Got It!
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>
            <span className="text-xs text-neutral-400">{filteredFlashcards.length > 0 ? `${currentIndex + 1} / ${filteredFlashcards.length}` : "0 / 0"}</span>
            <Button variant="outline" size="sm" onClick={() => { setIsFlipped(false); handleNext(); }} disabled={isLastCard && !isFlipped}>
              {isLastCard ? "Finish" : "Skip"} <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>

          {allStudied && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <Button className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50" onClick={() => setShowResults(true)}>
                <BarChart3 className="mr-2 size-4" /> View Results
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
