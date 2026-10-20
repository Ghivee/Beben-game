// Simpan semua file game supaya bisa dimainkan tanpa internet.
const CACHE = 'laut-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest',
  'icons/apple-touch-icon.png',
  'icons/favicon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'img/1.webp',
  'img/104.webp',
  'img/111.webp',
  'img/116.webp',
  'img/118.webp',
  'img/120.webp',
  'img/129.webp',
  'img/130.webp',
  'img/131.webp',
  'img/133.webp',
  'img/134.webp',
  'img/138.webp',
  'img/140.webp',
  'img/142.webp',
  'img/143.webp',
  'img/149.webp',
  'img/25.webp',
  'img/39.webp',
  'img/4.webp',
  'img/54.webp',
  'img/7.webp',
  'img/72.webp',
  'img/86.webp',
  'img/98.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Halaman: ambil versi terbaru kalau ada internet, kalau tidak pakai simpanan.
// File lain (gambar, ikon, font): pakai simpanan dulu, unduh kalau belum ada.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !font) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put('index.html', copy));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  })));
});
