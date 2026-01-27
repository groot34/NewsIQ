"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import {
  FEED_ORDER_BY_CREATED_DESC,
  FEED_WITH_COUNT_INCLUDE,
} from "@/lib/database/prisma-helpers";
import { prisma } from "@/lib/prisma";

// ============================================
// RSS FEED ACTIONS
// ============================================

/**
 * Fetches all RSS feeds for a specific user with article counts
 */
export async function getRssFeedsByUserId(userId: string) {
  return wrapDatabaseOperation(async () => {
    return await prisma.rssFeed.findMany({
      where: {
        userId,
      },
      include: FEED_WITH_COUNT_INCLUDE,
      orderBy: FEED_ORDER_BY_CREATED_DESC,
    });
  }, "fetch RSS feeds");
}

/**
 * Updates the lastFetched timestamp for an RSS feed
 */
export async function updateFeedLastFetched(feedId: string) {
  return wrapDatabaseOperation(async () => {
    return await prisma.rssFeed.update({
      where: { id: feedId },
      data: {
        lastFetched: new Date(),
      },
    });
  }, "update feed last fetched");
}

/**
 * Permanently deletes an RSS feed and cleans up articles not referenced by other feeds
 */
export async function deleteRssFeed(feedId: string) {
  return wrapDatabaseOperation(async () => {
    // 1. Find all articles that reference this feed (either as primary or in sources)
    const articles = await prisma.rssArticle.findMany({
      where: {
        OR: [{ feedId: feedId }, { sourceFeedIds: { has: feedId } }],
      },
      select: {
        id: true,
        feedId: true,
        sourceFeedIds: true,
      },
    });

    // 2. Process each article linearly to ensure safety
    for (const article of articles) {
      // Remove the current feedId from the sources list
      const newSourceIds = article.sourceFeedIds.filter((id) => id !== feedId);

      if (newSourceIds.length === 0) {
        // If no sources left, delete the article completely
        await prisma.rssArticle.delete({
          where: { id: article.id },
        });
      } else {
        // If sources remain, we need to update the article
        const updates: any = {
          sourceFeedIds: newSourceIds,
        };

        // If the deleted feed was the primary one, we MUST assign a new primary
        if (article.feedId === feedId) {
          updates.feedId = newSourceIds[0]; // Promote first remaining source to primary
        }

        await prisma.rssArticle.update({
          where: { id: article.id },
          data: updates,
        });
      }
    }

    // 3. Finally, delete the feed itself
    // Now that all references are gone, this should succeed without P2014
    await prisma.rssFeed.delete({
      where: { id: feedId },
    });

    return { success: true };
  }, "delete RSS feed");
}
