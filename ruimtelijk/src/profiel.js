"use strict";
// === SECTIE 76: PROFIEL – WIE BEN JIJ, EN WELKE AANPAK PAST ===
/* ==========================================================================
   Het profiel beschrijft de gebruiker: naam, geboortedatum (leeftijd wordt
   berekend), lengte, gewicht en een richting voor de aanpak. Die richting
   komt uit tien zelfreflectievragen of wordt met de hand gekozen.

   Belangrijk: de vragenlijst is GEEN test en geeft GEEN diagnose. Hij is
   niet gevalideerd. Hij geeft alleen een richting voor handvatten (hoe klussen
   worden ingedeeld, hoe lang blokken zijn, wanneer er pauze komt). Voor een
   echte beoordeling verwijzen we naar de huisarts; gevalideerde screeners
   zijn bijvoorbeeld de ASRS (ADHD) en de AQ-10 (autisme).

   Opslag: één record in de bestaande instellingen (sleutel "profiel"), dus
   geen nieuwe store. De richting stuurt ndAanpak(); andere modules lezen
   alleen die functie.
   ========================================================================== */

/* ---------- 76.1 Gegevens ---------- */
const PF_STANDAARD = { naam: "", geboortedatum: "", lengte: null, gewicht: null, nd: { antwoorden: [], richting: null, handmatig: null, energie: false, datum: null } };
function pfProfiel() {
  const p = inst("profiel", null) || {};
  return Object.assign({}, PF_STANDAARD, p, { nd: Object.assign({}, PF_STANDAARD.nd, p.nd || {}) });
}
async function pfZet(veranderd) {
  const p = Object.assign(pfProfiel(), veranderd);
  await zetInst("profiel", p);
  return p;
}
const pfNaam = () => (pfProfiel().naam || "").trim();
function pfLeeftijd(gd) {
  if (!gd) return null;
  const g = new Date(gd + "T12:00:00"), n = new Date();
  let l = n.getFullYear() - g.getFullYear();
  if (n.getMonth() < g.getMonth() || (n.getMonth() === g.getMonth() && n.getDate() < g.getDate())) l--;
  return l >= 0 && l < 130 ? l : null;
}
/* Gewicht: het profielveld, of anders de laatste meting uit Gezondheid. */
function pfGewicht() {
  const p = pfProfiel();
  const laatste = (S.vs_gewicht || []).filter(g => g.kg).sort((a, b) => b.datum.localeCompare(a.datum))[0];
  return laatste ? { kg: +laatste.kg, bron: "Gezondheid", datum: laatste.datum } : p.gewicht ? { kg: +p.gewicht, bron: "profiel" } : null;
}

/* ---------- 76.2 Tien vragen, drie dimensies ----------
   A = aandacht, beginnen, tijd (ADHD-kenmerken)
   S = prikkels, voorspelbaarheid, wisselen (autisme-kenmerken)
   E = energie (energiebeperking, zoals burn-out of ME/CVS)
   Antwoord 0–4: nooit, zelden, soms, vaak, heel vaak. */
