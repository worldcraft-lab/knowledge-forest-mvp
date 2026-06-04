# Knowledge Forest MVP v0.2.9

Knowledge Forest is a local browser MVP for turning daily observations and improvement ideas into reusable operational knowledge.

v0.2.9 is an onboarding and value-explanation release. It adds clearer in-app guidance for new testers: what the app is for, what becomes easier, how it differs from notes/chat/Notion, and what to try first.

## What Changed In v0.2.9

- Added a Dashboard card: `これは何のためのアプリ？`
- Added `何が便利になる？` and comparison with memo/chat/Notion
- Added a 5-minute tutorial on Dashboard
- Added `/guide`
- Added use-case cards for stores, events, student projects, and SNS operations
- Improved sample Tree entry point
- Added value explanations to Create, My Page, and empty Archive states

## Core Idea

Knowledge Forest is not just a post list or memo app.

```text
Seed / 気づき
→ Branch / 改善案
→ Trial / 実践
→ Sigma / 統合
→ System / 制度化
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

- `/` Dashboard and onboarding
- `/guide` New tester guide
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

## Manual Test Scenario v0.2.9

1. Open Dashboard and confirm the app's purpose is understandable from `これは何のためのアプリ？`.
2. Open `/guide`.
3. Follow the 5-minute tutorial links.
4. Open the sample Tree.
5. Select a Seed and create a Branch or Trial from Node Growth Actions.
6. Add Feedback.
7. Convert Feedback into a Branch.
8. Archive and Restore an item.
9. Confirm Dashboard/Search/My Page still work.
10. Give the URL to a first-time tester without explanation and check whether they understand what the app is for.

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
