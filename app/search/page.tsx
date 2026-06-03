"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { SearchResults } from "@/components/SearchResults";
import {
  getTreeNodes,
  hasPhase,
  phaseLabels,
  searchKnowledge,
  useKnowledgeForestData
} from "@/lib/v02-store";
import { Phase } from "@/lib/v02-types";

const validPhases: Phase[] = ["seed", "branch", "trial", "sigma", "system"];

export default function SearchPage() {
  return (
    <Suspense fallback={<section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">Loading search...</section>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const { data } = useKnowledgeForestData();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase") as Phase | null;
  const status = searchParams.get("status");
  const scope = searchParams.get("scope");
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = useMemo(() => searchKnowledge(data, query), [data, query]);

  const filteredByParams = useMemo(() => {
    let trees = [...data.trees];
    let nodes = [...data.nodes];

    if (phase && validPhases.includes(phase)) {
      nodes = nodes.filter((node) => node.phase === phase);
      const treeIds = new Set(nodes.map((node) => node.treeId));
      trees = trees.filter((tree) => treeIds.has(tree.id));
    }

    if (status === "system-candidate") {
      trees = trees.filter((tree) => {
        const treeNodes = getTreeNodes(data, tree.id);
        return hasPhase(treeNodes, "sigma") && !hasPhase(treeNodes, "system");
      });
      const treeIds = new Set(trees.map((tree) => tree.id));
      nodes = nodes.filter((node) => treeIds.has(node.treeId));
    }

    if (status === "stalled" || status === "trial-waiting") {
      trees = trees.filter((tree) => {
        const treeNodes = getTreeNodes(data, tree.id);
        const age = Date.now() - new Date(tree.updatedAt).getTime();
        return age > 6 * 24 * 60 * 60 * 1000 && !hasPhase(treeNodes, "trial");
      });
      const treeIds = new Set(trees.map((tree) => tree.id));
      nodes = nodes.filter((node) => treeIds.has(node.treeId));
    }

    if (scope === "trees") nodes = [];
    if (scope === "nodes") trees = data.trees.filter((tree) => nodes.some((node) => node.treeId === tree.id));

    return { trees, nodes };
  }, [data, phase, scope, status]);

  const initialTrees = useMemo(() => {
    return [...data.trees].sort((a, b) => {
      const aNodes = getTreeNodes(data, a.id);
      const bNodes = getTreeNodes(data, b.id);
      const aReadyForSystem = hasPhase(aNodes, "sigma") && !hasPhase(aNodes, "system") ? 1 : 0;
      const bReadyForSystem = hasPhase(bNodes, "sigma") && !hasPhase(bNodes, "system") ? 1 : 0;
      if (aReadyForSystem !== bReadyForSystem) return bReadyForSystem - aReadyForSystem;
      return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    });
  }, [data]);

  const hasParamFilter = Boolean(phase || status || scope);
  const visibleTrees = trimmedQuery ? results.trees : hasParamFilter ? filteredByParams.trees : initialTrees;
  const visibleNodes = trimmedQuery ? results.nodes : hasParamFilter ? filteredByParams.nodes : [];
  const description = getDescription({ trimmedQuery, phase, status, scope });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
        <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
          <ChevronLeft className="h-4 w-4" />
          Dashboardへ戻る
        </Link>
        <span>/</span>
        <span>Search</span>
      </div>
      <h2 className="text-2xl font-bold text-forest-ink">Search Related Trees</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        タイトル、本文、タグ、Phase、Forest、Authorを横断検索します。結果は関連Treeを優先し、その下に一致Nodeを表示します。
      </p>
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-12"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例：Sigma、接客、レビュー、System"
        />
      </div>
      <div className="mt-4 rounded-lg bg-forest-mist p-4 text-sm leading-6 text-slate-600">
        {description}
      </div>
      <div className="mt-6">
        <SearchResults data={data} trees={visibleTrees} nodes={visibleNodes} />
      </div>
    </section>
  );
}

function getDescription({
  trimmedQuery,
  phase,
  status,
  scope
}: {
  trimmedQuery: string;
  phase: Phase | null;
  status: string | null;
  scope: string | null;
}) {
  if (trimmedQuery) {
    return (
      <p>
        検索語「<span className="font-bold text-forest-ink">{trimmedQuery}</span>」に一致したTreeとNodeを表示しています。
        System化は人の評価ではなく、再利用可能な運用知へ到達した状態として扱います。
      </p>
    );
  }
  if (phase && validPhases.includes(phase)) {
    return <p>{phaseLabels[phase]}に関連するTreeとNodeを表示しています。</p>;
  }
  if (status === "system-candidate") {
    return <p>System化候補のTreeを表示しています。これは評価ではなく、再利用可能な運用知へ整理しやすい状態です。</p>;
  }
  if (status === "stalled" || status === "trial-waiting") {
    return <p>次の実践待ちTreeを表示しています。次にTrialへ進める余地がある知識です。</p>;
  }
  if (scope === "trees") return <p>Tree一覧を中心に表示しています。</p>;
  if (scope === "nodes") return <p>Nodeを含むTreeとMatched Nodesを表示しています。</p>;
  return (
    <p>
      検索前は初期表示として、最近更新されたTreeと、Sigmaに到達してSystem化を検討しやすいTreeを表示しています。
      これは人の評価ではなく、知識を再利用しやすくするための整理サインです。
    </p>
  );
}
