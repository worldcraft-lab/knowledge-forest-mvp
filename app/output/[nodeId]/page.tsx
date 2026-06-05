"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, ChevronLeft, Copy, Printer } from "lucide-react";
import { getForestArea, isArchived, phaseLabels, useKnowledgeForestData } from "@/lib/v02-store";
import { KnowledgeForestData, KnowledgeNode, Phase } from "@/lib/v02-types";

const sourcePhases: Phase[] = ["seed", "branch", "trial", "sigma"];

type OutputTab = "preview" | "markdown";

export default function OutputPage() {
  const params = useParams<{ nodeId: string }>();
  const { data } = useKnowledgeForestData();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [tab, setTab] = useState<OutputTab>("preview");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const context = useMemo(() => getOutputContext(data, params.nodeId), [data, params.nodeId]);

  if (!context) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <Link className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700" href="/">
          <ChevronLeft className="h-4 w-4" />
          Dashboardへ戻る
        </Link>
        <h2 className="text-xl font-bold text-forest-ink">Output対象のNodeが見つかりません</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">TreeからSystem Nodeを選択して、Outputを作成してください。</p>
      </section>
    );
  }

  const { area, forest, node, relatedByPhase, tree } = context;
  const markdown = buildMarkdown(context);

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFailed(true);
      setTab("markdown");
      window.setTimeout(() => textareaRef.current?.select(), 0);
    }
  }

  if (node.phase !== "system") {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <Link className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700" href={`/tree/${node.treeId}?node=${node.id}`}>
          <ChevronLeft className="h-4 w-4" />
          Treeに戻る
        </Link>
        <h2 className="text-xl font-bold text-forest-ink">OutputはSystem Nodeから作成できます</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          このNodeはまだSystemではありません。Outputするには、気づき・改善・実践・統合を経て、System Nodeとして整理してください。
        </p>
        <Link className="mt-5 inline-flex rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white" href={`/tree/${node.treeId}?node=${node.id}`}>
          Treeに戻る
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft print:border-0 print:shadow-none">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link className="inline-flex items-center gap-1 text-sm font-bold text-blue-700" href={`/tree/${tree.id}?node=${node.id}`}>
            <ChevronLeft className="h-4 w-4" />
            Back to Tree
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-100 active:scale-[0.99]"
              onClick={copyMarkdown}
              type="button"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Markdown"}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]"
              onClick={() => window.print()}
              type="button"
            >
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        <p className="text-sm font-bold text-emerald-700 print:hidden">System Node Output</p>
        <h2 className="mt-1 text-2xl font-bold leading-9 text-forest-ink">{node.title}</h2>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3 print:grid-cols-3">
          <Info label="出力元Tree" value={tree.title} />
          <Info label="出力対象System Node" value={node.title} />
          <Info label="出力元" value={["Knowledge Forest", area?.title, forest?.title].filter(Boolean).join(" / ")} />
        </div>
        {isArchived(node) && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
            このSystem NodeはArchiveされています。
          </p>
        )}
        <p className="mt-3 text-sm leading-6 text-slate-500 print:hidden">
          Markdown形式のOutput Previewです。CopyでMarkdownを取得し、Print / Save as PDFからPDF保存できます。
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft print:border-0 print:p-0 print:shadow-none">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h3 className="text-lg font-bold text-forest-ink">Output Preview</h3>
          <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <TabButton active={tab === "preview"} label="Preview" onClick={() => setTab("preview")} />
            <TabButton active={tab === "markdown"} label="Markdown" onClick={() => setTab("markdown")} />
          </div>
        </div>
        {copyFailed && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900 print:hidden">
            Clipboardへのコピーに失敗しました。Markdownタブのテキストを選択してコピーしてください。
          </p>
        )}
        {tab === "preview" ? (
          <MarkdownPreview markdown={markdown} />
        ) : (
          <textarea
            ref={textareaRef}
            className="min-h-[70vh] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none focus:border-blue-300 print:min-h-0 print:border-0 print:bg-white print:p-0"
            readOnly
            value={markdown}
          />
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft print:hidden">
        <h3 className="text-lg font-bold text-forest-ink">関連Nodeの参照</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          System Nodeの親子関係を優先し、つながりが不足するPhaseは同じTree内のNodeで補っています。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sourcePhases.map((phase) => (
            <article key={phase} className="rounded-lg bg-slate-50 p-4">
              <h4 className="text-sm font-bold text-forest-ink">{sectionTitle(phase)}</h4>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {(relatedByPhase[phase] ?? []).map((item) => item.title).join(" / ") || "参照Nodeなし"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function getOutputContext(data: KnowledgeForestData, nodeId: string) {
  const node = data.nodes.find((item) => item.id === nodeId);
  if (!node) return null;
  const tree = data.trees.find((item) => item.id === node.treeId);
  if (!tree) return null;
  const forest = data.forests.find((item) => item.id === tree.forestId);
  const area = forest ? getForestArea(data, forest) : null;
  const treeNodes = data.nodes.filter((item) => item.treeId === tree.id);
  const ancestors = getAncestorChain(treeNodes, node);
  const relatedByPhase = sourcePhases.reduce((acc, phase) => {
    const connected = ancestors.filter((item) => item.phase === phase);
    acc[phase] = connected.length ? connected : treeNodes.filter((item) => item.phase === phase);
    return acc;
  }, {} as Record<Phase, KnowledgeNode[]>);
  return { ancestors, area, forest, node, relatedByPhase, tree, treeNodes };
}

function buildMarkdown(context: NonNullable<ReturnType<typeof getOutputContext>>) {
  const { area, forest, node, relatedByPhase, tree } = context;
  const sourcePath = ["Knowledge Forest", area?.title, forest?.title, tree.title].filter(Boolean).join(" / ");
  const sections = sourcePhases.map((phase) => {
    const phaseNodes = relatedByPhase[phase] ?? [];
    return `## ${sectionTitle(phase)}\n${formatNodeBullets(phaseNodes)}`;
  });

  return [
    `# ${node.title}`,
    "",
    "## 概要",
    node.body,
    "",
    "## 目的",
    `このSystemは、${tree.title} に関する気づき・改善・実践をもとに作成された再利用可能な運用知です。`,
    "",
    ...sections.flatMap((section) => [section, ""]),
    "## 手順・運用ルール",
    formatSystemProcedure(node.body),
    "",
    "## 注意点",
    "- 必要に応じて追記してください。",
    "",
    "## 関連タグ",
    node.tags.length ? node.tags.map((tag) => `- ${tag}`).join("\n") : "- 未設定",
    "",
    "## 作成日",
    formatFullDate(node.createdAt),
    "",
    "## 出力元",
    sourcePath
  ].join("\n");
}

function getAncestorChain(nodes: KnowledgeNode[], node: KnowledgeNode) {
  const byId = new Map(nodes.map((item) => [item.id, item]));
  const ancestors: KnowledgeNode[] = [];
  const seen = new Set<string>();
  let current = node.parentId ? byId.get(node.parentId) : undefined;
  while (current && !seen.has(current.id)) {
    ancestors.unshift(current);
    seen.add(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return ancestors;
}

function sectionTitle(phase: Phase) {
  if (phase === "seed") return "背景となった気づき";
  if (phase === "branch") return "改善案";
  if (phase === "trial") return "実践したこと";
  return "統合された知見";
}

function formatNodeBullets(nodes: KnowledgeNode[]) {
  if (nodes.length === 0) return "- まだ記録がありません。";
  return nodes.map((node) => `- ${node.title}: ${summarize(node.body)}${isArchived(node) ? "（Archived）" : ""}`).join("\n");
}

function summarize(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > 120 ? `${compact.slice(0, 120)}...` : compact;
}

function formatSystemProcedure(body: string) {
  const lines = body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) return `1. ${body.trim() || "System Node本文をもとに運用ルールを追記してください。"}`;
  return lines.map((line, index) => `${index + 1}. ${line.replace(/^[-\d.\s]+/, "")}`).join("\n");
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-forest-ink shadow-sm" : "text-slate-500 hover:text-blue-700"}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value || "未設定"}</p>
    </div>
  );
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <article className="prose prose-slate max-w-none rounded-lg bg-white text-slate-800 print:prose-sm">
      {markdown.split("\n").map((line, index) => {
        if (line.startsWith("# ")) return <h1 key={index} className="mb-5 text-3xl font-bold text-forest-ink">{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={index} className="mb-3 mt-7 border-b border-slate-200 pb-2 text-xl font-bold text-forest-ink">{line.slice(3)}</h2>;
        if (line.startsWith("- ")) return <p key={index} className="ml-4 text-sm leading-7 text-slate-700">- {line.slice(2)}</p>;
        if (/^\d+\.\s/.test(line)) return <p key={index} className="ml-4 text-sm leading-7 text-slate-700">{line}</p>;
        if (!line.trim()) return <div key={index} className="h-2" />;
        return <p key={index} className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{line}</p>;
      })}
    </article>
  );
}
