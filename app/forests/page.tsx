"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ForestCard } from "@/components/ForestCard";
import { archiveItem, getAreaForests, getVisibleData, saveKnowledgeForestData, useKnowledgeForestData } from "@/lib/v02-store";

export default function ForestsPage() {
  const { data, setData } = useKnowledgeForestData();
  const visibleData = getVisibleData(data);

  function archiveArea(areaId: string, forestCount: number) {
    const message = forestCount
      ? "このAreaにはForestがあります。Archiveすると、配下のForest / Tree / Node / Feedbackも通常表示から隠れます。"
      : "このAreaをArchiveします。通常表示から隠れますが、データは保持され、後からRestoreできます。";
    if (!window.confirm(message)) return;
    const nextData = archiveItem(data, "area", areaId, "Area archived");
    saveKnowledgeForestData(nextData);
    setData(nextData);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-forest-ink">Areas / Forests</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Areaは複数のForestを束ねる知識領域です。Area → Forest → Tree → Node の順に、気づきが運用知へ育つ場所を整理します。
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

      <section className="space-y-5">
        {visibleData.areas.map((area) => {
          const forests = getAreaForests(data, area.id);

          return (
            <div key={area.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-teal-700">Area</p>
                  <h3 className="mt-1 text-xl font-bold text-forest-ink">{area.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{area.description}</p>
                </div>
                <span className="rounded-md bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800">
                  {forests.length} Forests
                </span>
                <button
                  className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"
                  onClick={() => archiveArea(area.id, forests.length)}
                  type="button"
                >
                  Archive Area
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {forests.map((forest) => (
                  <ForestCard key={forest.id} forest={forest} data={data} />
                ))}
                {forests.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    このAreaにはまだForestがありません。CreateからForestを作成するとここに表示されます。
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
