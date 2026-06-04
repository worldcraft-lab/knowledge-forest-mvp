"use client";

import { useEffect, useMemo, useState } from "react";
import { seedData, STORAGE_KEY_V02 } from "./v02-seed";
import {
  Area,
  DashboardMetrics,
  Feedback,
  Forest,
  ForestVisibility,
  KnowledgeForestData,
  KnowledgeNode,
  KnowledgeTree,
  Phase
} from "./v02-types";

export type ArchiveTarget = "area" | "forest" | "tree" | "node" | "feedback";

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
  updatedAt: new Date("2026-06-02T09:00:00.000Z").toISOString(),
  archivedAt: null,
  archivedReason: null
};

export function isArchived(item?: { archivedAt?: string | null } | null) {
  return Boolean(item?.archivedAt);
}

function withArchiveDefaults<T extends { archivedAt?: string | null; archivedReason?: string | null }>(item: T): T {
  return {
    ...item,
    archivedAt: item.archivedAt ?? null,
    archivedReason: item.archivedReason ?? null
  };
}

export function normalizeKnowledgeForestData(data: KnowledgeForestData): KnowledgeForestData {
  const rawAreas = data.areas?.length ? data.areas : [defaultArea];
  const areas = rawAreas.map(withArchiveDefaults);
  const hasDefaultArea = areas.some((area) => area.id === DEFAULT_AREA_ID);
  const nextAreas = hasDefaultArea ? areas : [defaultArea, ...areas];
  const areaIds = new Set(nextAreas.map((area) => area.id));

  return {
    ...data,
    areas: nextAreas,
    forests: data.forests.map((forest) =>
      withArchiveDefaults({
        ...forest,
        areaId: forest.areaId && areaIds.has(forest.areaId) ? forest.areaId : DEFAULT_AREA_ID
      })
    ),
    trees: data.trees.map(withArchiveDefaults),
    nodes: data.nodes.map(withArchiveDefaults),
    feedbacks: (data.feedbacks ?? []).map(withArchiveDefaults),
    notifications: data.notifications ?? []
  };
}

export function getVisibleData(data: KnowledgeForestData): KnowledgeForestData {
  const normalized = normalizeKnowledgeForestData(data);
  const areas = normalized.areas.filter((area) => !isArchived(area));
  const areaIds = new Set(areas.map((area) => area.id));
  const forests = normalized.forests.filter((forest) => !isArchived(forest) && areaIds.has(forest.areaId ?? DEFAULT_AREA_ID));
  const forestIds = new Set(forests.map((forest) => forest.id));
  const trees = normalized.trees.filter((tree) => !isArchived(tree) && forestIds.has(tree.forestId));
  const treeIds = new Set(trees.map((tree) => tree.id));

  const rawNodes = normalized.nodes.filter((node) => !isArchived(node) && treeIds.has(node.treeId));
  const nodeById = new Map(rawNodes.map((node) => [node.id, node]));
  const visibleNodeIds = new Set<string>();
  const isNodeVisible = (node: KnowledgeNode): boolean => {
    if (visibleNodeIds.has(node.id)) return true;
    if (!node.parentId) {
      visibleNodeIds.add(node.id);
      return true;
    }
    const parent = nodeById.get(node.parentId);
    if (!parent) return false;
    const visible = isNodeVisible(parent);
    if (visible) visibleNodeIds.add(node.id);
    return visible;
  };
  const nodes = rawNodes.filter(isNodeVisible);
  const feedbacks = normalized.feedbacks.filter(
    (feedback) => !isArchived(feedback) && treeIds.has(feedback.treeId) && visibleNodeIds.has(feedback.nodeId)
  );
  const notifications = normalized.notifications.filter((notice) => {
    if (!notice.relatedTreeId) return true;
    return treeIds.has(notice.relatedTreeId);
  });

  return { ...normalized, areas, forests, trees, nodes, feedbacks, notifications };
}

export function useKnowledgeForestData() {
  const [data, setData] = useState<KnowledgeForestData>(normalizeKnowledgeForestData(seedData));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_V02);
    const normalized = stored ? normalizeKnowledgeForestData(JSON.parse(stored) as KnowledgeForestData) : normalizeKnowledgeForestData(seedData);
    setData(normalized);
    window.localStorage.setItem(STORAGE_KEY_V02, JSON.stringify(normalized));
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
  return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric" }).format(new Date(value));
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

