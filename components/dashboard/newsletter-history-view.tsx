"use client";

import { ArrowLeft, Calendar, Clock, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { deleteNewsletterAction } from "@/actions/delete-newsletter";
import { Button } from "@/components/ui/button";
import { NewsletterDisplay } from "./newsletter-display";

interface Newsletter {
  id: string;
  userId: string;
  suggestedTitles: string[];
  suggestedSubjectLines: string[];
  body: string;
  topAnnouncements: string[];
  additionalInfo: string | null;
  startDate: Date;
  endDate: Date;
  userInput: string | null;
  feedsUsed: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NewsletterHistoryViewProps {
  newsletter: Newsletter;
}

export function NewsletterHistoryView({
  newsletter,
}: NewsletterHistoryViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleBackToHistory = () => {
    router.push("/dashboard/history");
  };

  const handleDelete = () => {
    const title = newsletter.suggestedTitles[0] || "this newsletter";
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteNewsletterAction(newsletter.id);
        toast.success("Newsletter deleted successfully");
        router.push("/dashboard/history");
      } catch (error) {
        console.error("Failed to delete newsletter:", error);
        toast.error("Failed to delete newsletter");
      }
    });
  };

  const handleSave = async () => {
    // Newsletter is already saved
  };

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHistory}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Button>
            <div className="h-4 w-px bg-slate-700" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Newsletter
              </h1>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>

        {/* Metadata Card */}
        <div className="glass-card rounded-xl overflow-hidden border border-blue-500/30">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-semibold text-white">Newsletter Information</h3>
            <p className="text-slate-400 mt-1">
              Generated on{" "}
              {new Date(newsletter.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-base text-white">Date Range</p>
                  <p className="text-slate-400">
                    {new Date(newsletter.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}{" "}
                    -{" "}
                    {new Date(newsletter.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-base text-white">Feeds Used</p>
                  <p className="text-slate-400">
                    {newsletter.feedsUsed.length} RSS feed
                    {newsletter.feedsUsed.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {newsletter.userInput && (
                <div className="flex items-start gap-3">
                  <div className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-base text-white">Custom Context</p>
                    <p className="text-slate-400 line-clamp-2">
                      {newsletter.userInput}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Display */}
        <NewsletterDisplay
          newsletter={{
            suggestedTitles: newsletter.suggestedTitles,
            suggestedSubjectLines: newsletter.suggestedSubjectLines,
            body: newsletter.body,
            topAnnouncements: newsletter.topAnnouncements,
            additionalInfo: newsletter.additionalInfo ?? undefined,
          }}
          onSave={handleSave}
          isGenerating={false}
          hideSaveButton={true}
        />
      </div>
    </div>
  );
}
