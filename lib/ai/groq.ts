import OpenAI from "openai";

// Uses the official OpenAI SDK with Groq's OpenAI-compatible endpoint.
// This guarantees /v1/chat/completions — @ai-sdk/openai@3 routes through /v1/responses by default.
export const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const GROQ_MODEL = "openai/gpt-oss-120b";

