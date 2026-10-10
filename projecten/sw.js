// Offline: eerst het netwerk (hooguit 3 seconden), anders de opgeslagen kopie. Alleen eigen bestanden, alleen goede antwoorden.
const CACHE = "futureme-projecten-v2";
const BESTANDEN = ["./", "./index.html", "./manifest.webmanifest", "./icoon-180.png", "./icoon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  const uitCache = () => caches.match(e.request).then(r => r || caches.match("./index.html"));
  const netwerk = fetch(e.request).then(r => { if (r.ok) { const kopie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, kopie)); } return r; });
  const traag = new Promise(ok => setTimeout(ok, 3000)).then(uitCache);
  e.respondWith(Promise.race([netwerk.catch(uitCache), traag]).then(r => r || uitCache()));
});
