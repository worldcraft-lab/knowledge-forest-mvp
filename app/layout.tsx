import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knowledge Forest MVP v0.2.10",
  description: "Dashboardを作業開始ページとして整理し、詳しい価値説明をGuideへ集約したLocalStorage MVP v0.2.10"
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
