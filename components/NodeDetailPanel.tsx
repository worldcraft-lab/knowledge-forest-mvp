"use client";

import { FormEvent, useState } from "react";
import { GitBranch, Plus } from "lucide-react";
import { formatDate } from "@/lib/v02-store";
import { Feedback, KnowledgeNode } from "@/lib/v02-types";
import { PhaseBadge } from "./PhaseBadge";

export function NodeDetailPanel({
  node,
  feedbacks,
  onAddFeedback,
  onBranchFromFeedback
}: {
  node?: KnowledgeNode;
  feedbacks: Feedback[];
  onAddFeedback: (payload: { body: string; authorLabel: string }) => void;
  onBranchFromFeedback: (feedback: Feedback) => void;
}) {
  const [body, setBody] = useState("");
  const [authorLabel, setAuthorLabel] = useState("");

  if (!node) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">Nodeを選択してください。</p>
      </aside>
    );
  }

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    onAddFeedback({ body: body.trim(), authorLabel: authorLabel.trim() || "Local User" });
    setBody("");
    setAuthorLabel("");
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <PhaseBadge phase={node.phase} />
      <h2 className="mt-4 text-xl font-bold leading-8 text-forest-ink">{node.title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{node.body}</p>
      {node.phase === "system" && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          Systemは人の評価ではなく、再利用可能な運用知へ到達した状態を示します。
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {node.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Info label="投稿者" value={node.authorName} />
        <Info label="投稿日" value={formatDate(node.createdAt)} />
        <Info label="Feedback" value={`${feedbacks.length}`} />
      </dl>

      <section className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-bold text-forest-ink">Feedback</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Feedbackは、Nodeに対する補足・観点・改善のきっかけです。重要なFeedbackはBranchとして切り出し、知識の成長につなげられます。
        </p>

        <form className="mt-4 grid gap-3" onSubmit={submitFeedback}>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Feedback本文
            <textarea
              className="input min-h-24 resize-y"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="補足、別視点、次に試したいことなど"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            投稿者ラベル
            <input
              className="input"
              value={authorLabel}
              onChange={(event) => setAuthorLabel(event.target.value)}
              placeholder="Local User"
            />
          </label>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]"
            type="submit"
          >
            <Plus className="h-4 w-4" />
            Feedbackを追加
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {feedbacks.map((feedback) => (
            <article key={feedback.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{feedback.body}</p>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {feedback.authorLabel} / {formatDate(feedback.createdAt)}
              </p>
              <button
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.99]"
                onClick={() => onBranchFromFeedback(feedback)}
                type="button"
              >
                <GitBranch className="h-4 w-4" />
                Branchとして切り出す
              </button>
            </article>
          ))}
          {feedbacks.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              このNodeにはまだFeedbackがありません。気づきや補足を残すと、次のBranchやTrialにつながります。
            </p>
          )}
        </div>
      </section>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs font-bold text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
