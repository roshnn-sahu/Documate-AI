"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  LayoutDashboard,
  BarChart3,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  bg: string;
}

const stats: StatCard[] = [
  {
    label: "Total Documents",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Queries Processed",
    value: "8,932",
    change: "+23.1%",
    trend: "up",
    icon: Search,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Avg Response Time",
    value: "1.2s",
    change: "-8.3%",
    trend: "down",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Active Users",
    value: "342",
    change: "+18.7%",
    trend: "up",
    icon: Users,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const weeklyActivity = [
  { day: "Mon", queries: 120, documents: 8 },
  { day: "Tue", queries: 245, documents: 12 },
  { day: "Wed", queries: 189, documents: 15 },
  { day: "Thu", queries: 312, documents: 20 },
  { day: "Fri", queries: 278, documents: 18 },
  { day: "Sat", queries: 156, documents: 5 },
  { day: "Sun", queries: 98, documents: 3 },
];

const topTopics = [
  { topic: "Retrieval-Augmented Generation", count: 342, growth: 28 },
  { topic: "Vector Embeddings", count: 289, growth: 22 },
  { topic: "Semantic Search", count: 231, growth: 35 },
  { topic: "Document Chunking", count: 198, growth: 15 },
  { topic: "Language Models", count: 167, growth: -5 },
  { topic: "Text Preprocessing", count: 145, growth: 12 },
  { topic: "Knowledge Graphs", count: 123, growth: 45 },
];

const recentInsights = [
  {
    title: "Search accuracy improved by 15%",
    description:
      "New embedding model shows significant improvement in semantic search relevance scores across all document categories.",
    impact: "positive",
    category: "Performance",
    date: "2 hours ago",
  },
  {
    title: "Most queried topic: RAG implementation",
    description:
      "Users are increasingly asking about RAG implementation patterns. Consider creating a dedicated guide.",
    impact: "info",
    category: "Trend",
    date: "5 hours ago",
  },
  {
    title: "Peak usage detected",
    description:
      "Highest query volume recorded between 2-4 PM EST. Consider scaling resources during this window.",
    impact: "neutral",
    category: "System",
    date: "1 day ago",
  },
  {
    title: "Document upload rate increasing",
    description:
      "Document uploads have grown 32% this week. Storage optimization recommended.",
    impact: "positive",
    category: "Growth",
    date: "2 days ago",
  },
];

const maxQuery = Math.max(...weeklyActivity.map((d) => d.queries));
const maxDoc = Math.max(...weeklyActivity.map((d) => d.documents));

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50">
            <Lightbulb className="size-5 text-rose-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">
              Insights
            </h1>
            <p className="text-xs text-neutral-500">
              Analytics and patterns from your documents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="xs" variant="ghost">
            <Filter className="mr-1.5 size-3.5" />
            Filter
          </Button>
          <Button size="xs" variant="outline">
            <Download className="mr-1.5 size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card size="sm" className="group/card transition-all duration-200 hover:shadow-md">
                <CardContent className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="size-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="size-3 text-rose-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`flex size-9 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`size-4 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {[
            { label: "Overview", value: "overview", icon: LayoutDashboard },
            { label: "Activity", value: "activity", icon: BarChart3 },
            { label: "Topics", value: "topics", icon: Hash },
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <TabsTrigger key={filter.value} value={filter.value}>
                <Icon className="mr-1.5 size-3.5" />
                {filter.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2">
                {weeklyActivity.map((day) => (
                  <div
                    key={day.day}
                    className="group relative flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex w-full flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-t bg-rose-100 transition-all duration-200 group-hover:bg-rose-200"
                        style={{
                          height: `${(day.queries / maxQuery) * 120}px`,
                        }}
                      />
                      <div
                        className="w-full rounded-t bg-amber-100 transition-all duration-200 group-hover:bg-amber-200"
                        style={{
                          height: `${(day.documents / maxDoc) * 60}px`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500">
                      {day.day}
                    </span>
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="whitespace-nowrap rounded-lg bg-neutral-800 px-2.5 py-1.5 text-xs text-white shadow-lg">
                        <p>{day.queries} queries</p>
                        <p>{day.documents} documents</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded bg-rose-100" />
                  <span className="text-xs text-neutral-500">Queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded bg-amber-100" />
                  <span className="text-xs text-neutral-500">Documents</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentInsights.map((insight) => (
                <div
                  key={insight.title}
                  className="group rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-neutral-200 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`border text-[10px] ${
                        insight.impact === "positive"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : insight.impact === "info"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {insight.category}
                    </Badge>
                    <span className="text-[10px] text-neutral-400">
                      {insight.date}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-neutral-800">
                    {insight.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    {insight.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyActivity.map((day) => (
                  <div key={day.day} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-700">
                        {day.day}
                      </span>
                      <span className="text-neutral-500">
                        {day.queries} queries
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <motion.div
                        className="h-full rounded-full bg-(image:--color-theme-gradient)"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(day.queries / maxQuery) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topTopics.map((topic, index) => (
                  <div
                    key={topic.topic}
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-neutral-50"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-[11px] font-bold text-neutral-500">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">
                        {topic.topic}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {topic.count} queries
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {topic.growth >= 0 ? (
                        <ArrowUpRight className="size-3.5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="size-3.5 text-rose-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          topic.growth >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {Math.abs(topic.growth)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
