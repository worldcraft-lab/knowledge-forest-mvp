import { formatDate } from "@/lib/v02-store";
import { KnowledgeNode } from "@/lib/v02-types";
import { PhaseBadge } from "./PhaseBadge";

export function NodeDetailPanel({ node }: { node?: KnowledgeNode }) {
  if (!node) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">ノードを選択してください。</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <PhaseBadge phase={node.phase} />
      <h2 className="mt-4 text-xl font-bold leading-8 text-forest-ink">{node.title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{node.body}</p>
      {node.phase === "system" && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          Systemは人の評価ではなく、再利用可能な運用知へ到達した状態を示します。
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {node.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Info label="投稿者" value={node.authorName} />
        <Info label="投稿日" value={formatDate(node.createdAt)} />
        <Info label="参考" value={`${node.helpfulCount}`} />
        <Info label="コメント" value={`${node.commentCount}`} />
      </dl>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs font-bold text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
