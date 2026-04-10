import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { History as HistoryIcon } from "lucide-react";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-12">
        <PageHeader
          icon={HistoryIcon}
          title="Newsletter History"
          description="View and manage your saved newsletters"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 h-[200px] animate-pulse">
              <div className="h-6 w-3/4 bg-slate-800 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-800/50 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-800/50 rounded"></div>
              </div>
              <div className="mt-8 flex justify-between">
                <div className="h-4 w-20 bg-slate-800/50 rounded"></div>
                <div className="h-8 w-24 bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
