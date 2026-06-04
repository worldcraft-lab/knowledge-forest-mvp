"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, User } from "lucide-react";
import { PhaseBadge } from "@/components/PhaseBadge";
import { getTreeNodes, hasPhase, phaseOrder, useKnowledgeForestData } from "@/lib/v02-store";
import { Phase } from "@/lib/v02-types";

const tendencyComments: Record<Phase, string> = {
  seed: "現場の気づき",
  branch: "改善案を広げる",
  trial: "実践検証",
  sigma: "知識を統合",
  system: "再利用可能な運用知づくり"
};

export default function MePage() {
  const { data } = useKnowledgeForestData();
  const myNodes = data.nodes.filter((node) => node.authorName === "あなた");
  const visibleNodes = myNodes.length ? myNodes : data.nodes;
  const feedbackCount = data.feedbacks.filter((feedback) => !feedback.archivedAt).length;
  const counts = Object.fromEntries(
    phaseOrder.map((phase) => [phase, visibleNodes.filter((node) => node.phase === phase).length])
  ) as Record<Phase, number>;
  const topPhase = [...phaseOrder].sort((a, b) => counts[b] - counts[a])[0];
  const systemCandidate = data.trees.find((tree) => {
    const nodes = getTreeNodes(data, tree.id);
    return hasPhase(nodes, "sigma") && !hasPhase(nodes, "system");
  });
  const trialWaiting = data.trees.find((tree) => {
    const nodes = getTreeNodes(data, tree.id);
    return hasPhase(nodes, "branch") && !hasPhase(nodes, "trial");
  });

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
            <ChevronLeft className="h-4 w-4" />
            Dashboardへ戻る
          </Link>
          <span>/</span>
          <span>My Page</span>
        </div>
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
          <User className="h-4 w-4" />
          Contribution tendencies
        </p>
        <h2 className="text-2xl font-bold text-forest-ink">My Page</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          このページは、このブラウザのLocalStorageデータに基づく知識傾向です。ランキングや人事評価ではありません。
        </p>
        <div className="mt-5 rounded-lg bg-forest-mist p-4">
          <p className="text-sm leading-6 text-slate-700">
            現在は<span className="font-bold text-forest-ink">{tendencyComments[topPhase]}</span>に関わるNodeが比較的多い状態です。
            次はTrialやSigmaへ進めると、知識が再利用しやすくなります。
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-forest-ink">Phase tendencies</h3>
        <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">Feedback: {feedbackCount}</p>
          <p className="mt-1 text-xs leading-5 text-emerald-800">
            補足や観点を残す関わりです。Feedbackは人の評価ではなく、次のBranchやTrialにつながる素材として扱います。
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {phaseOrder.map((phase) => {
            const max = Math.max(...phaseOrder.map((item) => counts[item]), 1);
            const width = Math.max(8, Math.round((counts[phase] / max) * 100));
            return (
              <div key={phase} className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <PhaseBadge phase={phase} compact />
                  <span className="text-sm font-bold text-forest-ink">{counts[phase]}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${width}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{tendencyComments[phase]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-forest-ink">Next Contribution</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <NextLink href={trialWaiting ? `/tree/${trialWaiting.id}` : "/search?status=stalled"} label="Branchが多いTreeにTrialを追加する" />
          <NextLink href={systemCandidate ? `/tree/${systemCandidate.id}` : "/search?status=system-candidate"} label="Sigma候補Treeを1つまとめる" />
          <NextLink href="/search?phase=system" label="System化された運用知を見直す" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-forest-ink">Recent contribution notes</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {visibleNodes.slice(0, 8).map((node) => (
            <Link
              key={node.id}
              href={`/tree/${node.treeId}?node=${node.id}`}
              className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
              aria-label={`${node.title}をTreeで見る`}
              title={`${node.title}をTreeで見る`}
            >
              <div className="flex items-start justify-between gap-3">
                <PhaseBadge phase={node.phase} compact />
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
              </div>
              <h4 className="mt-3 text-sm font-bold leading-6 text-forest-ink">{node.title}</h4>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{node.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function NextLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-forest-mist p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
    </Link>
  );
}
