import { notFound } from "next/navigation";
import { getEntityById } from "@/lib/db";
import { EntityDetailClient } from "./entity-detail-client";

export const dynamic = "force-dynamic";

export default async function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = getEntityById(id);
  if (!entity) notFound();
  return <EntityDetailClient entityId={entity.id} />;
}