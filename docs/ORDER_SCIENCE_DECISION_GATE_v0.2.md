# OrderScience Decision Gate v0.2

## 目的

Knowledge Forest内の知識を、意思決定可能な形へ近づける。

## 5W2H Gate

各TreeまたはSigmaに対して、以下の情報が揃っているかを確認する。

| 項目 | 確認内容 |
|---|---|
| Why | なぜ必要か |
| What | 何を改善・制度化するか |
| Who | 誰が関係するか |
| When | いつ使うか |
| Where | どこで使うか |
| How | どう運用するか |
| How much | コスト・負荷・予算感 |

## v0.2での扱い

完全な自動判定は不要。
MVPでは、Sigma/Systemノードの詳細パネルに5W2H checklistを表示する。

チェック項目はLocalStorageに保存できると良い。
難しければ、v0.2ではUI表示のみでもよい。

## System化候補判定

以下の条件を満たすものを候補として表示する。

- Sigmaがある
- Trialがある
- Why/What/Howが書かれている
- Systemがまだない

## 注意

OrderScienceは意思決定支援であり、正解判定装置ではない。