const PF_VRAGEN = [
  ["A", "Ik stel klussen uit, ook als ik ze belangrijk vind, omdat beginnen zwaar voelt."],
  ["A", "Midden in een klus raak ik afgeleid en maak ik hem niet af."],
  ["A", "Ik schat verkeerd in hoe lang iets duurt, of ik kom te laat."],
  ["A", "Saaie, herhalende taken maken me onrustig; ik zoek snel iets nieuws."],
  ["S", "Geluid, geur, licht of texturen (zoals schoonmaakmiddel) zijn me snel te veel."],
  ["S", "Onverwachte veranderingen in mijn planning brengen me flink van slag."],
  ["S", "Wisselen van de ene taak naar de andere kost me veel moeite."],
  ["S", "Ik doe dingen het liefst op een vaste manier en in een vaste volgorde."],
  ["E", "Na een gewone inspanning ben ik uren of dagen uitgeput."],
  ["E", "Ik moet mijn energie per dag zuinig verdelen om niet in te storten."]
];
const PF_SCHAAL = ["Nooit", "Zelden", "Soms", "Vaak", "Heel vaak"];
const PF_RICHTINGEN = {
  adhd: { naam: "ADHD-kenmerken", kort: "Aandacht en beginnen", ico: "⚡", uitleg: "Beginnen, afleiding en tijd zijn het lastigst. Korte blokken, snel succes en zichtbare tijd helpen." },
  autisme: { naam: "Autisme-kenmerken", kort: "Voorspelbaarheid en prikkels", ico: "🧩", uitleg: "Voorspelbaarheid, prikkels en wisselen kosten energie. Een vaste volgorde, vooraf alles zien en een seintje voor een wissel helpen." },
  audhd: { naam: "ADHD- én autisme-kenmerken", kort: "Beide", ico: "🔀", uitleg: "Zowel beginnen en afleiding als prikkels en wisselen. Korte blokken in een vaste volgorde, met een seintje voor elke wissel." },
  energie: { naam: "Weinig energie", kort: "Energie verdelen", ico: "🔋", uitleg: "Je energie is beperkt. Kleine porties, vaak rust en zwaar werk verdelen (pacing) helpen." },
  geen: { naam: "Geen duidelijke richting", kort: "Algemeen", ico: "🌿", uitleg: "Geen uitgesproken richting. Je krijgt de standaardaanpak, die je altijd kunt aanpassen." }
};
function pfUitslag(antwoorden) {
  const som = d => PF_VRAGEN.reduce((a, [dim], i) => a + (dim === d ? (+antwoorden[i] || 0) : 0), 0);
  const A = som("A") / 16, Sx = som("S") / 16, E = som("E") / 8;
  let richting = "geen";
  if (A >= .56 && Sx >= .56) richting = "audhd";
  else if (A >= .5 && A >= Sx) richting = "adhd";
  else if (Sx >= .5) richting = "autisme";
  else if (E >= .62) richting = "energie";
  return { A, S: Sx, E, richting, energie: E >= .62 };
}
/* De richting die telt: handmatig gekozen gaat voor de vragenlijst. */
function pfRichting() {
  const nd = pfProfiel().nd;
  return nd.handmatig || nd.richting || "geen";
}

/* ---------- 76.3 De aanpak per richting ----------
   Eén plek met alle knoppen waar andere modules aan draaien. Onderbouwing
   staat in het functioneel ontwerp (docs/huishouden-functioneel-ontwerp.md).
   - blokMax      : langste werkblok in minuten (daarna wordt een taak opgeknipt)
   - pauzeElke    : na zoveel minuten werk een geplande pauze (systematische pauzes)
   - pauzeMin     : lengte van die pauze
   - buffer       : factor op de geschatte tijd (planning-fallacy, tijdsblindheid)
   - volgorde     : "snelsucces" | "vast" | "zwaarEerst"
   - wisselSein   : seintje 1 minuut voor een wissel (overgangen)
   - variatie     : ruimtes afwisselen tegen verveling
   - afkoelUur    : wishlist-afkoelperiode (uren) voor aankopen boven € 50
   - maxSessie    : langste aangeraden sessie in minuten (null = geen)
   - ankerProfiel : bijpassend profiel in Anker */
const ND_AANPAK = {
  adhd:    { blokMax: 10, pauzeElke: 25, pauzeMin: 5, buffer: 1.25, volgorde: "snelsucces", wisselSein: false, variatie: true, afkoelUur: 72, maxSessie: null, ankerProfiel: "anders" },
  autisme: { blokMax: 15, pauzeElke: 30, pauzeMin: 5, buffer: 1.2, volgorde: "vast", wisselSein: true, variatie: false, afkoelUur: 24, maxSessie: null, ankerProfiel: "anders" },
  audhd:   { blokMax: 10, pauzeElke: 25, pauzeMin: 5, buffer: 1.3, volgorde: "vast", wisselSein: true, variatie: false, afkoelUur: 72, maxSessie: null, ankerProfiel: "anders" },
  energie: { blokMax: 8, pauzeElke: 15, pauzeMin: 8, buffer: 1.3, volgorde: "zwaarEerst", wisselSein: false, variatie: false, afkoelUur: 24, maxSessie: 45, ankerProfiel: "energie" },
  geen:    { blokMax: 20, pauzeElke: 45, pauzeMin: 5, buffer: 1.15, volgorde: "vast", wisselSein: false, variatie: false, afkoelUur: 24, maxSessie: null, ankerProfiel: null }
};
function ndAanpak() {
  const r = pfRichting(), a = Object.assign({ richting: r }, ND_AANPAK[r] || ND_AANPAK.geen);
  // Lage energie naast een andere richting: kortere sessies en langere pauzes.
  if (r !== "energie" && pfProfiel().nd.energie) Object.assign(a, { pauzeElke: Math.min(a.pauzeElke, 20), pauzeMin: Math.max(a.pauzeMin, 8), maxSessie: 60, extraEnergie: true });
  return a;
}

