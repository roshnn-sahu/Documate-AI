"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { AIToolType } from "@/types/ai-tools";

interface ToolContextType {
  runTool: (tool: AIToolType) => void;
  registerRunTool: (fn: (tool: AIToolType) => void) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const [runToolFn, setRunToolFn] = useState<(tool: AIToolType) => void>(
    () => () => {
      console.warn("No tool runner registered");
    },
  );

  const registerRunTool = useCallback((fn: (tool: AIToolType) => void) => {
    setRunToolFn(() => fn);
  }, []);

  const contextValue = useMemo(
    () => ({
      runTool: runToolFn,
      registerRunTool,
    }),
    [runToolFn, registerRunTool]
  );

  return (
    <ToolContext.Provider value={contextValue}>
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
