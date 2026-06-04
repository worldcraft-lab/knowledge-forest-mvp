"use client";

import Link from "next/link";
import type React from "react";
import { ArrowRight, BookOpen, ChevronLeft } from "lucide-react";

const nodeTypes = [
  ["Seed", "気づき。最初の小さな発見や違和感。"],
  ["Branch", "改善案。Seedから広げたアイデア。"],
  ["Trial", "実践。試した結果や検証メモ。"],
  ["Sigma", "統合。複数の実践や改善案をまとめた知識。"],
  ["System", "制度化。再利用できる運用知やマニュアル。"]
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
          初めて触る人向け
        </p>
        <h2 className="text-3xl font-bold text-forest-ink">Knowledge Forestとは</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          気づきや改善案を、あとで使える知識に育てるためのローカルMVPです。
          チャットで流れた話、メモに散らばった案、実践して分かったことを、Treeとしてつなげて残します。
        </p>
      </section>

      <GuideSection title="何ができるか">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "小さな気づきをSeedとして残す",
            "SeedからBranchやTrialを作る",
            "Feedbackを残してBranch化する",
            "実践結果をSigmaやSystemへまとめる",
            "Archive / Restoreで削除せず整理する",
            "Searchで関連Treeを探す"
          ].map((item) => <ListItem key={item} text={item} />)}
        </ul>
      </GuideSection>

      <GuideSection title="何が便利になるか">
        <p className="text-sm leading-6 text-slate-600">
          「前にも同じ話をした」を減らし、なぜそのルールになったかを残せます。
          新人教育、引き継ぎ、振り返り、改善活動で、実践した結果を次の人に渡しやすくなります。
        </p>
      </GuideSection>

      <GuideSection title="基本構造">
        <div className="rounded-lg bg-forest-mist p-4 font-mono text-sm leading-7 text-slate-700">
          Area<br />
          └ Forest<br />
          &nbsp;&nbsp;└ Tree<br />
          &nbsp;&nbsp;&nbsp;&nbsp;└ Node<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└ Feedback
        </div>
      </GuideSection>

      <GuideSection title="Nodeの5種類">
        <div className="grid gap-3 md:grid-cols-5">
          {nodeTypes.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-forest-ink">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{body}</p>
            </article>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="最初に試す流れ">
        <div className="grid gap-3 md:grid-cols-2">
          <Step href="/tree/tree-first-service-flow" text="サンプルTreeを開く" />
          <Step href="/tree/tree-first-service-flow" text="Seed Nodeを選ぶ" />
          <Step href="/tree/tree-first-service-flow" text="このNodeからBranchかTrialを追加する" />
          <Step href="/tree/tree-first-service-flow" text="Feedbackを書いてBranchとして切り出す" />
          <Step href="/archive" text="Archive / Restoreを試す" />
        </div>
      </GuideSection>

      <GuideSection title="テスターに見てほしいポイント">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "何に使うアプリか説明なしで伝わるか",
            "Seed / Branch / Trial / Sigma / Systemの言葉が分かるか",
            "Nodeから育てる導線が自然か",
            "FeedbackとBranch化の違いが分かるか",
            "Archiveが削除ではないと伝わるか",
            "スマホで迷わず触れるか"
          ].map((item) => <ListItem key={item} text={item} />)}
        </ul>
      </GuideSection>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-bold text-amber-900">注意事項</h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          このMVPはLocalStorage版です。入力した内容は自分のブラウザ内だけに保存されます。
          他の人とは共有されません。重要な個人情報や本番データは入力しないでください。
          今回は、使い心地・構造・言葉の分かりやすさを見るためのテストです。
        </p>
      </section>
    </div>
  );
}

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold text-forest-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ListItem({ text }: { text: string }) {
  return <li className="list-none rounded-lg bg-forest-mist p-3 text-sm font-semibold leading-6 text-slate-700">{text}</li>;
}

function Step({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
      {text}
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
    </Link>
  );
}
