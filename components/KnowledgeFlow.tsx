import { phaseDescriptions, phaseLabels, phaseOrder } from "@/lib/v02-store";

export function KnowledgeFlow({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section className="rounded-lg bg-forest-mist p-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">知識成長の流れ</p>
        <div className="space-y-2">
          {phaseOrder.map((phase) => (
            <div key={phase} className="flex items-center justify-between gap-3 rounded-md bg-white/65 px-3 py-2">
              <span className="whitespace-nowrap text-xs font-bold text-forest-ink">{phaseLabels[phase]}</span>
              <span className="whitespace-nowrap text-xs text-slate-500">{phaseDescriptions[phase]}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase text-slate-500">知識成長の流れ</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        これは知識が育つ流れの説明です。各Phaseへの絞り込みはDashboardのPhase Countsから行えます。
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-5 xl:grid-cols-1 2xl:grid-cols-5">
        {phaseOrder.map((phase, index) => (
          <div key={phase} className="flex min-w-0 items-center gap-2 rounded-md bg-white/70 px-3 py-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="whitespace-nowrap text-sm font-bold text-forest-ink">{phaseLabels[phase]}</p>
              <p className="whitespace-nowrap text-xs text-slate-500">{phaseDescriptions[phase]}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Sigmaは散らばったBranchとTrialを統合する中心フェーズです。System化は人の評価ではなく、再利用できる運用知への到達を示します。
      </p>
    </section>
  );
}
