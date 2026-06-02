"use client";

import { FormEvent, useMemo, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PhaseBadge } from "@/components/PhaseBadge";
import {
  addNode,
  addTree,
  getTreeNodes,
  phaseDescriptions,
  phaseLabels,
  phaseOrder,
  saveKnowledgeForestData,
  useKnowledgeForestData
} from "@/lib/v02-store";
import { Phase } from "@/lib/v02-types";

const emptyNodeForm = {
  treeId: "",
  parentId: "",
  phase: "seed" as Phase,
  title: "",
  body: "",
  tags: ""
};

export default function CreatePage() {
  const router = useRouter();
  const { data, setData } = useKnowledgeForestData();
  const [mode, setMode] = useState<"tree" | "node">("node");
  const [treeForestId, setTreeForestId] = useState("");
  const [treeTitle, setTreeTitle] = useState("");
  const [treeSummary, setTreeSummary] = useState("");
  const [nodeForm, setNodeForm] = useState(emptyNodeForm);
  const selectedTreeId = nodeForm.treeId || data.trees[0]?.id || "";
  const selectedForestId = treeForestId || data.forests[0]?.id || "";

  const selectedTreeNodes = useMemo(
    () => getTreeNodes(data, selectedTreeId),
    [data, selectedTreeId]
  );

  function submitTree(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedForestId) return;
    const result = addTree(data, selectedForestId, treeTitle.trim(), treeSummary.trim());
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    router.push(`/tree/${result.tree.id}`);
  }

  function submitNode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTreeId) return;
    const result = addNode(data, {
      treeId: selectedTreeId,
      parentId: nodeForm.parentId || null,
      phase: nodeForm.phase,
      title: nodeForm.title.trim(),
      body: nodeForm.body.trim(),
      tags: nodeForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    setNodeForm(emptyNodeForm);
    router.push(`/tree/${result.node.treeId}`);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <h2 className="text-2xl font-bold text-forest-ink">Create Tree / Node</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        新しい内容は投稿単体ではなく、Forestの中のTree、またはTree上のNodeとして追加します。
        保存後はLocalStorageに即時保存し、対象のTree Viewへ移動します。
      </p>

      <div className="mt-5 grid max-w-md grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        <button className={tabClass(mode === "node")} onClick={() => setMode("node")} type="button">
          Nodeを追加
        </button>
        <button className={tabClass(mode === "tree")} onClick={() => setMode("tree")} type="button">
          Treeを作成
        </button>
      </div>

      {mode === "tree" ? (
        <form className="mt-6 grid gap-4" onSubmit={submitTree}>
          <Field label="Forest">
            <select className="input" value={selectedForestId} onChange={(event) => setTreeForestId(event.target.value)}>
              {data.forests.map((forest) => (
                <option key={forest.id} value={forest.id}>
                  {forest.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Treeタイトル">
            <input className="input" required value={treeTitle} onChange={(event) => setTreeTitle(event.target.value)} />
          </Field>
          <Field label="Treeサマリー">
            <textarea className="input min-h-28 resize-y" required value={treeSummary} onChange={(event) => setTreeSummary(event.target.value)} />
          </Field>
          <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">
            作成後、このTreeの成長ビューへ移動します。Forest詳細にも新規Treeとして反映されます。
          </p>
          <SubmitButton label="Treeを作成して表示" />
        </form>
      ) : (
        <form className="mt-6 grid gap-4" onSubmit={submitNode}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="追加先Tree">
              <select
                className="input"
                value={selectedTreeId}
                onChange={(event) => setNodeForm({ ...nodeForm, treeId: event.target.value, parentId: "" })}
              >
                {data.trees.map((tree) => (
                  <option key={tree.id} value={tree.id}>
                    {tree.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phase">
              <select
                className="input"
                value={nodeForm.phase}
                onChange={(event) => setNodeForm({ ...nodeForm, phase: event.target.value as Phase })}
              >
                {phaseOrder.map((phase) => (
                  <option key={phase} value={phase}>
                    {phaseLabels[phase]} / {phaseDescriptions[phase]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="親Node">
            <select className="input" value={nodeForm.parentId} onChange={(event) => setNodeForm({ ...nodeForm, parentId: event.target.value })}>
              <option value="">親なし / Seedとして追加</option>
              {selectedTreeNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {phaseLabels[node.phase]}: {node.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="タイトル">
            <input className="input" required value={nodeForm.title} onChange={(event) => setNodeForm({ ...nodeForm, title: event.target.value })} />
          </Field>
          <Field label="本文">
            <textarea className="input min-h-36 resize-y" required value={nodeForm.body} onChange={(event) => setNodeForm({ ...nodeForm, body: event.target.value })} />
          </Field>
          <Field label="タグ（カンマ区切り）">
            <input className="input" value={nodeForm.tags} onChange={(event) => setNodeForm({ ...nodeForm, tags: event.target.value })} placeholder="例：実践, 接客, Sigma統合" />
          </Field>
          <div className="flex flex-wrap gap-2">
            {phaseOrder.map((phase) => (
              <PhaseBadge key={phase} phase={phase} compact />
            ))}
          </div>
          <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">
            追加後、対象TreeのTree Viewへ移動します。親Nodeを選ぶとReact Flow上でedgeとしてつながります。
          </p>
          <SubmitButton label="Nodeを追加してTree Viewへ" />
        </form>
      )}
    </section>
  );
}

function tabClass(active: boolean) {
  return `rounded-md px-3 py-2 text-sm font-bold transition ${
    active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
  }`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-ink px-5 py-4 font-bold text-white transition hover:bg-slate-700 md:w-fit" type="submit">
      <Plus className="h-5 w-5" />
      {label}
    </button>
  );
}
