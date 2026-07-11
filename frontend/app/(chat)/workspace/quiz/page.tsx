"use client";

import React, { useState, useCallback } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BarChart3,
  BrainCircuit,
  Sparkles,
  Clock,
  Trophy,
  Target,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What does RAG stand for in AI and document search?",
    options: [
      "Random Access Generation",
      "Retrieval-Augmented Generation",
      "Rapid Answer Generation",
      "Recursive Algorithmic Gathering",
    ],
    correctIndex: 1,
    explanation:
      "RAG stands for Retrieval-Augmented Generation, a framework that combines information retrieval with text generation to produce accurate, context-grounded responses.",
    category: "AI Fundamentals",
    difficulty: "easy",
  },
  {
    id: "2",
    question:
      "How do vector embeddings enable semantic document search?",
    options: [
      "By storing exact keyword matches",
      "By converting text into numerical vectors that capture meaning",
      "By compressing documents into smaller files",
      "By creating hierarchical folder structures",
    ],
    correctIndex: 1,
    explanation:
      "Vector embeddings convert text into numerical arrays that capture semantic meaning. Similar documents have vectors close together, enabling search by meaning rather than exact keywords.",
    category: "Search Technology",
    difficulty: "easy",
  },
  {
    id: "3",
    question:
      "What is the primary advantage of chunking documents before embedding?",
    options: [
      "Reduces file size for storage",
      "Improves retrieval precision by isolating relevant passages",
      "Makes documents easier to read",
      "Increases the number of tokens the model can process",
    ],
    correctIndex: 1,
    explanation:
      "Chunking splits documents into smaller segments before embedding, allowing the retrieval system to find and return only the most relevant passages rather than entire documents.",
    category: "Document Processing",
    difficulty: "medium",
  },
  {
    id: "4",
    question:
      "Which retrieval method captures semantic meaning beyond keyword matching?",
    options: [
      "BM25 scoring",
      "TF-IDF vectorization",
      "Dense retrieval using neural embeddings",
      "Boolean search operators",
    ],
    correctIndex: 2,
    explanation:
      "Dense retrieval uses neural network embeddings to capture semantic relationships between words and concepts, going beyond simple keyword matching to understand context and meaning.",
    category: "Search Technology",
    difficulty: "medium",
  },
  {
    id: "5",
    question:
      "In a RAG pipeline, what role does the language model play after documents are retrieved?",
    options: [
      "It re-ranks the retrieved documents",
      "It generates a response grounded in the retrieved context",
      "It creates vector embeddings for new documents",
      "It stores documents in the knowledge base",
    ],
    correctIndex: 1,
    explanation:
      "After relevant documents are retrieved, the language model uses them as context to generate a grounded, accurate response — reducing hallucinations and improving factual accuracy.",
    category: "AI Fundamentals",
    difficulty: "medium",
  },
  {
    id: "6",
    question:
      "What happens when a user asks a question with no relevant documents in the vector store?",
    options: [
      "The system returns an empty response",
      "The model falls back to its training knowledge",
      "The system automatically creates new embeddings",
      "A default document is retrieved instead",
    ],
    correctIndex: 1,
    explanation:
      "When no relevant documents are found, the system falls back to the language model's plain chat mode, answering based on its training data without document grounding.",
    category: "System Design",
    difficulty: "hard",
  },
];

const difficultyConfig = {
  easy: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Easy",
  },
  medium: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Medium",
  },
  hard: {
    color: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Hard",
  },
};

