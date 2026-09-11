"use client";

import * as React from "react";
import {
  FileText,
  Phone,
  Banknote,
  Video,
  Share2,
  ShieldAlert,
  Radar,
  Car,
  MapPin,
  UploadCloud,
  Database,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/utils";
import { demoProcessingTotals } from "@/data/sources";
import { cn } from "@/lib/utils";

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Phone,
  Banknote,
  Video,
  Share2,
  ShieldAlert,
  Radar,
  Car,
  MapPin,
};

const PIPELINE_STEPS = [
  "Data Received",
  "Cleaning & Normalization",
  "Entity Extraction",
  "Entity Resolution",
  "Relationship Extraction",
  "Graph Construction",
  "Pattern Detection",
  "AI Analysis",
];

export function DataSourcesPage() {
  const { dataSources } = useApp();
  const { toast } = useToast();
  const [processing, setProcessing] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(-1);
  const [done, setDone] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const runPipeline = () => {
    setProcessing(true);
    setDone(false);
    setStepIndex(0);
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setStepIndex(i);
      if (i >= PIPELINE_STEPS.length) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setProcessing(false);
          setDone(true);
          toast({
            title: "Processing complete",
            description: "Synthetic dataset ingested and merged into CASE-2026-014.",
            variant: "success",
          });
        }, 400);
        setStepIndex(PIPELINE_STEPS.length);
      }
    }, 700);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    toast({
      title: "File received",
      description: `${file.name} flagged for demo ingestion (not actually parsed).`,
      variant: "info",
    });
    runPipeline();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-foreground">Data Sources</h1>
        <p className="text-xs text-muted">
          Multi-source ingestion and normalization for CASE-2026-014 · synthetic demo data only.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dataSources.map((s) => {
          const Icon = SOURCE_ICONS[s.icon] ?? Database;
          return (
            <Card
              key={s.id}
              className="transition-colors hover:border-border-light"
            >
              <CardContent className="p-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card-alt text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted">{s.records} records · {s.format}</p>
                    </div>
                  </div>
                  {s.processed ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Processed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="mt-2 text-[11px] leading-snug text-muted">{s.description}</p>
                <p className="mt-1.5 text-[10px] text-muted-light">
                  {formatDateTime(s.lastIngested)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-accent" />
            Demo Ingestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-card-alt px-4 py-6 text-center transition-colors hover:border-accent/40">
              <UploadCloud className="h-5 w-5 text-muted" />
              <span className="text-xs text-muted">
                Drop CSV, JSON, TXT or PDF here to demo-upload
                <span className="block text-[10px] text-muted-light">No real parsing — simulated pipeline</span>
              </span>
              <input type="file" className="hidden" accept=".csv,.json,.txt,.pdf" onChange={handleFile} />
            </label>
            <div className="flex flex-col justify-center gap-2">
              <Button onClick={runPipeline} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Load Demo Dataset
                  </>
                )}
              </Button>
              {fileName && (
                <p className="text-[10px] text-muted-light">{fileName} accepted</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {(processing || done) && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan" />
              Processing Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PIPELINE_STEPS.map((step, i) => {
                const status =
                  stepIndex > i ? "done" : stepIndex === i ? "active" : "pending";
                return (
                  <div
                    key={step}
                    className={cn(
                      "relative rounded-md border p-3 transition-all duration-500",
                      status === "done" && "border-green/40 bg-green/5",
                      status === "active" && "border-accent/50 bg-accent/10 scale-[1.02]",
                      status === "pending" && "border-border bg-card-alt opacity-50"
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                          status === "done" && "bg-green text-white",
                          status === "active" && "bg-accent text-white",
                          status === "pending" && "bg-border text-muted"
                        )}
                      >
                        {status === "done" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      {status === "active" && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-[11px] font-medium",
                        status === "done" && "text-green",
                        status === "active" && "text-accent",
                        status === "pending" && "text-muted"
                      )}
                    >
                      {step}
                    </p>
                    <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-border">
                      {status === "active" && (
                        <div className="animate-progress h-full bg-accent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {done && (
              <div className="mt-4 animate-fade-in rounded-lg border border-green/30 bg-green/5 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-green">
                  <CheckCircle2 className="h-4 w-4" />
                  Processing Complete
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Entities discovered" value={demoProcessingTotals.entities} />
                  <Stat label="Relationships discovered" value={demoProcessingTotals.relationships} />
                  <Stat label="Patterns detected" value={demoProcessingTotals.patterns} />
                  <Stat label="High-priority indicators" value={demoProcessingTotals.highPriority} accent="text-red" />
                </div>
                <p className="mt-3 text-[10px] text-muted-light">
                  All records are synthetic demo data. No real criminal or personal information was processed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "text-foreground",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <p className={cn("text-xl font-bold tabular-nums", accent)}>{value.toLocaleString()}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}