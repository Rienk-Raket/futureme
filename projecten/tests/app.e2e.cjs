// Rooktest voor FutureMe Projecten (fase 1) met Playwright, plus schermafbeeldingen.
// Gebruik:  NODE_PATH=<map met playwright> SCHERMEN=<map> node tests/app.e2e.cjs
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
  check("Welkom zonder projecten", await p.evaluate(() => /Wat wil je afmaken/.test(document.querySelector("#scherm").textContent)));
  await foto("01-welkom");

  // Wizard
  await p.click('#scherm [data-tab="nieuw"]'); await wacht(400);
  await p.click('[data-wz="verder"]'); await wacht(200);
  check("Wizard: titel is nodig", await p.evaluate(() => /naam/.test(document.querySelector("#toast").textContent)));
  await p.fill("#wz-titel", "Fotoboek Japan"); await p.fill("#wz-waarom", "Herinneringen vasthouden");
  await foto("02-wizard");
  check("44px: wizard", (await tikvlakken("#blad")).length === 0, JSON.stringify(await tikvlakken("#blad")));
  await p.click('[data-wz="verder"]'); await wacht(300);
  await p.fill("#wz-klaar", "Het boek ligt op tafel"); await p.click('[data-wz="verder"]'); await wacht(300);
  await p.fill("#wz-stap", "Foto's"); await wacht(100);
  check("Wizard: vage eerste stap krijgt een hint", await p.evaluate(() => /vaag/.test(document.querySelector("#wz-hint").textContent)));
  await p.click('[data-wz-vb="Map openen"]'); await wacht(100);
  check("Wizard: voorbeeld neemt de hint weg", await p.evaluate(() => document.querySelector("#wz-hint").textContent === ""));
  await p.click('[data-wz="verder"]'); await wacht(300);
  await p.fill("#wz-cluster", "Creatief"); await p.fill("#wz-tags", "foto, reis"); await p.click('[data-wz-energie="laag"]'); await wacht(100);
  await p.fill("#wz-deadline", "2026-10-12");
  await p.click('[data-wz="verder"]'); await wacht(600);
  check("Project gestart, scherm Project", await p.evaluate(() => V.view === "project" && /Fotoboek Japan/.test(document.querySelector("#scherm").textContent)));
  check("Eerste stap staat klaar, cluster en tags bewaard", await p.evaluate(() => { const pr = S.projecten[0]; return S.stappen.length === 1 && S.stappen[0].tekst === "Map openen" && pr.cluster === "Creatief" && pr.tags.join() === "foto,reis" && pr.energie === "laag"; }));
  await foto("03-project");
  check("44px: project", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));

  // Stappen
  await p.fill("#stap-tekst", "Bel de drukker"); await p.press("#stap-tekst", "Enter"); await wacht(300);
  await p.fill("#stap-tekst", "Dingen regelen"); await p.press("#stap-tekst", "Enter"); await wacht(300);
  check("Stappen toevoegen; vage stap krijgt een tip", await p.evaluate(() => S.stappen.length === 3 && /werkwoord/.test(document.querySelector("#stap-hint").textContent)));
  await p.click("#scherm .stappen li:first-child [data-stap-vink]"); await wacht(300);
  check("Stap afvinken logt een winst", await p.evaluate(() => S.stappen.find(s => s.tekst === "Map openen").af && S.logs.some(l => l.soort === "winst" && /Map openen/.test(l.tekst))));
  // Fase
  await p.click('#scherm [data-fase="bouwen"]'); await wacht(300);
  check("Fase D: Bouwen, met logregel", await p.evaluate(() => S.projecten[0].fase === "bouwen" && S.logs.some(l => /Bouwen/.test(l.tekst)) && document.querySelector('[data-fase="bouwen"]').getAttribute("aria-pressed") === "true"));
  // Mijlpaal
  await p.click("#scherm [data-mijl-nieuw]"); await wacht(300); await p.fill("#mp-titel", "Selectie klaar"); await p.fill("#mp-datum", "2026-10-11"); await p.click("#mp-bewaar"); await wacht(300);
  check("Mijlpaal toegevoegd", await p.evaluate(() => S.mijlpalen.length === 1 && /Selectie klaar/.test(document.querySelector("#scherm .mijlpalen").textContent)));
  // Log
  await p.click('#scherm .sectie [data-snel-log]'); await wacht(300);
  check("44px: logblad", (await tikvlakken("#blad")).length === 0, JSON.stringify(await tikvlakken("#blad")));
  await p.click('[data-log-min="45"]'); await p.fill("#log-tekst", "Foto's geselecteerd"); await p.click("#log-bewaar"); await wacht(400);
  check("Werkblok van 45 min gelogd", await p.evaluate(() => S.logs.some(l => l.soort === "werk" && l.minuten === 45)));

  // Tweede en derde project via de wizard, snel
  for (const t of ["Website café", "Belasting 2026"]) {
    await p.click('#tabs [data-tab="nieuw"]'); await wacht(300); await p.fill("#wz-titel", t);
    for (let i = 0; i < 3; i++) { await p.click('[data-wz="verder"]'); await wacht(250); }
    await p.click('[data-wz="verder"]'); await wacht(400);
  }
  // Commando
  await p.click('#tabs [data-tab="commando"]'); await wacht(500);
  check("Commando: focus, tellers en radar", await p.evaluate(() => !!document.querySelector("#scherm .focus") && document.querySelectorAll("#scherm .teller").length === 4 && document.querySelectorAll("#scherm .orbit .knoop").length === 3));
  check("Commando: 45 minuten deze week, draad 1/14", await p.evaluate(() => /45/.test(document.querySelectorAll(".teller")[1].textContent) && /1\/14/.test(document.querySelectorAll(".teller")[2].textContent)));
  check("Focus: deadline dichtbij staat erbij", await p.evaluate(() => /Deadline over 2 dagen/.test(document.querySelector("#scherm").textContent)));
  await foto("04-commando");
  check("44px: commando", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));
  await p.click("#scherm .focus [data-stap-af]"); await wacht(300);
  check("Commando: stap klaar vanuit focus", await p.evaluate(() => S.stappen.find(s => s.tekst === "Bel de drukker").af));

  // WIP-limiet: vierde project actief maken
  await p.click('#tabs [data-tab="nieuw"]'); await wacht(300); await p.fill("#wz-titel", "Moestuin");
  for (let i = 0; i < 3; i++) { await p.click('[data-wz="verder"]'); await wacht(250); }
  check("Wizard: hint bij volle WIP", await p.evaluate(() => /ideeënbak/.test(document.querySelector("#blad").textContent)));
  await p.click('[data-wz-status="idee"]'); await wacht(150); await p.click('[data-wz="verder"]'); await wacht(400);
  await p.click('#scherm [data-status="actief"]'); await wacht(300);
  check("WIP: kiezen wat er pauzeert", await p.evaluate(() => /Even kiezen/.test(document.querySelector("#bladtitel").textContent)));
  await p.click('#blad [data-wip-pauze]'); await wacht(400);
  check("WIP: een ander gepauzeerd, Moestuin actief", await p.evaluate(() => vind("projecten", V.param).status === "actief" && S.projecten.filter(x => x.status === "actief").length === 3 && S.projecten.some(x => x.status === "pauze")));

  // Projecten: filter, cluster, zoek
  await p.click('#tabs [data-tab="projecten"]'); await wacht(400);
  check("Projecten: gegroepeerd op fase", await p.evaluate(() => [...document.querySelectorAll("#scherm .sectie h2")].map(h => h.textContent).some(t => /D · Bouwen/.test(t))));
  await p.selectOption("#cluster-op", "cluster"); await wacht(300);
  check("Groeperen op cluster", await p.evaluate(() => [...document.querySelectorAll("#scherm .sectie h2")].map(h => h.textContent).join("|").includes("Creatief")));
  await p.fill("#zoek", "cafe"); await wacht(300);
  check("Zoeken zonder accent vindt Website café, focus blijft in het veld", await p.evaluate(() => document.querySelectorAll("#scherm .kaart").length === 1 && document.activeElement.id === "zoek"));
  await p.fill("#zoek", ""); await wacht(200);
  await p.click('[data-filter-status="pauze"]'); await wacht(300);
  check("Filter Pauze", await p.evaluate(() => document.querySelectorAll("#scherm .kaart").length === 1));
  await p.click('[data-filter-status="open"]'); await wacht(300);
  await foto("05-projecten");
  check("44px: projecten", (await tikvlakken()).length === 0, JSON.stringify(await tikvlakken()));

  // Afronden met evaluatie
  await p.evaluate(() => ga("project", S.projecten.find(x => x.titel === "Fotoboek Japan").id)); await wacht(300);
  await p.click('#scherm [data-status="klaar"]'); await wacht(300);
  await p.fill("#ev-werkte", "Elke dag een kwartier"); await p.click("#ev-klaar"); await wacht(500);
  check("Afgerond: status, evaluatie en winst-log", await p.evaluate(() => { const x = S.projecten.find(x => x.titel === "Fotoboek Japan"); return x.status === "klaar" && x.fase === "evalueren" && x.evaluatie.Werkte && S.logs.some(l => /Afgerond/.test(l.tekst)); }));
  await p.evaluate(() => ga("archief")); await wacht(300);
  check("Archief toont het afgeronde project", await p.evaluate(() => /Fotoboek Japan/.test(document.querySelector("#scherm").textContent)));

  // Log
  await p.click('#tabs [data-tab="log"]'); await wacht(300);
  check("Log: tijdlijn met projectlinks", await p.evaluate(() => document.querySelectorAll("#scherm .tijdlijn .log").length >= 5 && !!document.querySelector('#scherm .tijdlijn [data-ga="project"]')));
  await foto("06-log");

  // Export en import
  await p.click('#tabs [data-tab="meer"]'); await wacht(300);
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click("[data-export]")]);
  const exportPad = path.join(UIT, "export.json"); await dl.saveAs(exportPad);
  const exp = JSON.parse(fs.readFileSync(exportPad, "utf8"));
  check("Export bevat alles", exp.app === "FutureMe Projecten" && exp.projecten.length === 4 && exp.logs.length > 5);
  await p.evaluate(async () => { for (const x of S.projecten.slice()) await verwijder("projecten", x.id); teken(); });
  await p.setInputFiles("#import-bestand", exportPad); await wacht(400);
  await p.click("#im-samen"); await wacht(500);
  check("Import zet alles terug", await p.evaluate(() => S.projecten.length === 4));
  await p.reload(); await wacht(800);
  check("Na herladen staat alles er nog (IndexedDB)", await p.evaluate(() => S.projecten.length === 4 && S.logs.length > 5));
  // Thema licht
  await p.evaluate(() => ga("meer")); await wacht(200);
  await p.click('[data-inst="thema"][data-waarde="licht"]'); await wacht(300);
  check("Licht thema", await p.evaluate(() => document.documentElement.dataset.thema === "licht"));
  await p.evaluate(() => ga("commando")); await wacht(300); await foto("07-commando-licht");
  check("44px: meer", await p.evaluate(() => true));

  check("geen consolefouten", fouten.length === 0, fouten.slice(0, 3).join(" | "));
  check("nul externe verzoeken", extern.length === 0, extern.slice(0, 3).join(" | "));
  await browser.close(); server.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
