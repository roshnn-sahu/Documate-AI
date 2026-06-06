"use client";

import React, { useState, useRef } from "react";
import {
  ScrollText,
  FileText,
  Upload,
  Sparkles,
  Copy,
  CheckCheck,
  Clock,
  BookOpen,
  ListChecks,
  Zap,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";

type SummaryLength = "short" | "medium" | "long";
type SummaryStyle = "bullet" | "paragraph" | "key-points";

interface SummaryResult {
  text: string;
  length: SummaryLength;
  style: SummaryStyle;
  wordCount: number;
  timestamp: string;
}

const sampleSummary: SummaryResult = {
  text: "Retrieval-Augmented Generation (RAG) is a powerful AI framework that enhances language model outputs by retrieving relevant information from external knowledge sources before generating responses. This approach combines the strengths of information retrieval systems with advanced text generation capabilities.\n\nKey aspects of RAG include:\n\n1. **Document Retrieval**: The system first searches a vector database or document store to find relevant passages based on the user's query. This ensures the model has access to up-to-date and domain-specific information.\n\n2. **Context Integration**: Retrieved documents are injected into the prompt as context, providing the language model with factual grounding before it generates an answer.\n\n3. **Grounded Generation**: By basing responses on retrieved documents, RAG significantly reduces hallucinations and improves factual accuracy compared to standalone language models.\n\n4. **Applications**: RAG is widely used in question-answering systems, customer support chatbots, research assistants, and document analysis tools where accuracy and up-to-date information are critical.",
  length: "medium",
  style: "paragraph",
  wordCount: 168,
  timestamp: "2 minutes ago",
};

const lengthOptions = [
  { value: "short", label: "Short", description: "1-2 sentences" },
  { value: "medium", label: "Medium", description: "1 paragraph" },
  { value: "long", label: "Long", description: "Detailed summary" },
];

const styleOptions = [
  {
    value: "paragraph",
    label: "Paragraph",
    icon: BookOpen,
    description: "Flowing text format",
  },
  {
    value: "bullet",
    label: "Bullet Points",
    icon: ListChecks,
    description: "Organized list",
  },
  {
    value: "key-points",
    label: "Key Points",
    icon: Zap,
    description: "Most important ideas",
  },
];

export default function SummarizePage() {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("paragraph");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async () => {
    if (!inputText.trim() && !file) return;
    setIsSummarizing(true);

    // Simulate a summary generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResult({
      ...sampleSummary,
      length: summaryLength,
      style: summaryStyle,
      timestamp: "Just now",
    });

    setIsSummarizing(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setFile(null);
    setResult(null);
  };

  const characterCount = inputText.length;
  const estimatedMinutes = Math.max(1, Math.ceil(characterCount / 1000));

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50">
            <ScrollText className="size-5 text-violet-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">
              Summarize
            </h1>
            <p className="text-xs text-neutral-500">
              Condense documents into concise, AI-powered summaries
            </p>
          </div>
        </div>
        {result && (
          <div className="flex items-center gap-2">
            <Button size="xs" variant="ghost" onClick={handleClear}>
              <RefreshCw className="mr-1.5 size-3.5" />
              New Summary
            </Button>
          </div>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Source Text</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="relative flex-1">
                <Textarea
                  placeholder="Paste your document text here, or upload a file..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[280px] resize-none text-sm leading-relaxed"
                />
              </div>

              <Separator />

              {/* File Upload */}
              <div
                className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 p-4 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50">
                  <Upload className="size-4 text-violet-500" />
                </div>
                <div className="flex-1">
                  {file ? (
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-violet-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        {file.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-neutral-700">
                        Upload a document
                      </p>
                      <p className="text-xs text-neutral-400">
                        Supports PDF, DOCX, TXT (max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
              />

              {/* Character count */}
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <FileText className="size-3.5" />
                <span>{characterCount.toLocaleString()} characters</span>
                {characterCount > 0 && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <Clock className="size-3.5" />
                    <span>~{estimatedMinutes} min read</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card size="sm">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600">
                    Length
                  </label>
                  <div className="flex gap-2">
                    {lengthOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        size="xs"
                        variant={
                          summaryLength === opt.value ? "default" : "outline"
                        }
                        onClick={() =>
                          setSummaryLength(opt.value as SummaryLength)
                        }
                        className={`text-xs ${
                          summaryLength === opt.value
                            ? "bg-violet-600 text-white"
                            : ""
                        }`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600">
                    Style
                  </label>
                  <div className="flex gap-2">
                    {styleOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        size="xs"
                        variant={
                          summaryStyle === opt.value ? "default" : "outline"
                        }
                        onClick={() =>
                          setSummaryStyle(opt.value as SummaryStyle)
                        }
                        className={`text-xs ${
                          summaryStyle === opt.value
                            ? "bg-violet-600 text-white"
                            : ""
                        }`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50"
                onClick={handleSummarize}
                disabled={(!inputText.trim() && !file) || isSummarizing}
              >
                {isSummarizing ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Summary</CardTitle>
                {result && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={handleCopy}
                    className="gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="size-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isSummarizing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4 py-20"
                  >
                    <div className="relative">
                      <div className="flex size-16 items-center justify-center">
                        <RefreshCw className="size-8 animate-spin text-violet-400" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-violet-100 opacity-30 blur-xl" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-neutral-700">
                        Analyzing your document...
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Extracting key information and generating summary
                      </p>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Summary Stats */}
                    <div className="flex items-center gap-3 rounded-lg bg-violet-50 px-4 py-2.5">
                      <Sparkles className="size-4 text-violet-500" />
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-violet-700">
                          <strong>{result.wordCount}</strong> words
                        </span>
                        <span className="text-violet-300">|</span>
                        <span className="text-violet-700">
                          {result.length === "short"
                            ? "Short"
                            : result.length === "medium"
                              ? "Medium"
                              : "Long"}{" "}
                          ·{" "}
                          {result.style === "paragraph"
                            ? "Paragraph"
                            : result.style === "bullet"
                              ? "Bullet Points"
                              : "Key Points"}
                        </span>
                        <span className="text-violet-300">|</span>
                        <span className="flex items-center gap-1 text-violet-600">
                          <Clock className="size-3" />
                          {result.timestamp}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Summary Text */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                      {result.text}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-3 py-20"
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
                      <ScrollText className="size-7 text-neutral-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-neutral-600">
                        No summary yet
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Paste text or upload a document and generate a summary
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card size="sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Lightbulb className="size-4 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-neutral-700">
                    Pro Tips
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-neutral-500">
                    <li>
                      • Longer texts produce more nuanced summaries with the
                      &quot;Long&quot; option
                    </li>
                    <li>
                      • Use &quot;Key Points&quot; style for quick
                      decision-making overviews
                    </li>
                    <li>
                      • Combine multiple documents for comprehensive cross-document
                      summaries
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
