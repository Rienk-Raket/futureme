// End-to-end tests voor "Je gegevens": exporteren en importeren (sectie 84).
// Start een eigen webserver op de repo-map. Gebruik:
//   NODE_PATH=<map met node_modules/playwright> node tests/gegevens.e2e.cjs
// Opties (env): CHROMIUM=<pad naar chrome>, SCHERMEN=<map voor schermafbeeldingen> (standaard tests/uitvoer)
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, ".."), UIT = process.env.SCHERMEN || path.join(ROOT, "tests", "uitvoer");
fs.mkdirSync(UIT, { recursive: true });
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]) === "/" ? "index.html" : decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": f.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream" }); fs.createReadStream(f).pipe(r);
});
let ok = 0, fout = 0;
const check = (naam, v, extra) => { if (v) ok++; else fout++; console.log((v ? "✔ " : "✘ ") + naam + (extra ? "  " + extra : "")); };
const wacht = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const BASIS = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--no-sandbox"] });
  const fouten = [];
  const nieuw = async o => { const c = await browser.newContext(Object.assign({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true }, o || {})); const p = await c.newPage();
    p.on("pageerror", e => fouten.push(e.message)); p.on("console", m => { if (m.type() === "error" && !/favicon|404/.test(m.text())) fouten.push(m.text()); }); await p.goto(BASIS + "/index.html"); await wacht(1300); return { c, p }; };
  const meer = async p => { await p.evaluate(() => { V.briefingGezien = true; ga("meer"); }); await wacht(350); };
  // Een export "opvangen" zoals de deelknop dat doet
  const vangExport = p => p.evaluate(async () => { let tekst = null, naam = null; const _d = deelOfDownload; deelOfDownload = async (n, t) => { naam = n; tekst = t; return "gedeeld"; }; await exportJSON(true); deelOfDownload = _d; return { naam, tekst }; });
  const kiesBestand = async (p, tekst, modus) => {
    const fc = p.waitForEvent("filechooser");
    await p.click(`#blad [data-act="backup-import"][data-modus="${modus}"]`);
    const ch = await fc; await ch.setFiles({ name: "export.json", mimeType: "application/json", buffer: Buffer.from(tekst) }); await wacht(900);
  };
  const png1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  /* ---------- Bron-app met gegevens ---------- */
  const A = await nieuw();
  await A.p.evaluate(async png => {
    const nu = new Date().toISOString(), v = vandaagISO();
    for (let i = 0; i < 5; i++) await bewaar("taken", { id: "t" + i, titel: "Taak " + i, af: i === 0, datum: v, gemaakt: nu, volgorde: i, labels: [], personen: [], subtaken: [], bijlagen: [], hangtAf: [] });
    await bewaar("projecten", { id: "p1", naam: "Verbouwing", gemaakt: nu });
    await bewaar("uitgaven", { id: "u1", bedrag: 12.5, datum: v, omschrijving: "Koffie", categorie: "overig" });
    await bewaar("lj_lijsten", { id: "L", naam: "Films", soort: "film" }); await bewaar("lj_items", { id: "i1", lijstId: "L", titel: "Dune", status: "klaar", score: 9 });
    const bin = atob(png), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    await bewaar("bijlagen", { id: "b1", naam: "pixel.png", type: "image/png", ts: nu, blob: new Blob([bytes], { type: "image/png" }) });
    await zetInst("thema", "donker"); await zetInst("tekst", "groot"); await zetInst("km_sleutel", "sk-ant-GEHEIM-123");
  }, png1);

  /* ---------- Het blok bovenaan Meer ---------- */
  await meer(A.p);
  check("Meer: 'Je gegevens' staat bovenaan met Exporteren en Importeren", await A.p.evaluate(() => { const s = document.querySelector("#scherm"); const b = s.querySelector(".gv-blok"); return !!b && s.firstElementChild === b && /Exporteren/.test(b.textContent) && /Importeren/.test(b.textContent) && /nog nooit/.test(b.textContent); }));
  check("Meer: de bestaande kaarten (o.a. Keuzemachine, Wishlist) staan er nog", await A.p.evaluate(() => !!document.querySelector('#scherm .menu-kaart[data-view="keuze"]') && !!document.querySelector('#scherm .menu-kaart[data-view="wishlist"]')));
  await A.p.screenshot({ path: path.join(UIT, "gegevens-1-meer.png") });

  /* ---------- Exporteren ---------- */
  const ex = await vangExport(A.p), json = JSON.parse(ex.tekst);
  check(`export: bestandsnaam ${ex.naam}`, /^futureme-backup-\d{4}-\d{2}-\d{2}-compleet\.json$/.test(ex.naam));
  const aantalWinkels = await A.p.evaluate(() => Object.keys(WINKELS).length);
  check(`export: alle ${aantalWinkels} opslagplekken zitten erin`, Object.keys(json.data).length === aantalWinkels && ["taken", "lj_items", "km_dilemmas", "instellingen", "bijlagen"].every(k => k in json.data));
  check("export: foto's en bijlagen zitten er compleet in (base64)", json.data.bijlagen.length === 1 && json.data.bijlagen[0].data && json.data.bijlagen[0].data.length > 20);
  check("export: de API-sleutel zit er niet in", !ex.tekst.includes("GEHEIM-123") && !ex.tekst.includes("km_sleutel"));
  await meer(A.p);
  check("na een export staat de datum van de laatste export in het blok", await A.p.evaluate(() => !/nog nooit/.test(document.querySelector(".gv-blok").textContent) && /om \d{2}:\d{2}/.test(document.querySelector(".gv-blok").textContent)));
  const knop = await A.p.evaluate(() => { const b = document.querySelector('.gv-blok [data-act="backup-json"]').getBoundingClientRect(), i = document.querySelector('.gv-blok [data-act="gv-import"]').getBoundingClientRect(); return [b.height, i.height, b.width, i.width]; });
  check("knoppen zijn minstens 44 px hoog en breed", knop.every(n => n >= 44), knop.map(Math.round).join("×"));

  /* ---------- Het importblad ---------- */
  await A.p.click('[data-act="gv-import"]'); await wacht(500);
  check("importblad: twee keuzes (Samenvoegen, Alles vervangen) en de tip", await A.p.evaluate(() => document.querySelector("#blad").classList.contains("open") && !!document.querySelector('#blad [data-modus="samenvoegen"]') && !!document.querySelector('#blad [data-modus="vervangen"]') && /Twijfel je\? Kies Samenvoegen/.test(document.querySelector("#blad").textContent)));
  await A.p.screenshot({ path: path.join(UIT, "gegevens-2-importblad.png") });
  await A.p.evaluate(() => bladSluit()); await wacht(300);

  /* ---------- Samenvoegen in een lege app (roundtrip) ---------- */
  const B = await nieuw();
  await meer(B.p);
  await B.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(B.p, ex.tekst, "samenvoegen");
  const tel = p => p.evaluate(() => ({ taken: S.taken.length, afgerond: S.taken.filter(t => t.af).length, ids: S.taken.map(t => t.id).sort().join(), proj: S.projecten.length, uitg: S.uitgaven.length, lj: S.lj_items.length, bij: S.bijlagen.length, thema: inst("thema"), tekst: inst("tekst"), sleutel: inst("km_sleutel", null) }));
  const tb = await tel(B.p);
  check("importblad sluit na de keuze en het bestand wordt ingelezen", await B.p.evaluate(() => !document.querySelector("#blad").classList.contains("open")) && tb.taken >= 5);
  check("samenvoegen in een lege app: taken, projecten, uitgaven en lijstjes terug", ["t0", "t1", "t2", "t3", "t4"].every(id => tb.ids.includes(id)) && tb.proj >= 1 && tb.uitg === 1 && tb.lj === 1 && await B.p.evaluate(() => !!vind("projecten", "p1") && !!vind("uitgaven", "u1") && !!vind("lj_items", "i1")));
  const bijData = await B.p.evaluate(async () => { const b = vind("bijlagen", "b1"); if (!b) return null; const buf = new Uint8Array(await b.blob.arrayBuffer()); return { type: b.blob.type, len: buf.length, kop: Array.from(buf.slice(0, 4)).join() }; });
  check("de foto is byte voor byte terug (PNG-kop)", bijData && bijData.kop === "137,80,78,71" && bijData.len > 50);
  check("instellingen zijn teruggezet en meteen toegepast (donker thema, grote tekst)", tb.thema === "donker" && tb.tekst === "groot" && await B.p.evaluate(() => document.documentElement.dataset.thema === "donker" && document.documentElement.dataset.tekst === "groot"));
  check("de API-sleutel komt niet mee", tb.sleutel === null);

  /* ---------- Samenvoegen: houdt wat er is, geen dubbelen ---------- */
  await B.p.evaluate(async () => { await zetInst("thema", "licht"); await bewaar("taken", { id: "eigen", titel: "Mijn eigen taak", af: false, datum: null, gemaakt: new Date().toISOString(), volgorde: 99, labels: [], personen: [], subtaken: [], bijlagen: [], hangtAf: [] });
    await bewaar("taken", { id: "dub", titel: "Taak 2", af: false, datum: vandaagISO(), gemaakt: new Date().toISOString(), volgorde: 100, labels: [], personen: [], subtaken: [], bijlagen: [], hangtAf: [] }); });
  const voor = await tel(B.p);
  await meer(B.p); await B.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(B.p, ex.tekst, "samenvoegen");
  const na = await tel(B.p);
  check("nog eens samenvoegen: geen dubbele records", na.taken === voor.taken && na.proj === voor.proj && na.uitg === voor.uitg && na.lj === voor.lj && na.bij === voor.bij, `${voor.taken} → ${na.taken}`);
  check("samenvoegen houdt bestaande instellingen (thema blijft licht) en eigen taken", na.thema === "licht" && na.ids.includes("eigen"));
  // Dezelfde open taak (titel en datum) onder een ander id wordt niet nog eens toegevoegd
  const andere = JSON.parse(ex.tekst); andere.data.taken = andere.data.taken.map(t => Object.assign({}, t, { id: "x" + t.id })).concat([{ id: "nieuw1", titel: "Nieuwe taak uit bestand", af: false, datum: null, gemaakt: new Date().toISOString(), volgorde: 5, labels: [], personen: [], subtaken: [], bijlagen: [], hangtAf: [] }]);
  await meer(B.p); await B.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(B.p, JSON.stringify(andere), "samenvoegen");
  const na2 = await tel(B.p);
  check("dezelfde open taak onder een ander id wordt overgeslagen; een nieuwe taak komt erbij", na2.ids.includes("nieuw1") && !na2.ids.includes("xt2") && !na2.ids.includes("xt1") && na2.ids.includes("xt0"), `${na.taken} → ${na2.taken} (afgeronde taak t0 telt als nieuw)`);

  /* ---------- Alles vervangen ---------- */
  await meer(B.p); await B.p.click('[data-act="gv-import"]'); await wacht(400);
  const fc = B.p.waitForEvent("filechooser"); await B.p.click('#blad [data-modus="vervangen"]'); const ch = await fc;
  await ch.setFiles({ name: "export.json", mimeType: "application/json", buffer: Buffer.from(ex.tekst) }); await wacht(500);
  check("alles vervangen vraagt eerst om bevestiging", await B.p.evaluate(() => document.querySelector("#blad").classList.contains("open") && /Alles vervangen\?/.test(document.querySelector("#bladtitel").textContent)));
  await B.p.screenshot({ path: path.join(UIT, "gegevens-3-vervangen.png") });
  await B.p.click("#bevOk"); await wacht(1000);
  const nv = await tel(B.p);
  check("na vervangen staat er precies wat in het bestand zat (eigen taak weg, thema donker)", nv.taken === json.data.taken.length && !nv.ids.includes("eigen") && !nv.ids.includes("nieuw1") && nv.thema === "donker" && nv.bij === 1);

  /* ---------- Oude back-up en ongeldige bestanden ---------- */
  const C = await nieuw();
  await meer(C.p); await C.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(C.p, JSON.stringify({ app: "FutureMe", versie: 1, dbVersie: 7, data: { taken: [{ id: "oud1", titel: "Uit een oude back-up", af: false, gemaakt: new Date().toISOString(), volgorde: 1, labels: [], personen: [], subtaken: [], bijlagen: [], hangtAf: [] }] } }), "samenvoegen");
  check("een oude back-up (zonder de nieuwe opslagplekken) wordt gewoon ingelezen", await C.p.evaluate(() => !!vind("taken", "oud1")));
  await meer(C.p); await C.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(C.p, "dit is geen json", "samenvoegen");
  const nC = await C.p.evaluate(() => S.taken.length);
  check("een kapot bestand geeft een melding en verandert niets", await C.p.evaluate(() => /geen geldig back-upbestand/.test(document.querySelector("#toast").textContent)) && await C.p.evaluate(n => S.taken.length === n, nC));
  await meer(C.p); await C.p.click('[data-act="gv-import"]'); await wacht(400);
  await kiesBestand(C.p, JSON.stringify({ dbVersie: 999, data: { taken: [] } }), "samenvoegen");
  check("een back-up uit een nieuwere versie wordt geweigerd", await C.p.evaluate(n => /nieuwere versie/.test(document.querySelector("#toast").textContent) && S.taken.length === n, nC));
  await C.c.close(); await B.c.close();

  /* ---------- Schermafbeeldingen: 390×844 en 360×740, licht en donker ---------- */
  for (const [bw, bh] of [[390, 844], [360, 740]]) for (const donker of [false, true]) {
    const c = await browser.newContext({ viewport: { width: bw, height: bh }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: donker ? "dark" : "light" }), q = await c.newPage();
    q.on("pageerror", e => fouten.push(e.message));
    await q.goto(BASIS + "/index.html"); await wacht(1300); await meer(q);
    const pre = `${bw}x${bh}-${donker ? "donker" : "licht"}`;
    await q.screenshot({ path: path.join(UIT, `gegevens-${pre}-meer.png`) });
    await q.click('[data-act="gv-import"]'); await wacht(500);
    await q.screenshot({ path: path.join(UIT, `gegevens-${pre}-importblad.png`) });
    const over = await q.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    check(`geen horizontale scroll (${pre})`, !over);
    await c.close();
  }
  await A.c.close();
  check("geen console-fouten", !fouten.length, fouten.slice(0, 3).join(" | "));
  await browser.close(); server.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
