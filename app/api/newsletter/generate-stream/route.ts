import type { NextRequest } from "next/server";
import { getUserSettingsByUserId } from "@/actions/user-settings";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  buildArticleSummaries,
  buildNewsletterPrompt,
} from "@/lib/newsletter/prompt-builder";
import { prepareFeedsAndArticles } from "@/lib/rss/feed-refresh";
import { groq } from "@/lib/ai/groq";

// Vercel Pro: 60s max - streaming bypasses timeout
export const maxDuration = 60;

const JSON_RULES = `
IMPORTANT RULES:
- Output VALID JSON only. No markdown fences (\`\`\`json), no commentary, no preamble.
- Strictly follow this schema:
{
  "suggestedTitles": ["string","string","string","string","string"],
  "suggestedSubjectLines": ["string","string","string","string","string"],
  "topAnnouncements": ["string","string","string","string","string"],
  "additionalInfo": "string (supplementary insights, or empty string)",
  "body": "string (comprehensive newsletter formatted in rich Markdown with ## section headers, ### subheadings, **bold highlights**, bullet lists, and > quotes)"
}
- EXACTLY 5 suggestedTitles, EXACTLY 5 suggestedSubjectLines, EXACTLY 5 topAnnouncements.
- Body should be 600–1000 words: well-structured, engaging, and professional.
- Output MUST start with { and end with }.
`;

export async function POST(req: NextRequest) {
  try {
    const { feedIds, startDate, endDate, userInput } = await req.json();

    const user = await getCurrentUser();
    const settings = await getUserSettingsByUserId(user.id);

    const articles = await prepareFeedsAndArticles({
      feedIds,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const prompt =
      buildNewsletterPrompt({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        articleSummaries: buildArticleSummaries(articles),
        articleCount: articles.length,
        userInput,
        settings,
      }) + JSON_RULES;

    console.log(`[newsletter] Starting Groq stream`);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 2500,
      top_p: 1,
      stream: true,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("[newsletter] Stream error:", error);
          controller.error(error);
        }
      },
    });

    console.log(`[newsletter] Streaming response ready`);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[newsletter] Generation error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to generate newsletter";

    if (message.includes("No articles found")) {
      return Response.json({ error: message }, { status: 404 });
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
