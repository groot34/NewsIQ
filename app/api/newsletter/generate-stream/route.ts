import { generateText } from "ai";
import type { NextRequest } from "next/server";
import { getUserSettingsByUserId } from "@/actions/user-settings";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  buildArticleSummaries,
  buildNewsletterPrompt,
} from "@/lib/newsletter/prompt-builder";
import { prepareFeedsAndArticles } from "@/lib/rss/feed-refresh";
import { model } from "@/lib/ai/groq";

// Vercel Pro: 60s max
export const maxDuration = 60;

const JSON_RULES = `
IMPORTANT RULES:
- Output VALID JSON only. No markdown fences, no commentary, no preamble.
- Strictly follow this schema:
{
  "suggestedTitles": ["string","string","string","string","string"],
  "suggestedSubjectLines": ["string","string","string","string","string"],
  "topAnnouncements": ["string","string","string","string","string"],
  "additionalInfo": "string (optional insights, or empty string)",
  "body": "string (newsletter body, markdown OK, escape newlines as \\n)"
}
- EXACTLY 5 suggestedTitles, EXACTLY 5 suggestedSubjectLines, EXACTLY 5 topAnnouncements.
- Body: 600–1000 words, comprehensive and insightful.
- No literal newlines inside string values — use \\n instead.
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

    const { text } = await generateText({
      model,
      prompt,
      maxOutputTokens: 3500,
    });

    console.log(`[newsletter] Successfully generated newsletter (${text.length} chars)`);

    return new Response(text, {
      status: 200,
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
