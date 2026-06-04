"use client";

import Link from "next/link";
import type React from "react";
import { Archive, ArrowRight, BookOpen, Flag, Plus, Sparkles, Trees } from "lucide-react";
import { DashboardCards } from "@/components/DashboardCards";
import { TreeCard } from "@/components/TreeCard";
import { getVisibleData, phaseLabels, useKnowledgeForestData, useMetrics } from "@/lib/v02-store";

export default function DashboardPage() {
  const { data } = useKnowledgeForestData();
  const visibleData = getVisibleData(data);
  const metrics = useMetrics(data);
  const sampleTree = visibleData.trees.find((tree) => tree.id === "tree-first-service-flow") ?? visibleData.trees[0];
  const recentForests = [...visibleData.forests].sort((a, b) => dateValue(b.updatedAt ?? b.createdAt) - dateValue(a.updatedAt ?? a.createdAt)).slice(0, 3);
  const recentTrees = [...visibleData.trees].sort((a, b) => dateValue(b.updatedAt ?? b.createdAt) - dateValue(a.updatedAt ?? a.createdAt)).slice(0, 3);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="max-w-4xl">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Knowledge Forest
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-forest-ink sm:text-4xl">
            気づきや改善案を、あとで使える知識に育てます
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Knowledge Forestは、日々の気づき・改善案・実践記録を、次に使える運用知として残すためのツールです。
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">詳しい使い方はGuideにまとめています。</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {sampleTree && (
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]"
              href={`/tree/${sampleTree.id}`}
              aria-label="サンプルTreeを見る"
              title="サンプルTreeを見る"
            >
              <Trees className="h-4 w-4" />
              サンプルを見る
            </Link>
          )}
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.99]"
            href="/create"
            aria-label="新しくArea Forest Tree Nodeを作る"
            title="新しくArea / Forest / Tree / Nodeを作る"
          >
            <Plus className="h-4 w-4" />
            新しく作る
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-100 active:scale-[0.99]"
            href="/guide"
            aria-label="Guideを見る"
            title="Guideを見る"
          >
            <BookOpen className="h-4 w-4" />
            Guideを見る
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-blue-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-forest-ink">初めての方へ</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              まずはサンプルTreeを開き、SeedからBranchかTrialを作ってみてください。詳しい手順はGuideにあります。
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 active:scale-[0.99]"
            href="/guide#tutorial"
          >
            Guideで5分チュートリアルを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <DashboardCards metrics={metrics} />

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="最近のForest" note="最近更新された知識空間です。テーマやプロジェクトごとにTreeを束ねます。">
          {recentForests.length > 0 ? (
            recentForests.map((forest) => (
              <Link
                key={forest.id}
                href={`/forests/${forest.id}`}
                className="group block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50 active:scale-[0.99]"
                aria-label={`${forest.title} を開く`}
                title={`${forest.title} を開く`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-forest-ink">{forest.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{forest.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-emerald-700" />
                </div>
              </Link>
            ))
          ) : (
            <Empty text="まだForestがありません。Createから最初のForestを作ると、知識領域ごとに整理できます。" />
          )}
        </Panel>

        <Panel title="最近のTree" note="最近触られた知識成長Treeです。NodeやFeedbackから次の実践につなげられます。">
          {recentTrees.length > 0 ? (
            recentTrees.map((tree) => <TreeCard key={tree.id} tree={tree} data={data} />)
          ) : (
            <Empty text="まだTreeがありません。サンプルを見るか、CreateからTreeと最初のSeedを作ってみてください。" />
          )}
        </Panel>
      </section>

      {sampleTree && (
        <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-forest-ink">まずはこのサンプルを見る</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                ひとつの気づきが、改善案・実践・統合・仕組みへ育つ流れを確認できます。
              </p>
            </div>
            <Link className="inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white" href={`/tree/${sampleTree.id}`}>
              開く
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <TreeCard tree={sampleTree} data={data} />
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="System化を検討しやすいTree"
          note="Sigmaに到達し、再利用可能な運用知として整理しやすい状態のTreeです。"
        >
          {metrics.systemCandidates.map((tree) => <TreeCard key={tree.id} tree={tree} data={data} />)}
          {metrics.systemCandidates.length === 0 && (
            <Empty text="まだ該当するTreeはありません。TrialやSigmaが増えると、ここから運用知への整理を始めやすくなります。" />
          )}
        </Panel>
        <Panel title="次の実践待ちTree" note="Branchはあるが、Trialに進んでいないTreeです。次に試す行動を見つける入口です。">
          {metrics.stalledTrees.map((tree) => <TreeCard key={tree.id} tree={tree} data={data} />)}
          {metrics.stalledTrees.length === 0 && (
            <Empty text="今は次の実践待ちTreeがありません。Branchを作ったら、次はTrialで試した結果を残してみてください。" />
          )}
        </Panel>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-forest-ink">
              <Flag className="h-5 w-5 text-emerald-700" />
              Phase Counts
            </h2>
            <p className="mt-1 text-sm text-slate-500">Archive済みは通常集計から除外しています。</p>
          </div>
          <Link href="/archive" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
            <Archive className="h-4 w-4" />
            Archiveを見る
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(metrics.phaseCounts).map(([phase, count]) => (
            <Link
              key={phase}
              href={`/search?phase=${phase}`}
              className="group cursor-pointer rounded-lg bg-forest-mist p-4 transition hover:bg-blue-50 active:scale-[0.99]"
              aria-label={`${phaseLabels[phase as keyof typeof phaseLabels]} のSearchへ移動`}
              title={`${phaseLabels[phase as keyof typeof phaseLabels]} のSearchへ移動`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase text-slate-500">{phaseLabels[phase as keyof typeof phaseLabels]}</p>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
              </div>
              <p className="mt-1 text-2xl font-bold text-forest-ink">{count}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold text-forest-ink">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{note}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-500">{text}</p>;
}

function dateValue(value?: string | null) {
  return value ? +new Date(value) : 0;
}
