"use client";

import React, { useState, useRef } from "react";
import {
  ScrollText,
  Sparkles,
  Copy,
  CheckCheck,
  Clock,
  BookOpen,
  ListChecks,
  Zap,
  RefreshCw,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { SessionPicker } from "@/components/workspace/session-picker";
import { runAITool } from "@/lib/client/run-ai-tools";

type SummaryLength = "short" | "medium" | "long";
type SummaryStyle = "bullet" | "paragraph" | "key-points";

const lengthOptions = [
  { value: "short", label: "Short", description: "1-2 sentences" },
  { value: "medium", label: "Medium", description: "1 paragraph" },
  { value: "long", label: "Long", description: "Detailed summary" },
];

const styleOptions = [
  { value: "paragraph", label: "Paragraph", icon: BookOpen },
  { value: "bullet", label: "Bullet Points", icon: ListChecks },
  { value: "key-points", label: "Key Points", icon: Zap },
];

export default function SummarizePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("paragraph");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!sessionId) return;
    setIsSummarizing(true);
    setResult(null);

    try {
      const body = await runAITool({
        sessionId,
        tool: "summary",
        input: `Length: ${summaryLength}, Style: ${summaryStyle}`,
      });

      const reader = body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulated += chunk;
        setResult(accumulated);
      }
    } catch (error: any) {
      setResult(`Error: ${error.message || "Failed to generate summary"}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResult(null);
  };

  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;

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
              <CardTitle>Select a Document</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-neutral-500">
                Choose a chat session with uploaded documents to generate a summary.
              </p>
              <SessionPicker
                selectedSessionId={sessionId}
                onSelect={setSessionId}
              />

              {/* Options */}
              <Separator />
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
                        variant={summaryLength === opt.value ? "default" : "outline"}
                        onClick={() => setSummaryLength(opt.value as SummaryLength)}
                        className={`text-xs ${summaryLength === opt.value ? "bg-violet-600 text-white" : ""}`}
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
                        variant={summaryStyle === opt.value ? "default" : "outline"}
                        onClick={() => setSummaryStyle(opt.value as SummaryStyle)}
                        className={`text-xs ${summaryStyle === opt.value ? "bg-violet-600 text-white" : ""}`}
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
                disabled={!sessionId || isSummarizing}
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
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
                  <Button size="xs" variant="ghost" onClick={handleCopy} className="gap-1">
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
                {isSummarizing && !result ? (
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
                    <div className="flex items-center gap-3 rounded-lg bg-violet-50 px-4 py-2.5">
                      <Sparkles className="size-4 text-violet-500" />
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-violet-700">
                          <strong>{wordCount}</strong> words
                        </span>
                        <span className="text-violet-300">|</span>
                        <span className="text-violet-700">
                          {summaryLength === "short" ? "Short" : summaryLength === "medium" ? "Medium" : "Long"}
                          {" · "}
                          {summaryStyle === "paragraph" ? "Paragraph" : summaryStyle === "bullet" ? "Bullet Points" : "Key Points"}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                      {result}
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
                      <p className="font-medium text-neutral-600">No summary yet</p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Select a session and generate a summary
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
                  <p className="text-xs font-medium text-neutral-700">Pro Tips</p>
                  <ul className="space-y-0.5 text-[11px] text-neutral-500">
                    <li>• Longer documents produce more detailed summaries</li>
                    <li>• Use "Key Points" style for quick decision-making</li>
                    <li>• Upload documents in chat first, then come here to summarize</li>
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
