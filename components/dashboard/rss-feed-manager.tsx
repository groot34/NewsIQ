import { auth } from "@clerk/nextjs/server";
import { ExternalLink, Plus } from "lucide-react";
import { getRssFeedsByUserId } from "@/actions/rss-feed";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddFeedDialog } from "./add-feed-dialog";
import { DeleteFeedButton } from "./delete-feed-button";

interface RssFeed {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  lastFetched: Date | null;
  _count?: {
    articles: number;
  };
}

export async function RssFeedManager() {
  const { userId, has } = await auth();
  const isPro = true; // Unlimited for everyone
  const feedLimit = 5;

  const user = await upsertUserFromClerk(userId!);
  const feeds = (await getRssFeedsByUserId(user.id)) as RssFeed[];

  return (
    <Card className="transition-all hover:shadow-lg overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">RSS Feeds</CardTitle>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                feeds.length >= feedLimit 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {feeds.length}/{feedLimit}
              </span>
            </div>
            <CardDescription className="text-base">
              Manage your RSS feed sources{" "}
            </CardDescription>
          </div>
          <AddFeedDialog
            currentFeedCount={feeds.length}
            feedLimit={feedLimit}
            isPro={isPro}
            existingFeedUrls={feeds.map((f) => f.url)}
          />
        </div>
        {feeds.length >= feedLimit && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>You've reached the maximum of {feedLimit} feeds. Remove a feed to add a new one.</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {feeds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No RSS feeds added yet
            </div>
            <AddFeedDialog
              currentFeedCount={feeds.length}
              feedLimit={feedLimit}
              isPro={isPro}
              existingFeedUrls={feeds.map((f) => f.url)}
              trigger={
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Feed
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="border rounded-lg p-4 hover:bg-accent/50 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">
                        {feed.title || "Untitled Feed"}
                      </h3>
                    </div>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 mb-2 transition-colors max-w-full"
                    >
                      <span className="truncate break-all">{feed.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {feed.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 break-words">
                        {feed.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="whitespace-nowrap">
                        {feed._count?.articles ?? 0} article
                        {feed._count?.articles !== 1 ? "s" : ""}
                      </span>
                      {feed.lastFetched && (
                        <span className="whitespace-nowrap">
                          Last fetched:{" "}
                          {new Date(feed.lastFetched).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <DeleteFeedButton
                    feedId={feed.id}
                    feedTitle={feed.title || feed.url}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
