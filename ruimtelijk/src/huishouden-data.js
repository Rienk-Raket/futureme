"use strict";
// === SECTIE 77: HUISHOUDEN – GEGEVENS, SCHATTING EN PLANNER ===
/* ==========================================================================
   Huishouden helpt vooral wie moeilijk begint, snel is afgeleid of tijd
   slecht inschat. De kern is de planner: gegeven een schoonmaaklijst en de
   tijd die je hebt, maakt hij behapbare kaartjes met geplande pauzes, in een
   volgorde die past bij je profielrichting (sectie 76, ndAanpak()).

   Waarom zo (kort; de volledige onderbouwing staat in het functioneel
   ontwerp, docs/huishouden-functioneel-ontwerp.md):
   - één kaartje tegelijk en een kleine eerste stap: beginnen (taakinitiatie)
     is bij ADHD vaak het grootste obstakel;
   - tijd zichtbaar en een buffer op elke schatting: tijdsperceptie wijkt af
     (Zheng e.a., 2022) en iedereen onderschat (planning-fallacy, Buehler
     e.a., 1994);
   - vaste, geplande pauzes: minder vermoeidheid en afleiding dan zelf
     gekozen pauzes (Biwer e.a., 2023);
   - vaste volgorde en een seintje voor een wissel bij autisme-kenmerken:
     voorspelbaarheid en visuele schema's (reviews over visuele
     activiteitsschema's);
   - kleine porties en zwaar werk vroeg bij weinig energie (pacing).
   - persoonlijke kalibratie: na elke sessie leert de app hoe lang jóuw
     taken echt duren, zodat de volgende planning beter klopt.

   Opslag (DB_VERSIE 12): hh_lijsten en hh_sessies. Bestaande stores blijven.
   ========================================================================== */

/* ---------- 77.1 Opslag ---------- */
WINKELS.hh_lijsten = "id";
WINKELS.hh_sessies = "id";
DB_OPTIES.hh_sessies = { keyPath: "id", indexen: [["datum", "datum"]] };
S.hh_lijsten = S.hh_lijsten || [];
S.hh_sessies = S.hh_sessies || [];

/* ---------- 77.2 Schatten: hoe lang en hoe zwaar? ----------
   Eerste schatting op trefwoorden; daarna leert de app van je eigen tijden. */
const HH_SCHATTING = [
  [/oven/i, 15], [/koelkast|vriezer/i, 12], [/ramen|raam/i, 12], [/douche|bad\b|badkuip/i, 10], [/bed (verschonen|opmaken)|verschonen/i, 10],
  [/stofzuig/i, 12], [/dweil/i, 10], [/vouw/i, 10], [/ophang/i, 8], [/afwas|vaat(?!wasser)/i, 10], [/stof/i, 8], [/opruim/i, 8],
  [/vaatwasser/i, 5], [/kookplaat|fornuis|gasfornuis/i, 5], [/wc|toilet/i, 6], [/veeg|vegen/i, 5], [/aanrecht/i, 4], [/gootsteen|wastafel|kraan/i, 4],
  [/spiegel/i, 2], [/afval|vuilnis|prullenbak|container/i, 2], [/planten/i, 3], [/handdoek/i, 2], [/was (draaien|aanzetten|in)/i, 3], [/bank|kussens/i, 4]
];
const HH_ZWAAR = /stofzuig|dweil|ramen|raam|douche|badkuip|\bbad\b|oven|koelkast|bed verschonen|verschonen|vloer/i;
const HH_LICHT = /spiegel|afval|vuilnis|prullenbak|planten|handdoek|was draaien|kussens|terugleggen/i;
function hhSchat(tekst) {
  const m = String(tekst).match(/(\d+)\s*(min|m\b|minuten)/i);
  if (m) return Math.max(1, Math.min(120, +m[1]));
  const k = HH_SCHATTING.find(([r]) => r.test(tekst));
  return k ? k[1] : 5;
}
const hhZwaarte = tekst => HH_ZWAAR.test(tekst) ? 2 : HH_LICHT.test(tekst) ? 0 : 1;
const hhSleutel = tekst => String(tekst).toLowerCase().replace(/\(.*?\)|\d+\s*(min|m|minuten)\b/g, "").replace(/[^a-zà-ÿ ]/g, " ").replace(/\s+/g, " ").trim();

