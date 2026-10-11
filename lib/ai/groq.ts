import { createOpenAI } from "@ai-sdk/openai";

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// llama-3.3-70b-versatile is fast and reliable for JSON output
export const model = groq.chat("llama-3.3-70b-versatile");
