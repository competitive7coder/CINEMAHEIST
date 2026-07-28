const CACHE_NAME = "streamhub-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png"
];

// Install Service Worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch events
self.addEventListener("fetch", (event) => {
  // Only handle same-origin GET requests (local assets, JS, CSS, HTML)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests (like TMDB images and API calls)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
