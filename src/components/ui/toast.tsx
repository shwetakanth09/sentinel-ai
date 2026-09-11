"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "warning" | "info";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

type Context = {
  toast: (item: Omit<ToastItem, "id">) => void;
};

const ToastCtx = React.createContext<Context>({ toast: () => {} });
let toastId = 0;

export function useToast() {
  return React.useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...item, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4 text-green shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber shrink-0" />,
    info: <Info className="h-4 w-4 text-accent shrink-0" />,
  };

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-in rounded-lg border border-border bg-card p-3 shadow-xl flex gap-2 items-start"
          >
            {icons[t.variant]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-[11px] text-muted">{t.description}</p>
              ) : null}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export { cn };