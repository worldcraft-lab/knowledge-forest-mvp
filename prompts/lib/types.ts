export type NodeType = "seed" | "branch" | "trial" | "sigma" | "system";

export type Phase = "low" | "mid" | "high";

export type KnowledgeNode = {
  id: string;
  parentId: string | null;
  type: NodeType;
  phase: Phase;
  title: string;
  body: string;
  category: string;
  authorName: string;
  createdAt: string;
  helpfulCount: number;
  commentCount: number;
};

export type Screen = "home" | "search" | "create" | "notifications" | "mypage" | "tree";