/* Persoonlijke kalibratie: werkelijke tijd gedeeld door de basisschatting,
   over je eerdere sessies. Pas vanaf twee metingen, en begrensd. */
function hhKalibratie(tekst) {
  const k = hhSleutel(tekst);
  let echt = 0, basis = 0, n = 0;
  for (const s of S.hh_sessies) for (const r of s.resultaat || []) {
    if (r.status !== "gedaan" || !r.sec || r.soort === "pauze" || hhSleutel(r.tekst || "") !== k || !r.basisMin) continue;
    echt += r.sec / 60; basis += r.basisMin; n++;
  }
  if (n < 2 || !basis) return { factor: 1, n };
  return { factor: Math.max(.5, Math.min(3, echt / basis)), n };
}

/* ---------- 77.3 Tips per taak ----------
   Praktisch en kort. De tip bij "inwerken" maakt gebruik van wachttijd:
   middel laten inwerken terwijl je iets anders doet. */
const HH_TIPS = [
  [/wc|toilet/i, "Eerst middel in de pot, laten inwerken, intussen de bril en buitenkant."],
  [/douche|badkuip|\bbad\b/i, "Spray eerst en laat het inwerken terwijl je iets anders doet."],
  [/stofzuig/i, "Begin in de verste hoek en werk naar de deur toe."],
  [/dweil/i, "Werk van achter naar de deur, zodat je niet over nat loopt."],
  [/stof/i, "Van boven naar beneden: wat valt, zuig je daarna op."],
  [/afwas|vaat(?!wasser)/i, "Eerst alles verzamelen, dan pas wassen. Glazen eerst, pannen laatst."],
  [/opruim|terugleggen/i, "Neem een wasmand mee: alles wat hier niet hoort gaat erin."],
  [/ramen|raam|spiegel/i, "Niet in de volle zon, dan krijg je strepen."],
  [/bed|verschonen/i, "Hoeslaken eerst, diagonaal de hoeken om."],
  [/aanrecht/i, "Eerst leegmaken, dan afnemen. Een leeg aanrecht voelt al half klaar."],
  [/oven/i, "Laat een ovenreiniger inwerken en doe intussen de kookplaat."],
  [/afval|vuilnis|prullenbak/i, "Neem meteen een nieuwe zak mee naar de prullenbak."],
  [/was/i, "Zet een wekker voor als de was klaar is, anders blijft hij staan."]
];
const HH_PRIKKEL = /wc|toilet|douche|oven|badkuip|\bbad\b|ramen|dweil|kookplaat|middel/i;
function hhTip(tekst, aanpak, eerste) {
  const t = (HH_TIPS.find(([r]) => r.test(tekst)) || [])[1] || "";
  const r = aanpak.richting;
  if ((r === "autisme" || r === "audhd") && HH_PRIKKEL.test(tekst)) return (t ? t + " " : "") + "Geurvrij middel of handschoenen als het te veel is.";
  if (eerste && (r === "adhd" || r === "audhd")) return "Alleen deze. Niet aan het geheel denken." + (t ? " " + t : "");
  if (r === "energie" && hhZwaarte(tekst) === 2) return (t ? t + " " : "") + "Mag zittend of in twee keer.";
  return t;
}

/* ---------- 77.4 Startlijsten ----------
   "Reset in 5 dingen" volgt een bekende aanpak voor wie overweldigd raakt:
   afval, afwas, was, dingen met een plek, dingen zonder plek. */
