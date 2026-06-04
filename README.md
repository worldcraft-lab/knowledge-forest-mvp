# Knowledge Forest MVP v0.2.8

Knowledge Forest is a local browser MVP for visualizing how small observations grow into reusable operational knowledge.

v0.2.8 adds Archive / Restore. Knowledge Forest uses Archive instead of destructive delete: archived items are hidden from normal views, but the data remains in LocalStorage and can be restored.

## Product Summary

- Area: top-level knowledge domain that groups multiple Forests
- Forest: topic or project-level knowledge space inside an Area
- Knowledge Tree: a linked growth path inside a Forest
- Knowledge Node: one knowledge item in the Seed / Branch / Trial / Sigma / System flow
- Feedback: a supplemental viewpoint attached to a Node
- Archive: hide an item from normal views while keeping the data
- Restore: clear archive fields and make an item visible again if its parent is not archived

## Core Hierarchy

```text
Area
└ Forest
  └ Tree
    └ Node
      └ Feedback
```

## Archive / Restore

- Area, Forest, Tree, Node, and Feedback support `archivedAt` and `archivedReason`.
- Normal Dashboard, Forest, Tree, Search, My Page, and Notifications views exclude archived items.
- If a parent is archived, child items are hidden from normal views.
- Restore clears `archivedAt` and `archivedReason`.
- If a parent remains archived, a restored child still does not appear in normal views until the parent is restored.
- Permanent delete is not implemented in v0.2.8.

## Routes

- `/` Dashboard
- `/forests` Area-grouped Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` React Flow Tree View, Node Growth Actions, Node Feedback, and Archive controls
- `/archive` Archived Items and Restore
- `/create` Create Forest / Create Tree / Create Node
- `/search` Search related Trees, Nodes, and Feedback
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

## Build

```bash
npm.cmd run build
```

## LocalStorage

Data is stored in the browser under:

```text
knowledge-forest-mvp-v0.2
```

Existing v0.2 LocalStorage data is normalized on load. If older data has no archive fields, the app adds `archivedAt: null` and `archivedReason: null`.

## Manual Test Scenario v0.2.8

### 1. Archive Feedback

1. Open a Tree View.
2. Select a Node with Feedback or add a new Feedback.
3. Click `Archive Feedback`.
4. Confirm the Feedback disappears from the normal Feedback list.
5. Open `/archive` and confirm it appears under Archived Feedback.
6. Restore it and confirm it appears again in the Node detail panel.

### 2. Archive Node

1. Select a Node.
2. Click `Archive Node`.
3. Confirm it disappears from React Flow and Tree Nodes.
4. If it has child Nodes, confirm that branch is hidden from normal Tree View.
5. Turn on `Archived Nodeを表示` and confirm archived Nodes appear faintly in the list.
6. Restore the Node from `/archive`.

### 3. Archive Tree / Forest / Area

1. Archive a Tree from Tree detail.
2. Confirm Dashboard, Search, My Page, and Forest detail exclude it.
3. Archive a Forest from Forest detail and confirm its Trees disappear from normal views.
4. Archive an Area from `/forests` and confirm its Forests disappear from normal views.
5. Restore from `/archive`.

### 4. Parent Restore Rule

1. Archive a Forest.
2. Restore one child Tree while the Forest is still archived.
3. Confirm `/archive` warns that the parent is archived.
4. Restore the Forest, then confirm the Tree appears again.

## Limitations

- Local browser MVP only
- No permanent delete
- No real notifications
- No user accounts or permissions
- No backend synchronization
- Feedback is local to this browser and is not shared
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
