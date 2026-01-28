import { auth } from "@clerk/nextjs/server";
import { Crown, History as HistoryIcon } from "lucide-react";
import { getNewslettersByUserId } from "@/actions/newsletter";
import { upsertUserFromClerk } from "@/actions/user";
import { NewsletterHistoryList } from "@/components/dashboard/newsletter-history-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingCards } from "@/components/dashboard/pricing-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HistoryPage() {
  const { userId, has } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
        <div className="container mx-auto py-12 px-6 lg:px-8">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-base">
                Please sign in to view your newsletter history.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const isPro = true; // Enabled for all users
  const user = await upsertUserFromClerk(userId);
  const newsletters = await getNewslettersByUserId(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          icon={HistoryIcon}
          title="Newsletter History"
          description="View and manage your saved newsletters"
        />

        {/* Free User Upgrade Prompt */}
        {/* Free User Upgrade Prompt Removed */}

        {/* Newsletter List */}
        {/* Newsletter List */}
        <NewsletterHistoryList newsletters={newsletters} />
      </div>
    </div>
  );
}
