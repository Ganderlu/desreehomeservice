self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.notification?.title || 'Desree';
  const options = {
    body: data.notification?.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
