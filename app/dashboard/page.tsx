import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { NewsletterGenerator } from "@/components/dashboard/newsletter-generator"
import { RssFeedManager } from "@/components/dashboard/rss-feed-manager";

async function Dashboard() {
  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <PageHeader
          icon={Sparkles}
          title="Dashboard"
          description="Manage your RSS feeds and generate AI-powered newsletters"
        />

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - RSS Feed Manager */}
          <div>
            <RssFeedManager />
          </div>

          {/* Right Column - Newsletter Generator */}
          <div>
            <NewsletterGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
