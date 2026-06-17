const CACHE_NAME = 'douane-prep-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap'
];

// Install event: cache all core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all core assets');
      // Using Promise.allSettled or caching individual items so that if one fails (e.g. offline during dev), the rest are still cached
      return Promise.allSettled(
        ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn('[Service Worker] Failed to cache:', asset, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve cached content if available, else fetch from network
self.addEventListener('fetch', (e) => {
  // Only handle GET requests and local/http protocols
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but fetch in the background to update cache (stale-while-revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse);
            });
          }
        }).catch(() => { /* Ignore offline fetch errors */ });

        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it dynamically
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Only cache basic responses or Google Fonts/gstatic assets
        const url = e.request.url;
        const isGoogleAsset = url.includes('googleapis') || url.includes('gstatic');
        if (networkResponse.type === 'basic' || isGoogleAsset) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Fallback for offline navigate requests
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
