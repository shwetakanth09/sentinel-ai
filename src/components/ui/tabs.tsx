import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContext = { value: string; onValueChange: (v: string) => void };
const TabsCtx = React.createContext<TabsContext>({ value: "", onValueChange: () => {} });

export function Tabs({
  value: controlled,
  defaultValue,
  onValueChange: controlledOnChange,
  className,
  children,
}: {
  value?: string;
  defaultValue: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = controlled ?? internal;
  const onValueChange = controlledOnChange ?? setInternal;
  return (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md bg-card border border-border p-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all",
        active
          ? "bg-accent text-white shadow-sm"
          : "text-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  if (ctx.value !== value) return null;
  return <div className={cn("mt-3 animate-fade-in", className)}>{children}</div>;
}