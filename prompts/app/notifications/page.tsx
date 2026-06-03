"use client";

import Link from "next/link";
import { ArrowRight, Bell, ChevronLeft } from "lucide-react";
import { formatDate, saveKnowledgeForestData, useKnowledgeForestData } from "@/lib/v02-store";
import { NotificationItem } from "@/lib/v02-types";

export default function NotificationsPage() {
  const { data, setData } = useKnowledgeForestData();

  function openNotification(item: NotificationItem) {
    if (item.read) return;
    const nextData = {
      ...data,
      notifications: data.notifications.map((notice) =>
        notice.id === item.id ? { ...notice, read: true } : notice
      )
    };
    saveKnowledgeForestData(nextData);
    setData(nextData);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
        <Link className="inline-flex items-center gap-1 text-blue-700" href="/">
          <ChevronLeft className="h-4 w-4" />
          Dashboardへ戻る
        </Link>
        <span>/</span>
        <span>Notifications</span>
      </div>
      <h2 className="text-2xl font-bold text-forest-ink">Local Notifications</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        MVP v0.2.4では実通知ではなく、次に見るとよいTreeへ移動するためのローカル通知として表示します。
      </p>
      <div className="mt-5 space-y-3">
        {data.notifications.map((item) => {
          const href = getNotificationHref(item);
          return (
            <Link
              key={item.id}
              href={href}
              onClick={() => openNotification(item)}
              className="group flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-forest-mist p-4 transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
              aria-label={`${item.title}を開く`}
              title={`${item.title}を開く`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-700">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-forest-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {formatDate(item.createdAt)} {item.read ? "/ opened" : ""}
                </p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-600" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getNotificationHref(item: NotificationItem) {
  if (item.relatedTreeId && item.relatedNodeId) {
    return `/tree/${item.relatedTreeId}?node=${item.relatedNodeId}`;
  }
  if (item.relatedTreeId) return `/tree/${item.relatedTreeId}`;
  if (item.id.includes("sigma")) return "/tree/tree-student-review-loop";
  if (item.id.includes("stalled")) return "/tree/tree-lunch-seat-flow";
  return "/tree/tree-first-service-flow";
}