/* ---------- 76.4 Handvatten per plek in de app ----------
   Korte, concrete tips per richting. Altijd één zin, geen labels in koppen. */
const ND_TIPS = {
  taken: {
    adhd: "Begin met iets van 2 minuten. Beginnen is het moeilijkste deel; daarna gaat het vaak vanzelf.",
    autisme: "Schrijf bij elke taak de eerste concrete stap. Dan weet je precies wat er gebeurt.",
    audhd: "Zet de eerste stap erbij en begin met iets kleins. Plan geen twee wissels vlak na elkaar.",
    energie: "Kies vandaag maximaal drie taken. Wat niet lukt, schuift gewoon door.",
    geen: "Maak er een als-dan-plan van: “Als ik koffie heb, dan begin ik aan …”."
  },
  planning: {
    adhd: "Plan 25% extra tijd en zet een vertrekwekker, niet alleen een afspraakwekker.",
    autisme: "Zet overgangen in je agenda: een blok van 10 minuten tussen afspraken.",
    audhd: "Plan 30% extra tijd en een rustblok na elke afspraak.",
    energie: "Houd na een drukke afspraak een rustblok vrij (pacing).",
    geen: "Plan wat buffer tussen afspraken; dingen duren vaak langer dan je denkt."
  },
  sidehustle: {
    adhd: "Werk aan één side hustle tegelijk en knip het werk in blokken van 25 minuten.",
    autisme: "Kies een vast moment in de week voor je side hustle; dat maakt het voorspelbaar.",
    audhd: "Eén hustle tegelijk, op een vast moment, in korte blokken.",
    energie: "Houd je side hustle klein: één kleine stap per keer, alleen op goede dagen.",
    geen: "Zet elke week één concrete volgende stap."
  },
  wishlist: {
    adhd: "Afkoelen: wacht 72 uur voor je iets boven € 50 koopt. Impulsen zakken vaak weg.",
    autisme: "Vergelijk op vaste punten (prijs, gebruik, prikkels) en beslis op een vast moment.",
    audhd: "Wacht 72 uur en vergelijk op vaste punten voor je iets boven € 50 koopt.",
    energie: "Vraag bij elke wens: bespaart dit energie? Dan telt dat mee.",
    geen: "Slaap er een nacht over bij grotere aankopen."
  },
  huishouden: {
    adhd: "Korte blokken, snel succes eerst, en de tijd zichtbaar. Muziek of een podcast helpt.",
    autisme: "Vaste volgorde per ruimte, alles vooraf te zien, en een seintje voor elke wissel.",
    audhd: "Korte blokken in een vaste volgorde, met een seintje voor elke wissel.",
    energie: "Kleine porties, zwaar werk vroeg, en echte rust in de pauzes.",
    geen: "Werk per ruimte en neem op tijd pauze."
  }
};
function ndTip(plek) {
  const r = pfRichting(), t = ND_TIPS[plek];
  return t ? (t[r] || t.geen) : "";
}
function ndTipKaart(plek) {
  const tip = ndTip(plek), r = pfRichting();
  if (!tip || !inst("ndTips", true)) return "";
  const rr = PF_RICHTINGEN[r] || PF_RICHTINGEN.geen;
  return `<div class="nd-tip" role="note"><span class="nd-ico" aria-hidden="true">${rr.ico}</span><span>${esc(tip)}</span>
    <button class="nd-tipknop" data-act="ga" data-view="profiel" aria-label="Aanpak aanpassen in je profiel">${ico("pijlr")}</button></div>`;
}

/* ---------- 76.5 Scherm: Profiel ----------
   Uitklapbare secties (details/summary), zodat het rustig blijft. */
