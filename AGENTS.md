# AGENTS.md - Knowledge Forest MVP v0.2

This repository is for the internal MVP of Knowledge Forest.

## Product direction

Knowledge Forest is not a simple post viewer.
It is a knowledge growth viewer.

The product visualizes how organizational experience grows through:

- Seed: 気づき
- Branch: 改善案
- Trial: 実践報告
- Sigma: 統合・まとめ
- System: 制度化・マニュアル

The core value is to show how scattered observations become reusable systems.

## Current MVP constraints

Build a local browser MVP with:

- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- LocalStorage only
- No backend
- No database
- No authentication
- No external paid API
- No AI API integration in v0.2
- No public release assumptions

## Required v0.2 change

v0.2 must shift the interface from:

"post list / post viewer"

to:

"knowledge growth / forest viewer"

Key concepts:

- Forests: topic or project-level knowledge spaces
- Trees: linked knowledge nodes inside a Forest
- Sigma: the central integration phase
- Dashboard: growth, integration, and systemization indicators
- Search: show related trees, not only isolated posts

## Boundary policy

Do not claim that this product is proven, validated, or publicly released.

Do not present this as an HR evaluation tool.
The system may show contribution patterns, but it must not rank or judge people.

Do not expose private StoS, Craft, or student-related details unless they are present in sample data and clearly fictional or internal test data.

## UX principle

The app should feel like:

- GitHub-like tree history for knowledge
- Notion-like organization with lower manual sorting burden
- Slack-like flow that does not disappear
- A forest where knowledge grows from small observations

## Implementation style

Prefer simple, readable code.
Avoid overengineering.
Keep all data types clear.
Use sample data so the MVP can be tested immediately.

Every generated file should be production-readable even if the system is still local-only.
