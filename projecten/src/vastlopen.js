"use strict";
// === FASE 3b: VASTLOOP-HULP — Ik loop vast, kiezen tussen projecten, dagniveau, energie, ochtendstart ===

/* PT-VAST-BEGIN */
const PT_OORZAKEN = [
  { id: "onduidelijk", label: "Onduidelijk", sub: "Ik weet niet waar ik begin", zin: "Begin bij wat je handen als eerste doen.", actie: "stap", duur: 5,
    vraag: "Wat is de eerste handeling?", voorbeelden: ["Bestand openen", "Telefoon pakken", "Spullen klaarleggen", "Eén zin opschrijven"],
    waarom: "Een stap die met een werkwoord begint en een duidelijk eindpunt heeft, is makkelijker te starten dan een vage taak." },
  { id: "groot", label: "Te groot", sub: "Het voelt als een berg", zin: "Kies een stuk van vijf minuten.", actie: "stap", duur: 5,
    vraag: "Wat past in vijf minuten?", voorbeelden: ["Eerste alinea", "Eén la", "Alleen de mail openen", "Vijf dingen opruimen"],
    waarom: "Kleine stappen maken het begin lichter; de rest komt daarna aan de beurt." },
  { id: "saai", label: "Saai", sub: "Het trekt niet", zin: "Een kort blok van tien minuten, daarna mag je stoppen.", actie: "blok", duur: 10,
    waarom: "Een blok met een duidelijk einde vraagt minder volhouden dan een open taak." },
  { id: "spannend", label: "Spannend", sub: "Ik zie er tegenop", zin: "Maak een ruwe versie die niemand ziet, tien minuten.", actie: "blok", duur: 10,
    waarom: "Spanning zakt vaak als de lat tijdelijk lager ligt: eerst slecht, dan beter." },
  { id: "leeg", label: "Leeg", sub: "Ik heb er de energie niet voor", zin: "Op een lege dag telt de kleinste versie ook.", actie: "blok", duur: 2,
    tweede: "moment", waarom: "Een minimumversie houdt de draad vast zonder je leeg te trekken." },
  { id: "kiezen", label: "Kan niet kiezen", sub: "Welk project eerst?", zin: "Drie vragen, dan een voorstel. Twee minuten.", actie: "kiezen",
    waarom: "Twijfel kost vaak meer dan een minder goede keuze. Een paar vaste vragen en een tijdsgrens maken kiezen lichter." }
];
const PT_VAST_BEWIJS = "Praktisch: een samenvoeging van onderdelen uit ADHD-gerichte begeleiding, niet als geheel onderzocht.";
const PT_NIVEAUS = [
  { id: "minimum", label: "Minimum", uitleg: "Eén ding, vijf minuten. Meer mag, hoeft niet." },
  { id: "standaard", label: "Standaard", uitleg: "Je gewone dag." },
  { id: "extra", label: "Extra", uitleg: "Ruimte voor meer: alles in beeld." }
];
/** Kiezen tussen twee projecten: punten per vraag, met een vaste volgorde bij gelijkspel (deadline, dan prioriteit). */
function ptKiesScore(p, antwoorden, nu) {
  let s = 0;
  if (antwoorden.zin === p.id) s += 2;
  if (antwoorden.energie === p.id) s += 2;
  if (antwoorden.dichtbij === p.id) s += 3;
  if (p.deadline) { const dg = (Date.parse(p.deadline + "T23:59:59") - nu) / 86400000; if (dg < 7) s += 1; }
  return s + (p.prioriteit || 2) / 10;
}
/** Past een project bij je energie van nu? Onbekend past altijd. */
function ptPastBijEnergie(p, energie) {
  const rang = { laag: 0, midden: 1, hoog: 2 };
  return !p.energie || !energie || rang[p.energie] <= rang[energie];
}
/* PT-VAST-EINDE */

const dagNiveau = () => { const n = inst("dagniveau", null); return n && n.datum === vandaagISO() ? n.niveau : "standaard"; };

