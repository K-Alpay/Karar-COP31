const CACHE_NAME = 'eko-burokrat-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/start_bg_split.png',
  './images/office_desktop_cutout.png',
  './images/office_mobile_cutout.png',
  './images/zeynep.png',
  './images/baskan.png',
  './images/ali.png',
  './images/helga.png',
  './images/tarik.png',
  './images/selin.png',
  './images/merve.png',
  './images/baris.png',
  './images/ekrem.png',
  './images/ece.png',
  './images/kerem.png',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy for HTML / navigation so updates are instant
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first falling back to network for images / static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
