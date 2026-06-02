# Knowledge Forest MVP v0.2.2

Knowledge Forest is a local browser MVP for visualizing how small observations grow into reusable operational knowledge.

v0.2.2 keeps the existing Next.js / TypeScript / Tailwind CSS / React Flow structure and focuses on local-use stability after creating Trees and Nodes.

## Product Summary

- Forest: topic or project-level knowledge space
- Knowledge Tree: a linked growth path inside a Forest
- Knowledge Node: one knowledge item in the Seed / Branch / Trial / Sigma / System flow
- Sigma: the integration phase where scattered Branch and Trial knowledge is summarized
- System: arrival at reusable operational knowledge, not a people evaluation signal

## Core Flow

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

## Routes

- `/` Dashboard
- `/forests` Forest list
- `/forests/[forestId]` Forest detail
- `/tree/[treeId]` React Flow Tree View
- `/create` Create Tree / Create Node
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

## Manual Test Scenario

Use this scenario to verify that Create changes are naturally reflected across Dashboard, Tree View, Search, My Page, and browser reloads.

### 1. Add Trial Node To Existing Tree

1. Open `/create`.
2. Choose `Nodeを追加`.
3. Select Tree: `ランチ帯の席案内安定化Tree`.
4. Select Phase: `Trial / 実践`.
5. Select a parent Node in the same Tree.
6. Enter the Trial sample below and submit.
7. Confirm the app moves to the target Tree View.
8. Confirm the new Trial Node appears in React Flow.
9. Confirm an edge connects the parent Node to the added Node.
10. Confirm the new Node also appears in the Tree Nodes list.

### 2. Add Sigma Node To Same Tree

1. Open `/create` again.
2. Select Tree: `ランチ帯の席案内安定化Tree`.
3. Select Phase: `Sigma / 統合`.
4. Select the Trial Node as parent.
5. Enter the Sigma sample below and submit.
6. Confirm the Sigma Node is emphasized in React Flow.

### 3. Confirm Dashboard Reflection

1. Open `/`.
2. Confirm Total Nodes increased.
3. Confirm Phase Counts reflect the new Trial and Sigma Nodes.
4. If the Tree newly reached Sigma, confirm Sigma arrival rate changes.
5. If no new System Node was added, Systemization rate should not increase.

### 4. Confirm Search Reflection

1. Open `/search`.
2. Confirm the empty search state says it is showing recently updated Trees and Trees ready to consider Systemization.
3. Search for a term from the added Node, such as `入口側` or `後の動線`.
4. Confirm Related Trees and Matched Nodes are filtered by the search term.

### 5. Confirm My Page Reflection

1. Open `/me`.
2. Confirm Phase counts and contribution tendency comments are visible.
3. Confirm the added Nodes are reflected as contribution tendencies.
4. Do not treat these numbers as ranking or HR evaluation.

### 6. Confirm LocalStorage Reload

1. Reload the browser after adding the Trial and Sigma Nodes.
2. Confirm the added data remains visible in Dashboard, Tree View, Search, and My Page.

## Sample Inputs

### Trial追加例

Tree:

```text
ランチ帯の席案内安定化Tree
```

Phase:

```text
Trial / 実践
```

Title:

```text
入口側の席から案内すると滞在時間が安定した
```

Body:

```text
ランチ帯に入口側の席を先に案内したところ、後から来た2名客を奥に通しやすくなり、ピーク時の席移動が減った。
```

Tags:

```text
接客, ランチ, 実践
```

### Sigma追加例

Tree:

```text
ランチ帯の席案内安定化Tree
```

Phase:

```text
Sigma / 統合
```

Title:

```text
ランチ帯の席案内は「先に詰める」より「後の動線を残す」が重要
```

Body:

```text
席案内の目的は満席にすることではなく、後から来る人数や提供動線を崩さないことだった。入口側と奥側の使い分けをルール化できる。
```

Tags:

```text
Sigma, 接客, 席案内
```

## Limitations

- Local browser MVP only
- No real notifications
- No user accounts or permissions
- No backend synchronization
- No claim of public release or validation
- Contribution views are tendencies only and must not be treated as ranking, HR evaluation, or performance scoring
