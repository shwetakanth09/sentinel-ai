import type { Entity } from "@/types";

export function getById(entities: Entity[], id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function entityName(entities: Entity[], id: string): string {
  return getById(entities, id)?.name ?? id;
}