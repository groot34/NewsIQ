"use client";

import { SignOutButton } from "@clerk/nextjs";
import { History, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlanBadge } from "./plan-badge";

export function DashboardHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/history",
      label: "History",
      icon: History,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/dashboard/account",
      label: "Account",
      icon: User,
    },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0d1220]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0d1220]/80">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold premium-gradient-text">
                NewsIQ
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard/history" &&
                    pathname.startsWith("/dashboard/history")) ||
                  (item.href === "/dashboard/account" &&
                    pathname.startsWith("/dashboard/account"));
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700"
                          : "text-slate-400 hover:text-white hover:bg-slate-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <PlanBadge />
            <SignOutButton>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard/history" &&
                pathname.startsWith("/dashboard/history")) ||
              (item.href === "/dashboard/account" &&
                pathname.startsWith("/dashboard/account"));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 transition-all shrink-0",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-800",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
