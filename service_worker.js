var CACHE_NAME = 'stargateportal-cache-v7';
var urlsToCache = [
  './',
  'index.html',
  'offline.html',
  'css/button.css',
  'fonts/obelisk-mxvv-font/ObeliskMxvvRegular-RGj6.ttf',
  'images/bedge-grunge.png',

  'images/animated/giza_animated.gif',
  'images/animated/teotihuacan_animated.gif',
  'images/animated/gobekli-tepe_animated.gif',
  'images/animated/nibiru_animated.gif',
  'images/animated/pleiades_animated.gif',
  'images/animated/sirius_animated.gif',

  // 'images/static/giza.WEBP',
  // 'images/static/teotihuacan.WEBP',
  // 'images/static/gobekli-tepe.WEBP',
  // 'images/static/nibiru.WEBP',
  // 'images/static/pleiades.WEBP',
  // 'images/static/sirius.WEBP',

  'music/transition.mp3',
  'music/giza.mp3',
  'music/teotihuacan.mp3',
  'music/gobekli_tepe.mp3',
  'music/nibiru.mp3',
  'music/lemuria.mp3',
  'music/sirius.mp3',
];

// Set to true to enable logging, false to disable
const loggingEnabled = true;

function log(...args) {
  if (loggingEnabled) {
    console.log(...args);
  }
}

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
            log('installing cache : ' + CACHE_NAME);
          return Promise.all(urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.error('Failed to cache:', url, error);
            });
          }));
        })
    );
  });

  self.addEventListener('fetch', event => {
    log('Fetching:', event.request.url);
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Log the matched response
          if (response) {
            log('Serving from cache:', response.url);
            return response;
          }
          // Log if fetching from network
          console.log('Fetching from network:', event.request.url);
          return fetch(event.request).catch(() => {
            log('Network request failed. Serving offline page.');
            return caches.match('/stargate-portal-book-of-secrets/offline.html');
          });
        })
        .catch(error => {
          console.error('Fetch failed:', error);
          return caches.match('/stargate-portal-book-of-secrets/offline.html');
        })
    );
  });

  self.addEventListener('activate', event => {
    log('activating cache : ' + CACHE_NAME);
    event.waitUntil(self.clients.claim());
  });

  /*
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
*/