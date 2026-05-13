"use client";

import { createContext, useContext } from "react";

import { AIToolType } from "@/types/ai-tools";

interface ToolContextType {
  runTool: (tool: AIToolType) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({children,runTool,}: {
  children: React.ReactNode;
  runTool: (tool: AIToolType) => void;
}) {
  return (
    <ToolContext.Provider
      value={{
        runTool,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);

  if (!context) {
    throw new Error("useTool must be used inside ToolProvider");
  }

  return context;
}
