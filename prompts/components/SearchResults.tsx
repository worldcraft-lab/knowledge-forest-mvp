import Link from "next/link";
import { Feedback, KnowledgeForestData, KnowledgeNode, KnowledgeTree } from "@/lib/v02-types";
import { formatDate } from "@/lib/v02-store";
import { TreeCard } from "./TreeCard";
import { PhaseBadge } from "./PhaseBadge";

export function SearchResults({
  data,
  trees,
  nodes,
  feedbacks
}: {
  data: KnowledgeForestData;
  trees: KnowledgeTree[];
  nodes: KnowledgeNode[];
  feedbacks: Feedback[];
}) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold text-forest-ink">Related Trees</h2>
        <p className="mt-1 text-sm text-slate-500">
          検索結果は投稿単体ではなく、関連するTreeを優先して表示します。Feedback本文に一致した場合も、該当Treeへ移動できます。
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {trees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} data={data} />
          ))}
          {trees.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              一致するTreeはありません。
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-forest-ink">Matched Nodes</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {nodes.map((node) => (
            <Link
              key={node.id}
              href={`/tree/${node.treeId}?node=${node.id}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            >
              <PhaseBadge phase={node.phase} compact />
              <h3 className="mt-3 text-sm font-bold leading-6 text-forest-ink">{node.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{node.body}</p>
            </Link>
          ))}
          {nodes.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              一致Nodeは検索後に表示されます。
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-forest-ink">Matched Feedback</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {feedbacks.map((feedback) => (
            <Link
              key={feedback.id}
              href={`/tree/${feedback.treeId}?node=${feedback.nodeId}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <p className="text-xs font-bold uppercase text-emerald-700">Feedback</p>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{feedback.body}</p>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {feedback.authorLabel} / {formatDate(feedback.createdAt)}
              </p>
            </Link>
          ))}
          {feedbacks.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              Feedback本文に一致した結果がある場合、ここに表示されます。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
