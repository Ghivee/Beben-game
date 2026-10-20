// Simpan file game supaya bisa dimainkan tanpa internet. Gambar dan sprite animasi
// Pokémon disimpan saat pertama kali tampil.
const CACHE = 'laut-v2';
const SHELL = ['./', 'index.html', 'game.js', 'dex.js', 'manifest.webmanifest',
  'icons/apple-touch-icon.png', 'icons/favicon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
const FAVORITES = [1, 4, 7, 25, 39, 50, 54, 129, 132, 133, 142, 143, 147, 150, 151, 172, 175, 201, 321, 393, 778];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL).then(() => c.addAll(FAVORITES.map(id => `img/${id}.webp`)).catch(() => {})))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const CACHED_HOSTS = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|raw\.githubusercontent\.com)$/;

// Halaman dan kode: versi terbaru kalau ada internet, kalau tidak pakai simpanan.
// Gambar, sprite, font: pakai simpanan dulu, unduh kalau belum ada.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  if (!same && !CACHED_HOSTS.test(url.hostname)) return;
  const fresh = same && (req.mode === 'navigate' || /\.(js|html|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/'));
  if (fresh) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? 'index.html' : req, copy)); }
      return res;
    }).catch(() => caches.match(req.mode === 'navigate' ? 'index.html' : req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
