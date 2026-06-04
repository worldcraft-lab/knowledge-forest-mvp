"use client";

import { FormEvent, useMemo, useState } from "react";
import { GitBranch, Plus, Sprout } from "lucide-react";
import { formatDate, phaseDescriptions, phaseLabels } from "@/lib/v02-store";
import { Feedback, KnowledgeNode, Phase } from "@/lib/v02-types";
import { PhaseBadge } from "./PhaseBadge";

const growthPhases: Phase[] = ["branch", "trial", "sigma", "system"];

const recommendedByPhase: Record<Phase, Phase[]> = {
  seed: ["branch", "trial"],
  branch: ["trial", "sigma"],
  trial: ["sigma", "system"],
  sigma: ["system", "branch"],
  system: ["branch", "trial"]
};

export function NodeDetailPanel({
  node,
  feedbacks,
  onAddFeedback,
  onBranchFromFeedback,
  onGrowNode,
  onArchiveNode,
  onArchiveFeedback,
  hasChildNodes
}: {
  node?: KnowledgeNode;
  feedbacks: Feedback[];
  onAddFeedback: (payload: { body: string; authorLabel: string }) => void;
  onBranchFromFeedback: (feedback: Feedback) => void;
  onGrowNode: (payload: { phase: Phase; title: string; body: string; tags: string[]; authorName: string }) => void;
  onArchiveNode: () => void;
  onArchiveFeedback: (feedback: Feedback) => void;
  hasChildNodes: boolean;
}) {
  const [feedbackBody, setFeedbackBody] = useState("");
  const [feedbackAuthorLabel, setFeedbackAuthorLabel] = useState("");
  const [growthPhase, setGrowthPhase] = useState<Phase>("branch");
  const [growthTitle, setGrowthTitle] = useState("");
  const [growthBody, setGrowthBody] = useState("");
  const [growthTags, setGrowthTags] = useState("");
  const [growthAuthorName, setGrowthAuthorName] = useState("");
  const [isGrowthFormOpen, setIsGrowthFormOpen] = useState(false);

  const orderedGrowthPhases = useMemo(() => {
    if (!node) return growthPhases;
    const recommended = recommendedByPhase[node.phase];
    return [...recommended, ...growthPhases.filter((phase) => !recommended.includes(phase))];
  }, [node]);

  if (!node) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">Nodeを選択してください。</p>
      </aside>
    );
  }

  function openGrowthForm(phase: Phase) {
    setGrowthPhase(phase);
    setIsGrowthFormOpen(true);
  }

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feedbackBody.trim()) return;
    onAddFeedback({ body: feedbackBody.trim(), authorLabel: feedbackAuthorLabel.trim() || "Local User" });
    setFeedbackBody("");
    setFeedbackAuthorLabel("");
  }

  function submitGrowthNode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!growthTitle.trim() || !growthBody.trim()) return;
    onGrowNode({
      phase: growthPhase,
      title: growthTitle.trim(),
      body: growthBody.trim(),
      tags: splitTags(growthTags),
      authorName: growthAuthorName.trim() || "あなた"
    });
    setGrowthTitle("");
    setGrowthBody("");
    setGrowthTags("");
    setGrowthAuthorName("");
    setIsGrowthFormOpen(false);
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
      <button
        className="mt-4 w-full rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 active:scale-[0.99]"
        onClick={onArchiveNode}
        title={hasChildNodes ? "このNodeには子Nodeがあります。Archiveすると、その枝も通常表示から隠れます。" : "このNodeをArchiveします。"}
        type="button"
      >
        Archive Node
      </button>

      <section className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-forest-ink">
          <Sprout className="h-5 w-5 text-emerald-700" />
          このNodeから育てる
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          このNodeを起点に、新しいBranchやTrialを追加できます。SeedからBranchへ進めるだけでなく、すぐにTrialとして実践を記録することもできます。
          Knowledge Forestでは、Phaseは評価ではなく、知識の状態を表します。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {orderedGrowthPhases.map((phase, index) => (
            <button
              key={phase}
              className={`rounded-lg border px-3 py-3 text-left text-sm font-bold transition active:scale-[0.99] ${
                index < 2
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => openGrowthForm(phase)}
              type="button"
            >
              {phaseLabels[phase]}を追加
              {index < 2 && <span className="mt-1 block text-[11px] font-semibold text-emerald-700">推奨</span>}
            </button>
          ))}
        </div>

        {isGrowthFormOpen && (
          <form className="mt-4 grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4" onSubmit={submitGrowthNode}>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Phase
              <select className="input" value={growthPhase} onChange={(event) => setGrowthPhase(event.target.value as Phase)}>
                {growthPhases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phaseLabels[phase]} / {phaseDescriptions[phase]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              タイトル
              <input className="input" value={growthTitle} onChange={(event) => setGrowthTitle(event.target.value)} required />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              本文
              <textarea className="input min-h-24 resize-y" value={growthBody} onChange={(event) => setGrowthBody(event.target.value)} required />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              タグ（カンマ区切り）
              <input className="input" value={growthTags} onChange={(event) => setGrowthTags(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              投稿者ラベル
              <input className="input" value={growthAuthorName} onChange={(event) => setGrowthAuthorName(event.target.value)} placeholder="あなた" />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-[0.99]" type="submit">
                <Plus className="h-4 w-4" />
                Nodeを追加
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50" onClick={() => setIsGrowthFormOpen(false)} type="button">
                閉じる
              </button>
            </div>
          </form>
        )}
      </section>

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
              value={feedbackBody}
              onChange={(event) => setFeedbackBody(event.target.value)}
              placeholder="補足、別視点、次に試したいことなど"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            投稿者ラベル
            <input
              className="input"
              value={feedbackAuthorLabel}
              onChange={(event) => setFeedbackAuthorLabel(event.target.value)}
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
              <button
                className="ml-2 mt-3 inline-flex items-center gap-2 rounded-md border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 active:scale-[0.99]"
                onClick={() => onArchiveFeedback(feedback)}
                type="button"
              >
                Archive Feedback
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

function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs font-bold text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
