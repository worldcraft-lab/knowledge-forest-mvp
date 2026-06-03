"use client";

import Link from "next/link";
import type React from "react";
import { Bell, Compass, Home, Leaf, Plus, Search, User } from "lucide-react";
import { KnowledgeFlow } from "./KnowledgeFlow";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/forests", label: "Forests", icon: Compass },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Notice", icon: Bell },
  { href: "/me", label: "Me", icon: User }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen pb-32 lg:pb-0">
      <div className="mx-auto flex w-full max-w-7xl gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-soft backdrop-blur lg:block">
          <Brand />
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/create"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            title="Area / Forest / Tree / Nodeを作成"
            aria-label="Area / Forest / Tree / Nodeを作成"
          >
            <Plus className="h-4 w-4" />
            Create
          </Link>
          <div className="mt-7">
            <KnowledgeFlow compact />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 flex items-center justify-between lg:hidden">
            <Brand />
            <Link
              className="rounded-lg bg-forest-ink p-3 text-white"
              href="/create"
              aria-label="Area / Forest / Tree / Nodeを作成"
              title="Area / Forest / Tree / Nodeを作成"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </header>
          {children}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(38,50,63,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
        <Leaf className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500">Knowledge Forest</p>
        <h1 className="text-xl font-bold tracking-normal text-forest-ink">MVP v0.2.5</h1>
      </div>
    </Link>
  );
}
