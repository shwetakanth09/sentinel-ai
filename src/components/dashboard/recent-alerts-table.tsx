"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/components/providers/app-provider";
import { getEntityName } from "@/data/entities";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RecentAlertsTable() {
  const { alerts } = useApp();
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber" />
          <CardTitle>Recent Alerts</CardTitle>
        </div>
        <Link href="/alerts" className="text-[11px] text-accent hover:underline">
          View all →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted">
                <th className="px-4 py-2 font-medium">Severity</th>
                <th className="px-4 py-2 font-medium">Alert</th>
                <th className="px-4 py-2 font-medium">Entities</th>
                <th className="px-4 py-2 font-medium">Detected</th>
                <th className="px-4 py-2 font-medium">Confidence</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-b border-border/50 transition-colors hover:bg-card-alt">
                  <td className="px-4 py-2.5">
                    <Badge
                      variant={
                        a.severity === "HIGH"
                          ? "destructive"
                          : a.severity === "MEDIUM"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {a.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{a.title}</td>
                  <td className="px-4 py-2.5 text-muted">
                    <span className="text-foreground">{a.entities.length}</span> entities
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {formatDateTime(a.detected).split(",")[0]}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-10 overflow-hidden rounded-full bg-border">
                        <div
                          className={cn(
                            "h-full",
                            a.confidence >= 0.8 ? "bg-red" : a.confidence >= 0.7 ? "bg-amber" : "bg-accent"
                          )}
                          style={{ width: `${a.confidence * 100}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-muted">
                        {Math.round(a.confidence * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={a.status === "reviewed" ? "success" : "warning"}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}