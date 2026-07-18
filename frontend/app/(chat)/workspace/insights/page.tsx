"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Loader2,
  Copy,
  CheckCheck,
  BarChart3,
  Target,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { SessionPicker } from "@/components/workspace/session-picker";
import { runAITool } from "@/lib/client/run-ai-tools";
import { Skeleton } from "@/components/ui/skeleton";

// Parse markdown insights into structured items
function parseInsights(markdown: string): { title: string; body: string }[] {
  const insights: { title: string; body: string }[] = [];
  const blocks = markdown.split(/\n(?=##\s+)/);

  for (const block of blocks) {
    const titleMatch = block.match(/^##\s+(.+)/);
    if (titleMatch) {
      const title = titleMatch[1].replace(/[*_]/g, "").trim();
      const body = block
        .replace(/^##\s+.+\n?/, "")
        .replace(/^[-*]\s+/gm, "")
        .trim();
      if (title && body) {
        insights.push({ title, body });
      }
    }
  }
  return insights;
}

export default function InsightsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [insights, setInsights] = useState<{ title: string; body: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!sessionId) return;
    setIsGenerating(true);
    setResult(null);
    setInsights([]);
    setError(null);

    try {
      const body = await runAITool({ sessionId, tool: "insights" });
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

      const parsed = parseInsights(accumulated);
      if (parsed.length === 0 && accumulated.length > 0) {
        // Show raw text if no structured insights parsed
        setInsights([{ title: "Analysis Result", body: accumulated }]);
      } else {
        setInsights(parsed);
      }
    } catch (err: any) {
      console.error("Failed to generate insights:", err);
      setError(err.message || "Failed to generate insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50">
            <Lightbulb className="size-5 text-rose-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">Insights</h1>
            <p className="text-xs text-neutral-500">Discover key patterns and findings from your documents</p>
          </div>
        </div>
        {result && (
          <Button size="xs" variant="ghost" onClick={handleCopy} className="gap-1">
            {copied ? (
              <><CheckCheck className="size-3.5 text-emerald-500" /><span className="text-emerald-600">Copied!</span></>
            ) : (
              <><Copy className="size-3.5" /> Copy</>
            )}
          </Button>
        )}
      </div>

      {/* Session Picker & Generate */}
      {!result && !isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50">
              <Lightbulb className="size-7 text-rose-400" />
            </div>
            <div className="text-center">
              <h3 className="font-bricolage text-lg font-semibold text-neutral-800">Extract Insights</h3>
              <p className="mt-1 text-sm text-neutral-500">Select a session with documents to discover key insights</p>
            </div>
            <SessionPicker selectedSessionId={sessionId} onSelect={setSessionId} />
            <Button className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50" onClick={handleGenerate} disabled={!sessionId}>
              <Sparkles className="mr-2 size-4" />
              Generate Insights
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
              <p className="font-medium text-red-700">Extraction Failed</p>
              <p className="mt-1 text-sm text-red-600/80">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isGenerating && !result && (
        <>
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Loader2 className="size-8 animate-spin text-rose-400" />
              <div className="text-center">
                <p className="font-medium text-neutral-700">Extracting insights...</p>
                <p className="mt-0.5 text-xs text-neutral-400">AI is analyzing patterns in your documents</p>
              </div>
            </CardContent>
          </Card>
          {/* Skeleton insight cards */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-l-4 border-l-neutral-200 border-dashed">
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5">
              <Target className="size-3" />
              {insights.length} insights found
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <BarChart3 className="size-3" />
              {result.split(/\s+/).filter(Boolean).length} words
            </Badge>
          </div>

          {/* Insight Cards */}
          <AnimatePresence>
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-rose-400">
                    <CardContent className="p-5">
                      <h3 className="font-bricolage text-base font-semibold text-neutral-900">{insight.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{insight.body}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{result}</div>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>

          {/* Raw markdown fallback */}
          {insights.length === 0 && result && (
            <Card size="sm">
              <CardContent className="max-h-64 overflow-y-auto p-4">
                <pre className="whitespace-pre-wrap text-xs text-neutral-600">{result}</pre>
              </CardContent>
            </Card>
          )}

          {/* New insight button */}
          {!isGenerating && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => { setResult(null); setInsights([]); }}>
                <Sparkles className="mr-2 size-4" />
                Generate New Insights
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {!result && !isGenerating && (
        <Card size="sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <Lightbulb className="size-4 text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-700">How it works</p>
                <ul className="space-y-0.5 text-[11px] text-neutral-500">
                  <li>• Upload documents in chat first, then select that session here</li>
                  <li>• AI extracts key findings, patterns, and actionable insights</li>
                  <li>• Use insights to guide research or decision-making</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