export function getTreeNodes(data: KnowledgeForestData, treeId: string, includeArchived = false) {
  const source = includeArchived ? normalizeKnowledgeForestData(data) : getVisibleData(data);
  return source.nodes.filter((node) => node.treeId === treeId);
}

export function getArchivedTreeNodes(data: KnowledgeForestData, treeId: string) {
  return normalizeKnowledgeForestData(data).nodes.filter((node) => node.treeId === treeId && isArchived(node));
}

export function getForestTrees(data: KnowledgeForestData, forestId: string) {
  return getVisibleData(data).trees.filter((tree) => tree.forestId === forestId);
}

export function getAreaForests(data: KnowledgeForestData, areaId: string) {
  return getVisibleData(data).forests.filter((forest) => (forest.areaId ?? DEFAULT_AREA_ID) === areaId);
}

export function getForestArea(data: KnowledgeForestData, forest: Forest) {
  return normalizeKnowledgeForestData(data).areas.find((area) => area.id === (forest.areaId ?? DEFAULT_AREA_ID)) ?? defaultArea;
}

export function getNodeFeedbacks(data: KnowledgeForestData, nodeId: string) {
  return getVisibleData(data).feedbacks.filter((feedback) => feedback.nodeId === nodeId);
}

export function getTreeFeedbacks(data: KnowledgeForestData, treeId: string) {
  return getVisibleData(data).feedbacks.filter((feedback) => feedback.treeId === treeId);
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
  const visible = getVisibleData(data);
  const phaseCounts = phaseOrder.reduce(
    (acc, phase) => ({ ...acc, [phase]: visible.nodes.filter((node) => node.phase === phase).length }),
    {} as Record<Phase, number>
  );
  const treesWithNodes = visible.trees.map((tree) => ({ tree, nodes: getTreeNodes(visible, tree.id) }));
  const sigmaTrees = treesWithNodes.filter(({ nodes }) => hasPhase(nodes, "sigma"));
  const systemTrees = treesWithNodes.filter(({ nodes }) => hasPhase(nodes, "system"));

  return {
    totalAreas: visible.areas.length,
    totalForests: visible.forests.length,
    totalTrees: visible.trees.length,
    totalNodes: visible.nodes.length,
    totalFeedbacks: visible.feedbacks.length,
    phaseCounts,
    sigmaArrivalRate: visible.trees.length ? Math.round((sigmaTrees.length / visible.trees.length) * 100) : 0,
    systemizationRate: visible.trees.length ? Math.round((systemTrees.length / visible.trees.length) * 100) : 0,
    systemCandidates: treesWithNodes.filter(({ nodes }) => hasPhase(nodes, "sigma") && !hasPhase(nodes, "system")).map(({ tree }) => tree),
    stalledTrees: treesWithNodes
      .filter(({ nodes, tree }) => Date.now() - new Date(tree.updatedAt).getTime() > 6 * 24 * 60 * 60 * 1000 && !hasPhase(nodes, "trial"))
      .map(({ tree }) => tree)
  };
}

export function useMetrics(data: KnowledgeForestData) {
  return useMemo(() => calculateMetrics(data), [data]);
}

