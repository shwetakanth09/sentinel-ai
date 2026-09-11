"use client";

import * as React from "react";
import { FileText, Download, Braces, Share2, Printer, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { downloadFile } from "@/lib/utils";
import { getAIInsights } from "@/lib/ai-assistant";
import { caseData } from "@/lib/report-data";

const reportFindings = [
  {
    id: "F-01",
    text: "Two structurally separable criminal clusters (Mumbai and Pune) are connected by only four bridge entities, of which PERSON-1088 is the highest-betweenness connector. Investigation should prioritize this node for interception and financial tracing.",
    confidence: 0.93,
  },
  {
    id: "F-02",
    text: "Communications surge detected between PERSON-1042 and PERSON-1088 on 2026-09-05, immediately preceding a flagged bulk asset transfer to LOCATION-105 on 2026-09-06.",
    confidence: 0.89,
  },
  {
    id: "F-03",
    text: "PERSON-1042 has the highest composite risk indicator (91) in the dataset, combining very-high proximity to enabled activities, strong network reach and a recent escalation in call frequency.",
    confidence: 0.91,
  },
  {
    id: "F-04",
    text: "Money movement is structured: incoming low-value deposits accumulate at a rely-funds node (ORGANIZATION-101), with high-value onward transfers to remote destinations, consistent with laundering syndicate behavior.",
    confidence: 0.84,
  },
];

export function ReportsPage() {
  const { metrics, activeCaseId, entities, relationships } = useApp();
  const { toast } = useToast();
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const caseInfo = caseData.find((c) => c.id === activeCaseId) ?? caseData[0];
  const insights = getAIInsights();
  const findings = reportFindings;

  const generate = () => {
    setGenerating(true);
    setGenerated(false);
    window.setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast({ title: "Investigation summary generated", description: `${activeCaseId} report ready.`, variant: "success" });
    }, 1500);
  };

  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      caseId: caseInfo.id,
      title: caseInfo.title,
      entities: entities.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        riskIndicator: e.riskIndicator,
        cluster: e.cluster,
        bridge: !!e.bridge,
      })),
      relationships: relationships.map((r) => ({
        source: r.source,
        target: r.target,
        type: r.type,
        confidence: r.confidence,
      })),
      insights: insights.map((i) => ({ title: i.title, confidence: i.confidence })),
    };
    downloadFile(`SENTINEL_${caseInfo.id}.json`, JSON.stringify(payload, null, 2), "application/json");
    toast({ title: "JSON exported", description: "Report exported as JSON.", variant: "success" });
  };

  const exportPdf = () => {
    const html = renderPdfHtml(caseInfo, insights, findings);
    const win = window.open("", "_blank");
    if (!win) {
      toast({ title: "Export blocked", description: "Allow pop-ups to export the report.", variant: "warning" });
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.setTimeout(() => win.print(), 400);
    toast({ title: "PDF ready", description: "Use your browser's print dialog to save as PDF.", variant: "success" });
  };

  const shareCase = () => {
    toast({ title: "Share link copied", description: `${caseInfo.id} shared link copied to clipboard.`, variant: "success" });
    navigator.clipboard?.writeText(`https://sentinel-ai.demo/shared/${caseInfo.id}`);
  };

  const counts = {
    entities: metrics.totalEntities,
    relationships: metrics.totalRelationships,
    clusters: metrics.clusters.length,
    alerts: metrics.totalAlerts,
    bridges: metrics.bridgeEntities.length,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Report Generation</h1>
          <p className="text-xs text-muted">
            Editable, client-side investigation summary for {activeCaseId}.
          </p>
        </div>
        <Button onClick={generate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" /> Generate Investigation Summary
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                CASE INTELLIGENCE SUMMARY
              </CardTitle>
              {generated && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Generated {new Date().toLocaleDateString()}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border bg-card-alt p-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <ReportMeta label="Case ID" value={caseInfo.id} />
                  <ReportMeta label="Title" value={caseInfo.title} />
                  <ReportMeta label="Priority" value={caseInfo.priority} />
                  <ReportMeta label="Status" value={caseInfo.status} />
                </div>
              </div>

              {(generated || generating) ? (
                <>
                  {generating && <ReportSkeleton />}
                  {generated && <ReportPreview counts={counts} insights={insights} findings={findings} />}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <Printer className="h-8 w-8 text-muted" />
                  <p className="text-sm font-medium text-foreground">No report generated yet</p>
                  <p className="max-w-sm text-xs text-muted">
                    Click “Generate Investigation Summary” to build the case analysis from the
                    synthetic knowledge graph.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={exportPdf} disabled={!generated && !generating}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
              <Button className="w-full" variant="outline" onClick={exportJson} disabled={!generated && !generating}>
                <Braces className="h-4 w-4" /> Export JSON
              </Button>
              <Button className="w-full" variant="secondary" onClick={shareCase}>
                <Share2 className="h-4 w-4" /> Share Case
              </Button>
              <p className="pt-1 text-[10px] leading-snug text-muted-light">
                PDF export is client-side (browser print). All data is synthetic demo data —
                generated reports are not official police documents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReportMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 rounded-md bg-border/30" />
      <div className="h-40 rounded-md bg-border/30" />
      <div className="h-20 rounded-md bg-border/30" />
    </div>
  );
}

function ReportPreview({
  counts,
  insights,
  findings,
}: {
  counts: { entities: number; relationships: number; clusters: number; alerts: number; bridges: number };
  insights: ReturnType<typeof getAIInsights>;
  findings: Array<{ id: string; text: string; confidence: number }>;
}) {
  const statRow: Array<[string, number]> = [
    ["Entities analyzed", counts.entities],
    ["Relationships", counts.relationships],
    ["Clusters", counts.clusters],
    ["Pattern alerts", counts.alerts],
    ["Key bridge entities", counts.bridges],
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {statRow.map(([label, value]) => (
          <div key={label} className="rounded-md border border-border bg-card p-3 text-center">
            <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="mt-0.5 text-[10px] text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          AI Findings
        </h3>
        <div className="space-y-2">
          {findings.map((f) => (
            <div key={f.id} className="rounded-md border border-border bg-card-alt p-3">
              <p className="text-xs font-medium text-foreground">{f.text}</p>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={f.confidence * 100} className="h-1 w-32" />
                <span className="text-[10px] tabular-nums text-muted">
                  {Math.round(f.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Evidence & Confidence
        </h3>
        <div className="space-y-2">
          {insights.map((i) => (
            <div key={i.id} className="flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{i.title}</p>
                <p className="mt-0.5 text-[11px] text-muted">{i.summary}</p>
                <p className="mt-1 text-[10px] text-muted-light">{i.evidenceCount} evidence items</p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {Math.round(i.confidence * 100)}%
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <p className="text-center text-[10px] text-muted-light">
        Prepared for demonstration · DEMO ENVIRONMENT — All investigation data is synthetic.
        AI-generated insights are decision-support indicators and require human verification.
      </p>
    </div>
  );
}

function renderPdfHtml(
  caseInfo: typeof caseData[number],
  insights: ReturnType<typeof getAIInsights>,
  findings: { id: string; text: string; confidence: number }[]
) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>SENTINEL AI — ${caseInfo.id}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #111; margin: 40px; }
  h1 { font-size: 22px; margin-bottom: 2px; }
  .sub { color: #555; font-size: 13px; margin-bottom: 24px; }
  .meta { display: flex; gap: 28px; margin-bottom: 24px; }
  .meta b { display: block; font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: .5px; }
  .meta span { font-size: 14px; }
  h2 { font-size: 15px; margin-top: 26px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
  .stats { display: flex; gap: 12px; flex-wrap: wrap; }
  .stat { border: 1px solid #ddd; border-radius: 8px; padding: 14px 20px; text-align: center; }
  .stat b { display: block; font-size: 24px; }
  .stat span { font-size: 11px; color: #555; }
  .finding { margin: 8px 0; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; }
  .finding .conf { display: flex; align-items: center; gap: 10px; margin-top: 6px; font-size: 12px; }
  .bar { height: 8px; background: #eee; border-radius: 4px; width: 160px; overflow: hidden; }
  .bar i { display: block; height: 100%; background: #2563eb; }
  .disclaimer { margin-top: 32px; font-size: 10px; color: #777; border-top: 1px solid #ccc; padding-top: 12px; }
</style>
</head>
<body>
  <h1>SENTINEL AI — CASE INTELLIGENCE SUMMARY</h1>
  <div class="sub">${caseInfo.title} · Generated ${new Date().toLocaleString()}</div>
  <div class="meta">
    <div><b>Case ID</b><span>${caseInfo.id}</span></div>
    <div><b>Priority</b><span>${caseInfo.priority}</span></div>
    <div><b>Status</b><span>${caseInfo.status}</span></div>
  </div>
  <h2>Overview</h2>
  <div class="stats">
    <div class="stat"><b>${caseInfo.entityCount}</b><span>Entities</span></div>
    <div class="stat"><b>${caseInfo.relationshipCount}</b><span>Relationships</span></div>
    <div class="stat"><b>${caseInfo.clusterCount}</b><span>Clusters</span></div>
    <div class="stat"><b>${caseInfo.alertCount}</b><span>Pattern alerts</span></div>
    <div class="stat"><b>${caseInfo.bridgeEntityCount}</b><span>Bridge entities</span></div>
  </div>
  <h2>AI Findings</h2>
  ${findings.map((f) => `
    <div class="finding">
      ${f.text}
      <div class="conf">
        <div class="bar"><i style="width:${Math.round(f.confidence * 100)}%"></i></div>
        ${Math.round(f.confidence * 100)}%
      </div>
    </div>`).join("")}
  <h2>Evidence & Confidence</h2>
  ${insights.map((i) => `
    <div class="finding">
      <b>${i.title}</b> — ${i.summary}
      <div>${i.evidenceCount} evidence items · ${Math.round(i.confidence * 100)}% confidence</div>
    </div>`).join("")}
  <div class="disclaimer">
    DEMO ENVIRONMENT — All investigation data is synthetic. AI-generated insights are
    decision-support indicators and require human verification. Not an official police document.
  </div>
</body>
</html>`;
}