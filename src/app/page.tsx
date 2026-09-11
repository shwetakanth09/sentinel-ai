"use client";

import Link from "next/link";
import { Share2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { RecentAlertsTable } from "@/components/dashboard/recent-alerts-table";
import { DataStatusPanel, ActiveCasesPanel } from "@/components/dashboard/data-status-panel";
import { NetworkGraph } from "@/components/network/network-graph";
import { GraphLegend } from "@/components/network/graph-legend";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { metrics } = useApp();

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Investigation Overview
          </h1>
          <p className="text-xs text-muted">
            AI-assisted analysis of connected entities, events and relationships.
          </p>
        </div>
        <Link href="/network-explorer">
          <Button variant="outline" size="sm">
            Open Network Explorer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total Entities" value={metrics.totalEntities} icon="Users" accent="text-accent" sub="37 analyzed in CASE-2026-014" />
        <KpiCard label="Relationships" value={metrics.totalRelationships} icon="GitBranch" accent="text-cyan" sub="94 edges across 3 clusters" />
        <KpiCard label="Active Alerts" value={metrics.totalAlerts} icon="Bell" accent="text-amber" sub="1 high · 3 medium · 4 low" />
        <KpiCard label="High-Risk Indicators" value={metrics.highRiskIndicators} icon="Activity" accent="text-red" sub="Risk ≥ 70 · require review" />
      </div>

      <div className="mb-4 grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Share2 className="h-4 w-4 text-accent" />
                Network Intelligence
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green" />
                  {metrics.totalEntities} entities · {metrics.totalRelationships} relationships
                </span>
              </div>
            </div>
            <div className="h-[430px]">
              <NetworkGraph />
            </div>
            <div className="border-t border-border px-4 py-2">
              <GraphLegend compact />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <AIInsightsPanel />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-4">
          <DataStatusPanel />
        </div>
        <div className="col-span-12 md:col-span-4">
          <ActiveCasesPanel />
        </div>
        <div className="col-span-12 md:col-span-4">
          <RecentDetectionsPanel />
        </div>
      </div>

      <RecentAlertsTable />
    </div>
  );
}

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { entities } from "@/data/entities";

function RecentDetectionsPanel() {
  const recent = entities
    .sort((a, b) => b.riskIndicator - a.riskIndicator)
    .slice(0, 6);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple" />
          Recent AI Detections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {recent.map((e) => (
          <Link
            key={e.id}
            href={`/entities/${e.id}`}
            className="flex items-center justify-between rounded-md border border-border bg-card-alt px-3 py-1.5 transition-colors hover:border-border-light"
          >
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-medium text-foreground">{e.name}</span>
              <span className="block text-[10px] text-muted">{e.id}</span>
            </span>
            <span
              className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${
                e.riskIndicator >= 70
                  ? "border-red/30 bg-red/10 text-red"
                  : e.riskIndicator >= 40
                  ? "border-amber/30 bg-amber/10 text-amber"
                  : "border-green/30 bg-green/10 text-green"
              }`}
            >
              {e.riskIndicator}
            </span>
          </Link>
        ))}
        <p className="pt-1 text-[10px] text-muted-light">
          Top risk indicators require human verification before action.
        </p>
      </CardContent>
    </Card>
  );
}