"use strict";
// === FASE 3a: KENNISMAKING EN MIJN AANPAK ===
/* De kennismaking uit Brain-Mate Nate (96 vragen, adaptief: 16 kernvragen plus
   verdieping tot ±44) geeft hooguit drie patronen (metaforen, geen diagnose).
   De app stelt per patroon aanpassingen voor; jij zet ze aan. Niets gaat vanzelf. */

/* PT-PROFIEL-BEGIN */
const PT_PATROON = {
  P1: { kort: "Veel ballen tegelijk in de lucht; aandacht en plannen kosten moeite.", app: "Minder projecten tegelijk en de volgende stap altijd in beeld." },
  P2: { kort: "Nieuwe ideeën geven energie, beginnen en volhouden gaan lastiger.", app: "Nieuwe ideeën eerst in de ideeënbak, en korte blokken om te starten." },
  P3: { kort: "Voorspelbaarheid geeft rust; prikkels en verrassingen kosten energie.", app: "Een rustige, vaste weergave zonder beweging." },
  P4: { kort: "Lezen en schrijven kosten extra moeite.", app: "Grotere tekst en minder tekst per scherm." },
  P5: { kort: "Gevoelens zijn sterk en herstel na een tegenvaller kost tijd.", app: "Zachte check-ins zonder tellers van wat niet lukte." },
  P6: { kort: "Dagelijkse routines en overgangen lopen niet vanzelf.", app: "Een vaste ochtendstart met één stap voor vandaag." },
  P7: { kort: "Veel aanpassen en compenseren kost energie.", app: "Kiezen op energie: wat past er vandaag bij je batterij?" }
};
const PT_BEWIJS = { direct: "Direct: bij ADHD onderzocht.", indirect: "Indirect: onderzocht, maar niet specifiek bij ADHD of autisme.", praktisch: "Praktisch: laag risico en nog een experiment; kijk of het bij jou werkt." };
/* Aanpassingen. patronen = voor wie de app het voorstelt. */
const PT_AANPASSINGEN = [
  { id: "wip2", label: "Hooguit 2 projecten tegelijk", uitleg: "De limiet gaat van 3 naar 2.", patronen: ["P1"], bewijs: "indirect",
    waarom: "Minder lopend werk betekent minder wisselen, en wisselen kost juist bij aandachtsproblemen veel." },
  { id: "ideeEerst", label: "Nieuwe ideeën eerst in de ideeënbak", uitleg: "De wizard start nieuwe projecten in de ideeënbak.", patronen: ["P2"], bewijs: "praktisch",
    waarom: "Een idee vastleggen zonder het meteen te starten, houdt de energie vast zonder dat er te veel tegelijk loopt." },
  { id: "kortBlok", label: "Korte focusblokken (15 minuten)", uitleg: "Een nieuw blok staat standaard op 15 minuten.", patronen: ["P2", "P7"], bewijs: "praktisch",
    waarom: "Een kort blok met een duidelijk einde is makkelijker te starten en kost minder energie." },
  { id: "rustig", label: "Rustige weergave", uitleg: "Geen beweging, geen draaiende radar.", patronen: ["P3"], bewijs: "praktisch",
    waarom: "Een scherm dat stilstaat en steeds hetzelfde is, geeft minder prikkels." },
  { id: "groot", label: "Grotere tekst", uitleg: "Alle tekst een maat groter.", patronen: ["P4"], bewijs: "praktisch",
    waarom: "Grotere letters kosten minder moeite om te lezen, zeker op een telefoon." },
  { id: "zacht", label: "Zachte check-ins", uitleg: "Alleen 'Gedaan' en 'Nog niet', zonder tellers van wat niet lukte.", patronen: ["P5"], bewijs: "praktisch",
    waarom: "Een vriendelijke check-in na een lastig moment helpt om weer op te pakken in plaats van te vermijden." },
  { id: "ochtend", label: "Ochtendstart", uitleg: "'s Ochtends op het Commandocentrum: welke ene stap doe je vandaag?", patronen: ["P6"], bewijs: "indirect",
    waarom: "Een vast moment om de dag te beginnen, met één concrete stap, maakt een routine makkelijker. Als-dan-plannen zijn in brede groepen onderzocht." },
  { id: "energie", label: "Kiezen op energie", uitleg: "Op het Commandocentrum: wat past bij je energie van nu?", patronen: ["P7"], bewijs: "praktisch",
    waarom: "Een taak die past bij je energie van dat moment, kost minder en maakt opnieuw beginnen lichter." }
];
/** Welke aanpassingen stelt de app voor bij deze patronen? */
function ptVoorgesteld(top) {
  const ids = (top || []).map(c => c.id || c);
  return PT_AANPASSINGEN.filter(a => a.patronen.some(p => ids.includes(p))).map(a => a.id);
}
/** Voortgang van de kennismaking: beantwoord / lengte van de route (de route groeit mee). */
function ptKmVoortgang(route, antwoorden) {
  const n = route.filter(id => antwoorden[id] !== undefined && antwoorden[id] !== null).length;
  return { n, van: route.length, pct: route.length ? Math.round(n / route.length * 100) : 0 };
}
/* PT-PROFIEL-EINDE */