/* ---------- Ik loop vast ---------- */
function vastBlad(projectId) {
  const p = vind("projecten", projectId); if (!p) return;
  bladOpen("Wat is het lastigst?", `<p class="klein">${esc(p.titel)}</p><div class="vast-keuzes">${PT_OORZAKEN.map(o => `<button type="button" class="vast-keuze" data-vast-oorzaak="${o.id}" data-id="${esc(p.id)}"><b>${esc(o.label)}</b><small>${esc(o.sub)}</small></button>`).join("")}</div>
    <button type="button" class="knop rand breed" data-vast-los="${esc(p.id)}">Vandaag niet, morgen weer</button>`);
}
function vastRoute(p, o) {
  if (o.actie === "kiezen") return kiesBlad(p.id);
  const stap = ptVolgendeStap(p, S.stappen), invoer = o.actie === "stap";
  bladOpen(o.label, `<p class="vast-zin">${esc(o.zin)}</p>
    ${invoer ? `<div class="veld"><label for="vast-stap">${esc(o.vraag)}</label><input class="invoer" id="vast-stap" maxlength="120" autocomplete="off" placeholder="${esc(o.voorbeelden[0])}"></div>
      <div class="chips">${o.voorbeelden.map(v => `<button type="button" class="chip-knop" data-vast-vb="${esc(v)}">${esc(v)}</button>`).join("")}</div>` : stap ? `<p class="klein">Aan: ${esc(stap.tekst)}</p>` : ""}
    <details class="waarom"><summary>Waarom zeg je dit?</summary><p>${esc(o.waarom)} ${esc(PT_VAST_BEWIJS)}</p></details>`,
    `<button class="knop primair breed" id="vast-doe">${invoer ? `Opslaan en ${o.duur} minuten starten` : `Start ${o.duur} minuten`}</button>${o.tweede ? `<button class="knop rand breed" id="vast-moment">Nieuw moment kiezen</button>` : ""}`);
  $("#bladinhoud").addEventListener("click", e => { const v = e.target.closest("[data-vast-vb]"); if (v) { $("#vast-stap").value = v.dataset.vastVb; $("#vast-stap").focus(); } });
  if (o.tweede) $("#vast-moment").onclick = () => belofteBlad(p.id);
  $("#vast-doe").onclick = async () => {
    let stapId = stap ? stap.id : null;
    if (invoer) {
      const t = $("#vast-stap").value.trim(); if (!t) { toast("Schrijf eerst één handeling op"); return; }
      for (const x of S.stappen.filter(x => x.projectId === p.id && x.pin)) { x.pin = false; await bewaar("stappen", x); }
      const nieuw = await bewaar("stappen", { id: uid(), projectId: p.id, tekst: t, af: false, pin: true, volgorde: 0, gemaakt: new Date().toISOString() });
      stapId = nieuw.id;
    }
    await log(p.id, "notitie", `Vastgelopen (${o.label.toLowerCase()}): ${invoer ? "eerste handeling gekozen" : `${o.duur} minuten`}`);
    if (inst("timer", null)) { bladSluit(); timerTeken(); toast("Er loopt al een blok."); return; }
    await zetInst("timer", { projectId: p.id, stapId, start: Date.now(), duur: o.duur, pauzeOp: null, gepauzeerd: 0 });
    bladSluit(); tril(10); timerTeken();
  };
}

