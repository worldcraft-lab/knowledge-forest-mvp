import Link from "next/link";
import { GitBranch, Timer, Workflow } from "lucide-react";
import { KnowledgeForestData, KnowledgeTree } from "@/lib/v02-types";
import {
  formatDate,
  getTreeHighestPhase,
  getTreeNodes,
  getTreeProgress,
  hasPhase
} from "@/lib/v02-store";
import { PhaseBadge } from "./PhaseBadge";

export function TreeCard({ tree, data }: { tree: KnowledgeTree; data: KnowledgeForestData }) {
  const nodes = getTreeNodes(data, tree.id);
  const highestPhase = getTreeHighestPhase(nodes);
  const progress = getTreeProgress(nodes);
  const isCandidate = hasPhase(nodes, "sigma") && !hasPhase(nodes, "system");
  const isStalled =
    Date.now() - new Date(tree.updatedAt).getTime() > 6 * 24 * 60 * 60 * 1000 &&
    !hasPhase(nodes, "trial");

  return (
    <Link
      href={`/tree/${tree.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <PhaseBadge phase={highestPhase} />
            {isCandidate && (
              <span className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2 py-1 text-xs font-bold text-fuchsia-800">
                System化準備Tree
              </span>
            )}
            {isStalled && (
              <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-bold text-orange-800">
                次の実践待ち
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold leading-7 text-forest-ink">{tree.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{tree.summary}</p>
        </div>
        <div className="hidden rounded-lg bg-forest-mist p-3 text-blue-700 sm:block">
          <GitBranch className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <Workflow className="h-3.5 w-3.5" />
          {nodes.length} Nodes
        </span>
        <span className="flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" />
          更新 {formatDate(tree.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
