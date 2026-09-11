import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent/15 text-accent border border-accent/25",
        destructive: "bg-red/15 text-red border border-red/25",
        secondary: "bg-card border border-border text-muted",
        success: "bg-green/15 text-green border border-green/25",
        warning: "bg-amber/15 text-amber border border-amber/25",
        outline: "border border-border text-foreground",
        purple: "bg-purple/15 text-purple border border-purple/25",
        cyan: "bg-cyan/15 text-cyan border border-cyan/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };