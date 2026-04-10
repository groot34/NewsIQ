import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="size-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center backdrop-blur-sm shadow-xl shadow-blue-500/10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-white">Loading Dashboard...</h2>
          <p className="text-sm text-slate-400">Fetching your personalized RSS feeds and data</p>
        </div>
      </div>
    </div>
  );
}
