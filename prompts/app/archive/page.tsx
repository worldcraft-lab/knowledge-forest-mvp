"use client";

import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Archive, ChevronLeft, RotateCcw } from "lucide-react";
import {
  formatDate,
  getForestArea,
  hasArchivedParent,
  isArchived,
  normalizeKnowledgeForestData,
  phaseLabels,
  restoreItem,
  saveKnowledgeForestData,
  searchKnowledge,
  useKnowledgeForestData,
  ArchiveTarget
} from "@/lib/v02-store";
import { Feedback, KnowledgeNode, KnowledgeTree } from "@/lib/v02-types";

export default function ArchivePage() {
  const { data, setData } = useKnowledgeForestData();
  const [query, setQuery] = useState("");
  const normalized = normalizeKnowledgeForestData(data);
  const searched = useMemo(() => searchKnowledge(data, query, true), [data, query]);
  const q = query.trim();

  function restore(target: ArchiveTarget, id: string, parentArchived: boolean) {
    const nextData = restoreItem(data, target, id);
    saveKnowledgeForestData(nextData);
    setData(nextData);
    if (parentArchived) {
      window.alert("親要素がArchiveされているため、Restoreしても通常画面には表示されません。先に親要素をRestoreしてください。");
    }
  }

  const areas = normalized.areas.filter(isArchived).filter((area) => !q || area.title.toLowerCase().includes(q.toLowerCase()));
  const forests = normalized.forests.filter(isArchived).filter((forest) => !q || forest.title.toLowerCase().includes(q.toLowerCase()));
  const trees = normalized.trees.filter(isArchived).filter((tree) => !q || searched.trees.some((item) => item.id === tree.id) || tree.title.toLowerCase().includes(q.toLowerCase()));
  const nodes = normalized.nodes.filter(isArchived).filter((node) => !q || searched.nodes.some((item) => item.id === node.id) || node.title.toLowerCase().includes(q.toLowerCase()));
  const feedbacks = normalized.feedbacks.filter(isArchived).filter((feedback) => !q || searched.feedbacks.some((item) => item.id === feedback.id) || feedback.body.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
            <ChevronLeft className="h-4 w-4" />
            Dashboardへ戻る
          </Link>
          <span>/</span>
          <span>Archived Items</span>
        </div>
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
          <Archive className="h-4 w-4" />
          Archive / Restore
        </p>
        <h2 className="text-2xl font-bold text-forest-ink">Archived Items</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Archiveは通常表示から隠す操作です。データは保持され、Restoreできます。親要素がArchiveされたままの場合、子をRestoreしても通常画面には表示されません。
        </p>
        <input
          className="input mt-5"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Archived itemを検索"
        />
      </section>

      <ArchiveSection title="Archived Areas">
        {areas.map((area) => (
          <ArchiveCard key={area.id} title={area.title} meta={`Area / ${area.archivedAt ? formatDate(area.archivedAt) : ""}`} onRestore={() => restore("area", area.id, false)} />
        ))}
        {areas.length === 0 && <EmptyArchive />}
      </ArchiveSection>

      <ArchiveSection title="Archived Forests">
        {forests.map((forest) => {
          const parentArchived = hasArchivedParent(data, "forest", forest);
          return (
            <ArchiveCard key={forest.id} title={forest.title} meta={`${getForestArea(data, forest).title} / ${forest.archivedAt ? formatDate(forest.archivedAt) : ""}`} parentArchived={parentArchived} onRestore={() => restore("forest", forest.id, parentArchived)} />
          );
        })}
        {forests.length === 0 && <EmptyArchive />}
      </ArchiveSection>

      <ArchiveSection title="Archived Trees">
        {trees.map((tree) => (
          <TreeArchiveCard key={tree.id} tree={tree} data={normalized} onRestore={(parentArchived) => restore("tree", tree.id, parentArchived)} />
        ))}
        {trees.length === 0 && <EmptyArchive />}
      </ArchiveSection>

      <ArchiveSection title="Archived Nodes">
        {nodes.map((node) => (
          <NodeArchiveCard key={node.id} node={node} data={normalized} onRestore={(parentArchived) => restore("node", node.id, parentArchived)} />
        ))}
        {nodes.length === 0 && <EmptyArchive />}
      </ArchiveSection>

      <ArchiveSection title="Archived Feedback">
        {feedbacks.map((feedback) => (
          <FeedbackArchiveCard key={feedback.id} feedback={feedback} data={normalized} onRestore={(parentArchived) => restore("feedback", feedback.id, parentArchived)} />
        ))}
        {feedbacks.length === 0 && <EmptyArchive />}
      </ArchiveSection>
    </div>
  );
}

function ArchiveSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="text-lg font-bold text-forest-ink">{title}</h3>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function EmptyArchive() {
  return (
    <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-500">
      Archiveは空です。Archiveは削除ではなく、今は使わない知識を通常表示から隠すための場所です。
    </p>
  );
}

function ArchiveCard({ title, meta, parentArchived = false, href, onRestore }: { title: string; meta: string; parentArchived?: boolean; href?: string; onRestore: () => void }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-bold leading-6 text-forest-ink">{title}</h4>
      <p className="mt-1 text-xs font-semibold text-slate-500">{meta}</p>
      {parentArchived && (
        <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs leading-5 text-amber-800">
          親要素がArchiveされているため、Restoreしても通常画面には表示されません。先に親要素をRestoreしてください。
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-forest-ink px-3 py-2 text-xs font-bold text-white" onClick={onRestore} type="button">
          <RotateCcw className="h-4 w-4" />
          Restore
        </button>
        {href && <Link className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600" href={href}>元Treeへ</Link>}
      </div>
    </article>
  );
}

function TreeArchiveCard({ tree, data, onRestore }: { tree: KnowledgeTree; data: ReturnType<typeof normalizeKnowledgeForestData>; onRestore: (parentArchived: boolean) => void }) {
  const forest = data.forests.find((item) => item.id === tree.forestId);
  const area = forest ? getForestArea(data, forest) : null;
  const parentArchived = hasArchivedParent(data, "tree", tree);
  return <ArchiveCard title={tree.title} meta={`${area?.title ?? "Area"} / ${forest?.title ?? "Forest"} / ${tree.archivedAt ? formatDate(tree.archivedAt) : ""}`} parentArchived={parentArchived} href={`/tree/${tree.id}`} onRestore={() => onRestore(parentArchived)} />;
}

function NodeArchiveCard({ node, data, onRestore }: { node: KnowledgeNode; data: ReturnType<typeof normalizeKnowledgeForestData>; onRestore: (parentArchived: boolean) => void }) {
  const tree = data.trees.find((item) => item.id === node.treeId);
  const parentArchived = hasArchivedParent(data, "node", node);
  return <ArchiveCard title={node.title} meta={`${phaseLabels[node.phase]} / ${tree?.title ?? "Tree"} / ${node.archivedAt ? formatDate(node.archivedAt) : ""}`} parentArchived={parentArchived} href={`/tree/${node.treeId}?node=${node.id}`} onRestore={() => onRestore(parentArchived)} />;
}

function FeedbackArchiveCard({ feedback, data, onRestore }: { feedback: Feedback; data: ReturnType<typeof normalizeKnowledgeForestData>; onRestore: (parentArchived: boolean) => void }) {
  const node = data.nodes.find((item) => item.id === feedback.nodeId);
  const parentArchived = hasArchivedParent(data, "feedback", feedback);
  return <ArchiveCard title={feedback.body.slice(0, 80)} meta={`Feedback / ${node?.title ?? "Node"} / ${feedback.archivedAt ? formatDate(feedback.archivedAt) : ""}`} parentArchived={parentArchived} href={`/tree/${feedback.treeId}?node=${feedback.nodeId}`} onRestore={() => onRestore(parentArchived)} />;
}
