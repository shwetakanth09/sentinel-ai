"use client";

import * as React from "react";
import { FolderKanban, ArrowUpRight, Users, GitFork, BellRing, Link2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STATUS_STYLES: Record<string, string> = {
  Active: "border-green/30 text-green",
  "Under Review": "border-amber/30 text-amber",
  Closed: "border-muted/30 text-muted",
};

export function CasesPage() {
  const { cases, activeCaseId, setActiveCaseId } = useApp();
  const router = useRouter();

  const active = (id: string) => activeCaseId === id;

  const openCase = (id: string) => {
    setActiveCaseId(id);
    router.push("/");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Investigations</h1>
          <p className="text-xs text-muted">Active and archived case folders</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <FolderKanban className="h-3 w-3" /> {cases.length} cases
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {cases.map((c) => {
          const isActive = active(c.id);
          return (
            <Card
              key={c.id}
              className={cn(
                "cursor-pointer transition-all",
                isActive && "border-accent/50 ring-1 ring-accent/20"
              )}
            >
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm text-foreground">{c.id}</CardTitle>
                  <p className="mt-0.5 text-[11px] text-muted">{c.title}</p>
                </div>
                <Badge variant={STATUS_STYLES[c.status] as "secondary"}>{c.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {c.entityCount} entities
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {c.relationshipCount} links
                  </span>
                  <span className="flex items-center gap-1">
                    <BellRing className="h-3 w-3" /> {c.alertCount} alerts
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{c.priority}</Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Link2 className="h-3 w-3" /> network linked
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant={isActive ? "secondary" : "outline"} onClick={() => openCase(c.id)}>
                    {isActive ? <>Active case</> : <>Open in Dashboard</>}
                    {!isActive && <ArrowUpRight className="h-3 w-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}