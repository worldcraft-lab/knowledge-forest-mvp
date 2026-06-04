# Knowledge Forest MVP v0.2.11

Knowledge Forest is a local browser MVP for turning daily observations and improvement ideas into reusable operational knowledge.

v0.2.11 is a Mobile Tree View improvement release. It adds a smartphone-friendly Timeline View to Tree detail pages while keeping the existing React Flow board as Map View.

## What Changed In v0.2.11

- Added `Timeline / Map` switching on Tree detail pages.
- Smartphone widths open Tree details in Timeline View by default.
- Desktop and wider tablet widths open Tree details in Map View by default.
- Kept React Flow as Map View.
- Timeline groups Nodes by Phase: Seed, Branch, Trial, Sigma, System.
- Timeline cards show Phase, title, body excerpt, tags, Feedback count, child count, date, and Archived state.
- Timeline selection updates the existing Node detail panel.
- Archived Node display toggle also affects Timeline.
- Node Growth Actions, Feedback, Feedback-to-Branch, and Archive controls are preserved.
- Added a Guide section explaining Timeline and Map views.

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
- `/tree/[treeId]` Timeline View, Map View, Node Growth Actions, Node Feedback, and Archive controls
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

## Manual Test Scenario v0.2.11

1. Open a Tree detail page at smartphone width and confirm Timeline is the initial view.
2. Open a Tree detail page at desktop width and confirm Map is the initial view.
3. Switch between Timeline and Map.
4. Select a Node in Timeline and confirm the Node detail panel updates.
5. Select a Seed in Timeline and add a Branch or Trial from Node Growth Actions.
6. Confirm the added Node appears in Timeline and Tree Nodes.
7. Add Feedback and confirm the Timeline card Feedback count updates.
8. Convert Feedback into Branch and confirm the Branch appears in Timeline.
9. Turn on `Archived Nodeを表示` and confirm archived Nodes appear as faded Timeline cards.
10. Switch to Map View and confirm the existing React Flow nodes, edges, and click selection still work.
11. Reload the browser and confirm LocalStorage data remains.

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
