import type React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
