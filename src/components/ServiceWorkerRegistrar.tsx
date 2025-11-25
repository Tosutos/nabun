"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const cleanedFlag = typeof sessionStorage !== "undefined" && sessionStorage.getItem("sw-cleaned");

    const cleanup = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        const hadSW = regs.length > 0;
        await Promise.all(regs.map((r) => r.unregister()));

        let hadCache = false;
        if ("caches" in window) {
          const keys = await caches.keys();
          hadCache = keys.length > 0;
          await Promise.all(keys.map((k) => caches.delete(k)));
        }

        if (!cleanedFlag && (hadSW || hadCache)) {
          sessionStorage.setItem("sw-cleaned", "1");
          window.location.reload();
        }
      } catch (err) {
        console.warn("SW cleanup failed", err);
      }
    };
    cleanup();
  }, []);

  return null;
}
