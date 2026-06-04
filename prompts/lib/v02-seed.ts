import { KnowledgeForestData } from "./v02-types";

const base = new Date("2026-06-02T09:00:00.000Z").getTime();
const daysAgo = (days: number) => new Date(base - days * 24 * 60 * 60 * 1000).toISOString();

export const STORAGE_KEY_V02 = "knowledge-forest-mvp-v0.2";

export const seedData: KnowledgeForestData = {
  areas: [
    {
      id: "area-store-ops",
      title: "店舗運営",
      description: "接客、席案内、ピークタイム運用など、店舗現場の知識を束ねるAreaです。",
      tags: ["店舗運営", "接客", "運用"],
      createdAt: daysAgo(24),
      updatedAt: daysAgo(1)
    },
    {
      id: "area-stos",
      title: "StoS / 学生OEM",
      description: "StoS関係者と学生OEMの制作、レビュー、学習運用に関するForestを束ねます。",
      tags: ["StoS", "学生OEM", "制作"],
      createdAt: daysAgo(18),
      updatedAt: daysAgo(3)
    }
  ],
  forests: [
    {
      id: "forest-restaurant-ops",
      areaId: "area-store-ops",
      title: "飲食店オペレーション改善",
      description:
        "接客、案内、ピークタイム運用の気づきを、現場で再利用できる手順へ育てるForest。",
      tags: ["接客", "店舗運営", "改善"],
      ownerLabel: "Internal Test",
      createdAt: daysAgo(20)
    },
    {
      id: "forest-student-oem",
      areaId: "area-stos",
      title: "学生OEM 実践知",
      description:
        "学生メンバーの小さな実践から、再現可能な学習・制作フローを整理するForest。",
      tags: ["学生OEM", "学習", "制作"],
      ownerLabel: "Internal Test",
      createdAt: daysAgo(14)
    }
  ],
  trees: [
    {
      id: "tree-first-service-flow",
      forestId: "forest-restaurant-ops",
      title: "初回接客フローの知識成長Tree",
      summary:
        "入店直後の気づきから、初回接客テンプレートとマニュアルへ成長したTree。",
      tags: ["接客", "ピークタイム", "マニュアル"],
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1)
    },
    {
      id: "tree-lunch-seat-flow",
      forestId: "forest-restaurant-ops",
      title: "ランチ帯の席案内安定化Tree",
      summary:
        "ランチ帯に席案内を先に安定させる改善案を、検証待ちの知識として整理。",
      tags: ["ランチ", "席案内", "改善候補"],
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8)
    },
    {
      id: "tree-student-review-loop",
      forestId: "forest-student-oem",
      title: "制作レビュー循環Tree",
      summary:
        "制作物のレビュー順序とフィードバックの残し方を、Sigma候補として育てるTree。",
      tags: ["レビュー", "制作", "学習"],
      createdAt: daysAgo(10),
      updatedAt: daysAgo(3)
    }
  ],
  nodes: [
    {
      id: "node-first-drink-seed",
      treeId: "tree-first-service-flow",
      parentId: null,
      phase: "seed",
      title: "飲食店で最初にドリンクを聞くと注文がスムーズだった",
      body:
        "入店直後にドリンクだけ先に確認すると、席についてからの会話が自然に始まり、最初の注文までの時間が短くなった。",
      tags: ["気づき", "接客"],
      authorName: "Knowledge Forest",
      createdAt: daysAgo(12),
      helpfulCount: 24,
      commentCount: 5
    },
    {
      id: "node-people-branch",
      treeId: "tree-first-service-flow",
      parentId: "node-first-drink-seed",
      phase: "branch",
      title: "人数確認も先にした方がさらにスムーズだった",
      body:
        "ドリンク確認の前に人数と席の希望を合わせて聞くと、案内と注文の手戻りが少なくなる。",
      tags: ["改善案", "人数確認"],
      authorName: "StoS Tester",
      createdAt: daysAgo(10),
      helpfulCount: 16,
      commentCount: 3
    },
    {
      id: "node-lunch-seat-branch",
      treeId: "tree-first-service-flow",
      parentId: "node-first-drink-seed",
      phase: "branch",
      title: "ランチ帯では、先に席案内を安定させた方が良かった",
      body:
        "ピーク時間帯は注文前の導線が混みやすいため、席案内を先に固定した方がスタッフ間の判断が揃った。",
      tags: ["改善案", "席案内"],
      authorName: "学生OEM",
      createdAt: daysAgo(8),
      helpfulCount: 13,
      commentCount: 4
    },
    {
      id: "node-order-miss-trial",
      treeId: "tree-first-service-flow",
      parentId: "node-people-branch",
      phase: "trial",
      title: "実践してみたら、ピーク時の注文ミスが減った",
      body:
        "3日間試したところ、ランチピークの聞き直しが減り、新人スタッフも接客の順番を覚えやすくなった。",
      tags: ["実践", "ピークタイム"],
      authorName: "現場メンバー",
      createdAt: daysAgo(5),
      helpfulCount: 31,
      commentCount: 8
    },
    {
      id: "node-first-flow-sigma",
      treeId: "tree-first-service-flow",
      parentId: "node-order-miss-trial",
      phase: "sigma",
      title: "初回接客フローの基本テンプレート v1.0",
      body:
        "人数確認、席案内、ドリンク確認、初回注文の順に整理すると、混雑時も品質が安定する。",
      tags: ["Sigma", "テンプレート"],
      authorName: "Knowledge Forest",
      createdAt: daysAgo(3),
      helpfulCount: 42,
      commentCount: 6
    },
    {
      id: "node-first-flow-system",
      treeId: "tree-first-service-flow",
      parentId: "node-first-flow-sigma",
      phase: "system",
      title: "飲食店 初回接客マニュアル v1.0",
      body:
        "新人研修とピーク時運用に使う初回接客マニュアル。店舗ごとの差分はSigmaに追記して改訂する。",
      tags: ["System", "マニュアル"],
      authorName: "StoS Ops",
      createdAt: daysAgo(1),
      helpfulCount: 57,
      commentCount: 12
    },
    {
      id: "node-lunch-seat-seed",
      treeId: "tree-lunch-seat-flow",
      parentId: null,
      phase: "seed",
      title: "ランチ帯の席案内でスタッフ判断が割れやすい",
      body:
        "混雑時に空席確認、案内、注文確認が同時に起こり、経験の浅いスタッフほど判断がぶれやすかった。",
      tags: ["気づき", "停滞候補"],
      authorName: "現場メンバー",
      createdAt: daysAgo(8),
      helpfulCount: 9,
      commentCount: 2
    },
    {
      id: "node-lunch-seat-proposal",
      treeId: "tree-lunch-seat-flow",
      parentId: "node-lunch-seat-seed",
      phase: "branch",
      title: "席案内だけを先に担当分離する",
      body:
        "ピーク15分だけ席案内担当を明確にし、注文確認と分ける案。まだTrialは未実施。",
      tags: ["改善案", "要検証"],
      authorName: "StoS Tester",
      createdAt: daysAgo(8),
      helpfulCount: 7,
      commentCount: 1
    },
    {
      id: "node-review-seed",
      treeId: "tree-student-review-loop",
      parentId: null,
      phase: "seed",
      title: "制作レビューの指摘がチャットで流れて再利用しづらい",
      body:
        "同じ指摘が別メンバーにも繰り返されるため、レビュー観点を蓄積する場所が必要だった。",
      tags: ["気づき", "レビュー"],
      authorName: "学生OEM",
      createdAt: daysAgo(10),
      helpfulCount: 18,
      commentCount: 4
    },
    {
      id: "node-review-trial",
      treeId: "tree-student-review-loop",
      parentId: "node-review-seed",
      phase: "trial",
      title: "レビュー前チェックリストを試した",
      body:
        "提出前に観点を3つだけ確認する運用を試すと、レビュー時間が短くなった。",
      tags: ["実践", "チェックリスト"],
      authorName: "制作メンバー",
      createdAt: daysAgo(4),
      helpfulCount: 22,
      commentCount: 3
    },
    {
      id: "node-review-sigma",
      treeId: "tree-student-review-loop",
      parentId: "node-review-trial",
      phase: "sigma",
      title: "制作レビュー観点の統合メモ",
      body:
        "初稿品質、目的一致、次アクション明確化の3観点にまとめると、レビューの再利用性が上がる。",
      tags: ["Sigma", "統合"],
      authorName: "Knowledge Forest",
      createdAt: daysAgo(3),
      helpfulCount: 29,
      commentCount: 5
    }
  ],
  feedbacks: [
    {
      id: "feedback-first-flow-note",
      treeId: "tree-first-service-flow",
      nodeId: "node-first-flow-sigma",
      body: "新人研修で使うなら、最初の声かけ例も一緒に残すとBranchやTrialにつなげやすそうです。",
      authorLabel: "Local Tester",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
      archivedAt: null
    }
  ],
  notifications: [
    {
      id: "notice-branch-added",
      title: "Seedから新しいBranchが伸びました",
      body: "初回接客フローのTreeに改善案が追加されました。",
      createdAt: daysAgo(1),
      relatedTreeId: "tree-first-service-flow",
      relatedNodeId: "node-people-branch",
      read: false
    },
    {
      id: "notice-sigma-candidate",
      title: "System化を検討しやすいTreeがあります",
      body: "制作レビュー循環TreeはSigmaに到達しています。再利用可能な運用知として整理できるかを検討できます。",
      createdAt: daysAgo(2),
      relatedTreeId: "tree-student-review-loop",
      relatedNodeId: "node-review-sigma",
      read: false
    },
    {
      id: "notice-stalled-tree",
      title: "停滞しているTreeがあります",
      body: "ランチ帯の席案内安定化TreeはTrial待ちの状態です。",
      createdAt: daysAgo(4),
      relatedTreeId: "tree-lunch-seat-flow",
      relatedNodeId: "node-lunch-seat-proposal",
      read: false
    }
  ]
};
