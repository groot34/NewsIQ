import { auth } from "@clerk/nextjs/server";
import { ExternalLink, Plus } from "lucide-react";
import { getRssFeedsByUserId } from "@/actions/rss-feed";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
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
  const { userId } = await auth();
  const isPro = true;
  const feedLimit = 5;

  const user = await upsertUserFromClerk(userId!);
  const feeds = (await getRssFeedsByUserId(user.id)) as RssFeed[];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">RSS Feeds</h2>
              <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                feeds.length >= feedLimit 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {feeds.length}/{feedLimit}
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              Manage your RSS feed sources
            </p>
          </div>
          <AddFeedDialog
            currentFeedCount={feeds.length}
            feedLimit={feedLimit}
            isPro={isPro}
            existingFeedUrls={feeds.map((f) => f.url)}
          />
        </div>
        {feeds.length >= feedLimit && (
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>You've reached the maximum of {feedLimit} feeds. Remove a feed to add a new one.</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {feeds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              No RSS feeds added yet
            </div>
            <AddFeedDialog
              currentFeedCount={feeds.length}
              feedLimit={feedLimit}
              isPro={isPro}
              existingFeedUrls={feeds.map((f) => f.url)}
              trigger={
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
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
                className="border border-slate-700 bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800 hover:border-slate-600 transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {feed.title || "Untitled Feed"}
                      </h3>
                    </div>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-blue-400 inline-flex items-center gap-1 mb-2 transition-colors max-w-full"
                    >
                      <span className="truncate break-all">{feed.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {feed.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2 break-words">
                        {feed.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
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
      </div>
    </div>
  );
}
