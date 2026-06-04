"use client";

import Link from "next/link";
import type React from "react";
import { Archive, ArrowRight, BookOpen, ChevronLeft, Flag, Layers, Lightbulb, Map, MessageSquare, Trees } from "lucide-react";

const benefits = [
  "チャットで流れた改善案を残せる",
  "前にも同じ話をした、を減らせる",
  "なぜそのルールになったかが残る",
  "実践した結果を次の人に渡せる",
  "新人教育や引き継ぎに使いやすくなる",
  "気づきからマニュアル化までの流れが見える"
];

const comparisons = [
  { label: "普通のメモ", text: "書いて終わりになりやすい。" },
  { label: "チャット", text: "会話は速いが、流れて見つけにくい。" },
  { label: "Notion", text: "整理すれば便利だが、整理する負荷が高い。" },
  { label: "Knowledge Forest", text: "気づきが、改善・実践・統合・仕組みへ育つ流れを見られる。", highlight: true }
];

const nodeTypes = [
  { title: "Seed", subtitle: "気づき", body: "最初の小さな発見や現場感覚を残します。" },
  { title: "Branch", subtitle: "改善案", body: "Seedから広げたアイデアや別案をつなげます。" },
  { title: "Trial", subtitle: "実践", body: "試した結果や検証メモを記録します。" },
  { title: "Sigma", subtitle: "統合", body: "複数のBranchやTrialをまとめ、再利用しやすくします。" },
  { title: "System", subtitle: "制度化", body: "マニュアルやルールとして使える運用知にします。" }
];

const tutorialSteps = [
  { text: "サンプルTreeを開く", href: "/tree/tree-first-service-flow" },
  { text: "Seed Nodeを選ぶ", href: "/tree/tree-first-service-flow" },
  { text: "このNodeから育てる、でBranchかTrialを追加する", href: "/tree/tree-first-service-flow" },
  { text: "Feedbackを書いてみる", href: "/tree/tree-first-service-flow" },
  { text: "FeedbackをBranchとして切り出す", href: "/tree/tree-first-service-flow" },
  { text: "ArchiveしてRestoreしてみる", href: "/archive" }
];

const useCases = [
  {
    title: "店舗運営",
    body: "ランチ帯の席案内、接客フロー、レビュー対応、在庫管理など。現場で気づいた小さな改善をSeedにできます。"
  },
  {
    title: "イベント運営",
    body: "当日の導線、受付改善、出演者対応、振り返りなど。次回の運営に渡したい気づきをSeedにできます。"
  },
  {
    title: "学生プロジェクト",
    body: "報連相、役割分担、週次レトロ、実践報告など。チームで学んだことを次の活動に残せます。"
  },
  {
    title: "SNS運用",
    body: "投稿案、試した企画、反応分析、次回改善など。思いつきから検証結果までをつなげて残せます。"
  }
];

