"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Background, Controls, Edge, MarkerType, MiniMap, Node, ReactFlow } from "@xyflow/react";
import { NodeDetailPanel } from "@/components/NodeDetailPanel";
import { PhaseBadge } from "@/components/PhaseBadge";
import {
  formatDate,
  getTreeNodes,
  phaseLabels,
  phaseNodeColors,
  phaseOrder,
  useKnowledgeForestData
} from "@/lib/v02-store";

export default function TreeDetailPage() {
  const params = useParams<{ treeId: string }>();
  const { data } = useKnowledgeForestData();
  const tree = data.trees.find((item) => item.id === params.treeId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const treeNodes = useMemo(() => (tree ? getTreeNodes(data, tree.id) : []), [data, tree]);
  const flow = useMemo(() => buildFlow(treeNodes), [treeNodes]);

  if (!tree) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-forest-ink">Treeが見つかりません</h2>
      </section>
    );
  }

  const forest = data.forests.find((item) => item.id === tree.forestId);
  const selectedNode = treeNodes.find((node) => node.id === selectedId) ?? treeNodes[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-4">
          <p className="text-sm font-bold text-emerald-700">{forest?.title ?? "Forest"}</p>
          <h2 className="mt-1 text-xl font-bold text-forest-ink">{tree.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{tree.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {phaseOrder.map((phase) => (
              <PhaseBadge key={phase} phase={phase} compact />
            ))}
          </div>
        </div>
        <div className="h-[64vh] min-h-[520px] w-full bg-gradient-to-b from-white to-forest-mist/50 sm:h-[72vh] lg:min-h-[600px]">
          <ReactFlow
            nodes={flow.nodes}
            edges={flow.edges}
            fitView
            fitViewOptions={{ padding: 0.24, includeHiddenNodes: false, minZoom: 0.45, maxZoom: 1.05 }}
            minZoom={0.22}
            maxZoom={1.45}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            nodesDraggable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#dbeafe" gap={18} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        </div>
      </section>
      <NodeDetailPanel node={selectedNode} />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft xl:col-span-2">
        <h3 className="mb-3 text-lg font-bold text-forest-ink">Tree Nodes</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {treeNodes.map((node) => (
            <button
              key={node.id}
              className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
              onClick={() => setSelectedId(node.id)}
              type="button"
            >
              <PhaseBadge phase={node.phase} compact />
              <h4 className="mt-3 text-sm font-bold leading-6 text-forest-ink">{node.title}</h4>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {node.authorName} / {formatDate(node.createdAt)}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function buildFlow(items: ReturnType<typeof getTreeNodes>): { nodes: Node[]; edges: Edge[] } {
  const grouped = phaseOrder.map((phase) => items.filter((item) => item.phase === phase));
  const nodes: Node[] = grouped.flatMap((group, columnIndex) =>
    group.map((item, rowIndex) => ({
      id: item.id,
      position: {
        x: columnIndex * 340,
        y: rowIndex * 150 + (item.phase === "sigma" ? 10 : 0)
      },
      data: {
        label: (
          <div className={`w-72 rounded-lg border bg-white p-4 shadow-soft ${item.phase === "sigma" ? "border-fuchsia-200 ring-4 ring-fuchsia-100" : "border-slate-200"}`}>
            <span className="rounded-md px-2 py-1 text-[11px] font-bold" style={{ background: phaseNodeColors[item.phase] }}>
              {phaseLabels[item.phase]}
            </span>
            <p className="mt-3 text-[15px] font-bold leading-6 text-forest-ink">{item.title}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {item.authorName} / {formatDate(item.createdAt)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              参考 {item.helpfulCount} / コメント {item.commentCount}
            </p>
          </div>
        )
      },
      style: {
        border: "0",
        background: "transparent",
        width: 300
      }
    }))
  );
  const edges: Edge[] = items
    .filter((item) => item.parentId)
    .map((item) => ({
      id: `${item.parentId}-${item.id}`,
      source: item.parentId as string,
      target: item.id,
      animated: item.phase === "system",
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: item.phase === "sigma" ? "#d946ef" : "#93c5fd"
      },
      style: { stroke: item.phase === "sigma" ? "#d946ef" : "#93c5fd", strokeWidth: 2 }
    }));

  return { nodes, edges };
}
