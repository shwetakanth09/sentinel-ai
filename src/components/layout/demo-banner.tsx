"use client";

import { TriangleAlert } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-amber/20 bg-amber/10 px-4">
      <TriangleAlert className="h-3 w-3 shrink-0 text-amber" />
      <p className="truncate text-[11px] font-medium tracking-wide text-amber">
        DEMO ENVIRONMENT — All investigation data is synthetic. AI-generated insights are
        decision-support indicators and require human verification.
      </p>
    </div>
  );
}