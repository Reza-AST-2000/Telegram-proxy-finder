// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Cache صفحات و فایل‌های استاتیک (HTML, CSS, JS, Images)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'document' || 
                   request.destination === 'script' || 
                   request.destination === 'style' || 
                   request.destination === 'image' || 
                   request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // کش کردن درخواست پروکسی‌ها (API)
  workbox.routing.registerRoute(
    ({url}) => url.href.includes('mtproto.json'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'proxies-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 30, // ۳۰ دقیقه
        }),
      ],
    })
  );

  // صفحه fallback آفلاین
  const FALLBACK_HTML_URL = '/offline.html';
  workbox.precaching.precacheAndRoute([{url: FALLBACK_HTML_URL, revision: null}]);

  workbox.routing.setCatchHandler(async ({event}) => {
    if (event.request.destination === 'document') {
      return caches.match(FALLBACK_HTML_URL);
    }
    return Response.error();
  });

} else {
  console.log(`Boo! Workbox didn't load 😢`);
}
