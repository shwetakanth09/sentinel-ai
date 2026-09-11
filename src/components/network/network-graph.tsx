"use client";

import * as React from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import coseBilkent from "cytoscape-cose-bilkent";
import type { Core, ElementDefinition } from "cytoscape";
import { useApp } from "@/components/providers/app-provider";
import { ENTITY_TYPE_CONFIG, RELATIONSHIP_COLORS } from "@/lib/entity-config";
import type { EntityType } from "@/types";

cytoscape.use(coseBilkent);

export function buildGraphElements({ entities, relationships, filters, focusEntityId }: {
  entities: ReturnType<typeof useApp>["entities"];
  relationships: ReturnType<typeof useApp>["relationships"];
  filters?: {
    entityTypes: EntityType[];
    relationshipTypes: string[];
    cluster: string | null;
    minRisk: number;
  };
  focusEntityId?: string | null;
}) {
  const nodes: ElementDefinition[] = [];
  const edges: ElementDefinition[] = [];

  const allowedTypes =
    filters && filters.entityTypes.length > 0 ? new Set(filters.entityTypes) : null;
  const allowedRels =
    filters && filters.relationshipTypes.length > 0
      ? new Set(filters.relationshipTypes)
      : null;

  // Determine visible entity set. When a focus entity is given, only the
  // focus node + its direct neighbors are shown.
  let visibleEntities = entities.filter((e) => {
    if (allowedTypes && !allowedTypes.has(e.type)) return false;
    if (filters?.cluster && e.cluster !== filters.cluster) return false;
    if (e.riskIndicator < (filters?.minRisk ?? 0)) return false;
    return true;
  });

  if (focusEntityId) {
    const incumbent = new Set<string>([focusEntityId]);
    for (const r of relationships) {
      if (r.source === focusEntityId) incumbent.add(r.target);
      if (r.target === focusEntityId) incumbent.add(r.source);
    }
    visibleEntities = visibleEntities.filter((e) => incumbent.has(e.id));
  }

  const visibleIds = new Set(visibleEntities.map((e) => e.id));

  for (const e of visibleEntities) {
    nodes.push({
      data: {
        id: e.id,
        label: e.name,
        type: e.type,
        cluster: e.cluster,
        bridge: e.bridge,
        risk: e.riskIndicator,
        confidence: e.confidence,
      },
    });
  }

  for (const r of relationships) {
    if (!visibleIds.has(r.source) || !visibleIds.has(r.target)) continue;
    if (allowedRels && !allowedRels.has(r.type)) continue;
    edges.push({
      data: {
        id: r.id,
        source: r.source,
        target: r.target,
        label: r.type,
        relType: r.type,
        timestamp: r.timestamp,
        confidence: r.confidence,
      },
    });
  }

  return nodes.concat(edges);
}

const NODE_SHAPES: Record<EntityType, string> = {
  person: "ellipse",
  organization: "round-rectangle",
  phone: "diamond",
  vehicle: "round-rectangle",
  location: "ellipse",
  account: "square",
  event: "triangle",
};

