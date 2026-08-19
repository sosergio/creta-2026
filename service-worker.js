const CACHE_NAME = "creta2026-v3";
const IMAGE_SLUGS = ["knossos", "rethymno", "chania", "elafonissi", "margarites", "anogeia", "marathi", "almyrida"];
const MAP_SLUGS = [
  "platanes", "bali", "elafonissi", "episkopi", "marathi", "almyrida",
  "knossos", "margarites", "anogeia", "rethymno-old-town", "chania-old-town",
  "taverna-knossos", "taverna-goules", "antikristo-anogeia-axos", "taverna-thalassi", "asikiko"
];
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  ...IMAGE_SLUGS.map((s) => `./images/${s}.jpg`),
  ...IMAGE_SLUGS.map((s) => `./images/${s}-thumb.jpg`),
  ...MAP_SLUGS.map((s) => `./images/maps/${s}.jpg`)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
