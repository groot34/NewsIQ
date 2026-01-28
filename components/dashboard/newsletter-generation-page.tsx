"use client";

import { useCompletion } from "@ai-sdk/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  type GeneratedNewsletter,
  saveGeneratedNewsletter,
} from "@/actions/generate-newsletter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewsletterDisplay } from "./newsletter-display";
import { NewsletterLoadingCard } from "./newsletter-loading-card";

/**
 * Newsletter schema for client-side streaming
 * Must match the server-side schema in the API route
 */
const newsletterSchema = z.object({
  suggestedTitles: z.array(z.string()).length(5),
  suggestedSubjectLines: z.array(z.string()).length(5),
  body: z.string(),
  topAnnouncements: z.array(z.string()).length(5),
  additionalInfo: z.string().optional(),
});

type NewsletterObject = z.infer<typeof newsletterSchema>;

/**
 * Newsletter Generation Page
 *
 * This component handles the full newsletter generation flow:
 * 1. Reads generation parameters from URL
 * 2. Prepares metadata and shows toast notifications
 * 3. Auto-starts generation using AI SDK's useObject hook
 * 4. Displays the streaming newsletter
 * 5. Allows saving for Pro users
 */
// Utility to clean invalid JSON (escapes newlines within strings)
function cleanJsonString(str: string): string {
  let inString = false;
  let isEscaped = false;
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '"' && !isEscaped) {
      inString = !inString;
    }

    if (char === "\n" && inString) {
      result += "\\n";
    } else {
      result += char;
    }

    if (char === "\\" && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }
  }
  return result;
}

