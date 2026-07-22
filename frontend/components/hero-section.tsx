"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  BarChart3,
  FileText,
  Bot,
  BotIcon,
  Send,
  Check,
  MessageSquare,
  Search,
  Zap,
} from "lucide-react";
import { HeroGradient } from "./hero-gradient";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";

/* ─── Animated counter ─── */
function AnimatedCounter({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(decimals)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Typing indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="size-1.5 rounded-full bg-rose-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="ml-2 text-xs text-gray-400">AI is thinking...</span>
    </div>
  );
}

/* ─── Animated bar chart ─── */
function AnimatedBarChart() {
  const bars = [
    { height: "80%", color: "bg-orange-400" },
    { height: "50%", color: "bg-gray-200" },
    { height: "35%", color: "bg-gray-200" },
    { height: "100%", color: "bg-orange-400" },
    { height: "65%", color: "bg-gray-200" },
  ];

  return (
    <div className="flex h-14 items-end gap-1.5">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={`w-full rounded-t ${bar.color}`}
          initial={{ height: 0 }}
          whileInView={{ height: bar.height }}
          viewport={{ once: true }}            transition={{ duration: 0.6, delay: 1.0 + i * 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
    </div>
  );
}



/* ─── Floating particles ─── */
function FloatingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-rose-300/40"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -20, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ═══════════════════════════════ MAIN HERO ═══════════════════════════════ */

const MESSAGES = [
  "Summarize the key findings from my research paper on climate change...",
  "What are the main conclusions in my Q4 financial report?",
  "Compare the revenue projections across all three departments.",
];

export default function HeroSection() {
  const [showTyping, setShowTyping] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Typing indicator cycle
  useEffect(() => {
    const show = setTimeout(() => setShowTyping(true), 2500);
    const hide = setTimeout(() => {
      setShowTyping(false);
      setActiveMessage((p) => (p + 1) % MESSAGES.length);
    }, 4500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [activeMessage]);

  return (
    <main
      ref={sectionRef}
      className="relative z-10 mx-auto flex min-h-screen flex-col items-center overflow-hidden px-4 pt-40 pb-20"
    >
      
      <HeroGradient className="rounded-xl" />

      {/* ── Floating particles ── */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { x: 10, y: 20, d: 0 },
          { x: 85, y: 15, d: 0.8 },
          { x: 20, y: 70, d: 1.6 },
          { x: 75, y: 65, d: 2.4 },
          { x: 50, y: 10, d: 0.4 },
          { x: 30, y: 85, d: 1.2 },
          { x: 90, y: 45, d: 2.0 },
          { x: 5, y: 50, d: 2.8 },
        ].map((p, i) => (
          <FloatingParticle key={i} x={p.x} y={p.y} delay={p.d} />
        ))}
      </div>

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <Badge className="gap-2 bg-linear-to-br from-rose-500 to-orange-500 px-4 py-3  text-xs lg:text-sm font-semibold text-white shadow-lg shadow-rose-500/25">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bot className="size-4" strokeWidth={2.5} />
          </motion.div>
          AI-Powered Document Search
          <Sparkles className="size-3.5" />
        </Badge>
      </motion.div>

      {/* ── Headline ── */}
      <div className="relative z-20 mx-auto mb-8 max-w-4xl space-y-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bricolage text-5xl leading-[1.1] font-bold tracking-tight text-neutral-900 md:text-6xl lg:text-7xl"
        >
          Chat with your{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-rose-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              documents
            </span>
            <motion.span
              className="absolute -right-2 -bottom-1 h-3 w-full rounded-full bg-linear-to-r from-rose-400 to-orange-400 opacity-30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </span>{" "}
          using AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl"
        >
          Upload PDFs, docs or notes and get instant, context-aware answers
          in seconds using AI-powered semantic search.
        </motion.p>
      </div>

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-30 mb-20 flex flex-col items-center gap-4 sm:flex-row"
      >
        <motion.div  whileTap={{ scale: 0.97 }}>
          <Link
            href="/signup"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-neutral-900/20 transition-shadow hover:shadow-2xl hover:shadow-neutral-900/30"
          >
            <Zap className="size-4" />
            Try for free
            <motion.span
              className="absolute inset-0 bg-linear-to-r from-rose-500/0 via-rose-500/20 to-rose-500/0"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </Link>
        </motion.div>

        <motion.div  whileTap={{ scale: 0.97 }}>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-8 py-4 text-sm font-semibold text-neutral-700 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white hover:shadow-lg"
          >
            <MessageSquare className="size-4" />
            See it in action
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Hero Visual: Chat Window + Flanking Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex w-full max-w-5xl items-center justify-center"
      >
        {/* ──── Left cards ──── */}
        <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 lg:block xl:-left-8">
          {/* Card 1: Documents */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="mb-4 flex w-52 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-lg shadow-slate-200/40 backdrop-blur-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <FileText className="size-5 text-orange-500" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900">
                <AnimatedCounter target={1247} />
              </div>
              <div className="text-[10px] font-medium text-gray-400">Docs indexed</div>
            </div>
          </motion.div>

          {/* Card 2: Accuracy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex w-52 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-lg shadow-slate-200/40 backdrop-blur-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <Check className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900">94%</div>
              <div className="text-[10px] font-medium text-gray-400">Accuracy rate</div>
            </div>
          </motion.div>
        </div>

        {/* ──── Main Chat Window ──── */}
        <motion.div
         
          className="relative z-50 mx-auto w-full max-w-md "
        >
          {/* Glow behind */}
          <div className="absolute -inset-4 rounded-[40px] bg-linear-to-br from-rose-400/20 via-orange-400/10 to-amber-400/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl ">
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400" />
                <div className="size-2.5 rounded-full bg-yellow-400" />
                <div className="size-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-semibold text-gray-400">Documate AI</span>
              <div className="size-2.5" />
            </div>

            {/* Chat body */}
            <div className="space-y-4 px-5 py-6 min-h-[250px]">
              {/* User message 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="ml-auto max-w-[85%]"
              >
                <div className="rounded-2xl rounded-tr-sm bg-neutral-900 px-4 py-3 text-sm leading-relaxed text-white shadow-md">
                  {MESSAGES[activeMessage]}
                </div>
              </motion.div>

              {/* AI response (with typing) */}
              <AnimatePresence mode="wait">
                {showTyping ? (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-orange-500 shadow-sm">
                      <BotIcon className="size-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50">
                      <TypingIndicator />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`response-${activeMessage}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-orange-500 shadow-sm">
                      <BotIcon className="size-3.5 text-white" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
                      Based on your uploaded documents, here are the key findings. I found 3 relevant sections across 2 documents that address your question...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="border-t border-slate-100 px-4 py-3">
              <div className=" flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 shadow-sm">
                <Search className="size-4 text-neutral-600" />
                <span className="flex-1 text-sm text-neutral-600">Ask about your documents...</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-orange-500"
                >
                  <Send className="size-3.5 text-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ──── Right cards ──── */}
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block xl:-right-8">
          {/* Card 3: Chunks */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="mb-4 flex w-52 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-lg shadow-slate-200/40 backdrop-blur-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <BarChart3 className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900">
                <AnimatedCounter target={48291} />
              </div>
              <div className="text-[10px] font-medium text-gray-400">Chunks processed</div>
            </div>
          </motion.div>

          {/* Card 4: Speed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex w-52 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-lg shadow-slate-200/40 backdrop-blur-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Zap className="size-5 text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900">1.2s</div>
              <div className="text-[10px] font-medium text-gray-400">Avg response</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom stat bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="relative z-20 mt-20 flex flex-wrap items-center justify-center gap-8 text-center"
      >
        {[
          { label: "Documents Indexed", target: 1247, suffix: "" },
          { label: "Accuracy Rate", target: 94, suffix: "%" },
          { label: "Avg Response", target: 1.2, suffix: "s", decimals: 1 },
          { label: "Chunks Processed", target: 48, suffix: "K+" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5 + i * 0.1 }}
            className="flex flex-col items-center"
          >
            <span className="text-2xl font-extrabold text-neutral-900 md:text-3xl">
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
            </span>
            <span className="mt-1 text-xs font-medium text-gray-400">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
