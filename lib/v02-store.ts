"use client";

import { useEffect, useMemo, useState } from "react";
import { seedData, STORAGE_KEY_V02 } from "./v02-seed";
import {
  Area,
  DashboardMetrics,
  Forest,
  ForestVisibility,
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

export const DEFAULT_AREA_ID = "area-general";

export const defaultArea: Area = {
  id: DEFAULT_AREA_ID,
  title: "General",
  description: "既存Forestや未分類のForestをまとめる既定Areaです。",
  tags: ["default"],
  createdAt: new Date("2026-06-02T09:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-06-02T09:00:00.000Z").toISOString()
};

export function normalizeKnowledgeForestData(data: KnowledgeForestData): KnowledgeForestData {
  const areas = data.areas?.length ? data.areas : [defaultArea];
  const hasDefaultArea = areas.some((area) => area.id === DEFAULT_AREA_ID);
  const nextAreas = hasDefaultArea ? areas : [defaultArea, ...areas];
  const areaIds = new Set(nextAreas.map((area) => area.id));

  return {
    ...data,
    areas: nextAreas,
    forests: data.forests.map((forest) => ({
      ...forest,
      areaId: forest.areaId && areaIds.has(forest.areaId) ? forest.areaId : DEFAULT_AREA_ID
    }))
  };
}

export function useKnowledgeForestData() {
  const [data, setData] = useState<KnowledgeForestData>(normalizeKnowledgeForestData(seedData));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_V02);
    if (stored) {
      const normalized = normalizeKnowledgeForestData(JSON.parse(stored) as KnowledgeForestData);
      setData(normalized);
      window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(normalized));
    } else {
      const normalizedSeed = normalizeKnowledgeForestData(seedData);
      setData(normalizedSeed);
      window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(normalizedSeed));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(normalizeKnowledgeForestData(data)));
    }
  }, [data, isReady]);

  return { data, setData, isReady };
}

export function saveKnowledgeForestData(data: KnowledgeForestData) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(normalizeKnowledgeForestData(data)));
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

export function createSlugId(prefix: string, value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
  return `${prefix}-${slug || "item"}-${Date.now()}`;
}

export function getTreeNodes(data: KnowledgeForestData, treeId: string) {
  return data.nodes.filter((node) => node.treeId === treeId);
}

export function getForestTrees(data: KnowledgeForestData, forestId: string) {
  return data.trees.filter((tree) => tree.forestId === forestId);
}

export function getAreaForests(data: KnowledgeForestData, areaId: string) {
  return data.forests.filter((forest) => (forest.areaId ?? DEFAULT_AREA_ID) === areaId);
}

export function getForestArea(data: KnowledgeForestData, forest: Forest) {
  return data.areas.find((area) => area.id === (forest.areaId ?? DEFAULT_AREA_ID)) ?? defaultArea;
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
  const normalized = normalizeKnowledgeForestData(data);
  const phaseCounts = phaseOrder.reduce(
    (acc, phase) => ({ ...acc, [phase]: normalized.nodes.filter((node) => node.phase === phase).length }),
    {} as Record<Phase, number>
  );

  const treesWithNodes = normalized.trees.map((tree) => ({
    tree,
    nodes: getTreeNodes(normalized, tree.id)
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
    totalAreas: normalized.areas.length,
    totalForests: normalized.forests.length,
    totalTrees: normalized.trees.length,
    totalNodes: normalized.nodes.length,
    phaseCounts,
    sigmaArrivalRate: normalized.trees.length ? Math.round((sigmaTrees.length / normalized.trees.length) * 100) : 0,
    systemizationRate: normalized.trees.length ? Math.round((systemTrees.length / normalized.trees.length) * 100) : 0,
    systemCandidates,
    stalledTrees
  };
}

export function useMetrics(data: KnowledgeForestData) {
  return useMemo(() => calculateMetrics(data), [data]);
}

export function searchKnowledge(data: KnowledgeForestData, query: string) {
  const normalized = normalizeKnowledgeForestData(data);
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      trees: normalized.trees,
      nodes: normalized.nodes
    };
  }

  const forestById = new Map(normalized.forests.map((forest) => [forest.id, forest]));
  const areaById = new Map(normalized.areas.map((area) => [area.id, area]));
  const treeMatches = normalized.trees.filter((tree) => {
    const forest = forestById.get(tree.forestId);
    const area = forest ? areaById.get(forest.areaId ?? DEFAULT_AREA_ID) : undefined;
    const treeNodes = getTreeNodes(normalized, tree.id);
    return [
      area?.title ?? "",
      area?.description ?? "",
      area?.tags.join(" ") ?? "",
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

  const nodes = normalized.nodes.filter((node) =>
    [node.title, node.body, node.tags.join(" "), node.phase, node.authorName]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  return { trees: treeMatches, nodes };
}

export function addArea(
  data: KnowledgeForestData,
  payload: {
    title: string;
    description: string;
    tags: string[];
  }
) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const area: Area = {
    id: createSlugId("area", payload.title),
    title: payload.title,
    description: payload.description,
    tags: payload.tags,
    createdAt: now,
    updatedAt: now
  };

  return {
    nextData: {
      ...normalized,
      areas: [area, ...normalized.areas]
    },
    area
  };
}

export function addForest(
  data: KnowledgeForestData,
  payload: {
    areaId: string;
    title: string;
    description: string;
    ownerLabel: string;
    tags: string[];
    visibility: ForestVisibility;
  }
) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const forest: Forest = {
    id: createSlugId("forest", payload.title),
    areaId: payload.areaId || DEFAULT_AREA_ID,
    title: payload.title,
    description: payload.description,
    tags: payload.tags,
    ownerLabel: payload.ownerLabel || "Local Demo",
    visibility: payload.visibility,
    createdAt: now,
    updatedAt: now
  };

  return {
    nextData: {
      ...normalized,
      forests: [forest, ...normalized.forests],
      areas: normalized.areas.map((area) =>
        area.id === forest.areaId ? { ...area, updatedAt: now } : area
      )
    },
    forest
  };
}

export function addTree(
  data: KnowledgeForestData,
  forestId: string,
  title: string,
  summary: string,
  tags: string[] = ["新規Tree"]
) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const tree: KnowledgeTree = {
    id: createSlugId("tree", title),
    forestId,
    title,
    summary,
    tags: tags.length ? tags : ["新規Tree"],
    createdAt: now,
    updatedAt: now
  };

  return {
    nextData: {
      ...normalized,
      trees: [tree, ...normalized.trees],
      forests: normalized.forests.map((forest) =>
        forest.id === forestId ? { ...forest, updatedAt: now } : forest
      )
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
  const normalized = normalizeKnowledgeForestData(data);
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
      ...normalized,
      nodes: [node, ...normalized.nodes],
      trees: normalized.trees.map((tree) =>
        tree.id === payload.treeId ? { ...tree, updatedAt: now } : tree
      )
    },
    node
  };
}

export function addTreeWithSeed(
  data: KnowledgeForestData,
  payload: {
    forestId: string;
    title: string;
    summary: string;
    tags: string[];
    seedTitle: string;
    seedBody: string;
  }
) {
  const treeResult = addTree(data, payload.forestId, payload.title, payload.summary, payload.tags);
  const nodeResult = addNode(treeResult.nextData, {
    treeId: treeResult.tree.id,
    parentId: null,
    phase: "seed",
    title: payload.seedTitle,
    body: payload.seedBody,
    tags: ["Seed", ...payload.tags].slice(0, 6)
  });

  return {
    nextData: nodeResult.nextData,
    tree: treeResult.tree,
    seedNode: nodeResult.node
  };
}
