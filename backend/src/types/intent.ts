// src/types/intent.ts
export interface BaseIntent {
  name: string;
  keywords: string[];
  requiredKeywords?: string[];
  boostWords?: string[];
  weight?: number;
  minConfidence?: number;
  maxConfidence?: number;
}

// This is the correct type – async OR sync execute
export interface ExecutableIntent extends BaseIntent {
  execute: (
    message: string,
    entities: any,
    sessionId: string
  ) => Promise<string> | string;
}