/* ---------- Kiezen tussen projecten (Keuzemachine light) ---------- */
function kiesBlad(vanId) {
  const actief = S.projecten.filter(p => p.status === "actief");
  if (actief.length < 2) { bladSluit(); toast("Er is maar één actief project. Dat is je keuze."); return; }
  const a = vind("projecten", vanId) && vind("projecten", vanId).status === "actief" ? vind("projecten", vanId) : actief[0], rest = actief.filter(p => p.id !== a.id);
  const ant = { b: rest[0].id }, start = Date.now();
  const vraag = (k, tekst) => `<p class="hud-label">${tekst}</p><div class="segment" role="group" aria-label="${esc(tekst)}"><button type="button" data-kies="${k}" data-waarde="a" aria-pressed="false">${esc(a.titel)}</button><button type="button" data-kies="${k}" data-waarde="b" aria-pressed="false" class="kies-b">${esc(rest[0].titel)}</button></div>`;
  bladOpen("Kiezen in twee minuten", `${rest.length > 1 ? `<div class="veld"><label for="kies-b">Tegen</label><select id="kies-b" class="invoer">${rest.map(p => `<option value="${esc(p.id)}">${esc(p.titel)}</option>`).join("")}</select></div>` : ""}
    ${vraag("zin", "Waar heb je nu het meest zin in?")}${vraag("energie", "Wat past bij je energie van nu?")}${vraag("dichtbij", "Wat brengt je het dichtst bij 'klaar'?")}
    <details class="waarom"><summary>Waarom zo?</summary><p>Twijfel kost vaak meer dan een minder goede keuze. Drie vaste vragen en een korte tijd maken kiezen lichter. Praktisch: een experiment.</p></details>`,
    `<button class="knop primair breed" id="kies-klaar">Kies voor mij</button><button class="knop rand breed" id="kies-munt">Gooi een munt</button>`);
  const naam = id => (vind("projecten", id) || {}).titel || "";
  const bSel = $("#kies-b"); if (bSel) bSel.onchange = () => { ant.b = bSel.value; document.querySelectorAll(".kies-b").forEach(x => { x.textContent = naam(ant.b); }); };
  $("#bladinhoud").addEventListener("click", e => { const b = e.target.closest("[data-kies]"); if (!b) return; ant[b.dataset.kies] = b.dataset.waarde === "a" ? a.id : ant.b; document.querySelectorAll(`[data-kies="${b.dataset.kies}"]`).forEach(x => x.setAttribute("aria-pressed", String(x === b))); });
  const kies = async (winnaar, hoe) => {
    await zetInst("focusId", winnaar.id);
    await log(winnaar.id, "notitie", `Gekozen boven ${winnaar.id === a.id ? naam(ant.b) : a.titel} (${hoe}, ${Math.max(1, Math.round((Date.now() - start) / 1000))} s)`);
    bladSluit(); ga("commando"); toast(`${winnaar.titel} staat in focus. De ander loopt niet weg.`);
  };
  $("#kies-klaar").onclick = () => { const B = vind("projecten", ant.b); kies(ptKiesScore(a, ant, Date.now()) >= ptKiesScore(B, ant, Date.now()) ? a : B, "drie vragen"); };
  $("#kies-munt").onclick = () => kies(Math.random() < .5 ? a : vind("projecten", ant.b), "munt");
}

/* ---------- Commandocentrum: dagniveau, energie, ochtendstart; zachte check-ins ---------- */
{
  const _cmd = VIEWS.commando;
  VIEWS.commando = function () {
    let h = _cmd.apply(this, arguments);
    if (!S.projecten.some(p => p.status === "actief")) return h;
    const n = dagNiveau();
    const blok = `<section class="paneel dagniveau" aria-label="Dagniveau"><div class="dn-kop"><p class="hud-label">Dagniveau</p><small class="klein">${esc(PT_NIVEAUS.find(x => x.id === n).uitleg)}</small></div>
      <div class="segment" role="radiogroup" aria-label="Dagniveau">${PT_NIVEAUS.map(x => `<button type="button" role="radio" data-niveau="${x.id}" aria-checked="${x.id === n}" aria-pressed="${x.id === n}">${x.label}</button>`).join("")}</div>
      <details class="waarom"><summary>Waarom?</summary><p>Een kleinere versie op een zware dag houdt de draad vast, zodat je niet helemaal stilvalt. Praktisch: een experiment.</p></details></section>`;
    // Minimum: alleen de focus (met één blok van vijf minuten) en de check-ins; de rest is morgen weer.
    if (n === "minimum") {
      const f = h.match(/<section class="paneel focus"[\s\S]*?<\/section>/), ci = (h.match(/<section class="paneel checkin"[\s\S]*?<\/section>/g) || []).join("");
      const fp = focusProject();
      h = ci + (f ? f[0] : "") + (fp ? `<button class="knop primair breed min-blok" data-focus-start="${esc(fp.id)}" data-duur="5">${ico("klok")} Vijf minuten, meer hoeft niet</button>` : "") + blok;
      return h;
    }
    let extra = "";
    if (aanAan("energie")) {
      const e = V.energieNu || "";
      const lijst = e ? S.projecten.filter(p => p.status === "actief" && ptPastBijEnergie(p, e)) : [];
      extra += `<section class="paneel"><p class="hud-label">Wat past bij je energie?</p><div class="segment" role="group" aria-label="Energie van nu">${[["laag", "Laag"], ["midden", "Midden"], ["hoog", "Hoog"]].map(([k, l]) => `<button type="button" data-energie-nu="${k}" aria-pressed="${e === k}">${l}</button>`).join("")}</div>
        ${e ? (lijst.length ? `<div class="lijst">${lijst.map(projectKaart).join("")}</div>` : `<p class="klein">Geen project dat hierbij past. Rust is ook een plan.</p>`) : ""}</section>`;
    }
    if (aanAan("ochtend") && new Date().getHours() < 12 && inst("ochtendGedaan", null) !== vandaagISO()) {
      const fp = focusProject();
      if (fp) extra = `<section class="paneel ochtend"><p class="hud-label">Ochtendstart</p><p>Welke ene stap zet je vandaag voor <b>${esc(fp.titel)}</b>?</p>
        <div class="knoprij"><button class="knop primair" data-belofte="${esc(fp.id)}" data-ochtend="1">Stap kiezen</button><button class="knop rand" data-ochtend-klaar>Vandaag niet</button></div></section>` + extra;
    }
    const i = h.indexOf('<section class="tellers"');
    h = i < 0 ? h + extra + blok : h.slice(0, i) + extra + h.slice(i) + blok;
    return h;
  };
  // Focuskaart en projectscherm: Ik loop vast
  const _cmd2 = VIEWS.commando;
  VIEWS.commando = function () {
    return _cmd2.apply(this, arguments).replace(/(<section class="paneel focus"[\s\S]*?)(<\/section>)/, (m, a, b) => {
      const id = (a.match(/data-param="([^"]+)"/) || [])[1];
      return id ? `${a}<button class="link klein vast-link" data-vast="${id}">Ik loop vast</button>${b}` : m;
    });
  };
  const _proj = VIEWS.project;
  VIEWS.project = function () {
    const h = _proj.apply(this, arguments), p = vind("projecten", V.param);
    if (!p || !ptIsOpen(p)) return h;
    return h.replace('<div class="paneel acties focusacties">', `<div class="paneel acties focusacties"><button class="knop rand" data-vast="${esc(p.id)}">Ik loop vast</button>`);
  };
}
// Zachte check-ins: alleen Gedaan en Nog niet; geen tellers van wat niet lukte.
{
  const _ci = checkinHTML;
  checkinHTML = function () {
    const h = _ci.apply(this, arguments);
    if (!aanAan("zacht")) return h;
    return h.replace(/<button class="knop rand" data-ci="half"[^>]*>Half<\/button>/g, "").replace(/(data-ci="niet"[^>]*>)Niet(<\/button>)/g, "$1Nog niet$2").replace(/grid-template-columns/g, "");
  };
  const _week = VIEWS.week;
  VIEWS.week = function () {
    const h = _week.apply(this, arguments);
    return aanAan("zacht") ? h.replace(/(<b class="mono">\d+)<small>\/\d+<\/small>(<\/b><span>beloftes<\/span>)/, "$1$2") : h;
  };
  const _proj = VIEWS.project;
  VIEWS.project = function () {
    const h = _proj.apply(this, arguments);
    return aanAan("zacht") ? h.replace(/<p class="klein leeg-regel">Beloftes: [^<]*<\/p>/, "") : h;
  };
}

