"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/helpers";
import { createNewsletter } from "./newsletter";

const NewsletterSchema = z.object({
  suggestedTitles: z.array(z.string()).length(5),
  suggestedSubjectLines: z.array(z.string()).length(5),
  body: z.string(),
  topAnnouncements: z.array(z.string()).length(5),
  additionalInfo: z.string().optional(),
});

export type GeneratedNewsletter = z.infer<typeof NewsletterSchema>;

// Note: streaming generation is handled by /api/newsletter/generate-stream route.
// This file only handles saving the completed newsletter.

export async function saveGeneratedNewsletter(params: {
  newsletter: GeneratedNewsletter;
  feedIds: string[];
  startDate: Date;
  endDate: Date;
  userInput?: string;
}) {
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
