# Codex Prompt 01 - Implement Knowledge Forest MVP v0.2

Implement Knowledge Forest MVP v0.2 in this repository.

Follow AGENTS.md and all docs in `/docs`.

## Required stack

- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- LocalStorage only

If the repository is empty or only has README, create a clean Next.js app structure.

## Product direction

This is not a post viewer.
Build a knowledge growth viewer.

Core phases:
- Seed
- Branch
- Trial
- Sigma
- System

Core concepts:
- Forests
- Knowledge Trees
- Knowledge Nodes
- Sigma-centered integration
- Systemization candidates
- Growth dashboard

## Required pages

Implement these routes:

- `/` Dashboard
- `/forests` Forest list
- `/forests/[forestId]` Forest detail with Tree cards
- `/tree/[treeId]` React Flow Tree View
- `/create` Create Node / Create Tree
- `/search` Search related Trees and Nodes
- `/me` My Page contribution tendencies
- `/notifications` Local pseudo notifications

## Required components

Create reusable components where sensible:

- AppShell
- PhaseBadge
- ForestCard
- TreeCard
- DashboardCards
- KnowledgeFlow
- NodeDetailPanel
- SearchResults

## Data

Use TypeScript types for:

- Phase
- Forest
- KnowledgeTree
- KnowledgeNode
- NotificationItem
- KnowledgeForestData

Use LocalStorage key:

```ts
knowledge-forest-mvp-v0.2
```

Seed sample data from either `/data/seed_knowledge_forest_v0.2.json` or an equivalent `src/lib/seed.ts`.

## Metrics

Implement dashboard metrics:

- Total Forests
- Total Trees
- Total Nodes
- Phase counts
- Sigma arrival rate
- Systemization rate
- System candidates
- Stalled Trees

## Tree View

Use React Flow.

Each KnowledgeNode becomes a graph node.
Parent-child relationships become edges.

Phase styling:
- Seed: origin
- Branch: branch/proposal
- Trial: experiment
- Sigma: integration, visually emphasized
- System: systemized output

Clicking a node should show details.

## Search

Search across title, body, tags, phase, forest, author.

Results should emphasize related Trees first, then matched Nodes.

## README

Update README with:

- Product summary
- v0.2 scope
- Setup
- Run command
- LocalStorage reset note
- Limitations

## Do not

- Add backend
- Add database
- Add auth
- Add AI API
- Add payments
- Add external analytics
- Turn this into HR ranking
- Claim this is public or validated

## Completion

After implementation, run the available checks:

- install if needed
- lint if configured
- build if feasible
- dev command note

Then summarize changed files and remaining issues.
