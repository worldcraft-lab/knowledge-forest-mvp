"use client";

import Link from "next/link";
import type React from "react";
import { ArrowRight, BookOpen, Flag, Lightbulb, Search, Sparkles, Trees } from "lucide-react";
import { DashboardCards } from "@/components/DashboardCards";
import { KnowledgeFlow } from "@/components/KnowledgeFlow";
import { TreeCard } from "@/components/TreeCard";
import { phaseLabels, useKnowledgeForestData, useMetrics } from "@/lib/v02-store";

const benefits = [
  "チャットで流れた改善案を残せる",
  "「前にも同じ話をした」を減らせる",
  "なぜそのルールになったかが残る",
  "実践した結果を次の人に渡せる",
  "新人教育や引き継ぎに使いやすくなる",
  "気づきからマニュアル化までの流れが見える"
];

const useCases = [
  { title: "店舗運営", body: "ランチ帯の席案内、接客フロー、レビュー対応、在庫管理。現場で気づいた小さな改善をSeedにできます。" },
  { title: "イベント運営", body: "当日の導線、受付改善、出演者対応、振り返り。次回に活かしたい運営知をTreeにできます。" },
  { title: "学生プロジェクト", body: "報連相、役割分担、週次レトロ、実践報告。チームで学んだことを次の活動へ渡せます。" },
  { title: "SNS運用", body: "投稿案、試した企画、反応分析、次回改善。思いつきから検証結果までをつなげて残せます。" }
];

export default function DashboardPage() {
  const { data } = useKnowledgeForestData();
  const metrics = useMetrics(data);
  const sampleTree = data.trees.find((tree) => tree.id === "tree-first-service-flow") ?? data.trees[0];

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Lightbulb className="h-4 w-4" />
              これは何のためのアプリ？
            </p>
            <h2 className="text-3xl font-bold tracking-normal text-forest-ink sm:text-4xl">
              気づきや改善案を、あとで使える知識に育てます。
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Knowledge Forestは、日々の気づきや改善案を、実践・統合・仕組みへ育てるためのツールです。
              チャットで流れた話や、メモに散らばった改善案を、あとで使える運用知として残せます。
            </p>
            <p className="mt-3 max-w-3xl rounded-lg bg-forest-mist p-4 text-sm leading-6 text-slate-700">
              単発のメモではなく、「気づきがどう育って、どんな仕組みになったか」を見るためのアプリです。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]" href="/guide">
                <BookOpen className="h-4 w-4" />
                Guideを見る
              </Link>
              {sampleTree && (
                <Link className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.99]" href={`/tree/${sampleTree.id}`}>
                  <Sparkles className="h-4 w-4" />
                  まずはこのサンプルを見る
                </Link>
              )}
            </div>
          </div>
          <KnowledgeFlow />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="何が便利になる？" note="流れて消えやすい改善の話を、次に使える形で残せます。">
          <div className="grid gap-2 sm:grid-cols-2">
            {benefits.map((item) => (
              <p key={item} className="rounded-lg bg-forest-mist p-3 text-sm font-semibold leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </Panel>
        <Panel title="メモやチャットと何が違う？" note="整理のためのアプリではなく、知識が育つ流れを見るためのアプリです。">
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <Compare label="普通のメモ" text="書いて終わりになりやすい。" />
            <Compare label="チャット" text="会話は速いが、流れて見つけにくい。" />
            <Compare label="Notion" text="整理すれば便利だが、整理する負荷が高い。" />
            <Compare label="Knowledge Forest" text="気づきが、改善・実践・統合・仕組みへ育つ流れを見られる。" strong />
          </div>
        </Panel>
      </section>

      <section className="rounded-lg border border-blue-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-forest-ink">まずは5分で試す</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">細かい構造を覚える前に、サンプルTreeで「気づきを育てる」流れを触ってみてください。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <TutorialStep index={1} href={sampleTree ? `/tree/${sampleTree.id}` : "/forests"} title="サンプルTreeを開く" />
          <TutorialStep index={2} href={sampleTree ? `/tree/${sampleTree.id}` : "/forests"} title="Seed Nodeを選ぶ" />
          <TutorialStep index={3} href={sampleTree ? `/tree/${sampleTree.id}` : "/forests"} title="BranchかTrialを追加" />
          <TutorialStep index={4} href={sampleTree ? `/tree/${sampleTree.id}` : "/forests"} title="Feedbackを書いてみる" />
          <TutorialStep index={5} href={sampleTree ? `/tree/${sampleTree.id}` : "/forests"} title="FeedbackをBranch化" />
          <TutorialStep index={6} href="/archive" title="ArchiveしてRestore" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-forest-ink">用途別サンプル</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-forest-ink">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <DashboardCards metrics={metrics} />

      {sampleTree && (
        <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-forest-ink">サンプルTree</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                このTreeは、ひとつの気づきが改善案・実践・統合・仕組みへ育つ例です。
              </p>
            </div>
            <Link className="inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white" href={`/tree/${sampleTree.id}`}>
              開いて試す
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <TreeCard tree={sampleTree} data={data} />
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="System化を検討しやすいTree" note="Sigmaに到達していて、まだSystemになっていないTreeです。再利用可能な運用知へ整理しやすい状態を示します。">
          {metrics.systemCandidates.map((tree) => <TreeCard key={tree.id} tree={tree} data={data} />)}
          {metrics.systemCandidates.length === 0 && <Empty text="まだ対象Treeはありません。Sigmaまで育ったTreeが出ると、仕組みにしやすい知識としてここに表示されます。" />}
        </Panel>
        <Panel title="次の実践待ちTree" note="Trialに進まず、更新が止まっているTreeです。次に試せる余地がある知識として扱います。">
          {metrics.stalledTrees.map((tree) => <TreeCard key={tree.id} tree={tree} data={data} />)}
          {metrics.stalledTrees.length === 0 && <Empty text="今は次の実践待ちTreeはありません。Branchを作ったら、次はTrialで試した結果を残してみてください。" />}
        </Panel>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-bold text-forest-ink">
          <Flag className="h-5 w-5 text-emerald-700" />
          Phase Counts
        </h2>
        <p className="mt-1 text-sm text-slate-500">Archive済みは通常集計から除外しています。</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(metrics.phaseCounts).map(([phase, count]) => (
            <Link key={phase} href={`/search?phase=${phase}`} className="group cursor-pointer rounded-lg bg-forest-mist p-4 transition hover:bg-blue-50 active:scale-[0.99]">
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

function Compare({ label, text, strong = false }: { label: string; text: string; strong?: boolean }) {
  return (
    <p className={`rounded-lg p-3 ${strong ? "bg-emerald-50 text-emerald-900" : "bg-slate-50"}`}>
      <span className="font-bold">{label}: </span>{text}
    </p>
  );
}

function TutorialStep({ index, href, title }: { index: number; href: string; title: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
      <span><span className="mr-2 text-blue-700">{index}.</span>{title}</span>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
    </Link>
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
