const CACHE_NAME = `freight-rate-v7`;
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
});

self.addEventListener(`fetch`, event => {
  // Instantly bypass cache for maps and remote APIs to maintain lightning speed
  if (event.request.url.startsWith('http') && !event.request.url.includes(location.hostname)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});
