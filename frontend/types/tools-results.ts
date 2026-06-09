import { AIToolType } from "./ai-tools";

export interface ToolsResults {
  tool: AIToolType;

  content: string;
}