export function searchKnowledge(data: KnowledgeForestData, query: string, includeArchived = false) {
  const source = includeArchived ? normalizeKnowledgeForestData(data) : getVisibleData(data);
  const q = query.trim().toLowerCase();
  if (!q) return { trees: source.trees, nodes: [] as KnowledgeNode[], feedbacks: [] as Feedback[] };

  const forestById = new Map(source.forests.map((forest) => [forest.id, forest]));
  const areaById = new Map(source.areas.map((area) => [area.id, area]));
  const matchedFeedbacks = source.feedbacks.filter((feedback) => [feedback.body, feedback.authorLabel].join(" ").toLowerCase().includes(q));
  const feedbackTreeIds = new Set(matchedFeedbacks.map((feedback) => feedback.treeId));

  const treeMatches = source.trees.filter((tree) => {
    const forest = forestById.get(tree.forestId);
    const area = forest ? areaById.get(forest.areaId ?? DEFAULT_AREA_ID) : undefined;
    const treeNodes = source.nodes.filter((node) => node.treeId === tree.id);
    const treeFeedbacks = source.feedbacks.filter((feedback) => feedback.treeId === tree.id);
    return (
      feedbackTreeIds.has(tree.id) ||
      [
        area?.title ?? "",
        area?.description ?? "",
        area?.tags.join(" ") ?? "",
        tree.title,
        tree.summary,
        tree.tags.join(" "),
        forest?.title ?? "",
        forest?.description ?? "",
        treeNodes.map((node) => `${node.title} ${node.body} ${node.tags.join(" ")} ${node.phase} ${node.authorName}`).join(" "),
        treeFeedbacks.map((feedback) => `${feedback.body} ${feedback.authorLabel}`).join(" ")
      ].join(" ").toLowerCase().includes(q)
    );
  });
  const nodes = source.nodes.filter((node) => [node.title, node.body, node.tags.join(" "), node.phase, node.authorName].join(" ").toLowerCase().includes(q));
  return { trees: treeMatches, nodes, feedbacks: matchedFeedbacks };
}

export function addArea(data: KnowledgeForestData, payload: { title: string; description: string; tags: string[] }) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const area: Area = { id: createSlugId("area", payload.title), title: payload.title, description: payload.description, tags: payload.tags, createdAt: now, updatedAt: now, archivedAt: null, archivedReason: null };
  return { nextData: { ...normalized, areas: [area, ...normalized.areas] }, area };
}

export function addForest(data: KnowledgeForestData, payload: { areaId: string; title: string; description: string; ownerLabel: string; tags: string[]; visibility: ForestVisibility }) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const forest: Forest = { id: createSlugId("forest", payload.title), areaId: payload.areaId || DEFAULT_AREA_ID, title: payload.title, description: payload.description, tags: payload.tags, ownerLabel: payload.ownerLabel || "Local Demo", visibility: payload.visibility, createdAt: now, updatedAt: now, archivedAt: null, archivedReason: null };
  return {
    nextData: {
      ...normalized,
      forests: [forest, ...normalized.forests],
      areas: normalized.areas.map((area) => area.id === forest.areaId ? { ...area, updatedAt: now } : area)
    },
    forest
  };
}

export function addTree(data: KnowledgeForestData, forestId: string, title: string, summary: string, tags: string[] = ["新規Tree"]) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const tree: KnowledgeTree = { id: createSlugId("tree", title), forestId, title, summary, tags: tags.length ? tags : ["新規Tree"], createdAt: now, updatedAt: now, archivedAt: null, archivedReason: null };
  return {
    nextData: {
      ...normalized,
      trees: [tree, ...normalized.trees],
      forests: normalized.forests.map((forest) => forest.id === forestId ? { ...forest, updatedAt: now } : forest)
    },
    tree
  };
}

export function addNode(data: KnowledgeForestData, payload: { treeId: string; parentId: string | null; phase: Phase; title: string; body: string; tags: string[]; authorName?: string }) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const node: KnowledgeNode = { id: createId("node"), treeId: payload.treeId, parentId: payload.parentId, phase: payload.parentId ? payload.phase : "seed", title: payload.title, body: payload.body, tags: payload.tags, authorName: payload.authorName?.trim() || "あなた", createdAt: now, helpfulCount: 0, commentCount: 0, archivedAt: null, archivedReason: null };
  return {
    nextData: {
      ...normalized,
      nodes: [node, ...normalized.nodes],
      trees: normalized.trees.map((tree) => tree.id === payload.treeId ? { ...tree, updatedAt: now } : tree)
    },
    node
  };
}

export function addFeedback(data: KnowledgeForestData, payload: { treeId: string; nodeId: string; body: string; authorLabel: string }) {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const feedback: Feedback = { id: createId("feedback"), treeId: payload.treeId, nodeId: payload.nodeId, body: payload.body, authorLabel: payload.authorLabel || "Local User", createdAt: now, updatedAt: now, archivedAt: null, archivedReason: null };
  return {
    nextData: {
      ...normalized,
      feedbacks: [feedback, ...normalized.feedbacks],
      trees: normalized.trees.map((tree) => tree.id === payload.treeId ? { ...tree, updatedAt: now } : tree)
    },
    feedback
  };
}

