"use client";

import { Bell } from "lucide-react";
import { formatDate, useKnowledgeForestData } from "@/lib/v02-store";

export default function NotificationsPage() {
  const { data } = useKnowledgeForestData();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <h2 className="text-2xl font-bold text-forest-ink">Local Notifications</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        MVP v0.2では実通知はありません。Treeの成長や停滞を示すローカルの疑似通知です。
      </p>
      <div className="mt-5 space-y-3">
        {data.notifications.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 bg-forest-mist p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-700">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-forest-ink">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
