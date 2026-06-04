# Knowledge Forest MVP v0.2.7

Knowledge Forest is a local browser MVP for visualizing how small observations grow into reusable operational knowledge.

v0.2.7 adds Node Growth Actions. While viewing a Node, you can grow the Tree directly from that Node without returning to the Create page.

## Product Summary

- Area: top-level knowledge domain that groups multiple Forests
- Forest: topic or project-level knowledge space inside an Area
- Knowledge Tree: a linked growth path inside a Forest
- Knowledge Node: one knowledge item in the Seed / Branch / Trial / Sigma / System flow
- Feedback: a supplemental viewpoint attached to a Node
- Node Growth Actions: direct Branch / Trial / Sigma / System creation from the selected Node
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

## Node Growth Actions

- The Node detail panel has `このNodeから育てる`.
- Seed can directly grow into Branch or Trial.
- Branch can grow into Trial or Sigma.
- Trial can grow into Sigma or System.
- New Nodes are connected with `parentId` to the selected source Node.
- Phase is not an evaluation. It represents the current state of knowledge.

## Feedback

- Feedback is attached to a Node.
- Feedback is used for supplements, viewpoints, and improvement hints.
- Important Feedback can be converted into a Branch Node.
- Feedback-to-Branch creates a Branch from Feedback content.
- Node Growth Actions create a new Node from the selected Node itself.
- Feedback counts are based on real LocalStorage data, not fixed sample numbers.
- This is a LocalStorage-only MVP, so Feedback is not shared with other people or devices.
- Feedback has `archivedAt` for future archive support; archived Feedback is hidden from normal views.

## Routes

- `/` Dashboard
- `/forests` Area-grouped Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` React Flow Tree View, Node Growth Actions, and Node Feedback
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

Existing v0.2 LocalStorage data is normalized on load. If older data has no `areas`, `areaId`, or `feedbacks`, the app adds safe defaults.

## Manual Test Scenario v0.2.7

Use this scenario on both smartphone and desktop widths.

### 1. Grow Seed Into Branch

1. Open a Tree View.
2. Select a Seed Node.
3. In `このNodeから育てる`, click `Branchを追加`.
4. Enter title, body, tags, and author label.
5. Submit.
6. Confirm React Flow shows a Branch connected to the Seed.
7. Confirm the Branch appears in Tree Nodes.

### 2. Grow Seed Into Trial

1. Select the original Seed Node again.
2. Click `Trialを追加`.
3. Submit a Trial body.
4. Confirm React Flow shows a Trial connected to the Seed.

### 3. Grow Branch Into Sigma

1. Select a Branch Node.
2. Click `Sigmaを追加`.
3. Submit.
4. Confirm the Sigma Node appears and remains visually emphasized.

### 4. Check Reflection

1. Open Dashboard and confirm Total Nodes and Phase Counts changed.
2. Confirm Sigma arrival or Systemization rates update when relevant.
3. Search for the new Node title or body and confirm it appears.
4. Open My Page and confirm Phase tendencies reflect the added Nodes.
5. Reload the browser and confirm the new Nodes remain in LocalStorage.

### 5. Confirm Feedback-To-Branch Still Works

1. Select any Node.
2. Add Feedback.
3. Click `Branchとして切り出す`.
4. Confirm a Branch Node is created from Feedback content and connected to the original Node.

## Limitations

- Local browser MVP only
- No real notifications
- No user accounts or permissions
- No backend synchronization
- Feedback is local to this browser and is not shared
- No claim of public release or validation
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
