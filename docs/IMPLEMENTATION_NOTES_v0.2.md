# Implementation Notes v0.2

## 推奨構成

```text
src/
  app/
    page.tsx
    forests/
      page.tsx
      [forestId]/
        page.tsx
    tree/
      [treeId]/
        page.tsx
    create/
      page.tsx
    search/
      page.tsx
    me/
      page.tsx
    notifications/
      page.tsx
  components/
    AppShell.tsx
    DashboardCards.tsx
    ForestCard.tsx
    TreeCard.tsx
    PhaseBadge.tsx
    KnowledgeFlow.tsx
    NodeDetailPanel.tsx
  lib/
    types.ts
    seed.ts
    storage.ts
    metrics.ts
    search.ts
```

## React Flow

Use React Flow for Tree View.

Node style should reflect Phase.
Sigma should be visually central or emphasized.

Do not overcomplicate layout.
A simple hierarchical layout is acceptable.

## Storage

Use a single LocalStorage key.

```ts
const STORAGE_KEY = "knowledge-forest-mvp-v0.2";
```

Provide functions:

- getData()
- saveData()
- resetData()
- addNode()
- addTree()
- updateNode()

## Metrics

Implement simple derived metrics in `lib/metrics.ts`.

Needed:
- countByPhase
- hasSigma
- hasSystem
- sigmaRate
- systemRate
- systemCandidates
- stalledTrees

## Visual direction

Use clean dashboard cards.
Avoid enterprise-heavy UI.
The mood should be: forest, growth, calm structure, internal lab.
