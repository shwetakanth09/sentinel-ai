"use client";

import * as React from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { cases, activeCaseId, setActiveCaseId, user, logout } = useApp();
  const activeCase = cases.find((c) => c.id === activeCaseId);
  const [query, setQuery] = React.useState("");
  const open = query.trim().length > 0;

  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-light" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities, phone numbers, vehicles, organizations..."
          className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-light focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
        {open && <QuickSearch query={query} onClose={() => setQuery("")} />}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          className="relative rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-card-alt transition-colors"
          title="Case selector"
          onClick={() => {
            const next = cases.map((c) => c.id);
            const idx = next.indexOf(activeCaseId);
            setActiveCaseId(next[(idx + 1) % next.length]);
          }}
        >
          <span className="flex items-center gap-1.5">
            {activeCase?.id ?? "No Case"}
            <ChevronDown className="h-3 w-3 text-muted" />
          </span>
        </button>

        <div className="hidden h-4 w-px bg-border sm:block" />

        <button className="relative rounded-md border border-border bg-card p-1.5 text-muted hover:text-foreground hover:bg-card-alt transition-colors cursor-pointer" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red text-[8px] font-bold text-white">
            {useAppAlertCount()}
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            {user ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-medium leading-tight text-foreground">
              {user ? user.name : "Investigator"}
            </p>
            <p className="text-[10px] leading-tight text-muted">{user ? user.role : "Analyst"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out"
          className="rounded-md border border-border bg-card p-1.5 text-muted hover:text-foreground hover:bg-card-alt transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function useAppAlertCount() {
  const { alerts } = useApp();
  return alerts.filter((a) => a.status !== "reviewed" && a.status !== "dismissed").length;
}

function QuickSearch({ query, onClose }: { query: string; onClose: () => void }) {
  const { entities } = useApp();
  const q = query.toLowerCase();
  const results = entities
    .filter((e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    .slice(0, 8);

  return (
    <div className="absolute left-0 right-0 top-9 z-40 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-xl animate-fade-in">
      {results.length === 0 ? (
        <p className="p-3 text-xs text-muted">No entity matches “{query}”.</p>
      ) : (
        results.map((e) => (
          <a
            key={e.id}
            href={`/entities/${e.id}`}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2 text-xs hover:bg-card-alt transition-colors"
            )}
          >
            <span>
              <span className="font-medium text-foreground">{e.name}</span>
              <span className="ml-2 text-muted-light">{e.id}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted">{e.type}</span>
          </a>
        ))
      )}
    </div>
  );
}