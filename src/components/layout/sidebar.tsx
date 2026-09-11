"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  Share2,
  Users,
  AlertTriangle,
  Database,
  Bot,
  FileText,
  ShieldHalf,
  Settings,
  UserRound,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/network-explorer", label: "Network Explorer", icon: Share2 },
  { href: "/entities", label: "Entities", icon: Users },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/data-sources", label: "Data Sources", icon: Database },
  { href: "/cases", label: "Investigations", icon: Route },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/timeline", label: "Timeline", icon: Activity },
  { href: "/nlp-analysis", label: "Document Analysis", icon: FileText },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-accent/10">
        <ShieldAlert className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="text-sm font-bold tracking-widest text-foreground">
          SENTINEL <span className="text-accent">AI</span>
        </p>
        <p className="text-[10px] text-muted leading-tight">Network Intelligence</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-surface">
      <Logo />
      <div className="px-3 pb-2">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-light">
          Workspace
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-card hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2">
          <div className="flex h-2 w-2 shrink-0">
            <div className="absolute h-2 w-2 animate-ping rounded-full bg-green/60" />
            <div className="h-2 w-2 rounded-full bg-green" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground">System Online</p>
            <p className="truncate text-[10px] text-muted">1,284 records indexed</p>
          </div>
        </div>
        <ul className="space-y-0.5">
          {[
            { icon: ShieldHalf, label: "Settings" },
            { icon: UserRound, label: "Profile" },
          ].map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.label}>
                <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted hover:bg-card hover:text-foreground cursor-pointer">
                  <Icon className="h-4 w-4 shrink-0" />
                  {it.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}