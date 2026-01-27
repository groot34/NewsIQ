"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import { prisma } from "@/lib/prisma";
import {
  type ArticleData,
  fetchAndParseFeed,
  parseFeedUrl,
} from "@/lib/rss/parser";
import { bulkCreateRssArticles } from "./rss-article";
import { updateFeedLastFetched } from "./rss-feed";

export async function validateAndAddFeed(userId: string, url: string) {
  return wrapDatabaseOperation(async () => {
    try {
      await parseFeedUrl(url);
    } catch (error) {
      throw new Error(`Invalid RSS feed`);
    }

    const feed = await prisma.rssFeed.create({
      data: { userId, url },
    });

    try {
      const result = await fetchAndStoreFeed(feed.id);

      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: result.metadata,
      });

      return {
        feed,
        articlesCreated: result.created,
        articlesSkipped: result.skipped,
      };
    } catch {
      return {
        feed,
        articlesCreated: 0,
        articlesSkipped: 0,
      };
    }
  }, "validate and add feed");
}

export async function fetchAndStoreFeed(feedId: string) {
  return wrapDatabaseOperation(async () => {
    const feed = await prisma.rssFeed.findUnique({ where: { id: feedId } });
    if (!feed) throw new Error("Feed not found");

    const { metadata, articles } = await fetchAndParseFeed(feed.url, feedId);

    const result = await bulkCreateRssArticles(
      articles.map((a: ArticleData) => ({
        feedId,
        ...a,
      })),
    );

    await updateFeedLastFetched(feedId);

    return {
      metadata,
      created: result.created,
      skipped: result.skipped,
      errors: result.errors,
    };
  }, "fetch and store feed");
}
