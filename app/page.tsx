"use client";

import Link from "next/link";
import type React from "react";
import { Flag, Search, Trees } from "lucide-react";
import { DashboardCards } from "@/components/DashboardCards";
import { KnowledgeFlow } from "@/components/KnowledgeFlow";
import { TreeCard } from "@/components/TreeCard";
import { useKnowledgeForestData, useMetrics } from "@/lib/v02-store";

export default function DashboardPage() {
  const { data } = useKnowledgeForestData();
  const metrics = useMetrics(data);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Trees className="h-4 w-4" />
              Knowledge Growth Viewer
            </p>
            <h2 className="text-3xl font-bold tracking-normal text-forest-ink sm:text-4xl">
              Forestごとに、気づきが仕組みへ育つ過程を見る。
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              v0.2では投稿一覧ではなく、Forest、Tree、Nodeの関係を中心に表示します。
              Sigmaへの到達とSystem化の準備が進んだTreeを見つけ、知識を再利用できる形へ近づけます。
            </p>
          </div>
          <KnowledgeFlow />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700" href="/forests">
            <Trees className="h-4 w-4" />
            Forestを見る
          </Link>
          <Link className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50" href="/search">
            <Search className="h-4 w-4" />
            関連Treeを探す
          </Link>
        </div>
      </section>

      <DashboardCards metrics={metrics} />

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="System化候補" note="Sigmaには到達しているが、まだSystemになっていないTreeです。再利用可能な運用知へ整理しやすい状態を示します。">
          {metrics.systemCandidates.map((tree) => (
            <TreeCard key={tree.id} tree={tree} data={data} />
          ))}
          {metrics.systemCandidates.length === 0 && <Empty text="現在、System化候補はありません。" />}
        </Panel>
        <Panel title="次の実践待ちTree" note="Trialに進まず、更新が止まっているTreeです。人の評価ではなく、次に試す余地がある知識として扱います。">
          {metrics.stalledTrees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} data={data} />
          ))}
          {metrics.stalledTrees.length === 0 && <Empty text="現在、停滞Treeはありません。" />}
        </Panel>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-bold text-forest-ink">
          <Flag className="h-5 w-5 text-emerald-700" />
          Phase Counts
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(metrics.phaseCounts).map(([phase, count]) => (
            <div key={phase} className="rounded-lg bg-forest-mist p-4">
              <p className="text-xs font-bold uppercase text-slate-500">{phase}</p>
              <p className="mt-1 text-2xl font-bold text-forest-ink">{count}</p>
            </div>
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
  return <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">{text}</p>;
}
