# Knowledge Forest MVP v0.2.10

Knowledge Forest is a local browser MVP for turning daily observations and improvement ideas into reusable operational knowledge.

v0.2.10 is a Dashboard Slim / Guide Consolidation release. It reduces the amount of explanatory content on Dashboard, organizes Dashboard as a work-start page, and consolidates the detailed value explanation added in v0.2.9 into `/guide`.

## What Changed In v0.2.10

- Slimmed Dashboard so it works as an entry point for action.
- Kept short Dashboard links for sample Tree, Create, and Guide.
- Moved detailed value explanation to `/guide`.
- Moved memo/chat/Notion comparison to `/guide`.
- Moved the 5-minute tutorial details to `/guide`.
- Moved use-case sample details to `/guide`.
- Kept Dashboard work cards such as recent Forests, recent Trees, Phase Counts, Archive, and Tree status links.

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

The app helps users see how a small observation grows into an improvement, a practice result, an integrated template, and finally reusable operational knowledge.

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

This MVP stores data only in the current browser. It is not shared with other people or devices.

## Manual Test Scenario v0.2.10

1. Open Dashboard and confirm the information volume feels lighter than a manual page.
2. Confirm Dashboard can open the sample Tree.
3. Confirm Dashboard can navigate to Create.
4. Confirm Dashboard can navigate to Guide.
5. Open `/guide` and confirm it includes the value explanation, comparison with memo/chat/Notion, 5-minute tutorial, use-case samples, Archive / Restore explanation, and LocalStorage notes.
6. Open the sample Tree and confirm existing Tree View, Node Growth Actions, Feedback, Feedback-to-Branch, and Archive controls still work.
7. Create a new Forest, Tree, Node, and Feedback.
8. Confirm Dashboard recent Forests / recent Trees / Phase Counts reflect normal LocalStorage data.
9. Archive and Restore an item from `/archive`.
10. Reload the browser and confirm LocalStorage data remains.

## Tester Notes

This MVP is for testing structure, wording, and usability. Do not enter important personal information or production data.

## Limitations

- Local browser MVP only
- No permanent delete
- No real notifications
- No user accounts or permissions
- No backend synchronization
- Feedback is local to this browser and is not shared
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