export default function GuidePage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
            <ChevronLeft className="h-4 w-4" />
            Dashboardへ戻る
          </Link>
          <span>/</span>
          <span>Guide</span>
        </div>
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
          <BookOpen className="h-4 w-4" />
          初めて触る方へ
        </p>
        <h2 className="text-3xl font-bold tracking-normal text-forest-ink">Knowledge Forestとは</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Knowledge Forestは、日々の気づきや改善案を、実践・統合・仕組みへ育てるためのツールです。
          チャットで流れた話や、メモに散らばった改善案を、あとで使える運用知として残せます。
        </p>
        <p className="mt-3 max-w-3xl rounded-lg bg-forest-mist p-4 text-sm leading-6 text-slate-700">
          単発のメモではなく、「気づきがどう育って、どんな仕組みになったか」を見るためのアプリです。
        </p>
      </section>

      <GuideSection icon={<Lightbulb className="h-5 w-5" />} title="何が便利になるか">
        <div className="grid gap-3 md:grid-cols-2">
          {benefits.map((item) => (
            <p key={item} className="rounded-lg bg-forest-mist p-3 text-sm font-semibold leading-6 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </GuideSection>

      <GuideSection icon={<MessageSquare className="h-5 w-5" />} title="メモ・チャット・Notionとの違い">
        <div className="grid gap-3 md:grid-cols-2">
          {comparisons.map((item) => (
            <article
              key={item.label}
              className={`rounded-lg p-4 text-sm leading-6 ${item.highlight ? "border border-emerald-200 bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-600"}`}
            >
              <h3 className="font-bold text-forest-ink">{item.label}</h3>
              <p className="mt-1">{item.text}</p>
            </article>
          ))}
        </div>
      </GuideSection>

      <GuideSection icon={<Layers className="h-5 w-5" />} title="基本構造">
        <p className="mb-4 text-sm leading-6 text-slate-600">
          気づきや改善案を、あとで使える知識に育てます。そのために Area / Forest / Tree / Node / Feedback という階層で整理します。
        </p>
        <div className="rounded-lg bg-forest-mist p-4 font-mono text-sm leading-7 text-slate-700">
          Area<br />
          └ Forest<br />
          &nbsp;&nbsp;└ Tree<br />
          &nbsp;&nbsp;&nbsp;&nbsp;└ Node<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└ Feedback
        </div>
      </GuideSection>

      <GuideSection icon={<Flag className="h-5 w-5" />} title="Nodeの5種類">
        <div className="grid gap-3 md:grid-cols-5">
          {nodeTypes.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-forest-ink">{item.title}</h3>
              <p className="mt-1 text-xs font-semibold text-emerald-700">{item.subtitle}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-900">
          Phaseは人の評価ではなく、知識の状態を表します。Seedから順番に進むだけでなく、必要に応じてTrialやSigmaへ育てられます。
        </p>
      </GuideSection>

      <GuideSection icon={<Trees className="h-5 w-5" />} title="まずは5分で試す" id="tutorial">
        <div className="grid gap-3 md:grid-cols-2">
          {tutorialSteps.map((step, index) => (
            <Link
              key={`${index}-${step.text}`}
              href={step.href}
              className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
            >
              <span>
                <span className="mr-2 text-blue-700">{index + 1}.</span>
                {step.text}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </GuideSection>

      <GuideSection icon={<Map className="h-5 w-5" />} title="用途別サンプル">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-forest-ink">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.body}</p>
            </article>
          ))}
        </div>
      </GuideSection>

      <GuideSection icon={<Archive className="h-5 w-5" />} title="Archive / Restoreとは">
        <p className="text-sm leading-6 text-slate-600">
          Knowledge Forestでは、削除ではなくArchiveを基本操作にしています。Archiveは通常表示から隠す操作で、データは保持されます。
          必要になったらArchive画面からRestoreできます。親要素がArchiveされている場合は、先に親をRestoreしてください。
        </p>
        <Link className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50" href="/archive">
          Archiveを見る
          <ArrowRight className="h-4 w-4" />
        </Link>
      </GuideSection>

      <GuideSection icon={<BookOpen className="h-5 w-5" />} title="テスターに見てほしいポイント">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "何に使うアプリか、説明なしで伝わるか",
            "Seed / Branch / Trial / Sigma / System の言葉が分かりやすいか",
            "Nodeを見ながら育てる導線が自然か",
            "FeedbackとBranch化の違いが分かるか",
            "Archiveが削除ではないと伝わるか",
            "スマホで迷わず触れるか"
          ].map((item) => (
            <p key={item} className="rounded-lg bg-forest-mist p-3 text-sm font-semibold leading-6 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </GuideSection>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-bold text-amber-900">LocalStorage版の注意事項</h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          このMVPはLocalStorage版です。入力した内容は自分のブラウザ内だけに保存されます。他の人とは共有されません。
          重要な個人情報や本番データは入力しないでください。今回は、使い心地・構造・言葉の分かりやすさを見るためのテストです。
        </p>
      </section>
    </div>
  );
}

function GuideSection({ icon, title, children, id }: { icon: React.ReactNode; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-xl font-bold text-forest-ink">
        <span className="text-emerald-700">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
