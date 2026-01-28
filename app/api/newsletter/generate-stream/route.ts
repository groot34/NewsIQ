import { model } from "@/lib/ai/groq";
import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getUserSettingsByUserId } from "@/actions/user-settings";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  buildArticleSummaries,
  buildNewsletterPrompt,
} from "@/lib/newsletter/prompt-builder";
import { prepareFeedsAndArticles } from "@/lib/rss/feed-refresh";

export const maxDuration = 300;

const NewsletterSchema = z.object({
  suggestedTitles: z.array(z.string()).length(5),
  suggestedSubjectLines: z.array(z.string()).length(5),
  body: z.string(),
  topAnnouncements: z.array(z.string()).length(5),
  additionalInfo: z.string().optional(),
});

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
      }) +
      `
IMPORTANT RULES:
- You must output VALID JSON only.
- Do not output markdown code blocks (\`\`\`json ... \`\`\`), just the raw JSON string.
- The JSON object must strictly follow this schema:
{
  "suggestedTitles": ["string", "string", "string", "string", "string"],
  "suggestedSubjectLines": ["string", "string", "string", "string", "string"],
  "body": "string (markdown allowed, MUST use \\n for newlines, NO literal newlines)",
  "topAnnouncements": ["string", "string", "string", "string", "string"],
  "additionalInfo": "string (optional)"
}
- Return EXACTLY 5 suggestedTitles
- Return EXACTLY 5 suggestedSubjectLines
- Return EXACTLY 5 topAnnouncements
- Strings must NOT contain literal newlines or control characters. Escape them (e.g., \\n).
`;

    console.log("Starting streamText generation...");
    // Reverting to streamText because streamObject/json_schema is not supported by this Groq model
    const result = streamText({
      model,
      prompt,
      // @ts-expect-error Groq provider supports this
      response_format: { type: 'json_object' },
      onFinish: ({ text, usage }: { text: string; usage: any }) => {
        console.log("Generation finished. Length:", text.length);
        console.log("Snippet:", text.substring(0, 100));
        console.log("Usage:", usage);
      },
    });

    return result.toTextStreamResponse();
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Failed to generate newsletter";
    
    if (message.includes("No articles found")) {
      return Response.json({ error: message }, { status: 404 });
    }
    
    return Response.json({ error: message }, { status: 500 });
  }
}
