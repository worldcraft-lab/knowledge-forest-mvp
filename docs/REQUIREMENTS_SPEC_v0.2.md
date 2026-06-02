# Requirements Spec - Knowledge Forest MVP v0.2

## 必須技術

- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- LocalStorage

## 非対応

- バックエンド
- 認証
- DB
- AI API
- 外部公開前提の権限管理
- 決済
- メール通知

## 画面

### 1. Home / Dashboard

目的:
Forest全体の知識成長状態を見る。

表示:
- Forest一覧
- 各Forestのノード数
- Sigma到達率
- System化率
- 最近更新されたTree
- System化候補
- 停滞Tree

### 2. Forest Page

目的:
特定Forestの中にあるTree群を見る。

表示:
- Tree一覧
- Phase別カウント
- Growth score
- Tree status

Tree status:
- Seed only
- Branching
- In Trial
- Integrated
- Systemized
- Stalled
- Candidate for System

### 3. Tree View

目的:
知識がどう育ったかを見る中心画面。

要件:
- React Flowでノードとエッジを表示
- Phaseごとに表示スタイルを変える
- Sigmaノードを視覚的に中心扱いする
- ノードクリックで詳細パネルを表示
- 親子関係を分かりやすくする

### 4. Create Node

目的:
新しい知識ノードを追加する。

入力:
- Forest
- Tree
- Phase
- Title
- Body
- Tags
- Parent node
- Author
- Source context
- Visibility

### 5. Search

目的:
単発投稿ではなく、関連Tree単位で検索する。

検索対象:
- Title
- Body
- Tags
- Phase
- Forest
- Author

表示:
- 関連Tree
- 該当Node
- Treeの成長状態
- Sigma/Systemの有無

### 6. My Page

目的:
自分の貢献傾向を見る。

表示:
- 自分の作成Node
- Phase別の傾向
- Trialが多い
- Sigmaが多い
- System化に関与
- 最近の活動

注意:
人事評価・ランキング化は禁止。

### 7. Notifications

目的:
LocalStorage内の疑似通知を表示する。

通知例:
- あなたのSeedにBranchが追加されました
- TrialがSigma候補になりました
- System化候補のTreeがあります

## データ保存

LocalStorageに保存する。
初回起動時は `data/seed_knowledge_forest_v0.2.json` 相当のサンプルデータを読み込むか、アプリ側に同等のseedを持つ。

## 完了条件

- `npm install` が通る
- `npm run dev` が通る
- ブラウザで主要画面が見られる
- サンプルデータでForest/Tree/Nodeが表示される
- Tree ViewがReact Flowで表示される
- LocalStorageに追加Nodeが保存される
- READMEに起動方法がある
