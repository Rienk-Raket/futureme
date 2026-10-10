// Rooktest voor FutureMe Projecten fase 3 (kennismaking, aanpak, vastloop-hulp).
// Gebruik:  NODE_PATH=<map met playwright> SCHERMEN=<map> node tests/profiel.e2e.cjs
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, ".."), UIT = process.env.SCHERMEN || path.join(ROOT, "tests", "uitvoer");
fs.mkdirSync(UIT, { recursive: true });
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split("?")[0]), f = path.join(ROOT, u === "/" ? "index.html" : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": f.endsWith(".html") ? "text/html; charset=utf-8" : f.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); fs.createReadStream(f).pipe(r);
});
let ok = 0, fout = 0;
const check = (naam, v, extra) => { if (v) ok++; else fout++; console.log((v ? "✔ " : "✘ ") + naam + (extra ? "  " + extra : "")); };
const wacht = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const BASIS = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const fouten = [], extern = [];
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  await c.clock.setFixedTime(new Date(2026, 9, 10, 10, 42));
  const p = await c.newPage();
  p.on("pageerror", e => fouten.push(e.message)); p.on("console", m => { if (m.type() === "error" && !/favicon|404/.test(m.text())) fouten.push(m.text()); });
  p.on("request", r => { if (!r.url().startsWith(BASIS) && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) extern.push(r.url()); });
  const tikvlakken = (b) => p.evaluate(b => [...document.querySelectorAll(`${b} button, ${b} a, ${b} summary, ${b} select, ${b} input:not([type=file])`)]
    .filter(el => el.offsetParent && !el.closest("svg")).map(el => [el.tagName + "." + el.className + (el.textContent || "").trim().slice(0, 14), el.offsetWidth, el.offsetHeight]).filter(([, w, h]) => w < 44 || h < 44), b || "#scherm");
  const foto = n => p.screenshot({ path: path.join(UIT, n + ".png") });

  await p.goto(BASIS + "/"); await wacht(800);
  await p.evaluate(async () => {
    const t = new Date(Date.now() - 2 * 86400000).toISOString();
    await bewaar("projecten", { id: "boek", titel: "Fotoboek", fase: "bouwen", status: "actief", kleur: "#36e2ff", prioriteit: 3, gemaakt: t, tags: [], energie: "hoog" });
    await bewaar("projecten", { id: "site", titel: "Website", fase: "plannen", status: "actief", kleur: "#8b7bff", prioriteit: 2, gemaakt: t, tags: [], energie: "laag" });
    await bewaar("stappen", { id: "s1", projectId: "boek", tekst: "Belasting", af: false, volgorde: 1 });
    ga("commando");
  });
  await wacht(400);
  check("Uitnodiging om kennis te maken", await p.evaluate(() => /Leer de app kennen/.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm [data-ga="kennismaking"]'); await wacht(300);
  check("Intro met disclaimer (geen diagnose)", await p.evaluate(() => /geen diagnose/i.test(document.querySelector("#scherm").textContent)));
  await p.click('[data-km="start"]'); await wacht(300);
  check("Eerste vraag met 5 antwoorden plus overslaan", await p.evaluate(() => document.querySelectorAll("#scherm .km-optie").length === 5 && document.querySelectorAll("#scherm .km-extra [data-km-antwoord]").length === 2));
  await foto("f3-01-vraag");
  check("44px: kennismaking", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  // Na precies 16 kernvragen pauzeren: nog niet af, geen 'weinig behoefte'
  for (let i = 0; i < 16; i++) { await p.click('#scherm [data-km-antwoord="often"]'); await wacht(50); }
  await p.evaluate(() => ga("aanpak")); await wacht(300);
  check("Review: na 16 vragen 'nog niet af', niet 'weinig behoefte'", await p.evaluate(() => /nog niet af/.test(document.querySelector("#scherm").textContent) && !/weinig gemelde behoefte/.test(document.querySelector("#scherm").textContent)));
  await p.evaluate(() => ga("commando")); await wacht(200);
  check("Review: uitnodiging blijft staan met 'Verdergaan'", await p.evaluate(() => /Verdergaan/.test(document.querySelector("#scherm").textContent)));
  await p.evaluate(async () => { await zetInst("km", { antwoorden: {}, gestart: new Date().toISOString() }); ga("kennismaking"); }); await wacht(300);
  // Alle vragen: aandacht en start 'zeer vaak', de rest 'zelden'
  for (let i = 0; i < 60; i++) {
    const id = await p.evaluate(() => document.querySelector("#scherm .km-optie") ? nsVolgende(kmRoute(), km().antwoorden) : null);
    if (!id) break;
    const keus = /^A1|^A2\.2|^A4\.3/.test(id) ? "very_often" : "rarely";
    await p.click(`#scherm [data-km-antwoord="${keus}"]`); await wacht(60);
    if (i === 2) { await p.click('[data-km="vorige"]'); await wacht(60); await p.click(`#scherm [data-km-antwoord="${keus}"]`); await wacht(60); }
  }
  check("Na de vragen: profiel klaar", await p.evaluate(() => /Je profiel is er/.test(document.querySelector("#scherm").textContent)), await p.evaluate(() => Object.keys(km().antwoorden).length + " antwoorden"));
  check("Patronen met metafoor", await p.evaluate(() => profiel().top.length >= 1 && /De /.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm [data-ga="aanpak"]'); await wacht(400);
  check("Mijn aanpak: patronen, voorstellen gelabeld, waarom bij elke aanpassing", await p.evaluate(() => document.querySelectorAll("#scherm .patronen li").length >= 1 && document.querySelectorAll("#scherm .voorstel").length >= 1 && document.querySelectorAll("#scherm .aanpassingen details.waarom").length === 8));
  await foto("f3-02-aanpak");
  check("44px: mijn aanpak", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  check("Niets gaat vanzelf aan", await p.evaluate(() => PT_AANPASSINGEN.every(a => !aanAan(a.id))));
  // Aanpassingen aanzetten
  await p.evaluate(async () => { await zetInst("wipLimiet", 1); await zetInst("blokDuur", 45); teken(); }); await wacht(150);
  for (const id of ["wip2", "kortBlok", "zacht", "energie", "ochtend", "groot"]) { await p.click(`#scherm [data-ap="${id}"]`); await wacht(150); }
  check("Review: 'Hooguit 2' maakt een strengere limiet (1) niet losser", await p.evaluate(() => wipLimiet() === 1));
  check("Grotere tekst aan; je eigen blokduur blijft bewaard", await p.evaluate(() => document.documentElement.dataset.groot === "1" && inst("blokDuur") === 45));
  await p.click('#scherm [data-ap="wip2"]'); await wacht(150);
  check("Review: WIP precies terug naar je eigen limiet", await p.evaluate(() => wipLimiet() === 1));
  await p.evaluate(async () => { await zetInst("wipLimiet", 3); });
  await p.evaluate(() => focusBlad("boek")); await wacht(300);
  check("Korte blokken: het focusblok staat standaard op 15", await p.evaluate(() => document.querySelector('#blad [data-fb-duur="15"]').getAttribute("aria-pressed") === "true"));
  await p.keyboard.press("Escape"); await wacht(300);
  await p.click('#scherm [data-ap="groot"]'); await wacht(150);

  // Commandocentrum: ochtendstart, energie, dagniveau
  await p.evaluate(() => ga("commando")); await wacht(300);
  check("Ochtendstart (voor 12 uur)", await p.evaluate(() => /Ochtendstart/.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm .ochtend [data-belofte]'); await wacht(300); await p.keyboard.press("Escape"); await wacht(300);
  check("Review: ochtendstart blijft staan als je het blad annuleert", await p.evaluate(() => /Ochtendstart/.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm [data-ochtend-klaar]'); await wacht(200);
  check("Ochtendstart weg na 'Vandaag niet'", await p.evaluate(() => !/Ochtendstart/.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm [data-energie-nu="laag"]'); await wacht(200);
  check("Energie laag: alleen Website past", await p.evaluate(() => { const s = [...document.querySelectorAll("#scherm .paneel")].find(x => /Wat past bij je energie/.test(x.textContent)); return /Website/.test(s.textContent) && !/Fotoboek/.test(s.textContent); }));
  await foto("f3-03-commando");
  check("44px: commando fase 3", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  await p.click('#scherm [data-niveau="minimum"]'); await wacht(300);
  check("Minimum: alleen focus en vijf minuten, geen radar", await p.evaluate(() => !!document.querySelector("#scherm .focus") && !!document.querySelector("#scherm .min-blok") && !document.querySelector("#scherm .orbit")));
  await p.click('#scherm [data-niveau="standaard"]'); await wacht(300);

  // Zachte check-ins
  await p.evaluate(async () => { await bewaar("beloftes", { id: "b1", projectId: "boek", tekst: "Bellen", moment: "2026-10-10T09:00", status: "open" }); teken(); }); await wacht(300);
  check("Zachte check-in: Gedaan en Nog niet, geen Half, twee kolommen", await p.evaluate(() => { const c = document.querySelector("#scherm .checkin"); return !!c && !c.querySelector('[data-ci="half"]') && /Nog niet/.test(c.textContent) && !!c.querySelector(".checkin-knoppen.twee"); }));
  await p.click("#scherm .checkin [data-ci-later]"); await wacht(400);
  check("Review: Nog niet = nieuw moment, geen 'niet gelukt'", await p.evaluate(() => /Belofte/.test(document.querySelector("#bladtitel").textContent) && vind("beloftes", "b1").status === "los" && !S.logs.some(l => l.soort === "blokkade")));
  await p.keyboard.press("Escape"); await wacht(300);

  // Ik loop vast
  await p.click("#scherm .focus [data-vast]"); await wacht(300);
  check("Ik loop vast: zes keuzes met Kan niet kiezen", await p.evaluate(() => document.querySelectorAll("#blad [data-vast-oorzaak]").length === 6));
  check("44px: ik loop vast", (await tikvlakken("#blad")).length === 0, JSON.stringify(await tikvlakken("#blad")));
  await p.click('#blad [data-vast-oorzaak="onduidelijk"]'); await wacht(300);
  await p.click('#blad [data-vast-vb="Bestand openen"]'); await p.click("#vast-doe"); await wacht(500);
  check("Onduidelijk: eerste handeling vastgepind en blok van 5 minuten loopt", await p.evaluate(() => { const s = S.stappen.find(x => x.tekst === "Bestand openen"); return s && s.pin && inst("timer") && inst("timer").duur === 5 && inst("timer").stapId === s.id; }));
  await p.evaluate(async () => { await zetInst("timer", null); timerTeken(); }); await wacht(200);
  // Kiezen, met een derde project en 'Tegen' wisselen na het antwoorden
  await p.evaluate(async () => { await bewaar("projecten", { id: "gam", titel: "Gamma", fase: "idee", status: "actief", kleur: "#ff5fd2", prioriteit: 2, gemaakt: new Date().toISOString(), tags: [] }); await zetInst("focusId", "boek"); ga("commando"); }); await wacht(300);
  await p.click("#scherm .focus [data-vast]"); await wacht(300); await p.click('#blad [data-vast-oorzaak="kiezen"]'); await wacht(300);
  for (const k of ["zin", "energie", "dichtbij"]) await p.click(`#blad [data-kies="${k}"][data-waarde="b"]`);
  await p.selectOption("#kies-b", "gam"); await wacht(100); await p.click("#kies-klaar"); await wacht(400);
  check("Review: na wisselen van 'Tegen' wint het gekozen project", await p.evaluate(() => inst("focusId") === "gam"));
  await p.evaluate(async () => { await statusToepassen(vind("projecten", "gam"), "pauze"); await zetInst("focusId", "boek"); ga("commando"); }); await wacht(200);
  await p.click("#scherm .focus [data-vast]"); await wacht(300); await p.click('#blad [data-vast-oorzaak="kiezen"]'); await wacht(300);
  check("Kiezen: drie vragen tussen twee projecten", await p.evaluate(() => document.querySelectorAll("#blad [data-kies]").length === 6));
  await p.click('#blad [data-kies="zin"][data-waarde="b"]'); await p.click('#blad [data-kies="dichtbij"][data-waarde="b"]'); await p.click("#kies-klaar"); await wacht(400);
  check("Kiezen: Website in focus", await p.evaluate(() => inst("focusId") === "site" && /Website/.test(document.querySelector("#scherm .focus").textContent)));
  // Ideeën eerst
  await p.evaluate(async () => { await zetInst("ap_ideeEerst", true); WZ.d = null; nieuwProject(); }); await wacht(300);
  check("Ideeën eerst: wizard start in de ideeënbak", await p.evaluate(() => WZ.d.status === "idee"));

  check("geen consolefouten", fouten.length === 0, fouten.slice(0, 3).join(" | "));
  check("nul externe verzoeken", extern.length === 0, extern.slice(0, 3).join(" | "));
  await browser.close(); server.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
