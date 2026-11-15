// Offline support: keeps a copy of the whole app on the device.
// Opens from the saved copy straight away, and quietly fetches any update in the background
// (the update shows the next time the app is opened).
// When you add a file, add it to FILES and change the number in CACHE.
const CACHE = "year4-maths-v4";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./shared/style.css", "./shared/progress.js", "./shared/engine.js", "./shared/draw.js", "./shared/topic.js",
  "./times-tables/", "./times-tables/index.html",
  "./multiply-divide/", "./multiply-divide/index.html", "./multiply-divide/skills.js",
  "./number/", "./number/index.html", "./number/skills.js",
  "./add-subtract/", "./add-subtract/index.html", "./add-subtract/skills.js",
  "./fractions/", "./fractions/index.html", "./fractions/skills.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      const fresh = fetch(e.request)
        .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
