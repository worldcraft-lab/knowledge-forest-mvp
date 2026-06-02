import { AlertTriangle, Flag, GitBranch, Layers3, Sigma, Trees, Workflow } from "lucide-react";
import { DashboardMetrics } from "@/lib/v02-types";

export function DashboardCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: "Total Forests", value: metrics.totalForests, icon: Trees, color: "text-emerald-700 bg-emerald-100" },
    { label: "Total Trees", value: metrics.totalTrees, icon: GitBranch, color: "text-blue-700 bg-blue-100" },
    { label: "Total Nodes", value: metrics.totalNodes, icon: Layers3, color: "text-orange-700 bg-orange-100" },
    { label: "Sigma到達率", value: `${metrics.sigmaArrivalRate}%`, icon: Sigma, color: "text-fuchsia-700 bg-fuchsia-100" },
    { label: "System化率", value: `${metrics.systemizationRate}%`, icon: Workflow, color: "text-slate-700 bg-slate-100" },
    { label: "System化候補", value: metrics.systemCandidates.length, icon: Flag, color: "text-emerald-700 bg-emerald-100" },
    { label: "次の実践待ち", value: metrics.stalledTrees.length, icon: AlertTriangle, color: "text-orange-700 bg-orange-100" }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${card.color}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-slate-500">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-forest-ink">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
