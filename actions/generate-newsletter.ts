"use server";

import { model } from "@/lib/ai/groq";
import { streamObject } from "ai";
import { z } from "zod";
import { checkIsProUser, getCurrentUser } from "@/lib/auth/helpers";
import {
  buildArticleSummaries,
  buildNewsletterPrompt,
} from "@/lib/newsletter/prompt-builder";
import { prepareFeedsAndArticles } from "@/lib/rss/feed-refresh";
import { createNewsletter } from "./newsletter";
import { getUserSettingsByUserId } from "./user-settings";

const NewsletterSchema = z.object({
  suggestedTitles: z.array(z.string()).length(5),
  suggestedSubjectLines: z.array(z.string()).length(5),
  body: z.string(),
  topAnnouncements: z.array(z.string()).length(5),
  additionalInfo: z.string().optional(),
});

export type GeneratedNewsletter = z.infer<typeof NewsletterSchema>;

export async function generateNewsletterStream(params: {
  feedIds: string[];
  startDate: Date;
  endDate: Date;
  userInput?: string;
}) {
  const user = await getCurrentUser();
  const settings = await getUserSettingsByUserId(user.id);

  const articles = await prepareFeedsAndArticles(params);
  const articleSummaries = buildArticleSummaries(articles);

  const prompt =
    buildNewsletterPrompt({
      startDate: params.startDate,
      endDate: params.endDate,
      articleSummaries,
      articleCount: articles.length,
      userInput: params.userInput,
      settings,
    }) +
    `
IMPORTANT RULES:
- Return EXACTLY 5 suggestedTitles
- Return EXACTLY 5 suggestedSubjectLines
- Return EXACTLY 5 topAnnouncements
- Do NOT omit any schema field
- Output MUST strictly match the JSON schema
`;

  const { partialObjectStream } = await streamObject({
    model,
    schema: NewsletterSchema,
    prompt,
  });

  return {
    stream: partialObjectStream,
    articlesAnalyzed: articles.length,
  };
}

export async function saveGeneratedNewsletter(params: {
  newsletter: GeneratedNewsletter;
  feedIds: string[];
  startDate: Date;
  endDate: Date;
  userInput?: string;
}) {
  /* Pro plan check removed */

  const user = await getCurrentUser();

  return await createNewsletter({
    userId: user.id,
    suggestedTitles: params.newsletter.suggestedTitles,
    suggestedSubjectLines: params.newsletter.suggestedSubjectLines,
    body: params.newsletter.body,
    topAnnouncements: params.newsletter.topAnnouncements,
    additionalInfo: params.newsletter.additionalInfo,
    startDate: params.startDate,
    endDate: params.endDate,
    userInput: params.userInput,
    feedsUsed: params.feedIds,
  });
}
