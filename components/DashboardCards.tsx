import Link from "next/link";
import { AlertTriangle, ArrowRight, Flag, GitBranch, Layers3, Sigma, Trees, Workflow } from "lucide-react";
import { DashboardMetrics } from "@/lib/v02-types";

export function DashboardCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: "Total Forests", value: metrics.totalForests, href: "/forests", icon: Trees, color: "text-emerald-700 bg-emerald-100" },
    { label: "Total Trees", value: metrics.totalTrees, href: "/search?scope=trees", icon: GitBranch, color: "text-blue-700 bg-blue-100" },
    { label: "Total Nodes", value: metrics.totalNodes, href: "/search?scope=nodes", icon: Layers3, color: "text-orange-700 bg-orange-100" },
    { label: "Sigma到達率", value: `${metrics.sigmaArrivalRate}%`, href: "/search?phase=sigma", icon: Sigma, color: "text-fuchsia-700 bg-fuchsia-100" },
    { label: "System化率", value: `${metrics.systemizationRate}%`, href: "/search?phase=system", icon: Workflow, color: "text-slate-700 bg-slate-100" },
    { label: "System化候補", value: metrics.systemCandidates.length, href: "/search?status=system-candidate", icon: Flag, color: "text-emerald-700 bg-emerald-100" },
    { label: "次の実践待ち", value: metrics.stalledTrees.length, href: "/search?status=stalled", icon: AlertTriangle, color: "text-orange-700 bg-orange-100" }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="group block cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
          aria-label={`${card.label}を詳しく見る`}
          title={`${card.label}を詳しく見る`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-600" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-slate-500">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-forest-ink">{card.value}</p>
        </Link>
      ))}
    </section>
  );
}
