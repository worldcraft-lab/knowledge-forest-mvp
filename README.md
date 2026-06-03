# Knowledge Forest MVP v0.2.4

Knowledge Forest is a local browser MVP for visualizing how small observations grow into reusable operational knowledge.

v0.2.4 keeps the existing structure and improves PC readability for the Knowledge Growth Flow plus clarity in the Tree creation form.

## Product Summary

- Forest: topic or project-level knowledge space
- Knowledge Tree: a linked growth path inside a Forest
- Knowledge Node: one knowledge item in the Seed / Branch / Trial / Sigma / System flow
- Sigma: the integration phase where scattered Branch and Trial knowledge is summarized
- System: arrival at reusable operational knowledge, not a people evaluation signal

## Core Flow

```text
Forest
↓
Tree
↓
Seed / 気づき
↓
Branch / 改善案
↓
Trial / 実践
↓
Sigma / 統合
↓
System / 制度化
```

## Routes

- `/` Dashboard
- `/forests` Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` React Flow Tree View
- `/create` Create Forest / Create Tree / Create Node
- `/search` Search related Trees and Nodes
- `/me` Contribution tendencies
- `/notifications` Local pseudo notifications

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React Flow via `@xyflow/react`
- LocalStorage only

No backend, database, authentication, AI API, external service, payments, or analytics are used.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If port 3000 is already in use, Next.js may start on another port such as `http://localhost:3001`.

## Build

```bash
npm.cmd run build
```

## LocalStorage

Data is stored in the browser under:

```text
knowledge-forest-mvp-v0.2
```

To reset local sample data, delete this LocalStorage key from browser dev tools and reload the app.

## Manual Test Scenario v0.2.4

Use this scenario on a smartphone-sized viewport.

### 1. Create Forest

1. Open `/create`.
2. Tap `Forestを作成`.
3. Enter a Forest name, description, owner/use label, tags, and visibility.
4. Submit.
5. Confirm the app moves to `/forests/[forestId]`.
6. Open `/forests` and confirm the new Forest appears in the Forest list.

### 2. Create Tree With First Seed

1. From the new Forest detail page, tap `Treeを作成する`.
2. Confirm the Create page opens with that Forest selected.
3. Enter Tree title, Tree summary, Tree tags, first Seed title, and first Seed body.
4. Submit.
5. Confirm the app moves to the new Tree View.
6. Confirm the Seed Node appears in React Flow.
7. Confirm the Seed Node appears in the Tree Nodes list.

### 3. Add Node To Tree

1. Open `/create`.
2. Tap `Nodeを追加`.
3. Select the newly created Tree.
4. Select a parent Node.
5. Add a Branch, Trial, or Sigma Node.
6. Confirm the new Node appears in React Flow.
7. Confirm an edge connects the parent Node to the added Node.
8. Confirm Sigma Nodes remain visually emphasized.

### 4. Dashboard Reflection

1. Open `/`.
2. Confirm Total Forests, Total Trees, and Total Nodes changed.
3. Confirm Phase Counts changed after adding Nodes.
4. Tap Dashboard metric cards:
   - Total Forests -> `/forests`
   - Total Trees -> `/search?scope=trees`
   - Total Nodes -> `/search?scope=nodes`
   - Sigma arrival -> `/search?phase=sigma`
   - Systemization -> `/search?phase=system`
   - System candidate -> `/search?status=system-candidate`
   - Next trial waiting -> `/search?status=stalled`
5. Tap Phase Count cards and confirm Search opens with the matching phase filter.

### 5. Search Reflection

1. Open `/search`.
2. Confirm the initial state says it shows recently updated Trees and Trees ready to consider Systemization.
3. Search for a term from the new Forest, Tree, or Node.
4. Confirm Related Trees and Matched Nodes are filtered naturally.

### 6. Notifications Navigation

1. Open `/notifications`.
2. Tap a notification card.
3. Confirm it opens the related Tree View.
4. If a notification has a related Node, confirm the URL includes `?node=...`.

### 7. My Page

1. Open `/me`.
2. Confirm the tendency summary is visible.
3. Confirm compact Phase tendencies are visible.
4. Confirm Next Contribution links are visible.
5. Tap a recent contribution note and confirm it opens the related Tree.
6. Confirm the page explains that data is based on this browser's LocalStorage, not an account or HR evaluation.

### 8. Navigation Without Browser Back

1. Confirm `/forests/[forestId]` has `Forest一覧へ`.
2. Confirm `/tree/[treeId]` has a link back to its Forest.
3. Confirm `/create`, `/search`, `/me`, and `/notifications` each have `Dashboardへ戻る`.

### 9. LocalStorage Reload

1. Reload the browser after creating a Forest, Tree, Seed, and additional Node.
2. Confirm the data remains visible in Dashboard, Forest list, Forest detail, Tree View, Search, and My Page.

## Limitations

- Local browser MVP only
- No real notifications
- No user accounts or permissions
- No backend synchronization
- No claim of public release or validation
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
