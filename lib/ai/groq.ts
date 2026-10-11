import { createOpenAI } from "@ai-sdk/openai";

const groqClient = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const model = groqClient("llama-3.3-70b-versatile");
