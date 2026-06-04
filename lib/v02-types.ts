export type Phase = "seed" | "branch" | "trial" | "sigma" | "system";

export type ForestVisibility = "private" | "team" | "organization" | "public-demo";

export type Area = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Forest = {
  id: string;
  areaId?: string;
  title: string;
  description: string;
  tags: string[];
  ownerLabel: string;
  visibility?: ForestVisibility;
  createdAt: string;
  updatedAt?: string;
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

export type Feedback = {
  id: string;
  treeId: string;
  nodeId: string;
  body: string;
  authorLabel: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  relatedTreeId?: string;
  relatedNodeId?: string;
  read?: boolean;
};

export type KnowledgeForestData = {
  areas: Area[];
  forests: Forest[];
  trees: KnowledgeTree[];
  nodes: KnowledgeNode[];
  feedbacks: Feedback[];
  notifications: NotificationItem[];
};

export type DashboardMetrics = {
  totalAreas: number;
  totalForests: number;
  totalTrees: number;
  totalNodes: number;
  totalFeedbacks: number;
  phaseCounts: Record<Phase, number>;
  sigmaArrivalRate: number;
  systemizationRate: number;
  systemCandidates: KnowledgeTree[];
  stalledTrees: KnowledgeTree[];
};
