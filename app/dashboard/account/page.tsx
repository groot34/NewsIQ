import { UserProfile } from "@clerk/nextjs";
import { User } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

export default function AccountPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative container mx-auto py-12 px-6 lg:px-8 space-y-8">
        <PageHeader
          icon={User}
          title="Account Settings"
          description="Manage your account settings and profile information"
        />

        <UserProfile
          routing="hash"
          appearance={{
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#111827",
              colorInputBackground: "rgba(30, 41, 59, 0.5)",
              colorInputText: "#f8fafc",
              colorText: "#f8fafc",
              colorTextSecondary: "#94a3b8",
              colorDanger: "#ef4444",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: {
                width: "100%",
              },
              card: {
                backgroundColor: "rgba(17, 24, 39, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.1)",
              },
              navbar: {
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              },
              navbarButton: {
                color: "#94a3b8",
              },
              navbarButtonIcon: {
                color: "#94a3b8",
              },
              "navbarButton__active": {
                color: "#f8fafc",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
              },
              headerTitle: {
                color: "#f8fafc",
              },
              headerSubtitle: {
                color: "#94a3b8",
              },
              profileSectionTitle: {
                borderColor: "rgba(255, 255, 255, 0.08)",
              },
              profileSectionTitleText: {
                color: "#f8fafc",
              },
              profileSectionContent: {
                color: "#94a3b8",
              },
              profileSectionPrimaryButton: {
                color: "#60a5fa",
              },
              formFieldLabel: {
                color: "#e2e8f0",
              },
              formFieldInput: {
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
              },
              formButtonPrimary: {
                background: "linear-gradient(to right, #2563eb, #7c3aed)",
                border: "none",
              },
              formButtonReset: {
                color: "#94a3b8",
              },
              accordionTriggerButton: {
                color: "#f8fafc",
              },
              accordionContent: {
                backgroundColor: "rgba(15, 23, 42, 0.5)",
              },
              badge: {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              },
              avatarBox: {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              userPreviewMainIdentifier: {
                color: "#f8fafc",
              },
              userPreviewSecondaryIdentifier: {
                color: "#94a3b8",
              },
              identityPreview: {
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              },
              identityPreviewText: {
                color: "#f8fafc",
              },
              identityPreviewEditButton: {
                color: "#60a5fa",
              },
              footer: {
                backgroundColor: "transparent",
              },
              footerActionLink: {
                color: "#60a5fa",
              },
              pageScrollBox: {
                backgroundColor: "transparent",
              },
              page: {
                backgroundColor: "transparent",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
