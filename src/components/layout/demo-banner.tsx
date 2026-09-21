"use client";

import { ShieldCheck } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-accent/20 bg-accent/10 px-4">
      <ShieldCheck className="h-3 w-3 shrink-0 text-accent" />
      <p className="truncate text-[11px] font-medium tracking-wide text-accent">
        Authorized investigation environment — access is monitored. AI-generated insights are
        decision-support indicators and require human verification.
      </p>
    </div>
  );
}