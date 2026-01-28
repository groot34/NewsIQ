import { Loader2 } from "lucide-react";

/**
 * Displays a simple loading state during newsletter generation
 */
export function NewsletterLoadingCard() {
  return (
    <div className="glass-card rounded-xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold text-white">
          Generating your newsletter...
        </h2>
      </div>
      <p className="text-slate-400">
        AI is crafting your personalized newsletter. This may take a minute.
      </p>
      
      {/* Loading animation bars */}
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-slate-800 rounded-lg animate-pulse" style={{ width: "85%" }} />
        <div className="h-4 bg-slate-800 rounded-lg animate-pulse" style={{ width: "70%" }} />
        <div className="h-4 bg-slate-800 rounded-lg animate-pulse" style={{ width: "90%" }} />
        <div className="h-4 bg-slate-800 rounded-lg animate-pulse" style={{ width: "60%" }} />
      </div>
    </div>
  );
}
