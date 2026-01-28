import { auth } from "@clerk/nextjs/server";
import { Settings as SettingsIcon } from "lucide-react";
import { getCurrentUserSettings } from "@/actions/user-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
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
                Please sign in to access settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const settings = await getCurrentUserSettings();

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          icon={SettingsIcon}
          title="Settings"
          description="Configure default settings for your newsletter generation"
        />

        {/* Settings Form */}
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
