export type Phase = "seed" | "branch" | "trial" | "sigma" | "system";

export type Forest = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  ownerLabel: string;
  createdAt: string;
};

export type KnowledgeTree = {
  id: string;
  forestId: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeNode = {
  id: string;
  treeId: string;
  parentId: string | null;
  phase: Phase;
  title: string;
  body: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  helpfulCount: number;
  commentCount: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type KnowledgeForestData = {
  forests: Forest[];
  trees: KnowledgeTree[];
  nodes: KnowledgeNode[];
  notifications: NotificationItem[];
};

export type DashboardMetrics = {
  totalForests: number;
  totalTrees: number;
  totalNodes: number;
  phaseCounts: Record<Phase, number>;
  sigmaArrivalRate: number;
  systemizationRate: number;
  systemCandidates: KnowledgeTree[];
  stalledTrees: KnowledgeTree[];
};