const HH_STARTLIJSTEN = [
  { sleutel: "reset", naam: "Reset in 5 dingen", emoji: "⚡", ritme: 1, taken: [
    ["Overal", "Afval weggooien", 3, "moet"], ["Overal", "Afwas verzamelen naar de keuken", 4, "moet"], ["Overal", "Wasgoed naar de wasmand", 3, "normaal"],
    ["Overal", "Dingen met een vaste plek terugleggen", 6, "normaal"], ["Overal", "Dingen zonder plek in één bak", 3, "bonus"]] },
  { sleutel: "keuken", naam: "Keuken", emoji: "🍳", ritme: 3, taken: [
    ["Keuken", "Aanrecht leegmaken", 3, "moet"], ["Keuken", "Vaatwasser uitruimen", 5, "moet"], ["Keuken", "Vaatwasser inruimen", 5, "moet"], ["Keuken", "Aanrecht afnemen", 3, "normaal"],
    ["Keuken", "Kookplaat schoonmaken", 5, "normaal"], ["Keuken", "Gootsteen schoonmaken", 3, "normaal"], ["Keuken", "Vuilnis wegbrengen", 2, "moet"], ["Keuken", "Vloer vegen", 5, "bonus"]] },
  { sleutel: "badkamer", naam: "Badkamer", emoji: "🛁", ritme: 7, taken: [
    ["Badkamer", "Wastafel en kraan", 4, "moet"], ["Badkamer", "Spiegel", 2, "normaal"], ["Badkamer", "Wc schoonmaken", 6, "moet"], ["Badkamer", "Douche schoonmaken", 10, "normaal"],
    ["Badkamer", "Handdoeken verwisselen", 2, "normaal"], ["Badkamer", "Vloer dweilen", 6, "bonus"]] },
  { sleutel: "week", naam: "Weekschoonmaak", emoji: "🏠", ritme: 7, taken: [
    ["Woonkamer", "Opruimen", 8, "moet"], ["Woonkamer", "Stof afnemen", 8, "normaal"], ["Woonkamer", "Stofzuigen", 12, "moet"],
    ["Slaapkamer", "Bed verschonen", 10, "normaal"], ["Slaapkamer", "Opruimen", 5, "normaal"],
    ["Keuken", "Aanrecht en kookplaat", 8, "moet"], ["Keuken", "Vuilnis wegbrengen", 2, "moet"],
    ["Badkamer", "Wc schoonmaken", 6, "moet"], ["Badkamer", "Wastafel en spiegel", 5, "normaal"],
    ["Hal", "Schoenen en jassen opruimen", 3, "bonus"], ["Overal", "Vloeren dweilen", 15, "bonus"]] }
];
function hhVanStart(s) {
  const nu = new Date().toISOString();
  return { id: uid(), naam: s.naam, emoji: s.emoji, ritme: s.ritme, bron: { soort: "start", id: s.sleutel }, gemaakt: nu, bijgewerkt: nu, laatstGedaan: null,
    taken: s.taken.map(([ruimte, tekst, min, prio]) => ({ id: uid(), ruimte, tekst, min, zwaar: hhZwaarte(tekst), prio, uit: false })) };
}

/* ---------- 77.5 Import uit Checklists ----------
   Alleen sjablonen waarvan de naam met "Schoonmaken" begint. Kopjes in de
   checklist (# Keuken of -- Keuken) worden ruimtes. In de tekst mag een
   duur staan ("Oven (15 min)"), een ! voor moet, of (bonus). */