export function branchFromFeedback(data: KnowledgeForestData, feedback: Feedback) {
  const titleSource = feedback.body.replace(/\s+/g, " ").trim();
  const title = titleSource.length > 32 ? `${titleSource.slice(0, 32)}...` : titleSource || "FeedbackからのBranch";
  return addNode(data, { treeId: feedback.treeId, parentId: feedback.nodeId, phase: "branch", title, body: feedback.body, tags: ["Feedback", "Branch"] });
}

export function addTreeWithSeed(data: KnowledgeForestData, payload: { forestId: string; title: string; summary: string; tags: string[]; seedTitle: string; seedBody: string }) {
  const treeResult = addTree(data, payload.forestId, payload.title, payload.summary, payload.tags);
  const nodeResult = addNode(treeResult.nextData, { treeId: treeResult.tree.id, parentId: null, phase: "seed", title: payload.seedTitle, body: payload.seedBody, tags: ["Seed", ...payload.tags].slice(0, 6) });
  return { nextData: nodeResult.nextData, tree: treeResult.tree, seedNode: nodeResult.node };
}

export function archiveItem(data: KnowledgeForestData, target: ArchiveTarget, id: string, reason = "Archived from MVP v0.2.8") {
  const normalized = normalizeKnowledgeForestData(data);
  const now = new Date().toISOString();
  const patch = <T extends { id: string; archivedAt?: string | null; archivedReason?: string | null }>(item: T) =>
    item.id === id ? { ...item, archivedAt: now, archivedReason: reason } : item;
  return {
    ...normalized,
    areas: target === "area" ? normalized.areas.map(patch) : normalized.areas,
    forests: target === "forest" ? normalized.forests.map(patch) : normalized.forests,
    trees: target === "tree" ? normalized.trees.map(patch) : normalized.trees,
    nodes: target === "node" ? normalized.nodes.map(patch) : normalized.nodes,
    feedbacks: target === "feedback" ? normalized.feedbacks.map(patch) : normalized.feedbacks
  };
}

export function restoreItem(data: KnowledgeForestData, target: ArchiveTarget, id: string) {
  const normalized = normalizeKnowledgeForestData(data);
  const patch = <T extends { id: string; archivedAt?: string | null; archivedReason?: string | null }>(item: T) =>
    item.id === id ? { ...item, archivedAt: null, archivedReason: null } : item;
  return {
    ...normalized,
    areas: target === "area" ? normalized.areas.map(patch) : normalized.areas,
    forests: target === "forest" ? normalized.forests.map(patch) : normalized.forests,
    trees: target === "tree" ? normalized.trees.map(patch) : normalized.trees,
    nodes: target === "node" ? normalized.nodes.map(patch) : normalized.nodes,
    feedbacks: target === "feedback" ? normalized.feedbacks.map(patch) : normalized.feedbacks
  };
}

export function hasArchivedParent(data: KnowledgeForestData, target: ArchiveTarget, item: { areaId?: string; forestId?: string; treeId?: string; nodeId?: string; parentId?: string | null }) {
  const normalized = normalizeKnowledgeForestData(data);
  if (target === "forest") return isArchived(normalized.areas.find((area) => area.id === item.areaId));
  const tree = item.treeId ? normalized.trees.find((candidate) => candidate.id === item.treeId) : undefined;
  const forest = item.forestId ? normalized.forests.find((candidate) => candidate.id === item.forestId) : tree ? normalized.forests.find((candidate) => candidate.id === tree.forestId) : undefined;
  const area = forest ? normalized.areas.find((candidate) => candidate.id === (forest.areaId ?? DEFAULT_AREA_ID)) : undefined;
  if (target === "tree") return isArchived(forest) || isArchived(area);
  const node = target === "feedback" && item.nodeId ? normalized.nodes.find((candidate) => candidate.id === item.nodeId) : undefined;
  return isArchived(tree) || isArchived(forest) || isArchived(area) || isArchived(node);
}
