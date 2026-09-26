const CACHE = 'ashes-v3.7.6';
const FONTS = 'ashes-fonts'; // Google Fonts, kept across versions so the typography survives offline play
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
/* A new version installs and then WAITS. The page shows "Update ready"; tapping it posts 'skip', and only then
   does the new version take over (the page reloads itself on controllerchange). Never skipWaiting on install. */
/* the typography, fetched at install so the first offline launch already has it: the stylesheet the page asks for (same URL,
   so it matches), and the Latin font files it lists. Best effort: offline or blocked, the install still succeeds. */
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Alegreya+Sans+SC:wght@500;700&display=swap';
const warmFonts = () => caches.open(FONTS).then(c => fetch(FONT_CSS).then(r => { if (!r.ok) return ''; c.put(FONT_CSS, r.clone()); return r.text(); })
  .then(css => { const urls = []; String(css || '').replace(/\/\* latin \*\/[^}]*?url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g, (_, u) => urls.push(u));
    return Promise.all(urls.map(u => c.match(u).then(hit => hit || fetch(u).then(res => res.ok ? c.put(u, res) : null)))); })).catch(() => {});
self.addEventListener('install', e => {
  e.waitUntil(Promise.all([caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache:'reload'})))), warmFonts()])); // past the HTTP cache: a new version must not precache the old page
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const css = url.hostname === 'fonts.googleapis.com', woff = url.hostname === 'fonts.gstatic.com';
  if (css || woff) { // the font files never change at a URL: cache first. The stylesheet (opaque, no-cors): stale-while-revalidate.
    e.respondWith(caches.open(FONTS).then(c => c.match(e.request).then(hit => {
      if (hit && woff) return hit;
      const net = fetch(e.request).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); c.put(e.request, cp).catch(() => {}); } return res; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net.catch(() => new Response('', {status:504}));
    })));
    return;
  }
  if (url.origin !== location.origin) return; // nothing else leaves the origin; let the browser handle it
  // the game itself: cache first (it starts offline and instantly), refreshed in the background
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => {
    const net = fetch(e.request).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {}); } return res; });
    if (r) { e.waitUntil(net.catch(() => {})); return r; }
    const miss = () => new Response('', {status:504});
    return net.catch(() => e.request.mode === 'navigate' ? caches.match('./index.html').then(x => x || miss()) : miss());
  }));
});
