import { notFound } from "next/navigation";
import { getEntity } from "@/data/entities";
import { EntityDetailClient } from "./entity-detail-client";

export default async function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = getEntity(id);
  if (!entity) notFound();
  return <EntityDetailClient entityId={entity.id} />;
}