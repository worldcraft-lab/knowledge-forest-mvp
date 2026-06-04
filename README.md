# Knowledge Forest MVP v0.2.6

Knowledge Forest is a local browser MVP for visualizing how small observations grow into reusable operational knowledge.

v0.2.6 adds Feedback under Node. Feedback is not a social comment thread; it is a note, viewpoint, or improvement seed that can be cut out into a Branch.

## Product Summary

- Area: top-level knowledge domain that groups multiple Forests
- Forest: topic or project-level knowledge space inside an Area
- Knowledge Tree: a linked growth path inside a Forest
- Knowledge Node: one knowledge item in the Seed / Branch / Trial / Sigma / System flow
- Feedback: a supplemental viewpoint attached to a Node
- Sigma: the integration phase where scattered Branch and Trial knowledge is summarized
- System: arrival at reusable operational knowledge, not a people evaluation signal

## Core Hierarchy

```text
Area
└ Forest
  └ Tree
    └ Node
      └ Feedback
```

## Knowledge Growth Flow

```text
Seed / 気づき
→ Branch / 改善案
→ Trial / 実践
→ Sigma / 統合
→ System / 制度化
```

## Feedback

- Feedback is attached to a Node.
- Feedback is used for supplements, viewpoints, and improvement hints.
- Important Feedback can be converted into a Branch Node.
- Feedback counts are based on real LocalStorage data, not fixed sample numbers.
- This is a LocalStorage-only MVP, so Feedback is not shared with other people or devices.
- Feedback has `archivedAt` for future archive support; archived Feedback is hidden from normal views.

## Routes

- `/` Dashboard
- `/forests` Area-grouped Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` React Flow Tree View and Node Feedback
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

Existing v0.2 LocalStorage data is normalized on load. If older data has no `areas`, `areaId`, or `feedbacks`, the app adds safe defaults.

To reset local sample data, delete this LocalStorage key from browser dev tools and reload the app.

## Manual Test Scenario v0.2.6

Use this scenario on both smartphone and desktop widths.

### 1. Create Area, Forest, Tree, And Seed

1. Open `/create`.
2. Create a Forest under an existing or new Area.
3. From the Forest detail page, create a Tree with its first Seed.
4. Confirm the app moves to the new Tree View.
5. Confirm the Seed Node appears in React Flow and in the Tree Nodes list.

### 2. Add Feedback To Node

1. Open a Tree View.
2. Select a Node in React Flow or the Tree Nodes list.
3. In the Node detail panel, enter Feedback body and an optional author label.
4. Submit Feedback.
5. Confirm the Feedback appears immediately under the selected Node.
6. Confirm the Feedback count updates from real data.

### 3. Reload Feedback

1. Reload the browser.
2. Open the same Tree and Node.
3. Confirm the Feedback remains visible from LocalStorage.

### 4. Search Feedback

1. Open `/search`.
2. Search for a term from the Feedback body.
3. Confirm the related Tree appears.
4. Confirm Matched Feedback appears and links back to the Tree View.

### 5. Convert Feedback To Branch

1. Open a Node with Feedback.
2. Click `Branchとして切り出す`.
3. Confirm a Branch Node is created with the Feedback body.
4. Confirm React Flow shows the new Branch connected to the original Node.

### 6. My Page

1. Open `/me`.
2. Confirm Feedback count is visible.
3. Confirm the wording describes a contribution tendency, not ranking or people evaluation.

## Limitations

- Local browser MVP only
- No real notifications
- No user accounts or permissions
- No backend synchronization
- Feedback is local to this browser and is not shared
- No claim of public release or validation
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
