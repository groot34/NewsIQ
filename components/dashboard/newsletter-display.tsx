"use client";

import { Check, Copy, Download } from "lucide-react";
import * as React from "react";
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
}

export function NewsletterDisplay({
  newsletter,
  onSave,
  isGenerating,
  hideSaveButton = false,
}: NewsletterDisplayProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

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
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    // Combine all content for download
    let content = "";
    
    if (newsletter.suggestedTitles?.length) {
      content += "SUGGESTED TITLES\n";
      content += "================\n";
      newsletter.suggestedTitles.forEach((title, i) => {
        content += `${i + 1}. ${title}\n`;
      });
      content += "\n";
    }
    
    if (newsletter.suggestedSubjectLines?.length) {
      content += "EMAIL SUBJECT LINES\n";
      content += "===================\n";
      newsletter.suggestedSubjectLines.forEach((subject, i) => {
        content += `${i + 1}. ${subject}\n`;
      });
      content += "\n";
    }
    
    if (newsletter.body) {
      content += "NEWSLETTER BODY\n";
      content += "===============\n";
      content += newsletter.body + "\n\n";
    }
    
    if (newsletter.topAnnouncements?.length) {
      content += "TOP ANNOUNCEMENTS\n";
      content += "=================\n";
      newsletter.topAnnouncements.forEach((announcement, i) => {
        content += `${i + 1}. ${announcement}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Newsletter downloaded!");
  };

  const wordCount = newsletter.body?.split(/\s+/).filter(Boolean).length || 0;

  const CopyButton = ({ field, text }: { field: string; text: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Generated Newsletter</h2>
            <p className="text-slate-400 mt-1">
              Copy sections individually or download the full newsletter
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {!hideSaveButton && (
              <Button
                onClick={handleSave}
                disabled={isSaving || isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
              >
                {isSaving ? "Saving..." : "Save Newsletter"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Titles & Subject Lines */}
        <div className="lg:col-span-3 space-y-6">
          {/* Newsletter Title Options */}
          {newsletter.suggestedTitles && newsletter.suggestedTitles.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Newsletter Title Options</h3>
                <CopyButton 
                  field="all-titles" 
                  text={newsletter.suggestedTitles.join("\n")} 
                />
              </div>
              <div className="p-4 space-y-3">
                {newsletter.suggestedTitles.map((title, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Subject Line Options */}
          {newsletter.suggestedSubjectLines && newsletter.suggestedSubjectLines.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Email Subject Line Options</h3>
                <CopyButton 
                  field="all-subjects" 
                  text={newsletter.suggestedSubjectLines.join("\n")} 
                />
              </div>
              <div className="p-4 space-y-3">
                {newsletter.suggestedSubjectLines.map((subject, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">{subject}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Newsletter Body */}
        <div className="lg:col-span-6">
          {newsletter.body && (
            <div className="glass-card rounded-xl overflow-hidden h-full">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white">Newsletter Body</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300">
                    {wordCount} words
                  </span>
                </div>
                <CopyButton field="body" text={newsletter.body} />
              </div>
              <div className="p-5 overflow-y-auto max-h-[620px]">
                <div className="space-y-0 text-slate-300 text-sm leading-relaxed">
                  {newsletter.body
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => {
                      const trimmed = line.trim();

                      // H2 heading
                      if (trimmed.startsWith("## ")) {
                        return (
                          <h3 key={index} className="text-base font-semibold text-white mt-4 mb-2 first:mt-0">
                            {trimmed.replace(/^##\s*/, "")}
                          </h3>
                        );
                      }
                      // H1 heading
                      if (trimmed.startsWith("# ")) {
                        return (
                          <h2 key={index} className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">
                            {trimmed.replace(/^#\s*/, "")}
                          </h2>
                        );
                      }
                      // Blockquote
                      if (trimmed.startsWith("> ")) {
                        return (
                          <blockquote key={index} className="border-l-2 border-blue-500 pl-3 my-2 italic text-slate-400 text-sm">
                            {trimmed.replace(/^>\s*/, "")}
                          </blockquote>
                        );
                      }
                      // Regular paragraph — render inline bold/italic
                      const html = trimmed
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.+?)\*/g, "<em>$1</em>")
                        .replace(/`(.+?)`/g, '<code class="bg-slate-700 px-1 rounded text-xs">$1</code>');
                      return (
                        <p
                          key={index}
                          className="mb-3"
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Top Announcements */}
        <div className="lg:col-span-3">
          {newsletter.topAnnouncements && newsletter.topAnnouncements.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Top 5 Announcements</h3>
                <CopyButton 
                  field="all-announcements" 
                  text={newsletter.topAnnouncements.join("\n")} 
                />
              </div>
              <div className="p-4 space-y-4">
                {newsletter.topAnnouncements.map((announcement, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">{announcement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info if present */}
          {newsletter.additionalInfo && (
            <div className="glass-card rounded-xl overflow-hidden mt-6">
              <div className="p-4 border-b border-slate-800">
                <h3 className="font-semibold text-white">Additional Information</h3>
              </div>
              <div className="p-4">
                <p className="text-slate-300 text-sm leading-relaxed">{newsletter.additionalInfo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
