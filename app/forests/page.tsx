"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ForestCard } from "@/components/ForestCard";
import { useKnowledgeForestData } from "@/lib/v02-store";

export default function ForestsPage() {
  const { data } = useKnowledgeForestData();

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-forest-ink">Forests</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Forestはテーマやプロジェクト単位の知識空間です。各Forestの中で複数のTreeが成長します。
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            Forestを作成
          </Link>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {data.forests.map((forest) => (
          <ForestCard key={forest.id} forest={forest} data={data} />
        ))}
      </section>
    </div>
  );
}
