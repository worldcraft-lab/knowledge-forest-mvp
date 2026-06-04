"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { PhaseBadge } from "@/components/PhaseBadge";
import {
  addArea,
  addForest,
  addNode,
  addTreeWithSeed,
  getTreeNodes,
  phaseDescriptions,
  phaseLabels,
  phaseOrder,
  saveKnowledgeForestData,
  useKnowledgeForestData
} from "@/lib/v02-store";
import { ForestVisibility, Phase } from "@/lib/v02-types";

const emptyNodeForm = {
  treeId: "",
  parentId: "",
  phase: "seed" as Phase,
  title: "",
  body: "",
  tags: ""
};

const emptyTreeForm = {
  forestId: "",
  title: "",
  summary: "",
  tags: "",
  seedTitle: "",
  seedBody: ""
};

const emptyForestForm = {
  areaId: "",
  newAreaTitle: "",
  newAreaDescription: "",
  newAreaTags: "",
  title: "",
  description: "",
  ownerLabel: "",
  tags: "",
  visibility: "private" as ForestVisibility
};

export default function CreatePage() {
  return (
    <Suspense fallback={<section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">Loading create form...</section>}>
      <CreatePageContent />
    </Suspense>
  );
}

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialForestId = searchParams.get("forestId") ?? "";
  const { data, setData } = useKnowledgeForestData();
  const [mode, setMode] = useState<"node" | "tree" | "forest">("node");
  const [nodeForm, setNodeForm] = useState(emptyNodeForm);
  const [treeForm, setTreeForm] = useState({ ...emptyTreeForm, forestId: initialForestId });
  const [forestForm, setForestForm] = useState(emptyForestForm);
  const selectedTreeId = nodeForm.treeId || data.trees[0]?.id || "";
  const selectedForestId = treeForm.forestId || initialForestId || data.forests[0]?.id || "";
  const selectedAreaId = forestForm.areaId || data.areas[0]?.id || "";

  const selectedTreeNodes = useMemo(
    () => getTreeNodes(data, selectedTreeId),
    [data, selectedTreeId]
  );

  function submitForest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const areaTitle = forestForm.newAreaTitle.trim();
    const areaResult = areaTitle
      ? addArea(data, {
          title: areaTitle,
          description: forestForm.newAreaDescription.trim() || `${areaTitle}に関するForestを束ねるAreaです。`,
          tags: splitTags(forestForm.newAreaTags)
        })
      : null;
    const baseData = areaResult?.nextData ?? data;
    const result = addForest(baseData, {
      areaId: areaResult?.area.id ?? selectedAreaId,
      title: forestForm.title.trim(),
      description: forestForm.description.trim(),
      ownerLabel: forestForm.ownerLabel.trim(),
      tags: splitTags(forestForm.tags),
      visibility: forestForm.visibility
    });
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    router.push(`/forests/${result.forest.id}`);
  }

  function submitTree(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedForestId) return;
    const result = addTreeWithSeed(data, {
      forestId: selectedForestId,
      title: treeForm.title.trim(),
      summary: treeForm.summary.trim(),
      tags: splitTags(treeForm.tags),
      seedTitle: treeForm.seedTitle.trim(),
      seedBody: treeForm.seedBody.trim()
    });
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
      tags: splitTags(nodeForm.tags)
    });
    saveKnowledgeForestData(result.nextData);
    setData(result.nextData);
    setNodeForm(emptyNodeForm);
    router.push(`/tree/${result.node.treeId}`);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
        <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
          <ChevronLeft className="h-4 w-4" />
          Dashboardへ戻る
        </Link>
        <span>/</span>
        <span>Create</span>
      </div>
      <h2 className="text-2xl font-bold text-forest-ink">Create Forest / Tree / Node</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">Forest</p>
          <p className="mt-1 text-xs leading-5 text-emerald-800">テーマやプロジェクトごとの知識空間を作ります。</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-900">Tree</p>
          <p className="mt-1 text-xs leading-5 text-blue-800">ひとつの気づきや課題を、改善・実践・仕組みへ育てる場所です。</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4">
          <p className="text-sm font-bold text-orange-900">Node</p>
          <p className="mt-1 text-xs leading-5 text-orange-800">Treeの中で育つ知識の単位です。Seed / Branch / Trial / Sigma / Systemがあります。</p>
        </div>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Forest、Tree、Nodeをこの順に育てます。Tree作成時は最初のSeed Nodeも同時に作るため、作成後すぐTree Viewに成長の起点が表示されます。
        v0.2.9では初めて触る人にも分かりやすいように、作成対象の意味を画面内で説明しています。Create画面は全体から追加する場所として使います。
      </p>

      <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
        <button className={tabClass(mode === "node")} onClick={() => setMode("node")} type="button">
          Nodeを追加
        </button>
        <button className={tabClass(mode === "tree")} onClick={() => setMode("tree")} type="button">
          Treeを作成
        </button>
        <button className={tabClass(mode === "forest")} onClick={() => setMode("forest")} type="button">
          Forestを作成
        </button>
      </div>

      {mode === "forest" && (
        <form className="mt-6 grid gap-4" onSubmit={submitForest}>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-900">Area</p>
            <p className="mt-1 text-xs leading-5 text-emerald-800">
              Areaは複数のForestを束ねる上位分類です。既存Areaを選ぶか、新しいArea名を入力して同時に作成できます。
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <Field label="既存Area">
                <select
                  className="input"
                  value={selectedAreaId}
                  onChange={(event) => setForestForm({ ...forestForm, areaId: event.target.value })}
                >
                  {data.areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="新しいArea名（任意）">
                <input
                  className="input"
                  value={forestForm.newAreaTitle}
                  onChange={(event) => setForestForm({ ...forestForm, newAreaTitle: event.target.value })}
                  placeholder="例: IT, 日常, 店舗運営, 地域活動"
                />
              </Field>
            </div>
            {forestForm.newAreaTitle.trim() && (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <Field label="新しいArea説明">
                  <input
                    className="input"
                    value={forestForm.newAreaDescription}
                    onChange={(event) => setForestForm({ ...forestForm, newAreaDescription: event.target.value })}
                  />
                </Field>
                <Field label="新しいAreaタグ（カンマ区切り）">
                  <input
                    className="input"
                    value={forestForm.newAreaTags}
                    onChange={(event) => setForestForm({ ...forestForm, newAreaTags: event.target.value })}
                  />
                </Field>
              </div>
            )}
          </div>
          <Field label="Forest名">
            <input className="input" required value={forestForm.title} onChange={(event) => setForestForm({ ...forestForm, title: event.target.value })} />
          </Field>
          <Field label="Forest説明">
            <textarea className="input min-h-28 resize-y" required value={forestForm.description} onChange={(event) => setForestForm({ ...forestForm, description: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="オーナー/用途ラベル">
              <input className="input" value={forestForm.ownerLabel} onChange={(event) => setForestForm({ ...forestForm, ownerLabel: event.target.value })} placeholder="例：公開デモ / チーム試作" />
            </Field>
            <Field label="Visibility">
              <select className="input" value={forestForm.visibility} onChange={(event) => setForestForm({ ...forestForm, visibility: event.target.value as ForestVisibility })}>
                <option value="private">private</option>
                <option value="team">team</option>
                <option value="organization">organization</option>
                <option value="public-demo">public-demo</option>
              </select>
            </Field>
          </div>
          <Field label="タグ（カンマ区切り）">
            <input className="input" value={forestForm.tags} onChange={(event) => setForestForm({ ...forestForm, tags: event.target.value })} placeholder="例：接客, 実験, 公開デモ" />
          </Field>
          <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">
            作成後、このForest詳細へ移動します。そこから続けてTreeを作成できます。
          </p>
          <SubmitButton label="Forestを作成" />
        </form>
      )}

      {mode === "tree" && (
        <form className="mt-6 grid gap-4" onSubmit={submitTree}>
          <Field label="Forest">
            <select className="input" value={selectedForestId} onChange={(event) => setTreeForm({ ...treeForm, forestId: event.target.value })}>
              {data.forests.map((forest) => (
                <option key={forest.id} value={forest.id}>
                  {data.areas.find((area) => area.id === forest.areaId)?.title ?? "General"} / {forest.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Treeタイトル">
            <input className="input" required value={treeForm.title} onChange={(event) => setTreeForm({ ...treeForm, title: event.target.value })} />
          </Field>
          <Field label="Treeサマリー">
            <textarea className="input min-h-24 resize-y" required value={treeForm.summary} onChange={(event) => setTreeForm({ ...treeForm, summary: event.target.value })} />
          </Field>
          <Field label="Treeタグ（カンマ区切り）">
            <input className="input" value={treeForm.tags} onChange={(event) => setTreeForm({ ...treeForm, tags: event.target.value })} />
          </Field>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-blue-900">最初のSeed Node</p>
                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Treeは最初のSeedから育ちます。Branch / Trial / Sigma / Systemは、Tree作成後にNode追加で育てます。
                </p>
              </div>
              <div className="rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-900">
                <span className="text-slate-500">Phase: </span>Seed / 気づき
              </div>
            </div>
            <div className="mt-3 grid gap-4">
              <Field label="最初のSeedタイトル">
                <input className="input" required value={treeForm.seedTitle} onChange={(event) => setTreeForm({ ...treeForm, seedTitle: event.target.value })} />
              </Field>
              <Field label="最初のSeed本文">
                <textarea className="input min-h-28 resize-y" required value={treeForm.seedBody} onChange={(event) => setTreeForm({ ...treeForm, seedBody: event.target.value })} />
              </Field>
            </div>
          </div>
          <SubmitButton label="TreeとSeedを作成して表示" />
        </form>
      )}

      {mode === "node" && (
        <form className="mt-6 grid gap-4" onSubmit={submitNode}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="追加先Tree">
              <select className="input" value={selectedTreeId} onChange={(event) => setNodeForm({ ...nodeForm, treeId: event.target.value, parentId: "" })}>
                {data.trees.map((tree) => (
                  <option key={tree.id} value={tree.id}>
                    {tree.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phase">
              <select className="input" value={nodeForm.phase} onChange={(event) => setNodeForm({ ...nodeForm, phase: event.target.value as Phase })}>
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
          <SubmitButton label="Nodeを追加してTree Viewへ" />
        </form>
      )}
    </section>
  );
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function tabClass(active: boolean) {
  return `rounded-md px-2 py-2 text-xs font-bold transition sm:text-sm ${
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