const km = () => inst("km", { antwoorden: {} }) || { antwoorden: {} };
const kmRoute = () => nsRoute(PT_VRAGENBANK, km().antwoorden, {}, PT_WEGING, {});
const kmVraag = id => PT_VRAGENBANK.questions.find(q => q.question_id === id);
let profielCache = null, profielBron = null;
function profiel() {
  const d = km();
  if (profielBron === d && profielCache) return profielCache;
  profielBron = d;
  profielCache = nsKernKlaar(PT_VRAGENBANK, d.antwoorden) ? nsProfiel(PT_VRAGENBANK, d.antwoorden, {}, {}, PT_WEGING, {}) : null;
  return profielCache;
}
const aanAan = id => !!inst("ap_" + id, false);
/** Is het profiel af? Pas als er patronen zijn, of als er geen vragen meer over zijn. */
function profielAf() { const p = profiel(); return !!p && (p.top.length > 0 || !nsVolgende(kmRoute(), km().antwoorden)); }
/** Tussenstop: alle open A-domeinen hebben hun verdiepingsvragen (Q2 en Q3), dus het eerste beeld is compleet. */
function kmTussenstop() { const a = km().antwoorden; return kmRoute().filter(id => id.startsWith("A")).every(id => a[id] !== undefined && a[id] !== null); }

/* ---------- Kennismaking ---------- */
function vwKennismaking() {
  const d = km(), route = kmRoute(), volgende = nsVolgende(route, d.antwoorden), v = ptKmVoortgang(route, d.antwoorden), kernKlaar = nsKernKlaar(PT_VRAGENBANK, d.antwoorden);
  if (!d.gestart) return `<section class="paneel"><p class="hud-label">Kennismaking</p><h2>Hoe werk jij?</h2>
    <p>Zestien korte vragen over aandacht, plannen, prikkels, energie en routines, daarna een paar vragen over wat bij jou speelt. Samen 20 tot 45 vragen.</p>
    <p class="klein">Elke vraag mag je overslaan. Je kunt stoppen en later verdergaan. Alles blijft op dit toestel.</p>
    <p class="klein">${esc(PT_VRAGENBANK.disclaimer)}</p>
    <div class="knoprij"><button class="knop primair" data-km="start">Beginnen</button><button class="knop rand" data-ga="commando">Later</button></div></section>`;
  // Na de kernvragen: pas een tussenstop als er al patronen zijn; anders eerst de verdieping (daar komen de patronen uit).
  const tussen = kernKlaar && !d.verdiepen && volgende && kmTussenstop() && profiel() && profiel().top.length;
  if (kernKlaar && (tussen || !volgende)) {
    const p = profiel(), rest = route.length - v.n;
    return `<section class="paneel"><p class="hud-label">${volgende ? "Eerste beeld" : "Kennismaking klaar"}</p><h2 tabindex="-1">Je profiel is er</h2>
      <p>${p && p.top.length ? `Je patronen: <b>${p.top.map(c => esc(c.metafoor)).join(", ")}</b>.` : "In je antwoorden zie ik weinig gemelde behoefte. Je krijgt de standaardaanpak."}</p>
      ${volgende && !d.verdiepen ? `<p class="klein">Verdiepen geeft een preciezere afstemming: nog ongeveer ${rest} vragen.</p>` : ""}
      <div class="knoprij"><button class="knop primair" data-ga="aanpak">Mijn aanpak bekijken</button>${volgende && !d.verdiepen ? `<button class="knop rand" data-km="verdiepen">Verdiepen</button>` : ""}</div></section>`;
  }
  const q = kmVraag(volgende); if (!q) return `<div class="paneel"><p>Geen vragen meer.</p></div>`;
  const hoofd = q.response_options.slice(0, 5), extra = q.response_options.slice(5);
  return `<div class="km-voortgang" role="progressbar" aria-valuemin="0" aria-valuemax="${v.van}" aria-valuenow="${v.n}" aria-label="Voortgang kennismaking"><i style="width:${v.pct}%"></i></div>
    <section class="paneel km-vraag"><p class="hud-label">${esc(q.pillar_name || "")}</p><h2 id="km-tekst" tabindex="-1">${esc(q.question_text)}</h2>
    <div class="km-opties" role="group" aria-labelledby="km-tekst">${hoofd.map(o => `<button type="button" class="knop rand km-optie" data-km-antwoord="${esc(o.value)}" aria-pressed="${d.antwoorden[q.question_id] === o.value}">${esc(o.label)}</button>`).join("")}</div>
    <div class="km-extra">${extra.map(o => `<button type="button" class="link klein" data-km-antwoord="${esc(o.value)}">${esc(o.label)}</button>`).join("")}</div></section>
    <div class="knoprij"><button class="knop rand" data-km="vorige"${v.n ? "" : " disabled"}>Vorige</button><button class="knop rand" data-ga="commando">Pauzeren</button></div>
    ${kernKlaar ? `<p class="klein">Nog een paar vragen over wat bij jou speelt; daaruit komen je patronen. Stoppen mag altijd.</p>` : ""}
    <p class="klein voet mono">${v.n} van ${v.van}${kernKlaar ? " · verdieping" : ""}</p>`;
}
KOPPEN.kennismaking = () => ["Kennismaking", "Geen diagnose, wel afstemming"];
VIEWS.kennismaking = vwKennismaking;

