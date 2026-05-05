const CACHE_NAME = 'fuel-app-shell-v4';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function canCacheRequest(request) {
  const url = new URL(request.url);

  return (
    request.method === 'GET' &&
    (url.protocol === 'http:' || url.protocol === 'https:')
  );
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

          return new Response(
            '<h1>You are offline</h1><p>This page was not saved yet. Open it once with internet first.</p>',
            {
              headers: {
                'Content-Type': 'text/html',
              },
            }
          );
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