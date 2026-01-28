import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
        <Icon className="size-7" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-lg text-slate-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
