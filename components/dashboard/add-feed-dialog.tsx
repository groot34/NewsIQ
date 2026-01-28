"use client";

import { useAuth } from "@clerk/nextjs";
import { Check, Plus, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { validateAndAddFeed } from "@/actions/rss-fetch";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CURATED_FEEDS,
  type CuratedFeed,
  type FeedCategory,
} from "@/lib/data/curated-feeds";

interface AddFeedDialogProps {
  currentFeedCount: number;
  feedLimit: number;
  isPro: boolean;
  trigger?: React.ReactNode;
  existingFeedUrls?: string[];
}

export function AddFeedDialog({
  currentFeedCount,
  feedLimit,
  isPro,
  trigger,
  existingFeedUrls = [],
}: AddFeedDialogProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  // Tab state: 'browse' or 'custom'
  const [activeTab, setActiveTab] = React.useState<'browse' | 'custom'>('browse');
  
  // Browse mode state
  const [selectedCategory, setSelectedCategory] = React.useState<FeedCategory>(CURATED_FEEDS[0]);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Custom URL mode state
  const [customUrl, setCustomUrl] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Feed
          </Button>
        )}
      </>
    );
  }

  const isAtLimit = currentFeedCount >= feedLimit;

  const handleAddFeed = async (url: string, feedName?: string) => {
    if (isAtLimit) {
      toast.error("Feed limit reached. Remove a feed to add a new one.");
      return;
    }

    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      setIsAdding(true);

      if (!userId) {
        throw new Error("Not authenticated");
      }

      const user = await upsertUserFromClerk(userId);
      const result = await validateAndAddFeed(user.id, url.trim());

      if (result.error) {
        toast.warning(`Feed added but: ${result.error}`);
      } else {
        toast.success(
          feedName 
            ? `"${feedName}" added! ${result.articlesCreated} articles imported.`
            : `Feed added! ${result.articlesCreated} articles imported.`
        );
      }

      setCustomUrl("");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to add feed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add RSS feed"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const isFeedAdded = (url: string) => existingFeedUrls.includes(url);

  // Filter feeds based on search
  const filteredFeeds = searchQuery.trim()
    ? CURATED_FEEDS.flatMap(cat => 
        cat.feeds
          .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(f => ({ ...f, category: cat.name }))
      )
    : selectedCategory.feeds;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" disabled={isAtLimit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add RSS Feed</DialogTitle>
          <DialogDescription>
            Browse curated feeds or add a custom URL
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'browse'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Browse Feeds
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'custom'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom URL
          </button>
        </div>

        {activeTab === 'browse' ? (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all feeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {!searchQuery && (
              /* Category Selector */
              <div className="flex flex-wrap gap-2">
                {CURATED_FEEDS.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedCategory.id === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {category.icon} {category.name.replace(/^[^\s]+\s/, '')}
                  </button>
                ))}
              </div>
            )}

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto border rounded-lg divide-y min-h-[200px] max-h-[300px]">
              {filteredFeeds.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No feeds found matching "{searchQuery}"
                </div>
              ) : (
                filteredFeeds.map((feed: CuratedFeed & { category?: string }) => {
                  const isAdded = isFeedAdded(feed.url);
                  return (
                    <button
                      key={feed.url}
                      type="button"
                      disabled={isAdded || isAdding || isAtLimit}
                      onClick={() => handleAddFeed(feed.url, feed.name)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors ${
                        isAdded
                          ? 'bg-green-50 dark:bg-green-950/20 cursor-default'
                          : isAtLimit
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{feed.name}</div>
                        {feed.category && (
                          <div className="text-xs text-muted-foreground">{feed.category}</div>
                        )}
                      </div>
                      {isAdded ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm shrink-0">
                          <Check className="h-4 w-4" />
                          Added
                        </span>
                      ) : isAdding ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Click any feed to add it instantly
            </p>
          </div>
        ) : (
          /* Custom URL Tab */
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feed-url">RSS Feed URL</Label>
              <Input
                id="feed-url"
                type="text"
                placeholder="example.com/feed.xml or https://example.com/rss"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAdding) {
                    handleAddFeed(customUrl);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Enter any RSS feed URL. The https:// prefix is optional.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleAddFeed(customUrl)} 
                disabled={isAdding || isAtLimit || !customUrl.trim()}
              >
                {isAdding ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Feed"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
