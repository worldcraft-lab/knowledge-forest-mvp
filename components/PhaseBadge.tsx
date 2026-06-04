import { phaseDescriptions, phaseLabels, phaseStyles } from "@/lib/v02-store";
import { Phase } from "@/lib/v02-types";

export function PhaseBadge({ phase, compact = false }: { phase: Phase; compact?: boolean }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-bold ${phaseStyles[phase]}`}>
      {phaseLabels[phase]}
      {!compact && <span className="ml-1 font-semibold opacity-75">/ {phaseDescriptions[phase]}</span>}
    </span>
  );
}
