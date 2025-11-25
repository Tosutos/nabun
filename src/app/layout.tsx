import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "NABUN",
  description: "실시간 분리배출 안내와 리워드를 제공해요",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
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
