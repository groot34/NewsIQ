"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type DateRange, DateRangePicker } from "./date-range-picker";

interface RssFeed {
  id: string;
  title: string | null;
  url: string;
}

interface NewsletterFormProps {
  feeds: RssFeed[];
}

export function NewsletterForm({ feeds }: NewsletterFormProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [userInput, setUserInput] = React.useState("");
  const [selectedFeeds, setSelectedFeeds] = React.useState<string[]>([]);

  const allSelected = selectedFeeds.length === feeds.length;

  const handleSelectAll = () => setSelectedFeeds(feeds.map((f) => f.id));
  const handleDeselectAll = () => setSelectedFeeds([]);
  const handleToggleFeed = (feedId: string) => {
    setSelectedFeeds((prev) =>
      prev.includes(feedId)
        ? prev.filter((id) => id !== feedId)
        : [...prev, feedId],
    );
  };

  const handleGenerate = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a date range");
      return;
    }

    if (selectedFeeds.length === 0) {
      toast.error("Please select at least one RSS feed");
      return;
    }

    const params = new URLSearchParams({
      feedIds: JSON.stringify(selectedFeeds),
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    if (userInput.trim()) {
      params.append("userInput", userInput.trim());
    }

    router.push(`/dashboard/generate?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-semibold text-white">Generate Newsletter</h2>
          <p className="text-slate-400 mt-1">
            Select date range, feeds, and add context to generate your AI-powered newsletter
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-white">Date Range</Label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Feed Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-white">Select Feeds</Label>
              {!allSelected && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Select All
                </Button>
              )}
              {allSelected && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDeselectAll}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Deselect All
                </Button>
              )}
            </div>
            <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
              {feeds.map((feed) => (
                <div key={feed.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feed.id}
                    checked={selectedFeeds.includes(feed.id)}
                    onCheckedChange={() => handleToggleFeed(feed.id)}
                    className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={feed.id}
                    className="text-sm font-normal cursor-pointer flex-1 text-slate-300"
                  >
                    {feed.title || feed.url}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {selectedFeeds.length} of {feeds.length} feeds selected
            </p>
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <Label htmlFor="user-input" className="text-base font-semibold text-white">
              Additional Context{" "}
              <span className="text-slate-500 font-normal">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="user-input"
              placeholder="Add any specific instructions, tone preferences, target audience details, or topics to focus on..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500">
              Your instructions will be prioritized and incorporated into the
              newsletter.
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={selectedFeeds.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Newsletter
          </Button>
        </div>
      </div>
    </div>
  );
}
