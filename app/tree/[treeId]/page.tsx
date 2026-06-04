"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Background, Controls, Edge, MarkerType, MiniMap, Node, ReactFlow } from "@xyflow/react";
import { ChevronLeft, Plus } from "lucide-react";
import { NodeDetailPanel } from "@/components/NodeDetailPanel";
import { PhaseBadge } from "@/components/PhaseBadge";
import {
  addFeedback,
  addNode,
  archiveItem,
  branchFromFeedback,
  formatDate,
  getArchivedTreeNodes,
  getForestArea,
  getNodeFeedbacks,
  getTreeNodes,
  isArchived,
  phaseLabels,
  phaseNodeColors,
  phaseOrder,
  saveKnowledgeForestData,
  useKnowledgeForestData
} from "@/lib/v02-store";
import { Feedback, Phase } from "@/lib/v02-types";

export default function TreeDetailPage() {
  const params = useParams<{ treeId: string }>();
  const searchParams = useSearchParams();
  const focusedNodeId = searchParams.get("node");
  const { data, setData } = useKnowledgeForestData();
  const tree = data.trees.find((item) => item.id === params.treeId);
  const [selectedId, setSelectedId] = useState<string | null>(focusedNodeId);
  const [showArchivedNodes, setShowArchivedNodes] = useState(false);
  const treeNodes = useMemo(() => (tree ? getTreeNodes(data, tree.id) : []), [data, tree]);
  const archivedTreeNodes = useMemo(() => (tree ? getArchivedTreeNodes(data, tree.id) : []), [data, tree]);
  const feedbackCounts = useMemo(
    () => new Map(treeNodes.map((node) => [node.id, getNodeFeedbacks(data, node.id).length])),
    [data, treeNodes]
  );
  const flow = useMemo(() => buildFlow(treeNodes, feedbackCounts), [treeNodes, feedbackCounts]);

  if (!tree) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <Link className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700" href="/forests">
          <ChevronLeft className="h-4 w-4" />
          Forest一覧へ
        </Link>
        <h2 className="text-xl font-bold text-forest-ink">Treeが見つかりません</h2>
      </section>
    );
  }

  const currentTree = tree;
  const forest = data.forests.find((item) => item.id === currentTree.forestId);
  const area = forest ? getForestArea(data, forest) : null;
  const selectedNode = treeNodes.find((node) => node.id === selectedId) ?? treeNodes[0];
  const selectedFeedbacks = selectedNode ? getNodeFeedbacks(data, selectedNode.id) : [];
  const forestHref = forest ? `/forests/${forest.id}` : "/forests";

  function handleAddFeedback(payload: { body: string; authorLabel: string }) {
    if (!selectedNode) return;
    const result = addFeedback(data, {
      treeId: selectedNode.treeId,
      nodeId: selectedNode.id,
      body: payload.body,
      authorLabel: payload.authorLabel
    });
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
  }

  function handleBranchFromFeedback(feedback: Feedback) {
    const result = branchFromFeedback(data, feedback);
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    setSelectedId(result.node.id);
  }

  function handleGrowNode(payload: { phase: Phase; title: string; body: string; tags: string[]; authorName: string }) {
    if (!selectedNode) return;
    const result = addNode(data, {
      treeId: selectedNode.treeId,
      parentId: selectedNode.id,
      phase: payload.phase,
      title: payload.title,
      body: payload.body,
      tags: payload.tags,
      authorName: payload.authorName
    });
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    setSelectedId(result.node.id);
  }

  function handleArchiveTree() {
    if (!window.confirm("このTreeをArchiveします。通常表示から隠れますが、データは保持され、後からRestoreできます。")) return;
    const nextData = archiveItem(data, "tree", currentTree.id, "Tree archived");
    saveKnowledgeForestData(nextData);
    setData(nextData);
  }

  function handleArchiveNode() {
    if (!selectedNode) return;
    const hasChildren = data.nodes.some((node) => node.parentId === selectedNode.id && !isArchived(node));
    const message = hasChildren
      ? "このNodeには子Nodeがあります。Archiveすると、その枝も通常表示から隠れます。"
      : "このNodeをArchiveします。通常表示から隠れますが、データは保持され、後からRestoreできます。";
    if (!window.confirm(message)) return;
    const nextData = archiveItem(data, "node", selectedNode.id, "Node archived");
    saveKnowledgeForestData(nextData);
    setData(nextData);
    setSelectedId(null);
  }

  function handleArchiveFeedback(feedback: Feedback) {
    if (!window.confirm("このFeedbackをArchiveします。通常表示から隠れますが、データは保持され、後からRestoreできます。")) return;
    const nextData = archiveItem(data, "feedback", feedback.id, "Feedback archived");
    saveKnowledgeForestData(nextData);
    setData(nextData);
  }

  if (treeNodes.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="inline-flex items-center gap-1 text-blue-700" href={forestHref}>
            <ChevronLeft className="h-4 w-4" />
            {forest ? `${forest.title}へ戻る` : "Forestへ戻る"}
          </Link>
          <span>/</span>
          <span>{currentTree.title}</span>
        </div>
        <h2 className="text-2xl font-bold text-forest-ink">{currentTree.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          このTreeにはまだNodeがありません。最初のSeedを追加して、知識の成長を始めましょう。
        </p>
        <Link
          href="/create"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Seed Nodeを追加する
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
            <Link className="inline-flex items-center gap-1 text-blue-700" href={forestHref}>
              <ChevronLeft className="h-4 w-4" />
              {forest ? `${forest.title}へ戻る` : "Forestへ戻る"}
            </Link>
            <span>/</span>
            <Link className="text-blue-700" href="/">Dashboard</Link>
            <span>/</span>
            <Link className="text-blue-700" href="/forests">Forests</Link>
            <span>/</span>
            {area && (
              <>
                <span>{area.title}</span>
                <span>/</span>
              </>
            )}
            <span>{currentTree.title}</span>
          </div>
          <p className="text-sm font-bold text-emerald-700">
            {area ? `${area.title} / ` : ""}{forest?.title ?? "Forest"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-forest-ink">{currentTree.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{currentTree.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700" onClick={handleArchiveTree} type="button">
              Archive Tree
            </button>
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600" href="/archive">
              Archived Items
            </Link>
          </div>
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
      <NodeDetailPanel
        node={selectedNode}
        feedbacks={selectedFeedbacks}
        onAddFeedback={handleAddFeedback}
        onBranchFromFeedback={handleBranchFromFeedback}
        onGrowNode={handleGrowNode}
        onArchiveNode={handleArchiveNode}
        onArchiveFeedback={handleArchiveFeedback}
        hasChildNodes={Boolean(selectedNode && data.nodes.some((node) => node.parentId === selectedNode.id && !isArchived(node)))}
      />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft xl:col-span-2">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-forest-ink">Tree Nodes</h3>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input checked={showArchivedNodes} onChange={(event) => setShowArchivedNodes(event.target.checked)} type="checkbox" />
            Archived Nodeを表示
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {treeNodes.map((node) => (
            <button
              key={node.id}
              className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
              onClick={() => setSelectedId(node.id)}
              type="button"
            >
              <PhaseBadge phase={node.phase} compact />
              <h4 className="mt-3 text-sm font-bold leading-6 text-forest-ink">{node.title}</h4>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {node.authorName} / {formatDate(node.createdAt)}
              </p>
              <p className="mt-2 text-xs font-bold text-emerald-700">
                Feedback {getNodeFeedbacks(data, node.id).length}
              </p>
            </button>
          ))}
        </div>
        {showArchivedNodes && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {archivedTreeNodes.map((node) => (
              <div key={node.id} className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 opacity-70">
                <PhaseBadge phase={node.phase} compact />
                <h4 className="mt-3 text-sm font-bold leading-6 text-slate-600">{node.title}</h4>
                <p className="mt-2 text-xs text-slate-500">Archived {node.archivedAt ? formatDate(node.archivedAt) : ""}</p>
              </div>
            ))}
            {archivedTreeNodes.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Archived Nodeはありません。</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function buildFlow(items: ReturnType<typeof getTreeNodes>, feedbackCounts: Map<string, number>): { nodes: Node[]; edges: Edge[] } {
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
              Feedback {feedbackCounts.get(item.id) ?? 0}
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
