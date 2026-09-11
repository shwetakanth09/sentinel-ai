"use client";

import * as React from "react";
import { FileText, ScanSearch, Plus, Check, Loader2, Braces } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getEntity } from "@/data/entities";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_CONFIG } from "@/lib/entity-config";
import type { EntityType } from "@/types";

const TYPE_BADGE: Record<string, string> = {
  PERSON: "default",
  LOCATION: "success",
  ORGANIZATION: "purple",
  VEHICLE: "warning",
  PHONE: "cyan",
};

export function NlpAnalysisPage() {
  const { nlpDocuments, addToNetwork } = useApp();
  const { toast } = useToast();
  const [docId, setDocId] = React.useState("DOC-001");
  const [analyzing, setAnalyzing] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const doc = nlpDocuments.find((d) => d.id === docId) ?? nlpDocuments[0];

  const runAnalysis = () => {
    setAnalyzing(true);
    setAdded(false);
    window.setTimeout(() => {
      setAnalyzing(false);
      toast({ title: "AI entity extraction complete", description: `Parsed ${doc.extractedEntities.length} entities and ${doc.extractedRelationships.length} relationships.`, variant: "success" });
    }, 1400);
  };

  const addToGraph = () => {
    const nameToId = new Map(
      doc.extractedEntities.map((e) => [e.name, e.id])
    );
    const resolved = doc.extractedRelationships
      .map((r) => ({
        source: nameToId.get(r.source) ?? r.source,
        target: nameToId.get(r.target) ?? r.target,
        type: r.type as "MET" | "CONTACTED" | "ASSOCIATED_WITH" | "OBSERVED_AT" | "ATTENDED" | "CONNECTED_TO" | "CALLED" | "WORKS_FOR" | "LOCATED_AT" | "USED" | "TRANSFERRED_TO" | "REGISTERED_TO",
      }))
      .filter((r) => !!getEntity(r.source) && !!getEntity(r.target));
    addToNetwork(resolved);
    setAdded(true);
    toast({
      title: "Relationships added to network",
      description: `${resolved.length} resolved edges added to the knowledge graph.`,
      variant: "success",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">NLP / Document Analysis</h1>
          <p className="text-xs text-muted">
            Demonstrate unstructured text → structured intelligence extraction pipeline.
          </p>
        </div>
        <div className="flex gap-1.5">
          {nlpDocuments.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDocId(d.id);
                setAdded(false);
                setAnalyzing(false);
              }}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer",
                docId === d.id
                  ? "border-accent/50 bg-accent text-white"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              {d.title.split("·")[1] ?? d.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted" />
              Source Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border bg-card-alt p-4 font-mono text-xs leading-relaxed text-foreground">
              {doc.content.split(/(Arjun Mehta|Rahul Sharma|Hotel Alpha|Organization X|Location Y|Neha Verma|Sanjay Gupta|Loc Central Tower|Organization Gamma|LOCATION East Depot|Phone 88121)/g).map((part, i) => {
                const hl =
                  part === "Arjun Mehta" ||
                  part === "Rahul Sharma" ||
                  part === "Neha Verma" ||
                  part === "Sanjay Gupta" ||
                  part === "Hotel Alpha" ||
                  part === "Organization X" ||
                  part === "Location Y" ||
                  part === "Loc Central Tower" ||
                  part === "Organization Gamma" ||
                  part === "LOCATION East Depot" ||
                  part === "Phone 88121";
                return hl ? (
                  <mark key={i} className="rounded bg-accent/20 px-0.5 text-accent">
                    {part}
                  </mark>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-muted-light">{doc.source} · synthetic report</p>
              <Button size="sm" variant="outline" onClick={runAnalysis} disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-3.5 w-3.5" /> Run AI Extraction
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-4 w-4 text-purple" />
                Extracted Entities ({doc.extractedEntities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted">
                      <th className="px-4 py-2 font-medium">Entity</th>
                      <th className="px-4 py-2 font-medium">Type</th>
                      <th className="px-4 py-2 font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.extractedEntities.map((e) => {
                      const known = getEntity(e.id);
                      return (
                        <tr key={e.name} className="border-b border-border/50">
                          <td className="px-4 py-2">
                            <span className="font-medium text-foreground">{e.name}</span>
                            {known && (
                              <span className="ml-1.5 text-[10px] text-muted-light">
                                → {known.id}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <Badge variant={(TYPE_BADGE as Record<string, "default">)[e.type] ?? "secondary"}>
                              {e.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 tabular-nums text-muted">
                            {Math.round(e.confidence * 100)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-cyan" />
                Extracted Relationships ({doc.extractedRelationships.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1.5 p-4">
                {doc.extractedRelationships.map((r, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-card-alt px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-foreground">{r.source}</span>
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      {r.type}
                    </span>
                    <span className="font-medium text-foreground">{r.target}</span>
                    <span className="ml-auto text-[10px] tabular-nums text-muted">
                      {Math.round(r.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={addToGraph}
            disabled={added}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Network
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to Network
              </>
            )}
          </Button>
          <p className="text-center text-[10px] text-muted-light">
            Adds these relationships to the knowledge graph for CASE-2026-014.
          </p>
        </div>
      </div>
    </div>
  );
}