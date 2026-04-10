import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-12">
        <PageHeader
          icon={SettingsIcon}
          title="Settings"
          description="Configure default settings for your newsletter generation"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((section) => (
            <div key={section} className="glass-card rounded-xl overflow-hidden animate-pulse">
              <div className="p-6 border-b border-slate-800 space-y-2">
                <div className="h-6 w-1/4 bg-slate-800 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-800/50 rounded"></div>
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((input) => (
                  <div key={input} className="space-y-2">
                    <div className="h-4 w-24 bg-slate-800/50 rounded"></div>
                    <div className="h-10 w-full bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