const hhIsSchoonmaakSjabloon = c => !!c && c.sjabloon && /^\s*schoonmaken/i.test(c.naam || "");
const hhSjablonen = () => S.checklists.filter(hhIsSchoonmaakSjabloon);
const hhLijstNaam = naam => String(naam).replace(/^\s*schoonmaken\s*[-–—:·|]*\s*/i, "").trim() || "Schoonmaken";
function hhVanChecklist(c, bestaand) {
  let ruimte = "Overal";
  const oud = bestaand ? bestaand.taken : [];
  const taken = [];
  for (const it of c.items || []) {
    const tekst0 = String(it.tekst || "").trim();
    if (!tekst0) continue;
    if (typeof clSectie === "function" && clSectie(it)) { ruimte = tekst0.replace(/^\s*(#+|--)\s*/, "").trim() || "Overal"; continue; }
    const prio = /^!/.test(tekst0) ? "moet" : /\(bonus\)|^\?/i.test(tekst0) ? "bonus" : "normaal";
    const tekst = tekst0.replace(/^[!?]\s*/, "").replace(/\s*\(bonus\)/i, "").replace(/\s*\(?\d+\s*(min|m|minuten)\)?\s*$/i, "").trim();
    const vorig = oud.find(t => hhSleutel(t.tekst) === hhSleutel(tekst) && t.ruimte === ruimte);
    taken.push(vorig ? Object.assign({}, vorig, { tekst }) : { id: uid(), ruimte, tekst, min: hhSchat(tekst0), zwaar: hhZwaarte(tekst), prio, uit: false });
  }
  const nu = new Date().toISOString();
  return Object.assign({ id: uid(), emoji: "🧽", ritme: 7, gemaakt: nu, laatstGedaan: null }, bestaand || {},
    { naam: hhLijstNaam(c.naam), bron: { soort: "checklist", id: c.id }, taken, bijgewerkt: nu });
}
async function hhImporteer(checklistId) {
  const c = vind("checklists", checklistId);
  if (!hhIsSchoonmaakSjabloon(c)) { toast("Alleen sjablonen die met “Schoonmaken” beginnen"); return null; }
  const bestaand = S.hh_lijsten.find(l => l.bron && l.bron.soort === "checklist" && l.bron.id === c.id);
  const l = hhVanChecklist(c, bestaand);
  await bewaar("hh_lijsten", l);
  toast(bestaand ? `“${l.naam}” bijgewerkt uit het sjabloon` : `“${l.naam}” staat in Huishouden`);
  return l;
}

/* ---------- 77.6 De planner ----------
   Invoer: lijst, beschikbare minuten, opties { energie 1–5, alleen: [taakIds] }.
   Uitvoer: { items, werkMin, pauzeMin, totaal, cap, buiten, notities }.
   Een item is { soort: "taak"|"pauze", tekst, ruimte, min, basisMin, deel, delen, tip, wissel }. */
function hhMaakPlan(lijst, beschikbaar, opties) {
  opties = opties || {};
  const a = ndAanpak(), notities = [];
  let buffer = a.buffer, cap = Math.max(1, +beschikbaar || 0);
  if (a.maxSessie && cap > a.maxSessie) { notities.push(`Voor jouw aanpak is ${a.maxSessie} minuten achter elkaar genoeg. De rest schuift door naar een volgende keer.`); cap = a.maxSessie; }
  const laag = opties.energie != null && opties.energie <= 2;
  if (laag) { buffer += .1; notities.push("Weinig energie vandaag: zware klussen alleen als ze moeten, en wat meer tijd per klus."); }
  let taken = (lijst.taken || []).filter(t => !t.uit && (!opties.alleen || opties.alleen.includes(t.id)));
  if (laag) taken = taken.filter(t => t.zwaar < 2 || t.prio === "moet");
  // Schatting met kalibratie, daarna de buffer.
  const schat = t => { const k = hhKalibratie(t.tekst); return { basis: +t.min || hhSchat(t.tekst), factor: k.factor, n: k.n }; };
  const kosten = w => { const werk = w * buffer; const pauzes = Math.max(0, Math.ceil(werk / a.pauzeElke) - 1); return werk + pauzes * a.pauzeMin; };
  // Kiezen: eerst "moet", dan "normaal", dan "bonus"; binnen elke groep in lijstvolgorde.
  const PRIO = { moet: 0, normaal: 1, bonus: 2 };
  const kandidaten = taken.map((t, i) => Object.assign({ t, i }, schat(t))).sort((x, y) => (PRIO[x.t.prio] ?? 1) - (PRIO[y.t.prio] ?? 1) || x.i - y.i);
  const gekozen = [], buiten = [];
  let werk = 0;
  // Snel succes: reserveer eerst de kortste klus (hooguit 5 min), ook als hij geen "moet" is.
  // Beginnen is het moeilijkste deel; een klus die meteen af is, geeft vaart.
  if (a.volgorde === "snelsucces") {
    const kort = kandidaten.filter(k => k.basis * k.factor <= 5).sort((x, y) => x.basis * x.factor - y.basis * y.factor)[0];
    if (kort) { const m = Math.max(1, Math.round(kort.basis * kort.factor)); if (kosten(m) <= cap + .01) { gekozen.push(Object.assign(kort, { m })); werk += m; kandidaten.splice(kandidaten.indexOf(kort), 1); } }
  }
  for (const k of kandidaten) {
    const m = Math.max(1, Math.round(k.basis * k.factor));
    if (kosten(werk + m) <= cap + .01) { gekozen.push(Object.assign(k, { m })); werk += m; } else buiten.push(k.t);
  }
  // Past er zelfs niets? Dan de kleinste taak in de tijd die er is: altijd iets om mee te beginnen.
  if (!gekozen.length && kandidaten.length) {
    const k = kandidaten.slice().sort((x, y) => x.basis - y.basis)[0];
    gekozen.push(Object.assign(k, { m: Math.max(1, Math.min(Math.round(k.basis * k.factor), Math.floor(cap / buffer) || 1)) }));
    buiten.splice(buiten.indexOf(k.t), 1);
    notities.push("Er past maar één klus in deze tijd. Dat is genoeg om te beginnen.");
  }
  // Volgorde volgens de aanpak.
  const ruimtes = [...new Set(gekozen.sort((x, y) => x.i - y.i).map(k => k.t.ruimte || "Overal"))];
  const perRuimte = r => gekozen.filter(k => (k.t.ruimte || "Overal") === r).sort((x, y) => x.i - y.i);
  let volgorde = [];
  if (a.volgorde === "zwaarEerst") {
    volgorde = gekozen.slice().sort((x, y) => y.t.zwaar - x.t.zwaar || ruimtes.indexOf(x.t.ruimte || "Overal") - ruimtes.indexOf(y.t.ruimte || "Overal") || x.i - y.i);
  } else {
    ruimtes.forEach(r => { let l = perRuimte(r); if (a.variatie) { const z = l.filter(k => k.t.zwaar === 2), rest = l.filter(k => k.t.zwaar !== 2); l = []; while (z.length || rest.length) { if (rest.length) l.push(rest.shift()); if (z.length) l.push(z.shift()); } } volgorde.push(...l); });
    if (a.volgorde === "snelsucces") {
      // Snel succes eerst: de kortste lichte klus vooraan, dan kom je in beweging.
      const kort = volgorde.filter(k => k.m <= 3).sort((x, y) => x.m - y.m)[0] || volgorde.slice().sort((x, y) => x.m - y.m)[0];
      if (kort) volgorde = [kort].concat(volgorde.filter(k => k !== kort));
    }
  }
  // Opknippen: blokken van hooguit blokMax minuten (inclusief buffer).
  const items = [];
  volgorde.forEach(k => {
    const totaal = Math.max(1, Math.round(k.m * buffer));
    const delen = Math.max(1, Math.ceil(totaal / a.blokMax));
    for (let d = 1; d <= delen; d++) {
      const min = Math.round(totaal / delen) || 1;
      items.push({ soort: "taak", taakId: k.t.id, tekst: k.t.tekst, ruimte: k.t.ruimte || "Overal", zwaar: k.t.zwaar, min, basisMin: k.basis / delen, deel: d, delen, geleerd: k.n >= 2 && Math.abs(k.factor - 1) > .1 ? k.factor : null });
    }
  });
  // Pauzes invoegen na elke pauzeElke minuten werk, niet aan het eind.
  const metPauzes = []; let acc = 0;
  items.forEach((it, i) => {
    metPauzes.push(it); acc += it.min;
    if (acc >= a.pauzeElke && i < items.length - 1) { metPauzes.push({ soort: "pauze", tekst: "Pauze", min: a.pauzeMin, tip: hhPauzeTip(a) }); acc = 0; }
  });
  // Tips en wisselseintjes.
  let eerste = true;
  metPauzes.forEach((it, i) => {
    if (it.soort !== "taak") return;
    it.tip = hhTip(it.tekst, a, eerste); eerste = false;
    const volgende = metPauzes.slice(i + 1).find(x => x.soort === "taak");
    if (a.wisselSein && volgende && volgende.ruimte !== it.ruimte) it.wissel = volgende.ruimte;
  });
  // Afronden per kaartje kan het totaal net over de tijd duwen: haal dan minuten van de langste kaartjes af.
  const som = () => metPauzes.reduce((s, x) => s + x.min, 0);
  for (let n = 0; som() > cap && n < 200; n++) { const l = metPauzes.filter(x => x.soort === "taak" && x.min > 1).sort((x, y) => y.min - x.min)[0]; if (!l) break; l.min--; }
  const werkMin = metPauzes.filter(x => x.soort === "taak").reduce((s, x) => s + x.min, 0), pauzeMin = metPauzes.filter(x => x.soort === "pauze").reduce((s, x) => s + x.min, 0);
  return { items: metPauzes, werkMin, pauzeMin, totaal: werkMin + pauzeMin, cap, buffer, buiten, notities, richting: a.richting };
}
function hhPauzeTip(a) {
  if (a.richting === "energie" || a.extraEnergie) return "Echt rusten: zitten of liggen, ogen dicht. Niet je telefoon.";
  if (a.richting === "autisme" || a.richting === "audhd") return "Even prikkelarm: zachter licht, stilte of oordoppen.";
  if (a.richting === "adhd") return "Water drinken en even bewegen. Blijf in de buurt, de timer loopt.";
  return "Even zitten, water drinken.";
}

/* ---------- 77.7 Ritme: wat is aan de beurt? ---------- */
function hhAanDeBeurt() {
  const v = vandaagISO();
  return S.hh_lijsten.filter(l => l.ritme).map(l => {
    const laatst = l.laatstGedaan ? l.laatstGedaan.slice(0, 10) : null;
    const dagen = laatst ? dagVerschil(v, laatst) : null;
    return { l, dagen, te: dagen == null ? 1 : dagen / l.ritme };
  }).sort((a, b) => b.te - a.te);
}

/* ---------- 77.8 Cijfers ---------- */
function hhWeekCijfers() {
  const ws = weekStart(vandaagISO());
  const s = S.hh_sessies.filter(x => (x.datum || "") >= ws);
  const taken = s.reduce((a, x) => a + (x.resultaat || []).filter(r => r.status === "gedaan" && r.soort !== "pauze").length, 0);
  const min = s.reduce((a, x) => a + Math.round((x.werkSec || 0) / 60), 0);
  return { sessies: s.length, taken, min };
}
/* In Voortgang als automatische bronnen (gebied Thuis en taken) en mijlpalen. */
if (typeof vgAutoBronnen === "function") {
  const _vg = vgAutoBronnen;
  vgAutoBronnen = function () {
    const uit = _vg();
    uit.push({ id: "huishouden.minuten", naam: "Minuten schoongemaakt", eenheid: "min", agg: "som", gebied: "thuis", richting: "omhoog", data: () => S.hh_sessies.map(s => ({ d: s.datum, v: Math.round((s.werkSec || 0) / 60) })) });
    uit.push({ id: "huishouden.taken", naam: "Huishoudklussen gedaan", eenheid: "aantal", agg: "som", gebied: "thuis", richting: "omhoog", data: () => S.hh_sessies.map(s => ({ d: s.datum, v: (s.resultaat || []).filter(r => r.status === "gedaan" && r.soort !== "pauze").length })) });
    return uit;
  };
  if (typeof VG_MP_TEKST === "object") {
    VG_MP_TEKST["huishouden.taken"] = n => `${nwoGetal(n)} ${n === 1 ? "huishoudklus" : "huishoudklussen"} gedaan`;
    VG_MP_TEKST["huishouden.minuten"] = n => `${nwoGetal(n / 60)} uur schoongemaakt`;
  }
}
