import { auth } from "@clerk/nextjs/server";
import { History as HistoryIcon } from "lucide-react";
import { getNewslettersByUserId } from "@/actions/newsletter";
import { upsertUserFromClerk } from "@/actions/user";
import { NewsletterHistoryList } from "@/components/dashboard/newsletter-history-list";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="relative container mx-auto py-12 px-6 lg:px-8">
          <Card className="glass-card border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-base text-slate-400">
                Please sign in to view your newsletter history.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const user = await upsertUserFromClerk(userId);
  const newsletters = await getNewslettersByUserId(user.id);

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          icon={HistoryIcon}
          title="Newsletter History"
          description="View and manage your saved newsletters"
        />

        {/* Newsletter List */}
        <NewsletterHistoryList newsletters={newsletters} />
      </div>
    </div>
  );
}
