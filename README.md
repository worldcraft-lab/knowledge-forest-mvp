# Knowledge Forest MVP v0.2.12

Knowledge Forest is a local browser MVP for turning daily observations and improvement ideas into reusable operational knowledge.

v0.2.12 is the System Output release. System Nodes can generate Markdown Output that can be previewed, copied, and printed or saved as PDF through the browser print dialog.

## What Changed In v0.2.12

- Added an `Outputを作成` action for System Nodes.
- Added `/output/[nodeId]` for Output Preview.
- Generated Markdown from the System Node and related Tree context.
- Related Nodes are collected by following the System Node ancestor chain first, then falling back to same-Tree Phase groups.
- Added Preview / Markdown display switching.
- Added Copy Markdown with a selectable textarea fallback.
- Added Print / Save as PDF via `window.print()`.
- Shows a clear message when a non-System Node is opened as Output.
- Shows an Archive notice when the target System Node is archived.
- Kept Output as an action, not a new Node Phase.

## Core Idea

Knowledge Forest is not just a post list or memo app.

```text
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

Output is not a sixth Phase. It is an action for System Nodes that are ready to become reusable operational knowledge.

## Structure

```text
Area
└ Forest
  └ Tree
    └ Node
      └ Feedback
```

## Routes

- `/` Dashboard as the work-start page
- `/guide` New tester guide and detailed explanation
- `/forests` Area-grouped Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` Timeline View, Map View, Node Growth Actions, Node Feedback, Output action, and Archive controls
- `/output/[nodeId]` Markdown Output Preview, Copy, and Print
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

This MVP stores data only in the current browser. It is not shared with other people or devices.

## Manual Test Scenario v0.2.12

1. Open a Tree detail page.
2. Select a System Node in Timeline View.
3. Confirm `Outputを作成` appears in the Node detail panel.
4. Open Output Preview.
5. Confirm the Output title, source Tree, target System Node, Markdown Preview, Copy Markdown, Print / Save as PDF, and Back to Tree controls are visible.
6. Confirm Markdown contains title, overview, purpose, Seed / Branch / Trial / Sigma context, procedure, notes, tags, created date, and source path.
7. Switch between Preview and Markdown.
8. Click Copy Markdown and confirm the Markdown can be pasted elsewhere.
9. Click Print / Save as PDF and confirm the browser print dialog opens.
10. Open `/output/[nodeId]` with a non-System Node and confirm the non-System message appears.
11. Open an archived System Node Output and confirm the Archive notice appears.
12. Confirm Timeline / Map selection both show the Output button for System Nodes.
13. Confirm Feedback, Feedback-to-Branch, Archive, Restore, and Node Growth Actions still work.
14. Reload the browser and confirm LocalStorage data remains.

## Tester Notes

This MVP is for testing structure, wording, and usability. Do not enter important personal information or production data.

## Limitations

- Local browser MVP only
- No permanent delete
- No real notifications
- No user accounts or permissions
- No backend synchronization
- Feedback is local to this browser and is not shared
- Output is Markdown preview / copy / print only, not a backend export
- Output history is not stored
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
