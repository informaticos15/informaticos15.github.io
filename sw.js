const CACHE = 'i15-v4';
const SHELL = ['./', './index.html', './styles.css', './script.js', './manifest.json', './icon-192.png', './icon-512.png'];
const CDN_OK = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', e => {
  // cada archivo por separado: si uno falta, los demás se guardan igual
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // los datos de Google Sheets siempre van a la red (la página guarda su propia última copia)
  if (url.hostname.endsWith('google.com') && url.pathname.indexOf('/spreadsheets/') > -1) return;

  if (url.origin === location.origin) {
    // archivos del sitio: red primero (así las actualizaciones llegan de inmediato) y caché si no hay internet
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return res;
      }).catch(() => caches.match(req).then(m => m || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
  } else if (CDN_OK.indexOf(url.hostname) > -1) {
    // fuentes y librerías: caché primero, se refresca en segundo plano
    e.respondWith(
      caches.match(req).then(cacheado => {
        const red = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
          return res;
        }).catch(() => cacheado);
        return cacheado || red;
      })
    );
  }
});