/* ---------- Mijn aanpak ---------- */
function vwAanpak() {
  const p = profiel(), voor = ptVoorgesteld(p ? p.top : []);
  let h = `<section class="paneel"><p class="hud-label">Jouw patronen</p>`;
  if (!profielAf()) h += `<p>${km().gestart ? "Je kennismaking is nog niet af. Na een paar vragen meer ziet de app je patronen." : "Nog geen profiel. Na de kennismaking stemt de app zich op je af."}</p><button class="knop primair breed" data-ga="kennismaking">${km().gestart ? "Verder met de kennismaking" : "Kennismaken"}</button>`;
  else if (!p.top.length) h += `<p>In je antwoorden zie ik weinig gemelde behoefte. Je krijgt de standaardaanpak; alles hieronder kun je zelf aanzetten.</p>`;
  else h += `<ul class="patronen">${p.top.map(c => `<li><b>${esc(c.metafoor)}</b><small>${esc(PT_PATROON[c.id].kort)}</small><small class="patroon-app">→ ${esc(PT_PATROON[c.id].app)}</small></li>`).join("")}</ul>${p.top.length > 1 ? `<p class="klein">Meerdere patronen tegelijk is heel gewoon. Er is geen winnaar.</p>` : ""}`;
  h += `</section>` + sectie("Aanpassingen") + `<p class="klein leeg-regel">Bij een voorstel staat een label. Jij beslist wat aan staat.</p><ul class="aanpassingen">${PT_AANPASSINGEN.map(a => {
    const aan = aanAan(a.id);
    return `<li class="paneel"><button type="button" class="schakel" data-ap="${a.id}" aria-pressed="${aan}"><span><b>${esc(a.label)}</b>${voor.includes(a.id) ? `<span class="voorstel">Voorgesteld</span>` : ""}<small class="klein">${esc(a.uitleg)}</small></span><span class="toggle" aria-hidden="true"></span></button>
      <details class="waarom"><summary>Waarom?</summary><p>${esc(a.waarom)} ${esc(PT_BEWIJS[a.bewijs])}</p></details></li>`; }).join("")}</ul>`;
  h += `<p class="klein voet">${esc(PT_VRAGENBANK.disclaimer)}</p>`;
  if (km().gestart) h += `<div class="paneel acties"><button class="knop rand" data-km="opnieuw">Antwoorden wissen en opnieuw</button>${p && nsVolgende(kmRoute(), km().antwoorden) ? `<button class="knop rand" data-km="verdiepen">Verdiepen</button>` : ""}</div>`;
  return h;
}
KOPPEN.aanpak = () => { const p = profielAf() ? profiel() : null; return ["Mijn aanpak", p && p.top.length ? p.top.map(c => c.metafoor).join(" · ") : "Hoe de app zich op je afstemt"]; };
VIEWS.aanpak = vwAanpak;

