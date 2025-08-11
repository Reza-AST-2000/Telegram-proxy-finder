const CACHE_NAME = 'proxy-finder-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  // Dependencies
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap'
];

// Installation: Caching the core files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force the new service worker to activate immediately
      .catch((error) => console.error('Service Worker: Caching failed during install:', error))
  );
});

// Activation: Cleaning up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim(); // Take control of unmanaged pages
    })
  );
});

// Fetch: Serving from cache first, then network
self.addEventListener('fetch', (event) => {
  // Prevent caching the dynamic proxy list to keep it fresh
  if (event.request.url.includes('hookzof/socks5_list')) {
      return; // Do nothing, let it go to the network
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return the cached response
        if (response) {
          return response;
        }

        // Otherwise, fetch from the network
        return fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Clone the response because it's a stream and can only be used once
          const responseToCache = networkResponse.clone();

          // Open the cache and store the network response
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        }).catch(() => {
            // Fallback for when both cache and network fail
            console.log('Service Worker: Offline fallback triggered');
            // Here you could return a simple offline page if you have one
        });
      })
  );
});
