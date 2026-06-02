"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/SearchResults";
import { getTreeNodes, hasPhase, searchKnowledge, useKnowledgeForestData } from "@/lib/v02-store";

export default function SearchPage() {
  const { data } = useKnowledgeForestData();
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = useMemo(() => searchKnowledge(data, query), [data, query]);
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
  const visibleTrees = trimmedQuery ? results.trees : initialTrees;
  const visibleNodes = trimmedQuery ? results.nodes : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
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
        {trimmedQuery ? (
          <p>
            検索語「<span className="font-bold text-forest-ink">{trimmedQuery}</span>」に一致したTreeとNodeを表示しています。
            System化は人の評価ではなく、再利用可能な運用知へ到達した状態として扱います。
          </p>
        ) : (
          <p>
            検索前は初期表示として、最近更新されたTreeと、Sigmaに到達してSystem化を検討しやすいTreeを表示しています。
            これは人の評価ではなく、知識を再利用しやすくするための整理サインです。
          </p>
        )}
      </div>
      <div className="mt-6">
        <SearchResults data={data} trees={visibleTrees} nodes={visibleNodes} />
      </div>
    </section>
  );
}
