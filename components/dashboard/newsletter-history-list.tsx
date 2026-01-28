"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, ChevronRight, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { deleteNewsletterAction } from "@/actions/delete-newsletter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Newsletter {
  id: string;
  suggestedTitles: string[];
  suggestedSubjectLines: string[];
  body: string;
  topAnnouncements: string[];
  additionalInfo?: string | null;
  startDate: Date;
  endDate: Date;
  userInput?: string | null;
  feedsUsed: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NewsletterHistoryListProps {
  newsletters: Newsletter[];
}

export function NewsletterHistoryList({
  newsletters,
}: NewsletterHistoryListProps) {
  const [isPending, startTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = (
    e: React.MouseEvent,
    newsletterId: string,
    newsletterTitle: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${newsletterTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(newsletterId);

    startTransition(async () => {
      try {
        await deleteNewsletterAction(newsletterId);
        toast.success("Newsletter deleted successfully");
        setDeletingId(null);
      } catch (error) {
        console.error("Failed to delete newsletter:", error);
        toast.error("Failed to delete newsletter");
        setDeletingId(null);
      }
    });
  };

  if (newsletters.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">No Newsletters Yet</h3>
        <p className="text-slate-400 mb-6">
          You haven't saved any newsletters yet. Generate and save your first
          newsletter to see it here.
        </p>
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
            Go to Dashboard to generate a newsletter →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {newsletters.map((newsletter) => {
        const title = newsletter.suggestedTitles[0] || "Untitled Newsletter";
        const isDeleting = deletingId === newsletter.id || isPending;

        return (
          <div
            key={newsletter.id}
            className="glass-card rounded-xl overflow-hidden h-full group relative border border-slate-700 hover:border-blue-500 transition-all"
          >
            <Link href={`/dashboard/history/${newsletter.id}`}>
              <div className="cursor-pointer p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-400"
                      onClick={(e) => handleDelete(e, newsletter.id, title)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(newsletter.createdAt), {
                    addSuffix: true,
                  })}
                </div>

                {/* Date Range Badge */}
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-500/50 text-purple-400 bg-purple-500/10"
                  >
                    {new Date(newsletter.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}{" "}
                    -{" "}
                    {new Date(newsletter.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                </div>

                {/* Preview Text */}
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {newsletter.suggestedSubjectLines[0] ||
                    `${newsletter.body.substring(0, 100)}...`}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{newsletter.feedsUsed.length} feeds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>
                      {newsletter.topAnnouncements.length} announcements
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
