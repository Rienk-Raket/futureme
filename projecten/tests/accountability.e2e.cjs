// Rooktest voor FutureMe Projecten fase 2 (accountability).
// Gebruik:  NODE_PATH=<map met playwright> SCHERMEN=<map> node tests/accountability.e2e.cjs
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
  // Twee projecten klaarzetten
  await p.evaluate(async () => {
    const t = new Date(Date.now() - 9 * 86400000).toISOString();
    await bewaar("projecten", { id: "boek", titel: "Fotoboek", fase: "bouwen", status: "actief", kleur: "#36e2ff", prioriteit: 3, gemaakt: t, tags: [] });
    await bewaar("projecten", { id: "site", titel: "Website", fase: "plannen", status: "actief", kleur: "#8b7bff", prioriteit: 2, gemaakt: t, tags: [] });
    await bewaar("stappen", { id: "s1", projectId: "boek", tekst: "Bel de drukker", af: false, volgorde: 1 });
    await bewaar("stappen", { id: "s2", projectId: "boek", tekst: "Cover schetsen", af: false, volgorde: 2 });
    ga("commando");
  });
  await wacht(400);
  check("Weer in beweging: stille projecten met 5 minuten", await p.evaluate(() => document.querySelectorAll("#scherm [data-focus-start][data-duur='5']").length === 2));
  check("Focuskaart: Focusblok en Belofte", await p.evaluate(() => !!document.querySelector("#scherm .focus [data-focus-start]") && !!document.querySelector("#scherm .focus [data-belofte]")));

  // Belofte maken (vandaag 13:00)
  await p.click("#scherm .focus [data-belofte]"); await wacht(400);
  check("Belofte: volgende stap staat voorgevuld", await p.evaluate(() => document.querySelector("#bf-tekst").value === "Bel de drukker"));
  check("44px: belofteblad", (await tikvlakken("#blad")).length === 0, JSON.stringify(await tikvlakken("#blad")));
  await p.fill("#bf-tijd", "13:00"); await p.click("#bf-bewaar"); await wacht(400);
  check("Belofte bewaard met moment en stap", await p.evaluate(() => S.beloftes.length === 1 && S.beloftes[0].moment.endsWith("T13:00") && S.beloftes[0].stapId === "s1"));
  // Tijd verstrijkt: check-in verschijnt
  await c.clock.setFixedTime(new Date(2026, 9, 10, 13, 30)); await p.evaluate(() => teken()); await wacht(300);
  check("Check-in bovenaan Commando", await p.evaluate(() => document.querySelector("#scherm > *").classList.contains("checkin") && /Bel de drukker/.test(document.querySelector("#scherm .checkin").textContent)));
  await foto("f2-01-checkin");
  check("44px: commando met check-in", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  await p.click('#scherm [data-ci="gedaan"]'); await wacht(400);
  check("Gedaan: stap afgevinkt, winst gelogd, check-in weg", await p.evaluate(() => vind("stappen", "s1").af && S.beloftes[0].status === "gedaan" && S.logs.some(l => l.soort === "winst" && /Belofte gedaan/.test(l.tekst)) && !document.querySelector("#scherm .checkin")));

  // Niet gelukt → kleiner maken
  await p.evaluate(async () => { await bewaar("beloftes", { id: "b2", projectId: "site", tekst: "Teksten schrijven", moment: "2026-10-10T12:00", status: "open" }); teken(); }); await wacht(300);
  await p.click('#scherm [data-ci="niet"]'); await wacht(400);
  check("Niet gelukt: geen oordeel, drie wegen", await p.evaluate(() => /geen oordeel/.test(document.querySelector("#blad").textContent) && document.querySelectorAll("#blad [data-ng]").length === 3));
  check("44px: niet-gelukt-blad", (await tikvlakken("#blad")).length === 0, JSON.stringify(await tikvlakken("#blad")));
  await p.click('#blad [data-ng-reden="groot"]'); await p.click('#blad [data-ng="kleiner"]'); await wacht(400);
  check("Kleiner maken: nieuwe belofte met 'Vijf minuten'", await p.evaluate(() => vind("beloftes", "b2").status === "niet" && vind("beloftes", "b2").reden === "groot" && /^Vijf minuten: Teksten schrijven/.test(document.querySelector("#bf-tekst").value)));
  await p.click("#bf-bewaar"); await wacht(400);
  check("Nieuwe belofte staat open", await p.evaluate(() => S.beloftes.filter(b => b.status === "open").length === 1));

  // Focusblok
  await p.evaluate(() => ga("project", "boek")); await wacht(300);
  check("Project: focusblok, belofte en cijfers", await p.evaluate(() => !!document.querySelector("#scherm .focusacties") && /1 gedaan/.test(document.querySelector("#scherm").textContent)));
  await p.click('#scherm .focusacties [data-focus-start]'); await wacht(400);
  await p.click('#blad [data-fb-duur="15"]'); await p.click("#fb-start"); await wacht(500);
  check("Timer: scherm met 15:00 en de stap", await p.evaluate(() => !!document.querySelector("#timer") && /15:00/.test(document.querySelector("#timer-klok").textContent) && /Cover schetsen/.test(document.querySelector("#timer-stap").textContent)));
  await foto("f2-02-timer");
  check("44px: timer", (await tikvlakken("#timer")).length === 0, JSON.stringify(await tikvlakken("#timer")));
  await c.clock.setFixedTime(new Date(2026, 9, 10, 13, 40)); await wacht(1300);
  check("Timer loopt: 5:00 over", await p.evaluate(() => /^5:00$/.test(document.querySelector("#timer-klok").textContent)), await p.evaluate(() => document.querySelector("#timer-klok").textContent));
  await p.reload(); await wacht(900);
  check("Timer overleeft herladen", await p.evaluate(() => !!document.querySelector("#timer")));
  await c.clock.setFixedTime(new Date(2026, 9, 10, 13, 46)); await wacht(1400);
  check("Blok klaar: vraagt wat je deed, met Stap klaar", await p.evaluate(() => !document.querySelector("#timer") && /Blok klaar/.test(document.querySelector("#bladtitel").textContent) && !!document.querySelector("#bk-stap")));
  await p.click("#bk-stap"); await p.fill("#bk-tekst", "Drie schetsen"); await p.click("#bk-bewaar"); await wacht(400);
  check("15 minuten gelogd en stap klaar", await p.evaluate(() => S.logs.some(l => l.soort === "werk" && l.minuten === 15 && l.tekst === "Drie schetsen") && vind("stappen", "s2").af));

  // Mijlpaal met terugblik
  await p.evaluate(async () => { await bewaar("mijlpalen", { id: "m1", projectId: "boek", titel: "Selectie klaar", af: false }); ga("project", "boek"); }); await wacht(300);
  await p.click('#scherm [data-mijl-vink="m1"]'); await wacht(400);
  check("Mijlpaal: terugblik (mag overslaan)", await p.evaluate(() => /Mijlpaal gehaald/.test(document.querySelector("#bladtitel").textContent) && !!document.querySelector("#mt-over")));
  await p.fill("#mt-werkte", "Elke ochtend"); await p.click("#mt-bewaar"); await wacht(300);
  check("Terugblik bewaard", await p.evaluate(() => vind("mijlpalen", "m1").evaluatie.Werkte === "Elke ochtend"));

  // Weekreview (zaterdag: kaart op Commando)
  await p.evaluate(() => ga("commando")); await wacht(300);
  check("Weekreview-kaart op zaterdag", await p.evaluate(() => !!document.querySelector('#scherm [data-ga="week"]')));
  await p.click('#scherm [data-ga="week"]'); await wacht(400);
  check("Weekreview: tellers en per project", await p.evaluate(() => document.querySelectorAll("#scherm .teller").length === 4 && document.querySelectorAll("#scherm .week-rij").length === 2 && /15/.test(document.querySelector("#scherm .teller").textContent)));
  await foto("f2-03-week");
  check("44px: weekreview", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  await p.click('#scherm [data-wk-keuze="pauze"][data-id="site"]'); await wacht(200);
  await p.fill("#wk-mee", "Ochtenden werken goed"); await p.click("#scherm [data-wk-klaar]"); await wacht(400);
  check("Weekreview klaar: keuze toegepast, tekst bewaard, kaart weg", await p.evaluate(() => vind("projecten", "site").status === "pauze" && inst("weekreviews").length === 1 && inst("weekreviews")[0].tekst === "Ochtenden werken goed" && !document.querySelector('#scherm [data-ga="week"]')));
  // Export bevat beloftes
  check("Export bevat beloftes", await p.evaluate(() => JSON.parse(exportJSON()).beloftes.length === 3));

  check("geen consolefouten", fouten.length === 0, fouten.slice(0, 3).join(" | "));
  check("nul externe verzoeken", extern.length === 0, extern.slice(0, 3).join(" | "));
  await browser.close(); server.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
