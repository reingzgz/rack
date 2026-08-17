/* Control de palés — funcionamiento sin cobertura.
   Sube VERSION al publicar cambios y las PDAs se actualizan solas. */
const VERSION = 'palets-v12';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      // cache:'reload' evita guardar una copia ya caducada del servidor
      .then(c => c.addAll(ARCHIVOS.map(u => new Request(u, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  // El HTML se pide siempre al servidor saltándose la caché del navegador,
  // porque GitHub Pages manda los archivos con diez minutos de validez.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(new Request(req.url, {cache: 'reload', credentials: 'same-origin'}))
        .then(r => {
          const copia = r.clone();
          caches.open(VERSION).then(c => c.put(req, copia));
          return r;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r && r.status === 200) {
        const copia = r.clone();
        caches.open(VERSION).then(c => c.put(req, copia));
      }
      return r;
    }))
  );
});
