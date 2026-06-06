"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  BrainCircuit,
  BarChart3,
  BookOpen,
  ArrowRight,
  Zap,
  GraduationCap,
  Lightbulb,
  ScrollText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const workspaceTools = [
  {
    id: "summarize",
    title: "Summarize",
    description: "Get concise AI-powered summaries of your documents in seconds",
    icon: ScrollText,
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    iconColor: "text-violet-600",
    href: "/workspace/summrize",
    stats: "2x faster reading",
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Create interactive flashcards from your content for effective revision",
    icon: GraduationCap,
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    href: "/workspace/flashcards",
    stats: "Boost retention",
  },
  {
    id: "notes",
    title: "Notes",
    description: "Capture, organize and manage your notes with AI assistance",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    iconColor: "text-amber-600",
    href: "/workspace/notes",
    stats: "Smart organization",
  },
  {
    id: "insights",
    title: "Insights",
    description: "Discover patterns, trends and key insights hidden in your documents",
    icon: Lightbulb,
    gradient: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    iconColor: "text-rose-600",
    href: "/workspace/insights",
    stats: "Data-driven",
  },
];

const quickStats = [
  {
    label: "Documents",
    value: "12",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Flashcards",
    value: "48",
    icon: BrainCircuit,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Notes",
    value: "23",
    icon: BookOpen,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Insights",
    value: "156",
    icon: BarChart3,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export default function WorkspacePage() {
  const router = useRouter();
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-(image:--color-theme-gradient) shadow-lg shadow-rose-200/50">
            <Zap className="size-5 text-white" />
          </div>
          <div>
            <h1 className="font-bricolage text-2xl font-bold text-neutral-900">
              AI Workspace
            </h1>
            <p className="text-sm text-neutral-500">
              Supercharge your productivity with AI-powered tools
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card size="sm" className="group/card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="flex items-center gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bricolage text-lg font-semibold text-neutral-800">
            AI Tools
          </h2>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="size-3" />
            Powered by AI
          </Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {workspaceTools.map((tool, index) => {
            const Icon = tool.icon;
            const isHovered = hoveredTool === tool.id;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <Card
                  className={`group cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isHovered ? "border-neutral-300/50 shadow-lg" : "border-transparent"
                  }`}
                  onClick={() => router.push(tool.href)}
                >
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex size-12 items-center justify-center rounded-xl ${tool.lightBg} transition-all duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`size-6 ${tool.iconColor}`} />
                      </div>
                      <motion.div
                        animate={{ x: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="rounded-full"
                        >
                          <ArrowRight className="size-4" />
                        </Button>
                      </motion.div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-bricolage text-lg font-semibold text-neutral-900">
                        {tool.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${tool.iconColor.replace("text-", "bg-")}`} />
                      <span className="text-xs font-medium text-neutral-400">
                        {tool.stats}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <h2 className="font-bricolage text-lg font-semibold text-neutral-800">
          Recent Activity
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100">
              <Sparkles className="size-5 text-neutral-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-neutral-700">No recent activity</p>
              <p className="mt-0.5 text-sm text-neutral-400">
                Start using AI tools to see your activity here
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/uploads")}
            >
              Upload a document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

