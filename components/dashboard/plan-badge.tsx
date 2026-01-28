"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PlanBadge() {
  return (
    <Badge className="gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all">
      <Sparkles className="h-3.5 w-3.5" />
      <span className="font-semibold">Free</span>
    </Badge>
  );
}
