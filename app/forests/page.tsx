"use client";

import { ForestCard } from "@/components/ForestCard";
import { useKnowledgeForestData } from "@/lib/v02-store";

export default function ForestsPage() {
  const { data } = useKnowledgeForestData();

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <h2 className="text-2xl font-bold text-forest-ink">Forests</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Forestはテーマやプロジェクト単位の知識空間です。各Forestの中で複数のTreeが成長します。
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {data.forests.map((forest) => (
          <ForestCard key={forest.id} forest={forest} data={data} />
        ))}
      </section>
    </div>
  );
}
