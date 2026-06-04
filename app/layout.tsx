import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knowledge Forest MVP v0.2.11",
  description: "Tree詳細にスマホ向けTimeline ViewとMap View切替を追加したLocalStorage MVP v0.2.11"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
