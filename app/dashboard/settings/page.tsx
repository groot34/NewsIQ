import { auth } from "@clerk/nextjs/server";
import { Crown, Settings as SettingsIcon } from "lucide-react";
import { getCurrentUserSettings } from "@/actions/user-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingCards } from "@/components/dashboard/pricing-cards";
import { SettingsForm } from "@/components/dashboard/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
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
                Please sign in to access settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const isPro = true; // Enabled for all users
  const settings = await getCurrentUserSettings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          icon={SettingsIcon}
          title="Settings"
          description="Configure default settings for your newsletter generation. These settings will be automatically applied to all newsletters you create."
        />

        {/* Free User Upgrade Prompt */}
        {/* Free User Upgrade Prompt Removed */}

        {/* Settings Form */}
        {/* Settings Form */}
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
