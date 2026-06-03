import Link from "next/link";
import { Trees } from "lucide-react";
import { Forest, KnowledgeForestData } from "@/lib/v02-types";
import { getForestTrees } from "@/lib/v02-store";

export function ForestCard({ forest, data }: { forest: Forest; data: KnowledgeForestData }) {
  const trees = getForestTrees(data, forest.id);

  return (
    <Link
      href={`/forests/${forest.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
          <Trees className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-7 text-forest-ink">{forest.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{forest.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {forest.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-emerald-700">{trees.length} Trees</p>
    </Link>
  );
}
