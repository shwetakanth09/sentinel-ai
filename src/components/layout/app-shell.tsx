"use client";

import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { DemoBanner } from "./demo-banner";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/network-explorer": "Network Explorer",
  "/entities": "Entities",
  "/alerts": "Alerts",
  "/data-sources": "Data Sources",
  "/cases": "Investigations",
  "/assistant": "AI Assistant",
  "/reports": "Reports",
  "/timeline": "Timeline",
  "/nlp-analysis": "Document Analysis",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const label = ROUTE_LABELS[pathname] ?? (pathname.startsWith("/entities/") ? "Entity" : "Sentinel");
  const isDashboard = pathname === "/";

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <DemoBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-screen-2xl px-5 py-4">
              {!isDashboard && (
                <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted">
                  <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Home className="h-3 w-3" />
                    Sentinel
                  </Link>
                  <ChevronRight className="h-3 w-3 text-muted-light" />
                  <span className="text-foreground">{label}</span>
                </nav>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}