import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "NABUN",
  description: "실시간 스캔 기반 분리배출 안내와 리워드 앱",
  manifest: "/manifest.webmanifest",
  themeColor: "#3ad29f"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
        <ServiceWorkerRegistrar />
        <BottomNav />
      </body>
    </html>
  );
}
