import { createOpenAI } from "@ai-sdk/openai";

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// openai/gpt-oss-120b is tested & verified to output clean, complete JSON.
export const model = groq.chat("openai/gpt-oss-120b");