export function NewsletterGenerationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasStartedRef = React.useRef(false);
  const [articlesCount, setArticlesCount] = React.useState(0);

  // Parse generation parameters from URL query string
  const feedIds = searchParams.get("feedIds");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userInput = searchParams.get("userInput");

  let params: {
    feedIds: string[];
    startDate: string;
    endDate: string;
    userInput?: string;
  } | null = null;

  if (feedIds && startDate && endDate) {
    try {
      params = {
        feedIds: JSON.parse(feedIds),
        startDate,
        endDate,
        userInput: userInput || undefined,
      };
    } catch {
      params = null;
    }
  }

  // Manual stream handling state
  const [completion, setCompletion] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  // Manual stream reader
  const handleStream = async (requestParams: any) => {
    setIsLoading(true);
    setError(null);
    setCompletion("");

    try {
      const response = await fetch("/api/newsletter/generate-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestParams),
      });

      if (!response.ok) {
        // Try to parse error message from response
        try {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error);
          }
        } catch (parseError) {
          // If parsing fails, throw generic error
          if (parseError instanceof Error && parseError.message !== "Unexpected end of JSON input") {
            throw parseError;
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !done });
        setCompletion((prev) => prev + chunkValue);
      }
    } catch (err) {
      console.error("Stream error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse dictionary from completion string
  const newsletter = React.useMemo(() => {
    if (!completion) return undefined;
    try {
      let cleanJson = completion.trim();
      
      // Handle Markdown code blocks if present
      const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanJson = match[1];
      }

      // Sanitize newlines inside strings
      cleanJson = cleanJsonString(cleanJson);

      // Try to parse partial or full JSON
      // If valid JSON, return it
      try {
        return JSON.parse(cleanJson) as Partial<NewsletterObject>;
      } catch {
        // If strict parsing fails (likely due to streaming/partial data), 
        // we could try a relaxed parser or just wait for valid JSON.
        // For now, if it fails, we return undefined so it doesn't break the UI.
        // We can check if it starts with { to at least know it's trying to be JSON
        if (cleanJson.startsWith('{')) {
             // In a real app, use a library like 'best-effort-json-parser' here
             return undefined; 
        }
        return undefined;
      }
    } catch {
      return undefined;
    }
  }, [completion]);

  // Auto-start generation with pre-flight metadata check
  React.useEffect(() => {
    if (!params || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const startGeneration = async () => {
      try {
        // Get metadata for toast notifications
        const response = await fetch("/api/newsletter/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (response.ok) {
          const data = await response.json();

          // Show toast for feed refresh if needed
          if (data.feedsToRefresh > 0) {
            toast.info(
              `Refreshing ${data.feedsToRefresh} feed${data.feedsToRefresh > 1 ? "s" : ""}...`,
            );
          }

          // Show toast for article analysis
          if (data.articlesFound > 0) {
            toast.info(
              `Analyzing ${data.articlesFound} article${data.articlesFound > 1 ? "s" : ""} from your feeds...`,
            );
            setArticlesCount(data.articlesFound);
          }
        }

        // Start AI generation
        await handleStream(params);
      } catch (error) {
        console.error("Failed to prepare newsletter:", error);
        // Start generation anyway
        await handleStream(params);
      }
    };

    startGeneration();
  }, [params]);

  // Track if we've already shown the success toast for this generation
  const hasShownToastRef = React.useRef(false);

  // Show success toast when generation completes (no auto-save)
  React.useEffect(() => {
    if (!isLoading && newsletter?.body && articlesCount > 0 && !hasShownToastRef.current) {
      toast.success(`Newsletter generated from ${articlesCount} articles!`);
      hasShownToastRef.current = true;
    }
  }, [isLoading, newsletter?.body, articlesCount]);

  // Navigation guard - warn users before leaving during generation
  // This prevents accidental loss of work if they close the tab
  React.useEffect(() => {
    if (!isLoading) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  /**
   * Saves the generated newsletter to database (Pro users only)
   */
  const handleSave = async () => {
    if (!newsletter || !params) {
      return;
    }

    try {
      await saveGeneratedNewsletter({
        newsletter: newsletter as GeneratedNewsletter,
        feedIds: params.feedIds,
        startDate: new Date(params.startDate),
        endDate: new Date(params.endDate),
        userInput: params.userInput,
      });

      toast.success("Newsletter saved to history!");
    } catch (error) {
      console.error("Failed to save newsletter:", error);
      toast.error("Failed to save newsletter");
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // If no params, show error
  if (!params) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="relative container mx-auto py-12 px-6 lg:px-8">
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Invalid Generation Request
            </h2>
            <p className="text-slate-400 mb-6">
              Missing required parameters for newsletter generation.
            </p>
            <Button
              onClick={handleBackToDashboard}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              disabled={isLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-slate-700" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Newsletter Generation
              </h1>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-slate-300">
              <div className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white animate-pulse shadow-lg shadow-blue-500/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-medium">Generating newsletter...</span>
            </div>
          )}
        </div>

        {/* Show loading card while generating */}
        {isLoading && !newsletter?.body && (
          <div className="transition-opacity duration-300 ease-in-out">
            <NewsletterLoadingCard />
          </div>
        )}

        {/* Newsletter display with smooth transition */}
        {newsletter?.body && (
          <div className="transition-opacity duration-500 ease-in-out animate-in fade-in">
            <NewsletterDisplay
              newsletter={newsletter}
              onSave={handleSave}
              isGenerating={isLoading}
            />
          </div>
        )}

        {/* Show user-friendly error message */}
        {(!isLoading && !newsletter?.body && (Boolean(completion) || Boolean(error))) && (() => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const isNoArticlesError = errorMessage.includes("No articles found");

          if (isNoArticlesError) {
            return (
              <div className="glass-card rounded-xl overflow-hidden border border-amber-500/30">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    No Articles Found
                  </h3>
                  <p className="text-amber-300/80 mt-1">
                    We couldn't find any articles for the selected feeds and date range.
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-sm text-amber-300/70 space-y-2">
                    <p><strong className="text-amber-300">This could happen because:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>The selected feeds haven't published any articles in this date range</li>
                      <li>The date range is too narrow</li>
                      <li>The RSS feeds might be temporarily unavailable</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleBackToDashboard}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            );
          }

          // For other errors, show a cleaner error card
          return (
            <div className="glass-card rounded-xl overflow-hidden border border-red-500/30">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-semibold text-red-400">
                  Generation Failed
                </h3>
                <p className="text-red-300/80 mt-1">
                  Something went wrong while generating your newsletter.
                </p>
              </div>
              <div className="p-6 space-y-4">
                {!!error && (
                  <div className="text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-300">
                    {errorMessage}
                  </div>
                )}
                <Button
                  onClick={handleBackToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          );
        })()}

        {/* If generation hasn't started yet */}
        {!isLoading && !newsletter?.body && !completion && (
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Preparing to Generate</h2>
            <p className="text-slate-400">
              Setting up newsletter generation...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
