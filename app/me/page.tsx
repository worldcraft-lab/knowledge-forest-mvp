"use client";

import { User } from "lucide-react";
import { PhaseBadge } from "@/components/PhaseBadge";
import { phaseOrder, useKnowledgeForestData } from "@/lib/v02-store";
import { Phase } from "@/lib/v02-types";

const tendencyComments: Record<Phase, string> = {
  seed: "現場の気づきを拾う傾向",
  branch: "改善案を広げる傾向",
  trial: "実践検証に関わる傾向",
  sigma: "知識を統合する傾向",
  system: "再利用可能な運用知づくりに関わる傾向"
};

export default function MePage() {
  const { data } = useKnowledgeForestData();
  const myNodes = data.nodes.filter((node) => node.authorName === "あなた");
  const visibleNodes = myNodes.length ? myNodes : data.nodes;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
          <User className="h-4 w-4" />
          Contribution tendencies
        </p>
        <h2 className="text-2xl font-bold text-forest-ink">My Page</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          ここではランキングや人事評価ではなく、どのPhaseに関わる投稿が多いかという貢献傾向だけを表示します。
          初期状態ではサンプル全体の傾向を表示し、あなたがNodeを追加した後はあなたの投稿傾向を表示します。
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {phaseOrder.map((phase) => {
          const count = visibleNodes.filter((node) => node.phase === phase).length;
          return (
            <div key={phase} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <PhaseBadge phase={phase} compact />
              <p className="mt-3 text-3xl font-bold text-forest-ink">{count}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">contribution tendency</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tendencyComments[phase]}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-forest-ink">Recent contribution notes</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {visibleNodes.slice(0, 8).map((node) => (
            <div key={node.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <PhaseBadge phase={node.phase} compact />
              <h4 className="mt-3 text-sm font-bold leading-6 text-forest-ink">{node.title}</h4>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{node.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
