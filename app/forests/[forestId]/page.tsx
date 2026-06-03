"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { TreeCard } from "@/components/TreeCard";
import { getForestArea, getForestTrees, useKnowledgeForestData } from "@/lib/v02-store";

export default function ForestDetailPage() {
  const params = useParams<{ forestId: string }>();
  const { data } = useKnowledgeForestData();
  const forest = data.forests.find((item) => item.id === params.forestId);

  if (!forest) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <Link className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700" href="/forests">
          <ChevronLeft className="h-4 w-4" />
          Forest一覧へ
        </Link>
        <h2 className="text-xl font-bold text-forest-ink">Forestが見つかりません</h2>
      </section>
    );
  }

  const trees = getForestTrees(data, forest.id);
  const area = getForestArea(data, forest);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="inline-flex items-center gap-1 text-blue-700" href="/forests">
            <ChevronLeft className="h-4 w-4" />
            Forest一覧へ
          </Link>
          <span>/</span>
          <Link className="text-blue-700" href="/">Dashboard</Link>
          <span>/</span>
          <span>{area.title}</span>
          <span>/</span>
          <span>{forest.title}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-700">Area / Forest</p>
            <p className="mt-1 text-xs font-bold uppercase text-teal-700">{area.title}</p>
            <h2 className="mt-1 text-2xl font-bold text-forest-ink">{forest.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{forest.description}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {forest.ownerLabel} / {forest.visibility ?? "private"}
            </p>
          </div>
          <Link
            className="flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]"
            href={`/create?forestId=${forest.id}`}
            aria-label={`${forest.title}にTreeを作成する`}
            title={`${forest.title}にTreeを作成する`}
          >
            <Plus className="h-4 w-4" />
            Treeを作成する
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {forest.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </section>
      {trees.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {trees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} data={data} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-5 text-center shadow-soft">
          <h3 className="text-lg font-bold text-forest-ink">このForestにはまだTreeがありません。</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            最初のTreeを作成して、知識の成長を始めましょう。
          </p>
          <Link
            href={`/create?forestId=${forest.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            Treeを作成する
          </Link>
        </section>
      )}
    </div>
  );
}
