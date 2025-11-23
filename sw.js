// Minimal Service Worker to enable "Add to Home Screen"
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Passthrough for all requests to ensure dynamic app works in all environments
  e.respondWith(fetch(e.request));
});