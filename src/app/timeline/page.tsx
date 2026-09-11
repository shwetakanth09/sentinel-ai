"use client";

import { Suspense } from "react";
import { TimelinePage } from "@/components/timeline/timeline-page";

export default function TimelineRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted">Loading timeline…</div>}>
      <TimelinePage />
    </Suspense>
  );
}