export function NetworkGraph({ height, focusEntityId }: { height?: number; focusEntityId?: string | null }) {
  const {
    entities,
    relationships,
    filterEntityTypes,
    filterRelationshipTypes,
    filterCluster,
    filterMinRisk,
    setSelectedEntityId,
  } = useApp();

  const cyRef = React.useRef<Core | null>(null);

  const elements = React.useMemo(
    () =>
      buildGraphElements({
        entities,
        relationships,
        filters: {
          entityTypes: filterEntityTypes,
          relationshipTypes: filterRelationshipTypes,
          cluster: filterCluster,
          minRisk: filterMinRisk,
        },
        focusEntityId,
      }),
    [entities, relationships, filterEntityTypes, filterRelationshipTypes, filterCluster, filterMinRisk, focusEntityId]
  );

  const stylesheet = React.useMemo(
    () => [
      {
        selector: "node",
        style: {
          width: 36,
          height: 36,
          "font-size": 10,
          "text-valign": "bottom",
          "text-halign": "center",
          "text-margin-y": 8,
          "text-wrap": "wrap",
          "text-max-width": 120,
          "background-color": "#101726",
          "border-width": 0,
          color: "#e2e8f0",
        },
      },
      {
        selector: "node[?bridge]",
        style: {
          "border-width": 2,
          "border-style": "dashed",
          "border-color": "#f59e0b",
        },
      },
      {
        selector: "edge",
        style: {
          width: 1.5,
          "curve-style": "bezier",
          "line-color": "#22304f",
          "target-arrow-color": "#22304f",
          "target-arrow-shape": "triangle",
          label: "data(label)",
          "font-size": 7,
          color: "#7c8aa5",
          "text-rotation": "autorotate",
          "text-background-color": "#0d1322",
          "text-background-opacity": 0.9,
          "text-background-padding": 2,
        },
      },
      {
        selector: "edge[conf '[0]'..[0.6]]",
        style: { opacity: 0.45, "line-style": "dotted" },
      },
      {
        selector: "edge[conf '[0.6]'..[0.8]]",
        style: { opacity: 0.7 },
      },
      {
        selector: "edge[conf '[0.8]'..[1]']",
        style: { opacity: 1 },
      },
      ...(Object.entries(ENTITY_TYPE_CONFIG) as Array<
        [EntityType, (typeof ENTITY_TYPE_CONFIG)[EntityType]]
      >).map(([type, cfg]) => ({
        selector: `node[type = "${type}"]`,
        style: {
          shape: NODE_SHAPES[type],
          "background-color": cfg.fill,
          "background-opacity": 0.25,
          "border-width": 2,
          "border-color": cfg.stroke,
        },
      })),
      ...(Object.entries(RELATIONSHIP_COLORS) as Array<[string, string]>).map(([type, color]) => ({
        selector: `edge[relType = "${type}"]`,
        style: {
          "line-color": color,
          "target-arrow-color": color,
          "target-arrow-shape": "triangle",
          label: type,
          "font-size": 7,
        },
      })),
      {
        selector: "node:selected",
        style: {
          "border-width": 3,
          "border-opacity": 1,
          "shadow-blur": 14,
          "shadow-color": "#3b82f6",
          "shadow-opacity": 0.9,
          "background-opacity": 0.5,
        },
      },
      {
        selector: "node:active",
        style: { "border-width": 3, "border-opacity": 0.8 },
      },
      {
        selector: "edge:selected",
        style: { width: 3, "line-opacity": 1 },
      },
    ] as never[],
    []
  );

  const layout = React.useMemo(
    () => ({
      name: "cose-bilkent",
      animate: "end",
      animationDuration: 900,
      nodeRepulsion: () => 3200,
      idealEdgeLength: () => 75,
      gravity: 0.15,
      numIter: 1200,
      componentSpacing: 90,
      padding: 40,
      randomize: true,
    }),
    []
  );

  const handleCy = React.useCallback((cy: Core) => {
    cyRef.current = cy;

    cy.on("tap", "node", (evt) => {
      const id = evt.target.id();
      setSelectedEntityId(id);
      cy.$("edge").removeClass("highlighted");
      cy.$(`edge[source = "${id}"], edge[target = "${id}"]`).addClass("highlighted");
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedEntityId(null);
        cy.$("edge").removeClass("highlighted");
      }
    });

    cy.on("mouseover", "node", (evt) => {
      const node = evt.target;
      const neighbors = node.closedNeighborhood();
      cy.$("node").addClass("dimmed");
      cy.$("edge").addClass("dimmed");
      neighbors.removeClass("dimmed");
      node.removeClass("dimmed");
    });
    cy.on("mouseout", "node", () => {
      cy.$("node").removeClass("dimmed");
      cy.$("edge").removeClass("dimmed");
    });

    const focusHandler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      const node = cy.getElementById(id);
      if (node.length) {
        cy.animate(
          { fit: { eles: node.closedNeighborhood(), padding: 60 }, duration: 600 },
          { easing: "ease-in-out" }
        );
        cy.$("edge").removeClass("highlighted");
        node.closedNeighborhood().edges().addClass("highlighted");
      }
    };
    const zoomInHandler = () => {
      cy.zoom({ level: Math.min(2.5, (cy.zoom() ?? 1) * 1.25), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    };
    const zoomOutHandler = () => {
      cy.zoom({ level: Math.max(0.25, (cy.zoom() ?? 1) * 0.8), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    };
    const resetHandler = () => {
      cy.reset();
      setSelectedEntityId(null);
      cy.$("edge").removeClass("highlighted");
    };
    window.addEventListener("focus-entity", focusHandler);
    window.addEventListener("zoom-in", zoomInHandler);
    window.addEventListener("zoom-out", zoomOutHandler);
    window.addEventListener("reset-graph", resetHandler);

    return () => {
      window.removeEventListener("focus-entity", focusHandler);
      window.removeEventListener("zoom-in", zoomInHandler);
      window.removeEventListener("zoom-out", zoomOutHandler);
      window.removeEventListener("reset-graph", resetHandler);
      cy.destroy();
    };
  }, [setSelectedEntityId]);

  // Register dim/highlight styles
  React.useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
  }, []);

  return (
    <div
      className="relative h-full w-full"
      style={height ? { height } : undefined}
    >
      <CytoscapeComponent
        elements={elements}
        stylesheet={[
          ...stylesheet,
          {
            selector: "node.dimmed",
            style: { opacity: 0.2, "border-opacity": 0.2 },
          },
          {
            selector: "edge.dimmed",
            style: { opacity: 0.05 },
          },
          {
            selector: "edge.highlighted",
            style: {
              width: 2.5,
              "line-color": "#f59e0b",
              "target-arrow-color": "#f59e0b",
            },
          },
        ] as never[]}
        layout={layout}
        cy={handleCy}
        style={{ width: "100%", height: "100%" }}
        minZoom={0.25}
        maxZoom={2.5}
        wheelSensitivity={0.2}
        boxSelectionEnabled={false}
        autoungrabify={false}
        zoomingEnabled
        panningEnabled
        hideEdgesOnViewport
        textureOnViewport
      />
    </div>
  );
}