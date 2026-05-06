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
    <main className="relative z-10 flex flex-col items-center pt-[180px] pb-32  rounded-2xl mx-auto  overflow-hidden">
      <HeroGradient />
      <Badge className="bg-linear-to-br from-rose-400 to-orange-400">
        AI Chatbot <Bot className="font-bold " strokeWidth={2.25}/>
      </Badge>
      
      {/* Hero Headline */}
      <div className="text-center max-w-6xl mx-auto mb-12 space-y-6 relative z-20">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight">
          Chat with your document <br className="hidden md:block" /> using AI
        </h1>
        <p className="text-[#64748b] text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Upload PDFs,cdocs or notes and get instant, context-aware answers in
          seconds pusing Ai-powered sementic search.
        </p>
      </div>  

      {/* Central Interactive Graphic */}
      <CenteralIntractiveGraphics />
      {/* Call To Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4  mt-16 relative z-30">
        <button className="w-full sm:w-auto bg-[#1e293b] hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300 text-sm tracking-wide">
          Try for free
        </button>
        <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#1e293b] border border-gray-200 px-8 py-3.5 rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm tracking-wide">
          Request a Demo
        </button>
      </div>
    </main>
  );
};

export default heroSection;

const CenteralIntractiveGraphics = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-auto min-h-[460px] flex items-center justify-center mt-6">
      {/* Main Chat Interface Window */}
      <div className="flex flex-col w-full max-w-[380px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-6 z-50 relative border border-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <X
            className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500 transition-colors"
            strokeWidth={2.5}
          />
          <span className="font-semibold text-gray-700 text-sm">New chat</span>
          <Sparkles className="w-5 h-5 text-rose-400" strokeWidth={2.5} />
        </div>

        {/* Glowing Center Core */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-200/50 relative">
            <span className="text-2xl font-bold text-white">D</span>
            {/* Subtle outer glow */}
            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 rounded-full"></div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="space-y-4 mb-20 text-[13px]">
          <div className="bg-[#f8fafc] rounded-[20px] rounded-tl-sm p-4 text-gray-600 leading-relaxed max-w-[90%] shadow-sm border border-gray-100">
            Provide a detailed summary of my company's latest investment
            including key metrics.
          </div>
          <div className="bg-white rounded-[20px] rounded-tr-sm p-4 text-gray-600 leading-relaxed max-w-[85%] self-end ml-auto shadow-sm border border-gray-100 transition-all hover:shadow-md">
            What are the key performance trends for my company this quarter?
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-full p-[2px] bg-gradient-to-r from-rose-400 via-orange-300 to-yellow-300 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="bg-white rounded-full flex items-center px-3 py-[9px]">
              <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center mr-3 shrink-0 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Ask or search for anything"
                className="flex-1 outline-none text-[13px] text-gray-700 bg-transparent placeholder-gray-400 font-medium whitespace-nowrap cursor-pointer"
                readOnly
              />
              <div className="text-gray-400 border border-gray-200 rounded-full p-1 ml-2 shrink-0 hover:bg-gray-50 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Flanking Data Cards --- */}

      {/* Left Column Data Components */}
      <div className="hidden lg:block absolute top-[2%] left-[2%] xl:left-[8%] z-10 w-[240px]">
        {/* Stat Pill 1 */}
        <div className="absolute top-8 left-4 w-[230px] bg-white rounded-[20px] p-3 shadow-xl flex items-center gap-3 z-20 border border-gray-50 transform -rotate-[3deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <div className="p-2.5 bg-orange-50 rounded-full shrink-0 group-hover:bg-orange-100 transition-colors">
            <PieChart className="w-5 h-5 text-orange-400" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-[800] text-gray-800 text-lg leading-tight">
              48%
            </div>
            <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
              The Best Deals for this year!
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-300 absolute top-2.5 right-1.5" />
        </div>

        {/* Stat Pill 2 */}
        <div className="absolute top-[80px] left-8 w-[230px] bg-white rounded-[20px] p-3 shadow-lg flex items-center gap-3 z-10 border border-gray-50 transform rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <div className="p-2.5 bg-purple-50 rounded-full shrink-0 group-hover:bg-purple-100 transition-colors">
            <Home className="w-5 h-5 text-purple-500" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-[800] text-gray-800 text-lg leading-tight">
              68%
            </div>
            <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
              in this year's art race
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-300 absolute top-2.5 right-1.5" />
        </div>
      </div>

      {/* Bottom Left Sales Card */}
      <div className="hidden lg:block absolute bottom-[-4%] left-[6%] xl:left-[12%] z-30 w-[190px] bg-white p-5 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transform -rotate-[4deg] hover:rotate-0 hover:-translate-y-2 transition-all duration-300 border border-gray-50">
        <div className="w-12 h-12 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center mb-5 shadow-lg shadow-indigo-200/50">
          <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-extrabold text-gray-800 text-sm">Sales</span>
          <span className="text-emerald-600 text-[10px] font-bold flex items-center bg-emerald-50 px-1 py-0.5 rounded tracking-wide">
            +5.9% <ArrowUpRight className="w-3 h-3 ml-[1px]" />
          </span>
        </div>
        <div className="text-[22px] font-[800] text-gray-900 mb-1">
          $7,854.21
        </div>
        <div className="text-[10px] font-medium text-gray-400">
          Previous year ($2,134.01)
        </div>
      </div>

      {/* Right Column Data Components */}

      {/* Top Right Chart Card */}
      <div className="hidden lg:block absolute top-[5%] right-[2%] xl:right-[8%] z-10 w-[200px] bg-white p-5 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transform rotate-[5deg] hover:rotate-0 hover:-translate-y-2 transition-all duration-300 border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-700 text-xs">Sales Figures</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-md bg-orange-400 shadow-sm shadow-orange-200"></div>
          <div className="font-[800] text-xl text-gray-900 tracking-tight">
            $4,686.82
          </div>
        </div>
        <div className="text-[10px] font-medium text-gray-400 mb-3">
          Upcoming Sales
        </div>
        <div className="flex items-end gap-[6px] h-12">
          <div className="w-full h-[40%] rounded bg-orange-100 hover:bg-orange-200 transition-colors"></div>
          <div className="w-full h-[60%] rounded bg-gray-100 hover:bg-gray-200 transition-colors"></div>
          <div className="w-full h-[30%] rounded bg-gray-100 hover:bg-gray-200 transition-colors"></div>
          <div className="w-full h-[100%] rounded bg-orange-400 shadow-sm hover:bg-orange-500 transition-colors"></div>
          <div className="w-full h-[70%] rounded bg-gray-100 hover:bg-gray-200 transition-colors"></div>
        </div>
      </div>

      {/* Bottom Right Performance Card */}
      <div className="hidden lg:block absolute bottom-[-1%] right-[0%] xl:right-[6%] z-30 w-[220px] bg-white p-5 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transform rotate-[2deg] hover:rotate-0 hover:-translate-y-2 transition-all duration-300 border border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-700 text-[11px]">
            Average Total Sales
          </span>
          <div className="flex gap-[3px]">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Radial Progress Display */}
        <div className="flex justify-center mb-5 relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5">
            <span className="text-xl font-[800] text-gray-900 tracking-tight">
              88%
            </span>
            <span className="text-[7px] font-bold text-purple-500 uppercase tracking-tight text-center w-12 leading-[1.2] mt-0.5">
              Target Reached SV
            </span>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-gray-400 mb-0.5">
              Average Sales
            </span>
            <span className="text-xs font-[800] text-gray-800">$4,277.86</span>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-semibold text-gray-400 mb-0.5">
              Average Products
            </span>
            <span className="text-xs font-[800] text-gray-800">$2,572.75</span>
          </div>
        </div>
      </div>
    </div>
  );
};
