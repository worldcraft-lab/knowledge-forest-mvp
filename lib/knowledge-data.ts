import { KnowledgeNode, NodeType, Phase } from "./types";

export const STORAGE_KEY = "knowledge-forest:nodes:v0.1";

export const nodeTypeLabels: Record<NodeType, string> = {
  seed: "Seed",
  branch: "Branch",
  trial: "Trial",
  sigma: "Sigma",
  system: "System"
};

export const nodeTypeDescriptions: Record<NodeType, string> = {
  seed: "気づき",
  branch: "改善案",
  trial: "実践報告",
  sigma: "統合・まとめ",
  system: "制度化"
};

export const phaseLabels: Record<Phase, string> = {
  low: "LowPhase",
  mid: "MidPhase",
  high: "HighPhase"
};

export const typeStyles: Record<NodeType, string> = {
  seed: "border-blue-200 bg-blue-50 text-blue-900",
  branch: "border-emerald-200 bg-emerald-50 text-emerald-900",
  trial: "border-orange-200 bg-orange-50 text-orange-900",
  sigma: "border-violet-200 bg-violet-50 text-violet-900",
  system: "border-slate-300 bg-slate-50 text-slate-900"
};

const now = new Date("2026-06-02T09:00:00.000Z");

export const sampleNodes: KnowledgeNode[] = [
  {
    id: "sample-seed",
    parentId: null,
    type: "seed",
    phase: "low",
    title: "飲食店で最初にドリンクを聞くと注文がスムーズだった",
    body: "入店直後にドリンクだけ先に確認すると、席についてからの会話が自然に始まり、最初の注文までの時間が短くなった。",
    category: "飲食店オペレーション",
    authorName: "Knowledge Forest",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    helpfulCount: 24,
    commentCount: 5
  },
  {
    id: "sample-branch-people",
    parentId: "sample-seed",
    type: "branch",
    phase: "low",
    title: "人数確認も先にした方がさらにスムーズだった",
    body: "ドリンク確認の前に人数と席の希望を合わせて聞くと、案内と注文の手戻りが少なくなる。",
    category: "飲食店オペレーション",
    authorName: "StoS Tester",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    helpfulCount: 16,
    commentCount: 3
  },
  {
    id: "sample-branch-seat",
    parentId: "sample-seed",
    type: "branch",
    phase: "mid",
    title: "ランチ帯では、先に席案内を安定させた方が良かった",
    body: "ピーク時間帯は注文前の導線が混みやすいため、席案内を先に固定した方がスタッフ間の判断が揃った。",
    category: "飲食店オペレーション",
    authorName: "学生OEM",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    helpfulCount: 13,
    commentCount: 4
  },
  {
    id: "sample-trial",
    parentId: "sample-branch-people",
    type: "trial",
    phase: "mid",
    title: "実践してみたら、ピーク時の注文ミスが減った",
    body: "3日間試したところ、ランチピークの聞き直しが減り、新人スタッフも接客の順番を覚えやすくなった。",
    category: "飲食店オペレーション",
    authorName: "現場メンバー",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    helpfulCount: 31,
    commentCount: 8
  },
  {
    id: "sample-sigma",
    parentId: "sample-trial",
    type: "sigma",
    phase: "high",
    title: "初回接客フローの基本テンプレート v1.0",
    body: "人数確認、席案内、ドリンク確認、初回注文の順に整理すると、混雑時も品質が安定する。",
    category: "接客テンプレート",
    authorName: "Knowledge Forest",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    helpfulCount: 42,
    commentCount: 6
  },
  {
    id: "sample-system",
    parentId: "sample-sigma",
    type: "system",
    phase: "high",
    title: "飲食店 初回接客マニュアル v1.0",
    body: "新人研修とピーク時運用に使う初回接客マニュアル。店舗ごとの差分はSigmaに追記して改訂する。",
    category: "マニュアル",
    authorName: "StoS Ops",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    helpfulCount: 57,
    commentCount: 12
  }
];

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function createId() {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function childrenOf(nodes: KnowledgeNode[], parentId: string | null) {
  return nodes.filter((node) => node.parentId === parentId);
}
