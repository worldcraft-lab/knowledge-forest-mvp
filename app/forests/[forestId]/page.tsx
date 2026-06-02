"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { TreeCard } from "@/components/TreeCard";
import { getForestTrees, useKnowledgeForestData } from "@/lib/v02-store";

export default function ForestDetailPage() {
  const params = useParams<{ forestId: string }>();
  const { data } = useKnowledgeForestData();
  const forest = data.forests.find((item) => item.id === params.forestId);

  if (!forest) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-forest-ink">Forestが見つかりません</h2>
      </section>
    );
  }

  const trees = getForestTrees(data, forest.id);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-700">Forest</p>
            <h2 className="mt-1 text-2xl font-bold text-forest-ink">{forest.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{forest.description}</p>
          </div>
          <Link className="flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white" href="/create">
            <Plus className="h-4 w-4" />
            Treeを追加
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
      <section className="grid gap-4 lg:grid-cols-2">
        {trees.map((tree) => (
          <TreeCard key={tree.id} tree={tree} data={data} />
        ))}
      </section>
    </div>
  );
}
