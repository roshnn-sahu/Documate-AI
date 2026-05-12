import React from "react";
import {
  Sparkles,
  X,
  ChevronDown,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Home,
  MoreVertical,
  Bot,
} from "lucide-react";
import { HeroGradient } from "./hero-gradient";
import { Badge } from "./ui/badge";

const heroSection = () => {
  return (
    <main className="relative z-10 mx-auto flex flex-col items-center overflow-hidden rounded-2xl pt-[180px] pb-32">
      <HeroGradient />
      <Badge className="bg-linear-to-br from-rose-400 to-orange-400">
        AI Chatbot <Bot className="font-bold" strokeWidth={2.25} />
      </Badge>

      {/* Hero Headline */}
      <div className="relative z-20 mx-auto mb-12 max-w-6xl space-y-6 text-center">
        <h1 className="bg-linear-to-b from-neutral-900 to-neutral-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
          Chat with your document <br className="hidden md:block" /> using AI
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-[#64748b] md:text-xl">
          Upload PDFs,cdocs or notes and get instant, context-aware answers in
          seconds pusing Ai-powered sementic search.
        </p>
      </div>

      {/* Central Interactive Graphic */}
      <CenteralIntractiveGraphics />
      {/* Call To Action */}
      <div className="relative z-30 mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-full rounded-full bg-[#1e293b] px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-xl shadow-slate-200/50 transition-all duration-200 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-300 sm:w-auto">
          Try for free
        </button>
        <button className="w-full rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#1e293b] shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md sm:w-auto">
          Request a Demo
        </button>
      </div>
    </main>
  );
};

export default heroSection;

const CenteralIntractiveGraphics = () => {
  return (
    <div className="relative mx-auto mt-6 flex h-auto min-h-[460px] w-full max-w-4xl items-center justify-center">
      {/* Main Chat Interface Window */}
      <div className="relative z-50 flex w-full max-w-[380px] flex-col rounded-[32px] border border-white bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <X
            className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
            strokeWidth={2.5}
          />
          <span className="text-sm font-semibold text-gray-700">New chat</span>
          <Sparkles className="h-5 w-5 text-rose-400" strokeWidth={2.5} />
        </div>

        {/* Glowing Center Core */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-orange-400 shadow-lg shadow-rose-200/50">
            <span className="text-2xl font-bold text-white">D</span>
            {/* Subtle outer glow */}
            <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-xl"></div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="mb-20 space-y-4 text-[13px]">
          <div className="max-w-[90%] rounded-[20px] rounded-tl-sm border border-gray-100 bg-[#f8fafc] p-4 leading-relaxed text-gray-600 shadow-sm">
            Provide a detailed summary of my company's latest investment
            including key metrics.
          </div>
          <div className="ml-auto max-w-[85%] self-end rounded-[20px] rounded-tr-sm border border-gray-100 bg-white p-4 leading-relaxed text-gray-600 shadow-sm transition-all hover:shadow-md">
            What are the key performance trends for my company this quarter?
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="absolute right-6 bottom-6 left-6">
          <div className="rounded-full bg-gradient-to-r from-rose-400 via-orange-300 to-yellow-300 p-[2px] shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center rounded-full bg-white px-3 py-[9px]">
              <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-400 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Ask or search for anything"
                className="flex-1 cursor-pointer bg-transparent text-[13px] font-medium whitespace-nowrap text-gray-700 placeholder-gray-400 outline-none"
                readOnly
              />
              <div className="ml-2 shrink-0 rounded-full border border-gray-200 p-1 text-gray-400 transition-colors hover:bg-gray-50">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Flanking Data Cards --- */}

      {/* Left Column Data Components */}
      <div className="absolute top-[2%] left-[2%] z-10 hidden w-[240px] lg:block xl:left-[8%]">
        {/* Stat Pill 1 */}
        <div className="group absolute top-8 left-4 z-20 flex w-[230px] -rotate-[3deg] transform cursor-default items-center gap-3 rounded-[20px] border border-gray-50 bg-white p-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:rotate-0">
          <div className="shrink-0 rounded-full bg-orange-50 p-2.5 transition-colors group-hover:bg-orange-100">
            <PieChart className="h-5 w-5 text-orange-400" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="text-lg leading-tight font-[800] text-gray-800">
              48%
            </div>
            <div className="mt-0.5 text-[10px] leading-tight font-medium text-gray-500">
              The Best Deals for this year!
            </div>
          </div>
          <MoreVertical className="absolute top-2.5 right-1.5 h-4 w-4 text-gray-300" />
        </div>

        {/* Stat Pill 2 */}
        <div className="group absolute top-[80px] left-8 z-10 flex w-[230px] rotate-2 transform cursor-default items-center gap-3 rounded-[20px] border border-gray-50 bg-white p-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:rotate-0">
          <div className="shrink-0 rounded-full bg-purple-50 p-2.5 transition-colors group-hover:bg-purple-100">
            <Home className="h-5 w-5 text-purple-500" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="text-lg leading-tight font-[800] text-gray-800">
              68%
            </div>
            <div className="mt-0.5 text-[10px] leading-tight font-medium text-gray-500">
              in this year's art race
            </div>
          </div>
          <MoreVertical className="absolute top-2.5 right-1.5 h-4 w-4 text-gray-300" />
        </div>
      </div>

      {/* Bottom Left Sales Card */}
      <div className="absolute bottom-[-4%] left-[6%] z-30 hidden w-[190px] -rotate-[4deg] transform rounded-3xl border border-gray-50 bg-white p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 lg:block xl:left-[12%]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1] text-white shadow-lg shadow-indigo-200/50">
          <BarChart3 className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-extrabold text-gray-800">Sales</span>
          <span className="flex items-center rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600">
            +5.9% <ArrowUpRight className="ml-[1px] h-3 w-3" />
          </span>
        </div>
        <div className="mb-1 text-[22px] font-[800] text-gray-900">
          $7,854.21
        </div>
        <div className="text-[10px] font-medium text-gray-400">
          Previous year ($2,134.01)
        </div>
      </div>

      {/* Right Column Data Components */}

      {/* Top Right Chart Card */}
      <div className="absolute top-[5%] right-[2%] z-10 hidden w-[200px] rotate-[5deg] transform rounded-3xl border border-gray-50 bg-white p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 lg:block xl:right-[8%]">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Sales Figures</span>
          <div className="flex gap-0.5">
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-orange-400 shadow-sm shadow-orange-200"></div>
          <div className="text-xl font-[800] tracking-tight text-gray-900">
            $4,686.82
          </div>
        </div>
        <div className="mb-3 text-[10px] font-medium text-gray-400">
          Upcoming Sales
        </div>
        <div className="flex h-12 items-end gap-[6px]">
          <div className="h-[40%] w-full rounded bg-orange-100 transition-colors hover:bg-orange-200"></div>
          <div className="h-[60%] w-full rounded bg-gray-100 transition-colors hover:bg-gray-200"></div>
          <div className="h-[30%] w-full rounded bg-gray-100 transition-colors hover:bg-gray-200"></div>
          <div className="h-[100%] w-full rounded bg-orange-400 shadow-sm transition-colors hover:bg-orange-500"></div>
          <div className="h-[70%] w-full rounded bg-gray-100 transition-colors hover:bg-gray-200"></div>
        </div>
      </div>

      {/* Bottom Right Performance Card */}
      <div className="absolute right-[0%] bottom-[-1%] z-30 hidden w-[220px] rotate-[2deg] transform rounded-3xl border border-gray-50 bg-white p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 lg:block xl:right-[6%]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-700">
            Average Total Sales
          </span>
          <div className="flex gap-[3px]">
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Radial Progress Display */}
        <div className="relative mb-5 flex justify-center">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f1f5f9"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#a855f7"
              strokeWidth="6"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset="30.14"
              strokeLinecap="round"
              className="drop-shadow-sm transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 mt-0.5 flex flex-col items-center justify-center">
            <span className="text-xl font-[800] tracking-tight text-gray-900">
              88%
            </span>
            <span className="mt-0.5 w-12 text-center text-[7px] leading-[1.2] font-bold tracking-tight text-purple-500 uppercase">
              Target Reached SV
            </span>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <div className="flex flex-col">
            <span className="mb-0.5 text-[9px] font-semibold text-gray-400">
              Average Sales
            </span>
            <span className="text-xs font-[800] text-gray-800">$4,277.86</span>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="flex flex-col text-right">
            <span className="mb-0.5 text-[9px] font-semibold text-gray-400">
              Average Products
            </span>
            <span className="text-xs font-[800] text-gray-800">$2,572.75</span>
          </div>
        </div>
      </div>
    </div>
  );
};
