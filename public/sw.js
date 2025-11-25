self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 기존 캐시 제거
      if ("caches" in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // 스스로 등록 해제
      await self.registration.unregister();
      // 열려 있는 클라이언트 강제 새로고침
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // 더 이상 캐싱하지 않음
  return;
});