export default function QuizPage() {
  const [questions] = useState(sampleQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentQuestion?.id];
  const isAnswered = answeredQuestions.has(currentQuestion?.id);
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const incorrectCount = Object.keys(selectedAnswers).length - correctCount;
  const unansweredCount = questions.length - Object.keys(selectedAnswers).length;

  const handleSelectAnswer = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex,
      }));
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion.id));
      setShowExplanation(true);
    },
    [currentQuestion, isAnswered]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(answeredQuestions.has(questions[currentIndex - 1].id));
    }
  }, [currentIndex, questions, answeredQuestions]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setShowResults(false);
  }, []);

  const handleReviewIncorrect = useCallback(() => {
    const incorrectIds = questions
      .filter((q) => selectedAnswers[q.id] !== q.correctIndex && selectedAnswers[q.id] !== undefined)
      .map((q) => q.id);
    const firstIncorrect = questions.findIndex((q) => q.id === incorrectIds[0]);
    setCurrentIndex(firstIncorrect >= 0 ? firstIncorrect : 0);
    setShowResults(false);
    setShowExplanation(false);
  }, [questions, selectedAnswers]);

  if (showResults) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const grade =
      percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!";
    const gradeColor =
      percentage >= 80
        ? "text-emerald-600"
        : percentage >= 60
          ? "text-amber-600"
          : "text-rose-600";

    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl",
                percentage >= 80
                  ? "bg-emerald-50"
                  : percentage >= 60
                    ? "bg-amber-50"
                    : "bg-rose-50"
              )}
            >
              {percentage >= 80 ? (
                <Trophy className="size-8 text-emerald-500" />
              ) : percentage >= 60 ? (
                <Target className="size-8 text-amber-500" />
              ) : (
                <BrainCircuit className="size-8 text-rose-500" />
              )}
            </div>
            <div className="text-center">
              <h2 className="font-bricolage text-xl font-bold text-neutral-900">
                Quiz Complete!
              </h2>
              <p className={cn("mt-1 font-semibold text-sm", gradeColor)}>{grade}</p>
            </div>

            {/* Score Ring */}
            <div className="relative flex items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 263.9} 263.9`}
                  initial={{ strokeDasharray: "0 263.9" }}
                  animate={{ strokeDasharray: `${(percentage / 100) * 263.9} 263.9` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-neutral-900">{percentage}%</span>
                <span className="text-[10px] font-medium text-neutral-400">Score</span>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <div className="flex flex-1 flex-col items-center rounded-xl bg-emerald-50 px-3 py-2.5">
                <span className="text-xl font-bold text-emerald-600">{correctCount}</span>
                <span className="text-[10px] font-medium text-emerald-700/70">Correct</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-rose-50 px-3 py-2.5">
                <span className="text-xl font-bold text-rose-600">{incorrectCount}</span>
                <span className="text-[10px] font-medium text-rose-700/70">Incorrect</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-blue-50 px-3 py-2.5">
                <span className="text-xl font-bold text-blue-600">{unansweredCount}</span>
                <span className="text-[10px] font-medium text-blue-700/70">Skipped</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Try Again
              </Button>
              {incorrectCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleReviewIncorrect}>
                  <BrainCircuit className="mr-1.5 size-3.5" />
                  Review Mistakes
                </Button>
              )}
              <Button
                size="sm"
                className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50"
                onClick={() => setCurrentIndex(0)}
              >
                <ArrowRight className="mr-1.5 size-3.5" />
                Review All
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
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
            <ClipboardList className="size-5 text-blue-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">Quiz</h1>
            <p className="text-xs text-neutral-500">
              Test your knowledge with interactive assessments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
          >
            <BarChart3 className="mr-1.5 size-3.5" />
            Results
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-500" />
            {correctCount} correct
            <span className="text-neutral-300 mx-1">·</span>
            <span>{Math.round(progress)}% complete</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-(image:--color-theme-gradient)"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Progress Stats */}
      <div className="flex gap-3">
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">{correctCount} Correct</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5">
          <XCircle className="size-3.5 text-rose-500" />
          <span className="text-xs font-medium text-rose-700">{incorrectCount} Incorrect</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5">
          <Clock className="size-3.5 text-blue-500" />
          <span className="text-xs font-medium text-blue-700">{unansweredCount} Remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex flex-1 items-start justify-center pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl space-y-6"
          >
            {/* Question Header */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border text-[10px]",
                  difficultyConfig[currentQuestion?.difficulty]?.color
                )}
              >
                <BrainCircuit className="mr-1 size-2.5" />
                {difficultyConfig[currentQuestion?.difficulty]?.label}
              </Badge>
              <span className="text-[10px] font-medium text-neutral-400">
                {currentQuestion?.category}
              </span>
              <span className="text-[10px] text-neutral-300">·</span>
              <span className="text-[10px] font-medium text-neutral-400">
                Question {currentIndex + 1}
              </span>
            </div>

            {/* Question */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bricolage text-lg leading-relaxed text-neutral-900 md:text-xl">
                  {currentQuestion?.question}
                </h2>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion?.options.map((option, optionIndex) => {
                const isSelectedOption = selectedAnswer === optionIndex;
                const isCorrectOption = optionIndex === currentQuestion.correctIndex;
                let optionStyle = "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50";
                let indicator = null;

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle =
                      "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200";
                    indicator = (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    );
                  } else if (isSelectedOption && !isCorrectOption) {
                    optionStyle =
                      "border-rose-300 bg-rose-50 ring-1 ring-rose-200";
                    indicator = (
                      <XCircle className="size-4 text-rose-500 shrink-0" />
                    );
                  } else {
                    optionStyle =
                      "border-neutral-100 bg-neutral-50/50 opacity-60";
                  }
                }

                return (
                  <motion.button
                    key={optionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: optionIndex * 0.05 }}
                    onClick={() => handleSelectAnswer(optionIndex)}
                    disabled={isAnswered}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-150",
                      optionStyle
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                        isAnswered && isCorrectOption
                          ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                          : isAnswered && isSelectedOption && !isCorrectOption
                            ? "border-rose-200 bg-rose-100 text-rose-700"
                            : "border-neutral-200 bg-neutral-50 text-neutral-500"
                      )}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span
                      className={cn(
                        "flex-1 leading-snug",
                        isAnswered && isCorrectOption
                          ? "text-emerald-800 font-medium"
                          : isAnswered && isSelectedOption && !isCorrectOption
                            ? "text-rose-800 font-medium"
                            : "text-neutral-700"
                      )}
                    >
                      {option}
                    </span>
                    {indicator && isSelectedOption && (
                      <span className="shrink-0">{indicator}</span>
                    )}
                    {isAnswered && isCorrectOption && !isSelectedOption && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card
                    className={cn(
                      "border-2",
                      isCorrect
                        ? "border-emerald-200/50 bg-emerald-50/50"
                        : "border-amber-200/50 bg-amber-50/50"
                    )}
                  >
                    <CardContent className="flex gap-3 p-4">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          isCorrect ? "bg-emerald-100" : "bg-amber-100"
                        )}
                      >
                        {isCorrect ? (
                          <Sparkles className="size-4 text-emerald-600" />
                        ) : (
                          <Target className="size-4 text-amber-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            isCorrect ? "text-emerald-700" : "text-amber-700"
                          )}
                        >
                          {isCorrect ? "Correct!" : "Not quite — here's why"}
                        </p>
                        <p className="text-xs leading-relaxed text-neutral-600">
                          {currentQuestion?.explanation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>
        <span className="text-xs text-neutral-400">
          {currentIndex + 1} / {questions.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>

      {/* Finish Button when all answered */}
      {Object.keys(selectedAnswers).length === questions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Button
            className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50"
            onClick={() => setShowResults(true)}
          >
            <Trophy className="mr-2 size-4" />
            View Results
          </Button>
        </motion.div>
      )}
    </div>
  );
}
