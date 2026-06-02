"use client";

import { useEffect, useMemo, useState } from "react";
import { seedData, STORAGE_KEY_V02 } from "./v02-seed";
import {
  DashboardMetrics,
  KnowledgeForestData,
  KnowledgeNode,
  KnowledgeTree,
  Phase
} from "./v02-types";

export const phaseOrder: Phase[] = ["seed", "branch", "trial", "sigma", "system"];

export const phaseLabels: Record<Phase, string> = {
  seed: "Seed",
  branch: "Branch",
  trial: "Trial",
  sigma: "Sigma",
  system: "System"
};

export const phaseDescriptions: Record<Phase, string> = {
  seed: "気づき",
  branch: "改善案",
  trial: "実践",
  sigma: "統合",
  system: "制度化"
};

export const phaseStyles: Record<Phase, string> = {
  seed: "border-blue-200 bg-blue-50 text-blue-900",
  branch: "border-emerald-200 bg-emerald-50 text-emerald-900",
  trial: "border-orange-200 bg-orange-50 text-orange-900",
  sigma: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900",
  system: "border-slate-300 bg-slate-50 text-slate-900"
};

export const phaseNodeColors: Record<Phase, string> = {
  seed: "#bfdbfe",
  branch: "#bbf7d0",
  trial: "#fed7aa",
  sigma: "#f5d0fe",
  system: "#cbd5e1"
};

export function useKnowledgeForestData() {
  const [data, setData] = useState<KnowledgeForestData>(seedData);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_V02);
    if (stored) {
      setData(JSON.parse(stored) as KnowledgeForestData);
    } else {
      window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(seedData));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(data));
    }
  }, [data, isReady]);

  return { data, setData, isReady };
}

export function saveKnowledgeForestData(data: KnowledgeForestData) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(data));
  }
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getTreeNodes(data: KnowledgeForestData, treeId: string) {
  return data.nodes.filter((node) => node.treeId === treeId);
}

export function getForestTrees(data: KnowledgeForestData, forestId: string) {
  return data.trees.filter((tree) => tree.forestId === forestId);
}

export function getTreePhaseSet(nodes: KnowledgeNode[]) {
  return new Set(nodes.map((node) => node.phase));
}

export function getTreeHighestPhase(nodes: KnowledgeNode[]): Phase {
  const set = getTreePhaseSet(nodes);
  return [...phaseOrder].reverse().find((phase) => set.has(phase)) ?? "seed";
}

export function hasPhase(nodes: KnowledgeNode[], phase: Phase) {
  return nodes.some((node) => node.phase === phase);
}

export function getTreeProgress(nodes: KnowledgeNode[]) {
  const reached = phaseOrder.filter((phase) => hasPhase(nodes, phase)).length;
  return Math.round((reached / phaseOrder.length) * 100);
}

export function calculateMetrics(data: KnowledgeForestData): DashboardMetrics {
  const phaseCounts = phaseOrder.reduce(
    (acc, phase) => ({ ...acc, [phase]: data.nodes.filter((node) => node.phase === phase).length }),
    {} as Record<Phase, number>
  );

  const treesWithNodes = data.trees.map((tree) => ({
    tree,
    nodes: getTreeNodes(data, tree.id)
  }));
  const sigmaTrees = treesWithNodes.filter(({ nodes }) => hasPhase(nodes, "sigma"));
  const systemTrees = treesWithNodes.filter(({ nodes }) => hasPhase(nodes, "system"));
  const systemCandidates = treesWithNodes
    .filter(({ nodes }) => hasPhase(nodes, "sigma") && !hasPhase(nodes, "system"))
    .map(({ tree }) => tree);
  const stalledTrees = treesWithNodes
    .filter(({ nodes, tree }) => {
      const age = Date.now() - new Date(tree.updatedAt).getTime();
      return age > 6 * 24 * 60 * 60 * 1000 && !hasPhase(nodes, "trial");
    })
    .map(({ tree }) => tree);

  return {
    totalForests: data.forests.length,
    totalTrees: data.trees.length,
    totalNodes: data.nodes.length,
    phaseCounts,
    sigmaArrivalRate: data.trees.length ? Math.round((sigmaTrees.length / data.trees.length) * 100) : 0,
    systemizationRate: data.trees.length ? Math.round((systemTrees.length / data.trees.length) * 100) : 0,
    systemCandidates,
    stalledTrees
  };
}

export function useMetrics(data: KnowledgeForestData) {
  return useMemo(() => calculateMetrics(data), [data]);
}

export function searchKnowledge(data: KnowledgeForestData, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      trees: data.trees,
      nodes: data.nodes
    };
  }

  const forestById = new Map(data.forests.map((forest) => [forest.id, forest]));
  const treeMatches = data.trees.filter((tree) => {
    const forest = forestById.get(tree.forestId);
    const treeNodes = getTreeNodes(data, tree.id);
    return [
      tree.title,
      tree.summary,
      tree.tags.join(" "),
      forest?.title ?? "",
      forest?.description ?? "",
      treeNodes.map((node) => `${node.title} ${node.body} ${node.tags.join(" ")} ${node.phase} ${node.authorName}`).join(" ")
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const nodes = data.nodes.filter((node) =>
    [node.title, node.body, node.tags.join(" "), node.phase, node.authorName]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  return { trees: treeMatches, nodes };
}

export function addTree(data: KnowledgeForestData, forestId: string, title: string, summary: string) {
  const now = new Date().toISOString();
  const tree: KnowledgeTree = {
    id: createId("tree"),
    forestId,
    title,
    summary,
    tags: ["新規Tree"],
    createdAt: now,
    updatedAt: now
  };

  return {
    nextData: {
      ...data,
      trees: [tree, ...data.trees]
    },
    tree
  };
}

export function addNode(
  data: KnowledgeForestData,
  payload: {
    treeId: string;
    parentId: string | null;
    phase: Phase;
    title: string;
    body: string;
    tags: string[];
  }
) {
  const now = new Date().toISOString();
  const node: KnowledgeNode = {
    id: createId("node"),
    treeId: payload.treeId,
    parentId: payload.parentId,
    phase: payload.parentId ? payload.phase : "seed",
    title: payload.title,
    body: payload.body,
    tags: payload.tags,
    authorName: "あなた",
    createdAt: now,
    helpfulCount: 0,
    commentCount: 0
  };

  return {
    nextData: {
      ...data,
      nodes: [node, ...data.nodes],
      trees: data.trees.map((tree) =>
        tree.id === payload.treeId ? { ...tree, updatedAt: now } : tree
      )
    },
    node
  };
}
