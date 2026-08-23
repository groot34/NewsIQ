import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { getUserSettingsByUserId } from "@/actions/user-settings";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  buildArticleSummaries,
  buildNewsletterPrompt,
} from "@/lib/newsletter/prompt-builder";
import { prepareFeedsAndArticles } from "@/lib/rss/feed-refresh";
import { model, modelLarge, modelQwen } from "@/lib/ai/groq";

// Vercel Pro: 60s max duration
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
- Body: 800–1200 words.
- No literal newlines inside string values — use \\n instead.
- Output MUST start with { and end with }.
`;

/** True for transient errors where a different model queue may succeed */
function isModelError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const msg = e.message.toLowerCase();
  return (
    msg.includes("overloaded") ||
    msg.includes("rate_limit") ||
    msg.includes("rate limit") ||
    msg.includes("request too large") ||
    msg.includes("503") ||
    msg.includes("413") ||
    msg.includes("429")
  );
}

/**
 * Tries models in order, yields text chunks.
 * Falls back to the next model on overload/rate-limit errors.
 */
async function* generateWithFallback(prompt: string): AsyncGenerator<string> {
  const models = [model, modelLarge, modelQwen] as const;
  const modelNames = ["gpt-oss-20b", "gpt-oss-120b", "qwen3.6-27b"];
  let lastError: unknown;

  for (let i = 0; i < models.length; i++) {
    try {
      const { textStream } = streamText({ model: models[i], prompt });
      for await (const chunk of textStream) {
        yield chunk;
      }
      return; // success — stop trying
    } catch (e) {
      if (isModelError(e)) {
        lastError = e;
        const next = modelNames[i + 1];
        console.warn(
          `[newsletter] ${modelNames[i]} failed${next ? `, trying ${next}` : " (no more fallbacks)"}:`,
          e instanceof Error ? e.message : e,
        );
        continue;
      }
      throw e; // non-retriable error — propagate immediately
    }
  }

  throw lastError ?? new Error("All models failed");
}

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

    // Convert AsyncGenerator → ReadableStream<Uint8Array> for the Response
    const encoder = new TextEncoder();
    const generator = generateWithFallback(prompt);

    const readable = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { value, done } = await generator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(encoder.encode(value));
        }
      },
      cancel() {
        // Clean up if the client disconnects
        generator.return?.("");
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Prevent Vercel edge / CDN from buffering — critical for streaming
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
        "X-Content-Type-Options": "nosniff",
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
