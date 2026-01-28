import { ArrowDown, ArrowRight, Rss, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CTAButtons from "./buttons/CTAButtons";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1a] py-20 sm:py-32">
      {/* Background decoration - subtle grid */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Gradient orbs for ambient light effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 ">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <Badge className="mb-6 px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
            <Sparkles className="mr-2 size-4" />
            AI-Powered Newsletter Creation
          </Badge>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Generate Professional Newsletters in{" "}
            <span className="premium-gradient-text">
              Minutes, Not Hours
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-slate-400 sm:text-xl">
            Stop spending hours curating content. Let AI transform your RSS
            feeds into engaging newsletters with perfect titles, subject lines,
            and content.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButtons />
          </div>

          {/* Social Proof */}
          <p className="mt-8 text-sm text-slate-500">
            Join 1,000+ newsletter creators saving 5+ hours every week
          </p>
        </div>

        {/* Hero visual - RSS Feeds → Newsletter Transformation */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left side - RSS Feed Orbs */}
            <div className="relative shrink-0 w-full lg:w-auto">
              <div className="grid grid-cols-3 gap-2 lg:gap-6 max-w-xs mx-auto lg:max-w-none">
                {/* RSS Feed Orb 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative size-16 lg:size-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center animate-pulse">
                    <Rss className="size-6 lg:size-10 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-xs text-slate-500">
                    Feed 1
                  </span>
                </div>

                {/* RSS Feed Orb 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative size-16 lg:size-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Rss className="size-6 lg:size-10 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-xs text-slate-500">
                    Feed 2
                  </span>
                </div>

                {/* RSS Feed Orb 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative size-16 lg:size-24 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25 flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Rss className="size-6 lg:size-10 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-xs text-slate-500">
                    Feed 3
                  </span>
                </div>
              </div>
            </div>

            {/* Middle - Arrows & AI Badge */}
            <div className="flex flex-col items-center gap-4 my-6 lg:my-0">
              {/* Mobile: Vertical arrows pointing down */}
              <div className="flex flex-col items-center gap-2 lg:hidden">
                <ArrowDown className="size-6 text-blue-400 animate-bounce" />
              </div>

              {/* Desktop: Horizontal arrows pointing right */}
              <div className="hidden lg:flex lg:flex-col items-center gap-2">
                <ArrowRight className="size-10 text-blue-400 animate-pulse" />
                <ArrowRight
                  className="size-10 text-purple-400 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
                <ArrowRight
                  className="size-10 text-pink-400 animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="size-4 text-white" />
                <span className="text-xs font-semibold text-white">
                  AI Processing
                </span>
              </div>
            </div>

            {/* Right side - Consolidated Newsletter */}
            <div className="flex-1 w-full">
              <div className="rounded-xl glass-card glow overflow-hidden">
                {/* Newsletter header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-white" />
                    <span className="text-xs font-medium text-white/80">
                      Your Newsletter
                    </span>
                  </div>
                  <div className="h-4 w-3/4 rounded bg-white/90 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-white/70" />
                </div>

                {/* Newsletter content */}
                <div className="p-6 space-y-4">
                  {/* Titles */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-1.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        5 Titles
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded bg-slate-700" />
                      <div className="h-2 w-5/6 rounded bg-slate-700" />
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-1.5 rounded-full bg-purple-500" />
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        Full Body
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded bg-slate-700" />
                      <div className="h-2 w-full rounded bg-slate-700" />
                      <div className="h-2 w-3/4 rounded bg-slate-700" />
                    </div>
                  </div>

                  {/* Top 5 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border border-slate-700 p-2 bg-blue-500/10">
                      <div className="h-2 w-3/4 rounded bg-blue-500/30" />
                    </div>
                    <div className="rounded border border-slate-700 p-2 bg-purple-500/10">
                      <div className="h-2 w-3/4 rounded bg-purple-500/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
