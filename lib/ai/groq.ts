import { createOpenAI } from "@ai-sdk/openai";

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Primary: 20B — fast, production-grade
export const model = groq.chat("openai/gpt-oss-20b");
// Fallback 1: 120B — same limits but separate queue
export const modelLarge = groq.chat("openai/gpt-oss-120b");
// Fallback 2: Qwen 27B — different model family, independent queue
export const modelQwen = groq.chat("qwen/qwen3.6-27b");
