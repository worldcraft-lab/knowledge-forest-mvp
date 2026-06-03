import { phaseDescriptions, phaseOrder } from "@/lib/v02-store";
import { PhaseBadge } from "./PhaseBadge";

export function KnowledgeFlow({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "rounded-lg bg-forest-mist p-4" : "rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5"}>
      <p className="mb-2 text-xs font-bold uppercase text-slate-500">知識成長の流れ</p>
      <p className="mb-3 text-xs leading-5 text-slate-500">
        これは説明用の静的表示です。各Phaseへの絞り込みはDashboardのPhase Countsから行えます。
      </p>
      <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-5"}>
        {phaseOrder.map((phase, index) => (
          <div key={phase} className="flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded-md border border-slate-100 bg-white/70 p-2">
              <PhaseBadge phase={phase} compact={compact} />
              {!compact && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {index + 1}. {phaseDescriptions[phase]}
                </p>
              )}
              {compact && <p className="mt-1 text-xs text-slate-500">{phaseDescriptions[phase]}</p>}
            </div>
            {index < phaseOrder.length - 1 && <span className="text-slate-300">{compact ? "↓" : "→"}</span>}
          </div>
        ))}
      </div>
      {!compact && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sigmaは散らばったBranchとTrialを統合する中心フェーズです。System化は人の評価ではなく、再利用できる運用知への到達を示します。
        </p>
      )}
    </section>
  );
}
