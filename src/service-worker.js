self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalado");
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
        // Agrega aquí otros recursos que quieras cachear
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== "v1") {
            console.log("Service Worker: Limpiando caché antigua");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching");
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
