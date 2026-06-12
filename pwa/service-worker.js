// Learn & Unblock — Service Worker
// Permite instalar la app y usarla sin conexión

const CACHE_NAME = 'learn-unblock-cache-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './audio-system.js',
  './realtime-lock.js',
  './audio-integration.js',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;700;900&display=swap'
];

// Instalación: precachear los archivos principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('No se pudo cachear:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, con fallback a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Cachear respuestas válidas de mismo origen para uso futuro
          if (
            response &&
            response.status === 200 &&
            event.request.method === 'GET'
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
