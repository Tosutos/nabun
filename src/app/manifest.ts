import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NABUN",
    short_name: "NABUN",
    description: "실시간 분리배출 스캔과 리워드를 제공하는 NABUN",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0e1a1f",
    theme_color: "#3ad29f",
    lang: "ko",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ]
  };
}
