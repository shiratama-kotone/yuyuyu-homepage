self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'https://cdn.glitch.global/b063afd9-f3c5-4a81-a445-da854de0fa7a/yuyuyu-new-visual.png?v=1739947847432',
    badge: 'https://cdn.glitch.global/b063afd9-f3c5-4a81-a445-da854de0fa7a/yuyuyu-new-visual.png?v=1739947847432'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