/* ---------- Aanpassingen toepassen ---------- */
const AP_ZET = {
  wip2: async aan => { if (aan) { await zetInst("ap_vorigWip", wipLimiet()); await zetInst("wipLimiet", Math.min(wipLimiet(), 2)); } else await zetInst("wipLimiet", +inst("ap_vorigWip", 3)); },
  kortBlok: async aan => { if (aan) await zetInst("blokDuurZelf", false); },   // toegepast als standaard in het focusblok
  rustig: async () => {},   // toegepast in pasInstellingenToe, zonder je eigen instelling te overschrijven
  groot: async () => {}, zacht: async () => {}, ochtend: async () => {}, energie: async () => {}, ideeEerst: async () => {}
};
{
  const _toe = pasInstellingenToe;
  pasInstellingenToe = function () { _toe.apply(this, arguments); document.documentElement.dataset.groot = aanAan("groot") ? "1" : "0"; };
  // Ideeën eerst: de wizard start dan in de ideeënbak.
  const _nieuw = nieuwProject;
  nieuwProject = function (opnieuw) { const r = _nieuw.apply(this, arguments); if (WZ.d && aanAan("ideeEerst") && WZ.stap === 0 && !WZ.d.titel) { WZ.d.status = "idee"; } return r; };
}

/* ---------- Ingangen ---------- */
{
  const _meer = VIEWS.meer;
  VIEWS.meer = function () {
    const p = profielAf() ? profiel() : null;
    return `<button class="paneel rij-knop" data-ga="aanpak"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span><b>Mijn aanpak</b><small>${p && p.top.length ? esc(p.top.map(c => c.metafoor).join(" · ")) : "Kennismaking en aanpassingen"}</small></span>${ico("pijl")}</button>` + _meer.apply(this, arguments);
  };
  // Na het eerste project: een uitnodiging om kennis te maken (weg te tikken).
  const _cmd = VIEWS.commando;
  VIEWS.commando = function () {
    const h = _cmd.apply(this, arguments);
    if (!S.projecten.length || profielAf() || inst("kmLater", false)) return h;
    return h + `<section class="paneel"><p class="hud-label">Leer de app kennen</p><p>${km().gestart ? "Nog een paar vragen, dan stemt de app zich af op hoe jij werkt." : "Een korte kennismaking, dan stemt de app zich af op hoe jij werkt."}</p>
      <div class="knoprij"><button class="knop primair" data-ga="kennismaking">${km().gestart ? "Verdergaan" : "Kennismaken"}</button><button class="knop rand" data-km="later">Niet nu</button></div></section>`;
  };
}

/* ---------- Klikken ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-km],[data-km-antwoord],[data-ap]"); if (!el) return;
  const d = el.dataset;
  if (d.kmAntwoord !== undefined) {
    const k = km(), id = nsVolgende(kmRoute(), k.antwoorden); if (!id) return;
    await zetInst("km", Object.assign({}, k, { antwoorden: Object.assign({}, k.antwoorden, { [id]: d.kmAntwoord }), geschiedenis: (k.geschiedenis || []).concat(id) }));
    tril(6); teken(); const t = $("#km-tekst") || $("#scherm h2"); if (t) t.focus({ preventScroll: true });
    return;
  }
  if (d.km === "start") { await zetInst("km", Object.assign({}, km(), { gestart: new Date().toISOString() })); return teken(); }
  if (d.km === "vorige") {
    const k = km(), g = (k.geschiedenis || []).slice(), id = g.pop(); if (!id) return;
    const a = Object.assign({}, k.antwoorden); delete a[id];
    await zetInst("km", Object.assign({}, k, { antwoorden: a, geschiedenis: g })); return teken();
  }
  if (d.km === "verdiepen") { await zetInst("km", Object.assign({}, km(), { verdiepen: true })); return ga("kennismaking"); }
  if (d.km === "later") { await zetInst("kmLater", true); return teken(); }
  if (d.km === "opnieuw") return bevestig("Antwoorden wissen?", "Je kennismaking begint opnieuw. Je aanpassingen blijven zoals ze staan.", "Wissen", async () => { await zetInst("km", { antwoorden: {} }); ga("kennismaking"); });
  if (d.ap) {
    const aan = el.getAttribute("aria-pressed") !== "true";
    await zetInst("ap_" + d.ap, aan); await AP_ZET[d.ap](aan); pasInstellingenToe(); tril(6); teken();
    const b = document.querySelector(`#scherm [data-ap="${d.ap}"]`); if (b) b.focus({ preventScroll: true });
  }
});

// Zelf de limiet gewijzigd in Meer? Dan staat "Hooguit 2" niet meer aan.
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('[data-inst="wipLimiet"]'); if (b && aanAan("wip2")) zetInst("ap_wip2", false); }, true);