/* ---------- Klikken ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-vast],[data-vast-oorzaak],[data-vast-los],[data-niveau],[data-energie-nu],[data-ochtend-klaar],[data-ochtend]"); if (!el) return;
  const d = el.dataset;
  if (d.vast) return vastBlad(d.vast);
  if (d.vastOorzaak) return vastRoute(vind("projecten", d.id), PT_OORZAKEN.find(o => o.id === d.vastOorzaak));
  if (d.vastLos) {
    await log(d.vastLos, "notitie", "Vastgelopen: vandaag niet, morgen weer");
    bladSluit(); toast("Morgen weer. Een rustdag is ook een keuze."); return;
  }
  if (d.niveau) { await zetInst("dagniveau", { datum: vandaagISO(), niveau: d.niveau }); tril(6); teken(); const b = document.querySelector(`#scherm [data-niveau="${d.niveau}"]`); if (b) b.focus({ preventScroll: true }); return; }
  if (d.energieNu) { V.energieNu = V.energieNu === d.energieNu ? "" : d.energieNu; return teken(); }
  if (d.ochtendKlaar !== undefined) { await zetInst("ochtendGedaan", vandaagISO()); return teken(); }
  if (d.ochtend) { await zetInst("ochtendGedaan", vandaagISO()); }   // de belofte zelf opent via data-belofte
});
// Pijltjes in de radiogroep Dagniveau
document.addEventListener("keydown", e => {
  const b = e.target.closest && e.target.closest("[data-niveau]"); if (!b) return;
  const ids = PT_NIVEAUS.map(x => x.id), i = ids.indexOf(b.dataset.niveau), j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1 }[e.key];
  if (j == null) return; e.preventDefault();
  const n = ids[(j + ids.length) % ids.length]; zetInst("dagniveau", { datum: vandaagISO(), niveau: n }).then(() => { teken(); const x = document.querySelector(`#scherm [data-niveau="${n}"]`); if (x) x.focus(); });
});
