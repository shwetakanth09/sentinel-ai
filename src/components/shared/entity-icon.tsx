import {
  UserCircle2,
  Building2,
  Smartphone,
  Car,
  MapPin,
  Landmark,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { EntityType } from "@/types";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_CONFIG } from "@/lib/entity-config";

export const ENTITY_ICONS: Record<EntityType, LucideIcon> = {
  person: UserCircle2,
  organization: Building2,
  phone: Smartphone,
  vehicle: Car,
  location: MapPin,
  account: Landmark,
  event: CalendarDays,
};

export function EntityIcon({
  type,
  className,
}: {
  type: EntityType;
  className?: string;
}) {
  const Icon = ENTITY_ICONS[type];
  const cfg = ENTITY_TYPE_CONFIG[type];
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
        className
      )}
      style={{ borderColor: cfg.stroke, backgroundColor: `${cfg.fill}1a`, color: cfg.stroke }}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}