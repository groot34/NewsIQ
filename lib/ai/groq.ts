import { createOpenAI } from "@ai-sdk/openai";

const groqClient = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  name: "groq",
});

// .chat() uses /v1/chat/completions — Groq doesn't support /v1/responses
export const model = groqClient.chat("llama-3.3-70b-versatile");

