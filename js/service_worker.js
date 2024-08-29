var CACHE_NAME = 'stargateportal-cache-v1';
var urlsToCache = [
  '/index.html',
  '/css/button.css',
  '/images/bedge-grunge.png',
  '/images/giza.WEBP',
  '/images/teotihuacan.WEBP',
  '/images/gobekli-tepe.WEBP',
  '/images/nibiru.WEBP',
  '/images/pleiades.WEBP',
  '/images/sirius.WEBP',
  '/fonts/obelisk-mxvv-font/ObeliskMxvvRegular-RGj6.ttf',
];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return Promise.all(urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.error('Failed to cache:', url, error);
            });
          }));
        })
    );
  });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(
        function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});