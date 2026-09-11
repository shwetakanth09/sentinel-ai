"use client";

import { Users, GitBranch, Bell, Activity, Database, FolderKanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICONS = { Users, GitBranch, Bell, Activity, Database, FolderKanban };

export function KpiCard({
  label,
  value,
  icon,
  trend,
  accent = "text-accent",
  sub,
}: {
  label: string;
  value: number | string;
  icon: keyof typeof ICONS;
  trend?: string;
  accent?: string;
  sub?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <Card className="transition-colors hover:border-border-light">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
          <Icon className={cn("h-4 w-4", accent)} />
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{value}</p>
        {trend && (
          <p className={cn("mt-1 text-[11px]", trend.startsWith("+") ? "text-green" : "text-amber")}>
            {trend}
          </p>
        )}
        {sub && <p className="mt-0.5 text-[11px] text-muted">{sub}</p>}
      </CardContent>
    </Card>
  );
}