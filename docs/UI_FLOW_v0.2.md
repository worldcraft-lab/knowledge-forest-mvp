# UI Flow - Knowledge Forest v0.2

## Navigation

推奨ナビゲーション:

```text
Dashboard
Forests
Create
Search
My Page
Notifications
```

## Dashboard

最初に見る画面。

表示の主役:
- 投稿数ではなく、知識成長
- Sigma到達率
- System化率
- System化候補
- 停滞Tree

## Forest Detail

Forestをクリックすると、そのForest内のTree一覧へ。

Tree cardには以下を表示:

- Title
- Summary
- Tags
- Phase progress
- Status
- Last updated
- Sigmaあり/なし
- Systemあり/なし

## Tree View

Knowledge Forestの中心画面。

React Flow表示:

- Seed: 起点
- Branch: 分岐
- Trial: 実践
- Sigma: 統合中心
- System: 出力・制度化

ノードクリックで右側または下部に詳細表示。

詳細表示:
- Phase
- Title
- Body
- Tags
- Author
- Source context
- Parent
- Children

## Create Node Flow

1. Forest選択
2. Tree選択、または新規Tree作成
3. Parent node選択
4. Phase選択
5. Title / Body / Tags入力
6. 保存
7. LocalStorage更新
8. Tree Viewへ遷移、または作成完了表示

## Search Flow

検索語入力後、結果は以下の順で表示:

1. 関連Tree
2. Tree内の該当Node
3. Treeの成長状態
4. Sigma/Systemの有無

## My Page

ランキングではなく、傾向を見る。

例:
- Seedが多い: 現場観察が多い
- Trialが多い: 実践検証が多い
- Sigmaが多い: 統合が得意
- Systemが多い: 仕組み化に貢献

人事評価に見えるUIは禁止。
