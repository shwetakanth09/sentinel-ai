"use client";

import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAIInsights } from "@/lib/ai-assistant";

export function AIInsightsPanel() {
  const insights = getAIInsights();
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <CardTitle>AI Intelligence Summary</CardTitle>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-medium text-green border border-green/20">
          <CheckCircle2 className="h-3 w-3" />
          Explainable
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="rounded-md border border-border bg-card-alt p-3 transition-colors hover:border-border-light"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">{ins.title}</p>
              <Badge variant="secondary" className="shrink-0">
                {Math.round(ins.confidence * 100)}% conf
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-muted">{ins.summary}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-light">
                {ins.evidenceCount} evidence items
              </span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-accent">
                View Evidence <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2">
              <Progress value={ins.confidence * 100} className="h-1" />
            </div>
          </div>
        ))}
        <p className="text-[10px] leading-snug text-muted-light">
          AI-generated insights are decision-support indicators and require human verification.
        </p>
      </CardContent>
    </Card>
  );
}