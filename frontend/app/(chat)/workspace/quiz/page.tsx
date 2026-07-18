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
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SessionPicker } from "@/components/workspace/session-picker";
import { runAITool } from "@/lib/client/run-ai-tools";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

// Parse markdown quiz format into structured data
function parseQuiz(markdown: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  // Match "## Question N" blocks
  const qRegex = /(?:^|\n)##\s+Question\s+\d+\s*\n([\s\S]*?)(?=(?:\n##\s+Question\s+\d+)|$)/gi;
  let match;

  while ((match = qRegex.exec(markdown)) !== null) {
    const block = match[1];
    const questionMatch = block.match(/\*\*?Question\*?\*?:?\s*(.+?)(?:\n|$)/i);
    const options: string[] = [];
    const optionRegex = /^[-*]\s*\(?([A-D])\)?\s*[:.)]\s*(.+)/gim;
    let optMatch;
    while ((optMatch = optionRegex.exec(block)) !== null) {
      options.push(optMatch[2].trim());
    }
    const answerMatch = block.match(/Answer:\s*(.+)/i);
    const explanationMatch = block.match(/Explanation:\s*([\s\S]*?)(?=(?:\n##|\nAnswer:|$))/i);

    if (questionMatch && options.length >= 2) {
      let correctIndex = 0;
      if (answerMatch) {
        const ans = answerMatch[1].trim().charAt(0).toUpperCase();
        correctIndex = ["A", "B", "C", "D"].indexOf(ans);
        if (correctIndex === -1) correctIndex = 0;
      }
      questions.push({
        id: String(questions.length + 1),
        question: questionMatch[1].replace(/[*_]/g, "").trim(),
        options,
        correctIndex,
        explanation: explanationMatch ? explanationMatch[1].trim() : "",
        category: "Document",
      });
    }
  }

  // Fallback: simpler pattern
  if (questions.length === 0) {
    const lines = markdown.split("\n");
    let currentQ = "";
    let currentOpts: string[] = [];
    let currentExplanation = "";

    for (const line of lines) {
      const qMatch = line.match(/^#+\s*Question\s*\d*/i) || line.match(/^[-*]\s*\*?\*?Question/);
      if (qMatch) {
        if (currentQ && currentOpts.length >= 2) {
          questions.push({
            id: String(questions.length + 1),
            question: currentQ,
            options: currentOpts,
            correctIndex: 0,
            explanation: currentExplanation,
            category: "Document",
          });
        }
        currentQ = line.replace(/^#+\s*Question\s*\d*:?\s*/i, "").replace(/^[-*]\s*\*?\*?Question\*?\*?:\s*/i, "").trim();
        currentOpts = [];
        currentExplanation = "";
      } else if (line.match(/^[-*]\s*\(?[A-D]\)?/)) {
        const opt = line.replace(/^[-*]\s*\(?[A-D]\)?\s*[:.)]\s*/, "").trim();
        if (opt) currentOpts.push(opt);
      } else if (line.match(/^Explanation:/i)) {
        currentExplanation = line.replace(/^Explanation:\s*/i, "").trim();
      }
    }
    if (currentQ && currentOpts.length >= 2) {
      questions.push({
        id: String(questions.length + 1),
        question: currentQ,
        options: currentOpts,
        correctIndex: 0,
        explanation: currentExplanation,
        category: "Document",
      });
    }
  }

  return questions;
}

export default function QuizPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!sessionId) return;
    setIsGenerating(true);
    setQuestions([]);
    setRawMarkdown("");
    setError(null);

    try {
      const body = await runAITool({ sessionId, tool: "quiz" });
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

      const parsed = parseQuiz(accumulated);
      if (parsed.length === 0) {
        setError("No quiz questions could be parsed from the AI response. The document may not have enough content.");
      } else {
        setQuestions(parsed);
        setCurrentIndex(0);
      }
    } catch (err: any) {
      console.error("Failed to generate quiz:", err);
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const isAnswered = currentQuestion ? answeredQuestions.has(currentQuestion.id) : false;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion?.correctIndex;
  const score = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
  const totalAnswered = answeredQuestions.size;

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!currentQuestion || selectedAnswer === undefined) return;
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion.id));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(answeredQuestions.has(questions[currentIndex - 1]?.id));
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setShowResults(false);
  };

  // Results view
  if (showResults) {
    const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Trophy className="size-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <h2 className="font-bricolage text-xl font-bold text-neutral-900">Quiz Complete!</h2>
              <p className="mt-1 text-sm text-neutral-500">Here&apos;s how you performed</p>
            </div>
            <div className="flex w-full gap-4">
              <div className="flex flex-1 flex-col items-center rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-2xl font-bold text-emerald-600">{accuracy}%</span>
                <span className="text-xs font-medium text-emerald-700/70">Accuracy</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-blue-50 px-4 py-3">
                <span className="text-2xl font-bold text-blue-600">{score}/{totalAnswered}</span>
                <span className="text-xs font-medium text-blue-700/70">Correct</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-xl bg-rose-50 px-4 py-3">
                <span className="text-2xl font-bold text-rose-600">{totalAnswered - score}</span>
                <span className="text-xs font-medium text-rose-700/70">Wrong</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-1.5 size-3.5" />
              Try Again
            </Button>
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
            <p className="text-xs text-neutral-500">Test your knowledge from uploaded documents</p>
          </div>
        </div>
        {questions.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <Target className="size-3" />
              {score}/{totalAnswered} correct
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Clock className="size-3" />
              {questions.length - answeredQuestions.size} remaining
            </Badge>
          </div>
        )}
      </div>

      {/* Session Picker & Generate */}
      {questions.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50">
              <ClipboardList className="size-7 text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="font-bricolage text-lg font-semibold text-neutral-800">Generate Quiz</h3>
              <p className="mt-1 text-sm text-neutral-500">Select a session with documents to create a quiz</p>
            </div>
            <SessionPicker selectedSessionId={sessionId} onSelect={setSessionId} />
            <Button className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50" onClick={handleGenerate} disabled={!sessionId}>
              <Sparkles className="mr-2 size-4" />
              Generate Quiz
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
              <Loader2 className="size-8 animate-spin text-blue-400" />
              <div className="text-center">
                <p className="font-medium text-neutral-700">Generating quiz...</p>
                <p className="mt-0.5 text-xs text-neutral-400">AI is creating questions from your documents</p>
              </div>
            </CardContent>
          </Card>
          {/* Skeleton question card */}
          <Card className="border-2 border-dashed border-neutral-200">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border-2 border-neutral-100 p-4">
                    <Skeleton className="size-8 shrink-0 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quiz UI */}
      {questions.length > 0 && !isGenerating && currentQuestion && (
        <>
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% complete</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <motion.div className="h-full rounded-full bg-(image:--color-theme-gradient)" initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {/* Question Card */}
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="mb-6">
                <Badge variant="outline" className="mb-3 text-xs">{currentQuestion.category}</Badge>
                <h2 className="font-bricolage text-lg font-semibold text-neutral-900 md:text-xl">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  let stateClass = "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50";
                  if (isAnswered) {
                    if (isCorrectOption) stateClass = "border-emerald-300 bg-emerald-50";
                    else if (isSelected && !isCorrectOption) stateClass = "border-red-300 bg-red-50";
                    else stateClass = "border-neutral-200 opacity-50";
                  } else if (isSelected) {
                    stateClass = "border-blue-300 bg-blue-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isAnswered}
                      className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all", stateClass)}
                    >
                      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm font-medium",
                        isAnswered && isCorrectOption ? "border-emerald-300 bg-emerald-100 text-emerald-700" :
                        isAnswered && isSelected ? "border-red-300 bg-red-100 text-red-700" :
                        "border-neutral-200 bg-neutral-50 text-neutral-600"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm text-neutral-700">{option}</span>
                      {isAnswered && isCorrectOption && <CheckCircle2 className="ml-auto size-5 text-emerald-500" />}
                      {isAnswered && isSelected && !isCorrectOption && <XCircle className="ml-auto size-5 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && currentQuestion.explanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">Explanation</p>
                  <p className="mt-1 text-sm text-blue-700">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {!isAnswered ? (
                <Button onClick={handleSubmit} disabled={selectedAnswer === undefined}>
                  Submit Answer
                </Button>
              ) : currentIndex < questions.length - 1 ? (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-1 size-4" />
                </Button>
              ) : (
                <Button className="bg-(image:--color-theme-gradient) text-white" onClick={() => setShowResults(true)}>
                  <Trophy className="mr-2 size-4" /> View Results
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
