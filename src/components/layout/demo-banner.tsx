"use client";

import { ShieldCheck } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-amber/20 bg-amber/10 px-4">
      <ShieldCheck className="h-3 w-3 shrink-0 text-amber" />
      <p className="truncate text-[11px] font-medium tracking-wide text-amber">
        Demonstration project — all entities, people and events are fictional. No real data
        was used. AI output is decision-support only and requires human verification.
      </p>
    </div>
  );
}