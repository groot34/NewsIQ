"use client";

import { Check, Copy, Download, RefreshCw } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NewsletterData {
  suggestedTitles?: string[];
  suggestedSubjectLines?: string[];
  body?: string;
  topAnnouncements?: string[];
  additionalInfo?: string;
}

interface NewsletterDisplayProps {
  newsletter: NewsletterData;
  onSave: () => Promise<void>;
  isGenerating: boolean;
  hideSaveButton?: boolean;
  onRegenerate?: () => void;
}

/**
 * Normalizes raw/escaped string content so literal "\n" escape sequences
 * become real newlines for Markdown and clipboard operations.
 */
function normalizeText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r\n/g, "\n");
}

export function NewsletterDisplay({
  newsletter,
  onSave,
  isGenerating,
  hideSaveButton = false,
  onRegenerate,
}: NewsletterDisplayProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const cleanBody = React.useMemo(() => normalizeText(newsletter.body), [newsletter.body]);
  const cleanAdditionalInfo = React.useMemo(
    () => normalizeText(newsletter.additionalInfo),
    [newsletter.additionalInfo],
  );

  const wordCount = React.useMemo(() => {
    if (!cleanBody) return 0;
    return cleanBody.trim().split(/\s+/).filter(Boolean).length;
  }, [cleanBody]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(normalizeText(text));
      setCopiedField(field);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    let content = "";

    if (newsletter.suggestedTitles?.length) {
      content += "# SUGGESTED TITLES\n\n";
      newsletter.suggestedTitles.forEach((title, i) => {
        content += `${i + 1}. ${normalizeText(title)}\n`;
      });
      content += "\n---\n\n";
    }

    if (newsletter.suggestedSubjectLines?.length) {
      content += "# EMAIL SUBJECT LINES\n\n";
      newsletter.suggestedSubjectLines.forEach((subject, i) => {
        content += `${i + 1}. ${normalizeText(subject)}\n`;
      });
      content += "\n---\n\n";
    }

    if (newsletter.topAnnouncements?.length) {
      content += "# TOP ANNOUNCEMENTS\n\n";
      newsletter.topAnnouncements.forEach((announcement, i) => {
        content += `${i + 1}. ${normalizeText(announcement)}\n`;
      });
      content += "\n---\n\n";
    }

    if (cleanBody) {
      content += "# NEWSLETTER BODY\n\n";
      content += cleanBody;
      content += "\n\n";
    }

    if (cleanAdditionalInfo) {
      content += "---\n\n# ADDITIONAL INFORMATION\n\n";
      content += cleanAdditionalInfo;
      content += "\n";
    }

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Newsletter downloaded as Markdown!");
  };

  const CopyButton = ({ field, text }: { field: string; text: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, field)}
      className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <Check className="h-3.5 w-3.5" />
          <span>Copied</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs">
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </span>
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Generated Newsletter</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Review sections below, copy individual parts, or export the full markdown newsletter.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating || isSaving}
              className="border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white shadow-sm flex-1 sm:flex-none"
              title="Generate a fresh version with the same settings"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-2 text-purple-400 ${isGenerating ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white shadow-sm flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4 mr-2 text-blue-400" />
            Download MD
          </Button>

          {!hideSaveButton && (
            <Button
              onClick={handleSave}
              disabled={isSaving || isGenerating}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none"
            >
              {isSaving ? "Saving..." : "Save Newsletter"}
            </Button>
          )}
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Titles & Subject Lines */}
        <div className="lg:col-span-3 space-y-6">
          {/* Newsletter Title Options */}
          {newsletter.suggestedTitles && newsletter.suggestedTitles.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-400 inline-block" />
                  Title Options
                </h3>
                <CopyButton
                  field="all-titles"
                  text={newsletter.suggestedTitles.join("\n")}
                />
              </div>
              <div className="p-4 space-y-3">
                {newsletter.suggestedTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors border border-slate-800/50 group"
                  >
                    <span className="inline-flex items-center justify-center size-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed flex-1 select-text">
                      {normalizeText(title)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Subject Line Options */}
          {newsletter.suggestedSubjectLines && newsletter.suggestedSubjectLines.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-400 inline-block" />
                  Subject Lines
                </h3>
                <CopyButton
                  field="all-subjects"
                  text={newsletter.suggestedSubjectLines.join("\n")}
                />
              </div>
              <div className="p-4 space-y-3">
                {newsletter.suggestedSubjectLines.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors border border-slate-800/50 group"
                  >
                    <span className="inline-flex items-center justify-center size-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed flex-1 select-text">
                      {normalizeText(subject)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Newsletter Body */}
        <div className="lg:col-span-6">
          {cleanBody && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/60 shadow-xl flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base text-white">Newsletter Content</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {wordCount} words
                  </span>
                </div>
                <CopyButton field="body" text={cleanBody} />
              </div>
              <div className="p-6 overflow-y-auto max-h-[750px] custom-scrollbar">
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-slate-800 tracking-tight">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-slate-100 mt-6 mb-3 flex items-center gap-2 tracking-tight">
                          <span className="size-1.5 rounded-full bg-blue-400 inline-block" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-blue-300 mt-5 mb-2">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-sm font-semibold text-purple-300 mt-4 mb-1.5">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-slate-300 text-sm leading-relaxed mb-4 last:mb-0">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-slate-200 font-light">{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-1.5 my-3 pl-5 list-disc marker:text-blue-400 text-slate-300 text-sm">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-1.5 my-3 pl-5 list-decimal marker:text-purple-400 text-slate-300 text-sm">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-blue-500/80 bg-blue-950/20 pl-4 py-2 my-4 rounded-r-lg text-slate-300 text-sm italic">
                          {children}
                        </blockquote>
                      ),
                      hr: () => <hr className="border-slate-800 my-6" />,
                      code: ({ children }) => (
                        <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {cleanBody}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Top Announcements & Additional Info */}
        <div className="lg:col-span-3 space-y-6">
          {newsletter.topAnnouncements && newsletter.topAnnouncements.length > 0 ? (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                  Top Announcements
                </h3>
                <CopyButton
                  field="all-announcements"
                  text={newsletter.topAnnouncements.join("\n")}
                />
              </div>
              <div className="p-4 space-y-3">
                {newsletter.topAnnouncements.map((announcement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors border border-slate-800/50 group"
                  >
                    <span className="inline-flex items-center justify-center size-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed flex-1 select-text">
                      {normalizeText(announcement)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : isGenerating ? (
            <div className="glass-card rounded-xl p-5 border border-slate-800/80 space-y-4 animate-pulse bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="h-4 w-36 bg-slate-700 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-slate-800/60 rounded-lg" />
                <div className="h-12 bg-slate-800/60 rounded-lg" />
                <div className="h-12 bg-slate-800/60 rounded-lg" />
              </div>
            </div>
          ) : null}

          {/* Additional Info if present */}
          {cleanAdditionalInfo && (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400 inline-block" />
                  Additional Info
                </h3>
                <CopyButton field="additional-info" text={cleanAdditionalInfo} />
              </div>
              <div className="p-4 text-slate-300 text-xs leading-relaxed prose prose-invert prose-xs max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => (
                      <strong className="text-slate-100 font-semibold">{children}</strong>
                    ),
                  }}
                >
                  {cleanAdditionalInfo}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
