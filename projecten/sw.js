// Offline: eerst het netwerk (hooguit 3 seconden), anders de opgeslagen kopie. Alleen eigen bestanden, alleen goede antwoorden.
const CACHE = "futureme-projecten-v3";
const NODIG = ["./index.html"], ERBIJ = ["./", "./manifest.webmanifest", "./icoon-180.png", "./icoon-512.png"];
self.addEventListener("install", e => {
  // De app zelf is nodig; de rest los, zodat één ontbrekend icoon de offline kopie niet tegenhoudt.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(NODIG).then(() => Promise.allSettled(ERBIJ.map(u => c.add(u))))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  const uitCache = () => caches.match(e.request).then(r => r || caches.match("./index.html"));
  const netwerk = fetch(e.request);
  // Een goed antwoord wordt bewaard; een fout (404, 500, inlogpagina van een wifi) maakt plaats voor de opgeslagen kopie.
  const vers = netwerk.then(r => {
    if (r.ok) { const kopie = r.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, kopie))); return r; }
    return uitCache().then(c => c || r);
  }).catch(uitCache);
  const traag = new Promise(ok => setTimeout(ok, 3000)).then(() => uitCache()).then(c => c || vers);
  e.respondWith(Promise.race([vers, traag]));
});
