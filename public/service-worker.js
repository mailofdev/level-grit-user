const CACHE_NAME = 'levelgrit-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/192.png',
  '/512.png',
  '/180.png'
];

// ✅ Install event - pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          // Silently handle cache errors
        });
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// ✅ Activate event - remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Don't call clients.claim() to prevent refresh loops
  // Service worker will take control on next page navigation
});

// ✅ Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip service worker and chrome-extension requests
  if (
    event.request.url.includes('/service-worker.js') ||
    event.request.url.includes('chrome-extension://')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network request succeeds, clone and cache it
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache same-origin responses
            if (networkResponse.type === 'basic') {
              cache.put(event.request, responseToCache).catch(() => {
                // Ignore cache errors
              });
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          // For navigation requests, always return index.html if cache misses
          if (event.request.mode === 'navigate' && !cachedResponse) {
            return caches.match('/index.html');
          }
          return cachedResponse;
        });
      })
  );
});

// ✅ Push event - handle background push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.notification?.title || 'New Message';
  const options = {
    body: data.notification?.body || data.data?.message || 'You have a new message',
    icon: data.notification?.icon || '/logo192.png',
    badge: '/logo192.png',
    tag: data.data?.messageId || 'message',
    requireInteraction: false,
    data: data.data || {},
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ✅ Notification click event - open app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let urlToOpen = '/';

  if (notificationData?.trainerId) {
    urlToOpen = `/client-messages/${notificationData.trainerId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});