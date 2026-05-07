const CACHE_NAME = 'fuel-app-shell-v5';
const PRECACHE_URLS = [
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/flo-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => null)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

function canCacheRequest(request) {
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return false;
  }

  if (url.origin !== self.location.origin) {
    return false;
  }

  if (request.mode === 'navigate') {
    return true;
  }

  if (url.pathname.startsWith('/api/')) {
    return false;
  }

  return [
    'document',
    'script',
    'style',
    'image',
    'font',
    'manifest',
  ].includes(request.destination);
}

async function cacheResponse(request, response) {
  if (!canCacheRequest(request)) return;
  if (!response || response.status !== 200) return;

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (!canCacheRequest(request)) return;

  // Cache visited pages, so refresh works offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          await cacheResponse(request, response);
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);

          if (cachedPage) {
            return cachedPage;
          }

          const offlinePage = await caches.match('/offline');

          if (offlinePage) {
            return offlinePage;
          }

          return new Response('You are offline.', {
            headers: {
              'Content-Type': 'text/plain',
            },
          });
        })
    );

    return;
  }

  // Cache JS, CSS, images, fonts after first load
  event.respondWith(
    fetch(request)
      .then(async (response) => {
        await cacheResponse(request, response);
        return response;
      })
      .catch(async () => {
        const cachedAsset = await caches.match(request);

        if (cachedAsset) {
          return cachedAsset;
        }

        return Response.error();
      })
  );
});
