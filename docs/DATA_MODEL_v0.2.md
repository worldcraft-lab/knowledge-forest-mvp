# Data Model - Knowledge Forest MVP v0.2

## Phase

```ts
export type Phase = "Seed" | "Branch" | "Trial" | "Sigma" | "System";
```

## Forest

```ts
export type Forest = {
  id: string;
  name: string;
  description: string;
  ownerLabel: string;
  visibility: "private" | "team" | "organization" | "public-demo";
  createdAt: string;
  updatedAt: string;
};
```

## KnowledgeTree

```ts
export type KnowledgeTree = {
  id: string;
  forestId: string;
  title: string;
  summary: string;
  tags: string[];
  status:
    | "seed-only"
    | "branching"
    | "in-trial"
    | "integrated"
    | "systemized"
    | "stalled"
    | "system-candidate";
  createdAt: string;
  updatedAt: string;
};
```

## KnowledgeNode

```ts
export type KnowledgeNode = {
  id: string;
  forestId: string;
  treeId: string;
  parentId: string | null;
  phase: Phase;
  title: string;
  body: string;
  tags: string[];
  author: string;
  sourceContext?: string;
  visibility: "private" | "team" | "organization" | "public-demo";
  createdAt: string;
  updatedAt: string;
};
```

## Notification

```ts
export type NotificationItem = {
  id: string;
  type: "reply" | "sigma-candidate" | "system-candidate" | "update";
  title: string;
  body: string;
  relatedTreeId?: string;
  relatedNodeId?: string;
  read: boolean;
  createdAt: string;
};
```

## Derived metrics

### Sigma到達率

```text
Sigma nodes / Trees
```

Treeに1つ以上Sigmaがあれば統合済み。

### System化率

```text
Systemized Trees / Trees
```

Treeに1つ以上SystemがあればSystem化済み。

### System化候補

以下を満たすTree:

- Sigmaがある
- Trialが1つ以上ある
- Systemがまだない

### 停滞Tree

以下を満たすTree:

- 一定期間更新がない
- Systemがない
- Sigmaもない、またはTrial以後に進んでいない

MVPでは日数判定を簡易実装でよい。
