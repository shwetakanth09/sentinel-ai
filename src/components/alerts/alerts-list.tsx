"use client";

import * as React from "react";
import { AlertTriangle, Share2, FileText, CheckCheck } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { getEntityName } from "@/data/entities";
import { formatDateTime } from "@/lib/utils";
import type { PatternAlert } from "@/types";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const SEVERITY_STYLE = {
  HIGH: { badge: "destructive", ring: "border-red/40" },
  MEDIUM: { badge: "warning", ring: "border-amber/40" },
  LOW: { badge: "secondary", ring: "border-border" },
} as const;

export function AlertsList() {
  const { alerts, markAlertReviewed } = useApp();
  const [filter, setFilter] = React.useState<"ALL" | "NEEDS_REVIEW" | "REVIEWED">("ALL");
  const [selected, setSelected] = React.useState<PatternAlert | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const filtered = alerts.filter((a) => {
    if (filter === "NEEDS_REVIEW") return a.status === "needs_review";
    if (filter === "REVIEWED") return a.status === "reviewed";
    return true;
  });

  const ordered = [...filtered].sort((a, b) => {
    const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  const counts = {
    ALL: alerts.length,
    NEEDS_REVIEW: alerts.filter((a) => a.status === "needs_review").length,
    REVIEWED: alerts.filter((a) => a.status === "reviewed").length,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">AI Pattern Detection</h1>
          <p className="text-xs text-muted">
            Automated pattern and anomaly detection across the investigation graph.
          </p>
        </div>
        <div className="flex gap-1.5">
          {(["ALL", "NEEDS_REVIEW", "REVIEWED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                filter === f
                  ? "border-accent/50 bg-accent text-white"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {f === "ALL" ? "All" : f.replace("_", " ")} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ordered.map((a) => {
          const style = SEVERITY_STYLE[a.severity];
          return (
            <Card key={a.id} className={`transition-colors hover:border-border-light ${style.ring}`}>
              <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                      a.severity === "HIGH"
                        ? "border-red/40 bg-red/10 text-red"
                        : a.severity === "MEDIUM"
                        ? "border-amber/40 bg-amber/10 text-amber"
                        : "border-border bg-card-alt text-muted"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                      <Badge variant={style.badge}>{a.severity}</Badge>
                      <Badge variant={a.status === "reviewed" ? "success" : "warning"}>
                        {a.status === "needs_review" ? "Needs Review" : "Reviewed"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.entities.map((eid) => (
                        <span
                          key={eid}
                          className="rounded border border-border bg-card-alt px-2 py-0.5 text-[10px] text-foreground"
                        >
                          {getEntityName(eid)} ({eid})
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted">
                        Confidence
                        <Progress
                          value={a.confidence * 100}
                          className="w-24"
                          color={a.confidence >= 0.8 ? "bg-red" : "bg-amber"}
                        />
                        <span className="tabular-nums">{Math.round(a.confidence * 100)}%</span>
                      </div>
                      <span className="text-[11px] text-muted-light">
                        Detected {formatDateTime(a.detected)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const first = a.entities[0];
                      if (first) {
                        window.dispatchEvent(new CustomEvent("focus-entity", { detail: first }));
                      }
                      router.push("/network-explorer");
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    View Graph
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelected(a)}>
                    <FileText className="h-3.5 w-3.5" />
                    Evidence
                  </Button>
                  {a.status === "needs_review" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        markAlertReviewed(a.id);
                        toast({ title: "Alert marked reviewed", description: a.title, variant: "success" });
                      }}
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark Reviewed
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-green">
                      <CheckCheck className="h-3.5 w-3.5" /> Reviewed
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertEvidenceDialog alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function AlertEvidenceDialog({
  alert,
  onClose,
}: {
  alert: PatternAlert | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!alert} onOpenChange={(o) => (o ? null : onClose())}>
      {alert && (
        <>
          <DialogHeader>
            <div>
              <DialogTitle>{alert.title}</DialogTitle>
              <DialogDescription>
                Pattern: {alert.pattern} · Detected {formatDateTime(alert.detected)}
              </DialogDescription>
            </div>
            <DialogClose onClose={onClose} />
          </DialogHeader>
          <DialogContent>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Description
                </p>
                <p className="text-xs leading-relaxed text-foreground">{alert.description}</p>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Evidence ({alert.evidence.length})
                </p>
                <ul className="space-y-1.5">
                  {alert.evidence.map((ev, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-md border border-border bg-card-alt px-3 py-2 text-xs text-muted"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-card-alt px-3 py-2">
                <span className="text-xs text-muted">Confidence</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {Math.round(alert.confidence * 100)}%
                </span>
              </div>
              <p className="text-[10px] text-muted-light">
                AI-generated investigative lead · requires independent verification.
              </p>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}