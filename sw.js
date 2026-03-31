const CACHE_NAME = `freight-rate-v16`;
const urlsToCache = [
  `./`,
  `./index.html`,
  `./manifest.json`,
  `./icon-192.png`,
  `./icon-512.png`,
  `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`,
  `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`,
  `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
];

self.addEventListener(`install`, event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener(`activate`, event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('http') && !event.request.url.includes(location.hostname)) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