function vwProfiel() {
  const p = pfProfiel(), l = pfLeeftijd(p.geboortedatum), gw = pfGewicht(), r = pfRichting(), rr = PF_RICHTINGEN[r];
  const bmi = gw && p.lengte ? gw.kg / Math.pow(p.lengte / 100, 2) : null;
  const open = V.pfOpen || "over";
  const sectie2 = (id, titel, sub, inhoud) => `<details class="pf-sectie" data-pf="${id}"${open === id ? " open" : ""}><summary><span><b>${titel}</b><small>${esc(sub)}</small></span>${ico("pijlr")}</summary><div class="pf-inhoud">${inhoud}</div></details>`;
  let h = `<div class="pf-kop"><div class="pf-avatar" aria-hidden="true">${esc((p.naam || "?").trim().slice(0, 1).toUpperCase() || "?")}</div>
    <div><b>${esc(p.naam || "Jouw profiel")}</b><span>${[l != null ? l + " jaar" : "", rr ? rr.ico + " " + rr.kort : ""].filter(Boolean).join(" · ") || "Vul in wat je wilt; alles is optioneel"}</span></div></div>`;
  h += sectie2("over", "Over jou", [p.naam, l != null ? l + " jaar" : ""].filter(Boolean).join(" · ") || "Naam en geboortedatum", `
    <div class="veld"><label for="pf-naam">Naam</label><input class="invoer" id="pf-naam" value="${esc(p.naam)}" maxlength="40" autocomplete="given-name" placeholder="Hoe mag de app je noemen?"></div>
    <div class="veld"><label for="pf-gd">Geboortedatum</label><input class="invoer" id="pf-gd" type="date" value="${esc(p.geboortedatum)}" max="${vandaagISO()}"></div>
    <p class="pf-klein">${l != null ? `Leeftijd: <b>${l} jaar</b>` : "Je leeftijd wordt berekend uit je geboortedatum."}</p>`);
  h += sectie2("lichaam", "Lichaam", [p.lengte ? p.lengte + " cm" : "", gw ? nwoGetal(gw.kg, 1) + " kg" : ""].filter(Boolean).join(" · ") || "Lengte en gewicht", `
    <div class="pf-twee"><div class="veld"><label for="pf-lengte">Lengte (cm)</label><input class="invoer" id="pf-lengte" type="number" inputmode="numeric" min="50" max="250" value="${p.lengte || ""}"></div>
      <div class="veld"><label for="pf-gewicht">Gewicht (kg)</label><input class="invoer" id="pf-gewicht" type="number" inputmode="decimal" step="0.1" min="20" max="400" value="${p.gewicht || ""}"></div></div>
    ${gw && gw.bron === "Gezondheid" ? `<p class="pf-klein">Laatste meting in Gezondheid: <b>${nwoGetal(gw.kg, 1)} kg</b> (${esc(datumLabel(gw.datum))}). Die gebruikt de app voor berekeningen.</p>` : ""}
    ${bmi ? `<p class="pf-klein">BMI: <b>${nwoGetal(bmi, 1)}</b>. Een BMI zegt weinig over één persoon; zie het als ruwe indicatie.</p>` : ""}`);
  const nd = p.nd, uit = nd.antwoorden.length === 10 ? pfUitslag(nd.antwoorden) : null;
  h += sectie2("aanpak", "Aanpak die bij je past", rr ? rr.ico + " " + rr.naam : "Nog niet gekozen", `
    <p class="pf-klein">De app past de indeling van klussen, taken, planning, side hustles en wishlist-afwegingen aan op de richting die bij je past. Kies zelf, of beantwoord tien korte vragen.</p>
    <div class="veld"><label for="pf-richting">Mijn richting</label><select class="invoer" id="pf-richting">
      <option value=""${!nd.handmatig ? " selected" : ""}>${nd.richting ? "Uit de vragen: " + esc(PF_RICHTINGEN[nd.richting].naam) : "Nog niet gekozen (algemeen)"}</option>
      ${Object.entries(PF_RICHTINGEN).map(([k, v]) => `<option value="${k}"${nd.handmatig === k ? " selected" : ""}>${v.ico} ${esc(v.naam)}</option>`).join("")}</select></div>
    ${rr ? `<div class="pf-richting"><b>${rr.ico} ${esc(rr.naam)}</b><p>${esc(rr.uitleg)}</p>${pfAanpakLijst()}</div>` : ""}
    ${uit ? `<div class="pf-scores" aria-label="Uitkomst van de vragen">${[["Aandacht en beginnen", uit.A], ["Prikkels en voorspelbaarheid", uit.S], ["Energie", uit.E]].map(([n, v]) => `<div class="pf-score"><span>${n}</span><i><b style="width:${Math.round(v * 100)}%"></b></i><small>${Math.round(v * 100)}%</small></div>`).join("")}
      <p class="pf-klein">Ingevuld: ${esc(datumLabel(nd.datum).toLowerCase())}.</p></div>` : ""}
    <button class="knop breed ${uit ? "rand" : "primair"}" data-act="pf-vragen">${uit ? "Vragen opnieuw invullen" : "Tien vragen beantwoorden"}</button>
    <p class="pf-let"><b>Geen diagnose.</b> Dit is zelfreflectie om handvatten te kiezen, geen test. Herken je veel? Praat met je huisarts; die kan verwijzen voor een echte beoordeling.</p>`);
  h += sectie2("app", "In de app", inst("ndTips", true) ? "Tips staan aan" : "Tips staan uit", `
    <ul class="schakels">${typeof mfSchakel === "function" ? "" : ""}
      <li class="schakel"><span class="tekst"><b>Tips per onderdeel</b><small>Eén korte tip bovenaan Persoonlijk, Komend, Side Hustle, Wishlist en Huishouden.</small></span>
      <button class="toggle" data-act="pf-tips" aria-pressed="${inst("ndTips", true)}" aria-label="Tips per onderdeel"></button></li></ul>
    <p class="pf-klein">Alles blijft op dit toestel. Je profiel gaat mee in je back-up.</p>`);
  return `<div class="pf">${h}</div>`;
}
function pfAanpakLijst() {
  const a = ndAanpak();
  const rij = (n, w) => `<li><span>${n}</span><b>${w}</b></li>`;
  return `<ul class="pf-aanpak">
    ${rij("Langste werkblok", a.blokMax + " min")}
    ${rij("Pauze", `${a.pauzeMin} min na elke ${a.pauzeElke} min`)}
    ${rij("Extra tijd bij plannen", "+" + Math.round((a.buffer - 1) * 100) + "%")}
    ${rij("Volgorde", { snelsucces: "Snel succes eerst", vast: "Vaste volgorde per ruimte", zwaarEerst: "Zwaar werk vroeg, dan licht" }[a.volgorde])}
    ${rij("Seintje voor een wissel", a.wisselSein ? "Ja" : "Nee")}
    ${a.maxSessie ? rij("Langste sessie", a.maxSessie + " min") : ""}
    ${rij("Afkoelen bij aankopen > € 50", a.afkoelUur + " uur")}</ul>`;
}
/* De vragen in een onderblad, één scherm, grote tikdoelen. */
function pfVragenBlad() {
  const ant = pfProfiel().nd.antwoorden.slice();
  const inhoud = `<p class="pf-klein" style="margin-top:0">Hoe vaak herken je dit bij jezelf, de laatste maanden? Er is geen goed of fout.</p>
    <ol class="pf-vragen">${PF_VRAGEN.map(([, v], i) => `<li><p>${esc(v)}</p><div class="pf-antw" role="radiogroup" aria-label="Vraag ${i + 1}">${PF_SCHAAL.map((s, w) => `<button role="radio" data-pfv="${i}" data-w="${w}" aria-checked="${ant[i] === w}">${s}</button>`).join("")}</div></li>`).join("")}</ol>`;
  bladOpen("Tien vragen", inhoud, `<button class="knop breed primair" id="pf-v-ok">Bekijk mijn richting</button>`);
  $("#bladinhoud").addEventListener("click", e => {
    const b = e.target.closest("[data-pfv]"); if (!b) return;
    const i = +b.dataset.pfv; ant[i] = +b.dataset.w;
    $$(`#bladinhoud [data-pfv="${i}"]`).forEach(x => x.setAttribute("aria-checked", String(x === b)));
    const vol = b.closest("li").nextElementSibling; if (vol && ant[i + 1] == null) vol.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  $("#pf-v-ok").onclick = async () => {
    const leeg = PF_VRAGEN.findIndex((_, i) => ant[i] == null);
    if (leeg >= 0) { toast(`Vraag ${leeg + 1} is nog leeg`); return; }
    const u = pfUitslag(ant), p = pfProfiel();
    await pfZet({ nd: Object.assign({}, p.nd, { antwoorden: ant, richting: u.richting, energie: u.energie, datum: vandaagISO() }) });
    await pfSyncAnker();
    bladSluit(); V.pfOpen = "aanpak"; teken();
    toast("Richting: " + PF_RICHTINGEN[pfRichting()].naam);
  };
}
/* Anker krijgt een passend profiel, maar alleen als je daar nog niets koos. */
async function pfSyncAnker() {
  if (typeof mfInst !== "function") return;
  const a = ndAanpak();
  if (!mfInst().profiel && a.ankerProfiel) await mfInstZet({ profiel: a.ankerProfiel });
}

/* ---------- 76.6 Tikken en typen ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest && e.target.closest("[data-act^='pf-']");
  if (!el) return;
  if (el.dataset.act === "pf-vragen") pfVragenBlad();
  else if (el.dataset.act === "pf-tips") { await zetInst("ndTips", !inst("ndTips", true)); V.pfOpen = "app"; teken(); }
});
document.addEventListener("change", async e => {
  const t = e.target; if (!t || !t.id || !t.id.startsWith("pf-") || V.view !== "profiel") return;
  const p = pfProfiel();
  if (t.id === "pf-naam") await pfZet({ naam: t.value.trim().slice(0, 40) });
  else if (t.id === "pf-gd") await pfZet({ geboortedatum: t.value });
  else if (t.id === "pf-lengte") await pfZet({ lengte: t.value ? Math.round(+t.value) : null });
  else if (t.id === "pf-gewicht") await pfZet({ gewicht: t.value ? Math.round(+t.value * 10) / 10 : null });
  else if (t.id === "pf-richting") { await pfZet({ nd: Object.assign({}, p.nd, { handmatig: t.value || null }) }); await pfSyncAnker(); V.pfOpen = "aanpak"; }
  else return;
  V.pfOpen = V.pfOpen || "over";
  const d = t.closest("details"); if (d) V.pfOpen = d.dataset.pf;
  teken(); toast("Opgeslagen");
});
document.addEventListener("toggle", e => { const d = e.target; if (d && d.classList && d.classList.contains("pf-sectie") && d.open) V.pfOpen = d.dataset.pf; }, true);

/* ---------- 76.7 Ingangen en app-brede aanpassingen ---------- */
Object.defineProperty(KOPPEN, "profiel", { get: () => ["Profiel", () => "Wie je bent en wat bij je past"], configurable: true, enumerable: true });
/* De begroeting op de landingspagina krijgt je naam: "Goedemorgen Kas". */
{
  const _groet = groet;
  groet = function () { const n = pfNaam(); return n ? `${_groet()} ${n.split(/\s+/)[0]}` : _groet(); };
}
/* Profiel bovenaan de instellingen. */
{
  const _inst = vwInstellingen;
  vwInstellingen = function () {
    const p = pfProfiel(), rr = PF_RICHTINGEN[pfRichting()], l = pfLeeftijd(p.geboortedatum);
    return `${sectie("Profiel")}<button class="card pf-instkaart" data-act="ga" data-view="profiel">
      <span class="pf-avatar klein" aria-hidden="true">${esc((p.naam || "?").slice(0, 1).toUpperCase())}</span>
      <span class="pf-instt"><b>${esc(p.naam || "Stel je profiel in")}</b><small>${[l != null ? l + " jaar" : "", rr.ico + " " + rr.naam].filter(Boolean).join(" · ")}</small></span>${ico("pijlr", "width:16px;height:16px;color:var(--faint)")}</button>` + _inst();
  };
}
/* Tips bovenaan de plekken waar de aanpak het meest verschil maakt. */
{
  // voor: tekst waar de tip vóór moet komen; niet gevonden = bovenaan.
  const wrap = (naam, plek, voor) => {
    if (typeof window[naam] !== "function") return;
    const oud = window[naam];
    window[naam] = function () { const h = oud.apply(this, arguments); const tip = ndTipKaart(plek); if (!tip) return h;
      const i = voor ? h.indexOf(voor) : -1;
      return i >= 0 ? h.slice(0, i) + tip + h.slice(i) : tip + h; };
  };
  wrap("vwPersoonlijk", "taken", '<div class="startgrid">');
  wrap("vwKomend", "planning");
  wrap("vwSideHustles", "sidehustle");
  wrap("vwWishlist", "wishlist");
}
