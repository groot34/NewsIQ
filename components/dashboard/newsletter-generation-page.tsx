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

  // Track if we've already auto-saved this generation
  const hasAutoSavedRef = React.useRef(false);

  // Show success toast when generation completes
  React.useEffect(() => {
    if (!isLoading && newsletter?.body && articlesCount > 0 && !hasAutoSavedRef.current) {
      toast.success(`Newsletter generated from ${articlesCount} articles!`);
      
      // Auto-save logic
      hasAutoSavedRef.current = true;
      handleSave();
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
        <div className="container mx-auto py-12 px-6 lg:px-8">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Invalid Generation Request
              </CardTitle>
              <CardDescription className="text-base">
                Missing required parameters for newsletter generation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="container mx-auto py-12 px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              disabled={isLoading}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Newsletter Generation
              </h1>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-base">
              <div className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white animate-pulse">
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

        {/* Debug: Show raw completion if parsing fails */}
        {(!isLoading && !newsletter?.body && (Boolean(completion) || Boolean(error))) && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Debug: Generation Failed</CardTitle>
            </CardHeader>
            <CardContent>
              {!!error && (
                <div className="mb-4">
                  <strong>Error:</strong>
                  <pre className="whitespace-pre-wrap text-xs bg-red-50 p-2 rounded text-red-800">
                    {error instanceof Error ? error.message : String(error)}
                  </pre>
                </div>
              )}
              {completion && (
                <div>
                  <strong>Raw Output:</strong>
                  <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    {completion}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* If generation hasn't started yet */}
        {!isLoading && !newsletter?.body && !completion && (
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Preparing to Generate</CardTitle>
              <CardDescription className="text-base">
                Setting up newsletter generation...
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
