"use strict";
// === FASE 2: ACCOUNTABILITY — beloftes met check-in, focusblok, weekreview, weer in beweging ===
/* De app is je accountabilitypartner: je spreekt iets af met jezelf, de app vraagt
   op het afgesproken moment hoe het ging. Gedaan, half of niet: alle drie zijn
   informatie, geen oordeel. Niet gelukt leidt naar kleiner maken, een nieuw
   moment of loslaten. */

/* PT-ACC-BEGIN */
const PT_REDENEN = [["groot", "Te groot"], ["tijd", "Geen tijd"], ["vergeten", "Vergeten"], ["zin", "Geen zin"], ["onduidelijk", "Onduidelijk"], ["anders", "Iets anders"]];
const PT_UITKOMST = { gedaan: "Gedaan", half: "Half", niet: "Niet gelukt", los: "Losgelaten" };

/** Lokaal moment als "YYYY-MM-DDTHH:MM" naar milliseconden. */
const ptMomentMs = m => Date.parse(m);
/** Open beloftes waarvan het moment voorbij is: tijd voor een check-in. Oudste eerst. */
function ptCheckinsNodig(beloftes, nu) {
  return (beloftes || []).filter(b => b.status === "open" && ptMomentMs(b.moment) <= nu).sort((a, b) => a.moment.localeCompare(b.moment));
}
/** Hoe gaan je beloftes (vanaf een moment)? Half telt voor de helft; losgelaten telt niet mee. */
function ptBeloftesCijfers(beloftes, vanaf, projectId) {
  const l = (beloftes || []).filter(b => b.antwoordOp && Date.parse(b.antwoordOp) >= (vanaf || 0) && (!projectId || b.projectId === projectId));
  const tel = { gedaan: 0, half: 0, niet: 0, los: 0 };
  for (const b of l) if (tel[b.status] !== undefined) tel[b.status]++;
  const telt = tel.gedaan + tel.half + tel.niet;
  return Object.assign(tel, { totaal: telt, score: telt ? Math.round((tel.gedaan + tel.half / 2) / telt * 100) : null });
}
/** De meest voorkomende reden bij "niet gelukt" (voor een tip), of null. */
function ptVaaksteReden(beloftes) {
  const tel = {};
  for (const b of beloftes || []) if (b.status === "niet" && b.reden) tel[b.reden] = (tel[b.reden] || 0) + 1;
  const top = Object.entries(tel).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 2 ? top[0] : null;
}
/** Timer: {start, duur (min), pauzeOp|null, gepauzeerd (ms)} → resterende seconden, verstreken minuten, klaar. */
function ptTimer(t, nu) {
  if (!t) return null;
  const tot = t.duur * 60000, nuEff = t.pauzeOp || nu, verstreken = Math.max(0, nuEff - t.start - (t.gepauzeerd || 0));
  return { rest: Math.max(0, Math.ceil((tot - verstreken) / 1000)), minuten: Math.round(verstreken / 60000), klaar: verstreken >= tot, gepauzeerd: !!t.pauzeOp, deel: Math.min(1, verstreken / tot) };
}
/** Maandag 00:00 (lokaal) van de week waar nu in valt. */
function ptWeekStart(nu) { const d = new Date(nu); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
/** Cijfers van een week per project: minuten, stappen af, winsten; plus totalen. */
function ptWeekCijfers(projecten, stappen, logs, beloftes, van, tot) {
  const inWeek = ts => { const t = Date.parse(ts); return t >= van && t < tot; };
  const per = (projecten || []).map(p => ({
    id: p.id, titel: p.titel, status: p.status,
    minuten: (logs || []).filter(l => l.projectId === p.id && l.soort === "werk" && inWeek(l.ts)).reduce((s, l) => s + (+l.minuten || 0), 0),
    stappen: (stappen || []).filter(s => s.projectId === p.id && s.af && s.afOp && inWeek(s.afOp)).length,
    logs: (logs || []).filter(l => l.projectId === p.id && inWeek(l.ts)).length
  }));
  const bel = ptBeloftesCijfers((beloftes || []).filter(b => b.antwoordOp && inWeek(b.antwoordOp)), 0);
  return { per, minuten: per.reduce((s, x) => s + x.minuten, 0), stappen: per.reduce((s, x) => s + x.stappen, 0), beloftes: bel };
}
/** Mm:ss voor de timer. */
const ptKlok = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
/* PT-ACC-EINDE */

const PT_REDEN_TIP = {
  groot: "Te groot komt vaker voor. Maak de volgende belofte kleiner: vijf minuten, één handeling.",
  tijd: "Geen tijd komt vaker voor. Kies een vast moment dat al vrij is, of een kortere versie.",
  vergeten: "Vergeten komt vaker voor. Koppel je belofte aan iets wat je toch al doet, zoals na de koffie.",
  zin: "Geen zin komt vaker voor. Begin met twee minuten; daarna mag je stoppen.",
  onduidelijk: "Onduidelijk komt vaker voor. Schrijf eerst de allereerste handeling op.",
  anders: ""
};
const nuMoment = (plusMin) => { const d = new Date(Date.now() + (plusMin || 0) * 60000); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const momentTekst = m => `${datumKort(m.slice(0, 10))} ${m.slice(11, 16)}`;

/* ---------- Beloftes ---------- */
function belofteBlad(projectId, tekst, stapId) {
  const p = vind("projecten", projectId); if (!p) return;
  const stap = stapId ? vind("stappen", stapId) : ptVolgendeStap(p, S.stappen);
  const rond = m => { const d = new Date(Date.now() + m * 60000); d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  let wanneer = "vandaag";
  bladOpen(`Belofte · ${p.titel}`, `<div class="veld"><label for="bf-tekst">Wat doe je?</label><input class="invoer" id="bf-tekst" maxlength="120" value="${esc(tekst || (stap ? stap.tekst : ""))}" autocomplete="off"></div>
    <p class="hud-label">Wanneer</p><div class="segment">${[["vandaag", "Vandaag"], ["morgen", "Morgen"], ["datum", "Andere dag"]].map(([k, l]) => `<button type="button" data-bf-wanneer="${k}" aria-pressed="${k === wanneer}">${l}</button>`).join("")}</div>
    <div class="veld" id="bf-datumveld" hidden><label for="bf-datum">Datum</label><input class="invoer" id="bf-datum" type="date" value="${vandaagISO()}" min="${vandaagISO()}"></div>
    <div class="veld"><label for="bf-tijd">Hoe laat check ik bij je in?</label><input class="invoer" id="bf-tijd" type="time" value="${rond(120)}"></div>
    <details class="waarom"><summary>Waarom een belofte?</summary><p>Een plan met een vast moment ("om 17:00 bel ik de drukker") wordt vaker uitgevoerd dan een losse bedoeling, en terugkijken of het lukte houdt je op koers. Indirect: als-dan-plannen en zelfmonitoring zijn onderzocht in brede groepen, niet specifiek bij ADHD.</p></details>`,
    `<button class="knop primair breed" id="bf-bewaar">Beloven</button>`);
  $("#bladinhoud").addEventListener("click", e => {
    const b = e.target.closest("[data-bf-wanneer]"); if (!b) return;
    wanneer = b.dataset.bfWanneer;
    document.querySelectorAll("[data-bf-wanneer]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $("#bf-datumveld").hidden = wanneer !== "datum";
    if (wanneer === "morgen" && $("#bf-tijd").value < "08:00") $("#bf-tijd").value = "10:00";
  });
  $("#bf-bewaar").onclick = async () => {
    const t = $("#bf-tekst").value.trim(), tijd = $("#bf-tijd").value || "17:00"; if (!t) { toast("Schrijf op wat je doet"); return; }
    const datum = wanneer === "vandaag" ? vandaagISO() : wanneer === "morgen" ? (d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)(new Date(Date.now() + PT_DAG)) : ($("#bf-datum").value || vandaagISO());
    let moment = `${datum}T${tijd}`;
    if (ptMomentMs(moment) <= Date.now()) moment = nuMoment(60);   // al voorbij: over een uur
    await bewaar("beloftes", { id: uid(), projectId: p.id, stapId: stap && stap.tekst === t ? stap.id : null, tekst: t, moment, status: "open", gemaakt: new Date().toISOString() });
    await log(p.id, "notitie", `Belofte: ${t} (${momentTekst(moment)})`);
    bladSluit(); tril(10); teken(); toast(`Afgesproken. Ik vraag ${momentTekst(moment)} hoe het ging.`);
  };
}
async function belofteAntwoord(id, uitkomst, reden) {
  const b = vind("beloftes", id); if (!b) return;
  b.status = uitkomst; b.antwoordOp = new Date().toISOString(); if (reden) b.reden = reden;
  await bewaar("beloftes", b);
  if (uitkomst === "gedaan" && b.stapId) { const s = vind("stappen", b.stapId); if (s && !s.af) { s.af = true; s.afOp = b.antwoordOp; await bewaar("stappen", s); } }
  await log(b.projectId, uitkomst === "gedaan" ? "winst" : uitkomst === "niet" ? "blokkade" : "notitie",
    `Belofte ${PT_UITKOMST[uitkomst].toLowerCase()}: ${b.tekst}${reden ? ` (${(PT_REDENEN.find(r => r[0] === reden) || ["", reden])[1].toLowerCase()})` : ""}`);
}
function nietGeluktBlad(id) {
  const b = vind("beloftes", id); if (!b) return;
  let reden = null;
  bladOpen("Niet gelukt", `<p>Dat gebeurt. Niet gelukt is informatie, geen oordeel.</p><p class="hud-label">Wat zat in de weg? <small>(mag leeg)</small></p>
    <div class="chips">${PT_REDENEN.map(([k, l]) => `<button type="button" class="chip-knop" data-ng-reden="${k}" aria-pressed="false">${l}</button>`).join("")}</div>
    <p class="hud-label">Hoe nu verder?</p>
    <div class="lijst"><button class="knop primair breed" data-ng="kleiner">Kleiner maken</button><button class="knop rand breed" data-ng="moment">Nieuw moment</button><button class="knop rand breed" data-ng="los">Loslaten</button></div>`);
  $("#bladinhoud").onclick = async e => {
    const r = e.target.closest("[data-ng-reden]"), k = e.target.closest("[data-ng]");
    if (r) { reden = reden === r.dataset.ngReden ? null : r.dataset.ngReden; document.querySelectorAll("[data-ng-reden]").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.ngReden === reden))); return; }
    if (!k) return;
    await belofteAntwoord(id, k.dataset.ng === "los" ? "los" : "niet", reden);
    if (k.dataset.ng === "kleiner") return belofteBlad(b.projectId, `Vijf minuten: ${b.tekst}`);
    if (k.dataset.ng === "moment") return belofteBlad(b.projectId, b.tekst, b.stapId);
    bladSluit(); teken(); toast("Losgelaten. Ook dat is een keuze.");
  };
}
function checkinHTML() {
  const l = ptCheckinsNodig(S.beloftes, Date.now());
  if (!l.length) return "";
  return l.slice(0, 3).map(b => { const p = vind("projecten", b.projectId); return `<section class="paneel checkin" style="--pk:${p ? kleurVan(p) : "var(--accent)"}" aria-label="Check-in">
    <p class="hud-label">Check-in${p ? " · " + esc(p.titel) : ""}</p>
    <p class="checkin-zin">Je zei: <b>${esc(b.tekst)}</b>, ${esc(momentTekst(b.moment))}. Hoe ging het?</p>
    <div class="checkin-knoppen"><button class="knop primair" data-ci="gedaan" data-id="${esc(b.id)}">${ico("check")} Gedaan</button><button class="knop rand" data-ci="half" data-id="${esc(b.id)}">Half</button><button class="knop rand" data-ci="niet" data-id="${esc(b.id)}">Niet</button></div>
  </section>`; }).join("") + (l.length > 3 ? `<p class="klein">En nog ${l.length - 3} check-ins.</p>` : "");
}

/* ---------- Focusblok met timer ---------- */
function focusBlad(projectId) {
  const p = vind("projecten", projectId); if (!p) return;
  const open = stappenVan(p.id).filter(s => !s.af), stap = ptVolgendeStap(p, S.stappen);
  let duur = +inst("blokDuur", 25), stapId = stap ? stap.id : "";
  bladOpen(`Focusblok · ${p.titel}`, `<p class="hud-label">Hoe lang?</p><div class="chips">${[5, 15, 25, 45, 60].map(m => `<button type="button" class="chip-knop" data-fb-duur="${m}" aria-pressed="${m === duur}">${m} min</button>`).join("")}</div>
    ${open.length ? `<div class="veld"><label for="fb-stap">Waaraan?</label><select id="fb-stap" class="invoer"><option value="">Het project in het algemeen</option>${open.map(s => `<option value="${esc(s.id)}"${s.id === stapId ? " selected" : ""}>${esc(s.tekst)}</option>`).join("")}</select></div>` : ""}
    <details class="waarom"><summary>Waarom een blok met een eind?</summary><p>Een blok met een duidelijk einde vraagt minder volhouden dan een open taak, en de timer maakt tijd zichtbaar. Praktisch: een experiment, kijk welke lengte bij jou past.</p></details>`,
    `<button class="knop primair breed" id="fb-start">${ico("klok")} Start</button>`);
  $("#bladinhoud").onclick = e => { const b = e.target.closest("[data-fb-duur]"); if (!b) return; duur = +b.dataset.fbDuur; document.querySelectorAll("[data-fb-duur]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); };
  $("#fb-start").onclick = async () => {
    if ($("#fb-stap")) stapId = $("#fb-stap").value;
    await zetInst("blokDuur", duur);
    await zetInst("timer", { projectId: p.id, stapId: stapId || null, start: Date.now(), duur, pauzeOp: null, gepauzeerd: 0 });
    bladSluit(); tril(10); timerTeken();
  };
}
let timerTik = null, wekslot = null;
function timerTeken() {
  const t = inst("timer", null), el = $("#timer");
  if (!t) { if (el) el.remove(); clearInterval(timerTik); timerTik = null; try { wekslot && wekslot.release(); } catch (e) {} wekslot = null; return; }
  const p = vind("projecten", t.projectId), s = t.stapId && vind("stappen", t.stapId), st = ptTimer(t, Date.now());
  if (!el) {
    document.body.insertAdjacentHTML("beforeend", `<section id="timer" role="dialog" aria-modal="true" aria-label="Focusblok"><div class="timer-binnen" style="--pk:${p ? kleurVan(p) : "var(--accent)"}">
      <p class="hud-label">Focusblok</p><h2 id="timer-titel"></h2><p id="timer-stap" class="klein"></p>
      <div class="timer-ring"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" class="ring-baan"/><circle cx="100" cy="100" r="88" id="timer-boog" class="ring-voor" transform="rotate(-90 100 100)"/></svg><b id="timer-klok" class="mono" role="timer" aria-live="off"></b></div>
      <div class="knoprij"><button class="knop rand" id="timer-pauze"></button><button class="knop rand" id="timer-plus">+5 min</button><button class="knop primair" id="timer-stop">Klaar</button></div>
    </div></section>`);
    $("#timer-pauze").onclick = async () => { const x = inst("timer", null); if (!x) return; if (x.pauzeOp) { x.gepauzeerd += Date.now() - x.pauzeOp; x.pauzeOp = null; } else x.pauzeOp = Date.now(); await zetInst("timer", x); timerTeken(); };
    $("#timer-plus").onclick = async () => { const x = inst("timer", null); if (!x) return; x.duur += 5; await zetInst("timer", x); timerTeken(); };
    $("#timer-stop").onclick = () => timerKlaar(false);
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(w => { wekslot = w; }).catch(() => {}); } catch (e) {}
    setTimeout(() => { const b = $("#timer-stop"); if (b) b.focus(); }, 50);
  }
  $("#timer-titel").textContent = p ? p.titel : "Project";
  $("#timer-stap").textContent = s ? "→ " + s.tekst : "";
  $("#timer-klok").textContent = ptKlok(st.rest);
  const o = 2 * Math.PI * 88; $("#timer-boog").style.strokeDasharray = o.toFixed(1); $("#timer-boog").style.strokeDashoffset = (o * st.deel).toFixed(1);
  $("#timer-pauze").textContent = st.gepauzeerd ? "Verder" : "Pauze";
  if (st.klaar) return timerKlaar(true);
  if (!timerTik) timerTik = setInterval(timerTeken, 1000);
}
async function timerKlaar(vanzelf) {
  const t = inst("timer", null); if (!t) return;
  const st = ptTimer(t, Date.now()), min = Math.max(1, Math.min(st.minuten, t.duur)), s = t.stapId && vind("stappen", t.stapId);
  await zetInst("timer", null); timerTeken();
  if (vanzelf) tril([30, 60, 30]);
  bladOpen(vanzelf ? "Blok klaar" : "Blok gestopt", `<p class="blok-klaar mono">${duurTekst(min)}</p>
    ${s ? `<button type="button" class="schakel" id="bk-stap" aria-pressed="false"><span><b>Stap klaar</b><small class="klein">${esc(s.tekst)}</small></span><span class="toggle" aria-hidden="true"></span></button>` : ""}
    <div class="veld"><label for="bk-tekst">Wat deed je? <small>(mag leeg)</small></label><textarea class="invoer" id="bk-tekst" rows="2" maxlength="300"></textarea></div>`,
    `<button class="knop primair breed" id="bk-bewaar">Vastleggen</button>`);
  if ($("#bk-stap")) $("#bk-stap").onclick = e => { const b = e.currentTarget; b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); };
  $("#bk-bewaar").onclick = async () => {
    await log(t.projectId, "werk", $("#bk-tekst").value.trim(), { minuten: min });
    if (s && $("#bk-stap") && $("#bk-stap").getAttribute("aria-pressed") === "true" && !s.af) { s.af = true; s.afOp = new Date().toISOString(); await bewaar("stappen", s); await log(s.projectId, "winst", `Stap: ${s.tekst}`); }
    bladSluit(); teken(); toast(`${duurTekst(min)} gelogd. De draad loopt.`);
  };
}

/* ---------- Weekreview ---------- */
function weekGedaan() { const w = ptWeekStart(Date.now()); return (inst("weekreviews", []) || []).some(r => r.week === w); }
function vwWeek() {
  const nu = Date.now(), w = ptWeekStart(nu), c = ptWeekCijfers(S.projecten, S.stappen, S.logs, S.beloftes, w, w + 7 * PT_DAG);
  const open = S.projecten.filter(p => ["actief", "wacht"].includes(p.status));
  const tip = PT_REDEN_TIP[ptVaaksteReden(S.beloftes.filter(b => b.antwoordOp && Date.parse(b.antwoordOp) >= nu - 28 * PT_DAG))] || "";
  let h = `<section class="tellers"><div class="teller"><b class="mono">${duurTekst(c.minuten).replace(" min", "<small>m</small>").replace(" u", "<small>u</small>")}</b><span>gewerkt</span></div>
    <div class="teller"><b class="mono">${c.stappen}</b><span>stappen af</span></div><div class="teller"><b class="mono">${c.beloftes.gedaan}<small>/${c.beloftes.totaal}</small></b><span>beloftes</span></div>
    <div class="teller"><b class="mono">${ptDraad(S.logs, nu, 7).actief}<small>/7</small></b><span>dagen</span></div></section>`;
  if (tip) h += `<section class="paneel"><p class="hud-label">Patroon</p><p>${esc(tip)}</p><details class="waarom"><summary>Waarom zeg je dit?</summary><p>Dit komt uit je eigen check-ins van de laatste vier weken. Praktisch: een voorstel, geen regel.</p></details></section>`;
  h += sectie("Per project") + (open.length ? `<div class="paneel week-lijst">${open.map(p => { const x = c.per.find(y => y.id === p.id), g = ptGezondheid(p, S.logs, nu);
    return `<div class="week-rij"><div><b>${esc(p.titel)}</b><small class="klein">${duurTekst(x.minuten)} · ${x.stappen} ${x.stappen === 1 ? "stap" : "stappen"} · ${esc(g.naam)}</small></div>
      <div class="segment" role="group" aria-label="Hoe verder met ${esc(p.titel)}">${[["door", "Door"], ["pauze", "Pauze"], ["idee", "Ideeën"]].map(([k, l]) => `<button type="button" data-wk-keuze="${k}" data-id="${esc(p.id)}" aria-pressed="${(V.weekKeuzes || {})[p.id] === k || (!(V.weekKeuzes || {})[p.id] && k === "door")}">${l}</button>`).join("")}</div></div>`; }).join("")}</div>`
    : `<p class="klein leeg-regel">Geen actieve projecten deze week.</p>`);
  h += sectie("Volgende week") + `<div class="paneel"><div class="veld"><label for="wk-mee">Wat neem je mee naar volgende week?</label><textarea class="invoer" id="wk-mee" rows="3" maxlength="400" placeholder="Eén ding is genoeg">${esc(V.weekTekst || "")}</textarea></div>
    <button class="knop primair breed" data-wk-klaar>${weekGedaan() ? "Opnieuw opslaan" : "Weekreview afronden"}</button>
    <details class="waarom"><summary>Waarom een weekreview?</summary><p>Eens per week kort terugkijken en bewust kiezen wat doorgaat, houdt je projecten in beweging en voorkomt dat er te veel tegelijk loopt. Indirect: terugkijken en bijsturen zijn onderdeel van ADHD-gerichte coaching en CGT, niet als losse oefening onderzocht.</p></details></div>`;
  return h;
}
KOPPEN.week = () => ["Weekreview", `week van ${datumKort((d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)(new Date(ptWeekStart(Date.now()))))}`];
VIEWS.week = vwWeek;

/* ---------- Commandocentrum en projectscherm uitbreiden ---------- */
{
  const _cmd = VIEWS.commando;
  VIEWS.commando = function () {
    let h = _cmd.apply(this, arguments);
    if (!S.projecten.length) return h;
    const ci = checkinHTML();
    // Weer in beweging: afkoelende en stille projecten met één tik naar een blok van 5 minuten.
    const koud = S.projecten.filter(p => p.status === "actief" && ["afkoelend", "stil"].includes(ptGezondheid(p, S.logs, Date.now()).id));
    const beweging = koud.length ? `<section class="paneel"><p class="hud-label">Weer in beweging</p><p class="klein">Vijf minuten is genoeg om de draad weer op te pakken.</p>
      <div class="lijst">${koud.slice(0, 3).map(p => `<button class="knop rand breed" data-focus-start="${esc(p.id)}" data-duur="5">${ico("klok")} 5 minuten aan ${esc(p.titel)}</button>`).join("")}</div></section>` : "";
    const dag = new Date().getDay(), week = !weekGedaan() && [0, 1, 5, 6].includes(dag) ? `<button class="paneel rij-knop" data-ga="week">${ico("log")}<span><b>Weekreview</b><small>Tien minuten terugkijken en kiezen wat doorgaat.</small></span>${ico("pijl")}</button>` : "";
    // Check-ins bovenaan, de rest onder de focus.
    const i = h.indexOf('<section class="tellers"');
    return ci + (i < 0 ? h + beweging + week : h.slice(0, i) + beweging + h.slice(i) + week);
  };
  const _proj = VIEWS.project;
  VIEWS.project = function () {
    let h = _proj.apply(this, arguments);
    const p = vind("projecten", V.param); if (!p || !ptIsOpen(p)) return h;
    const open = S.beloftes.filter(b => b.projectId === p.id && b.status === "open").sort((a, b) => a.moment.localeCompare(b.moment));
    const c = ptBeloftesCijfers(S.beloftes, 0, p.id);
    const blok = `<div class="paneel acties focusacties"><button class="knop primair" data-focus-start="${esc(p.id)}">${ico("klok")} Focusblok</button><button class="knop rand" data-belofte="${esc(p.id)}">${ico("vlag")} Belofte</button></div>
      ${open.length ? `<ul class="paneel beloftes">${open.map(b => `<li><span class="mono">${esc(momentTekst(b.moment))}</span><span>${esc(b.tekst)}</span></li>`).join("")}</ul>` : ""}
      ${c.totaal ? `<p class="klein leeg-regel">Beloftes: ${c.gedaan} gedaan, ${c.half} half, ${c.niet} niet gelukt.</p>` : ""}`;
    const i = h.indexOf('<div class="sectie"><h2>Stappen</h2>');
    return i < 0 ? h + blok : h.slice(0, i) + blok + h.slice(i);
  };
  // Op de focuskaart: ook een focusblok en een belofte.
  const _cmd2 = VIEWS.commando;
  VIEWS.commando = function () {
    return _cmd2.apply(this, arguments).replace(/<button class="knop rand" data-snel-log="([^"]+)">[^]*?<\/button>/, (m, id) => `<button class="knop rand" data-focus-start="${id}">${ico("klok")} Focusblok</button><button class="knop rand" data-belofte="${id}">${ico("vlag")} Belofte</button>`);
  };
}
// Meer: weekreview erbij
{
  const _meer = VIEWS.meer;
  VIEWS.meer = function () {
    return `<button class="paneel rij-knop" data-ga="week">${ico("log")}<span><b>Weekreview</b><small>${weekGedaan() ? "Deze week gedaan" : "Kijk terug op deze week"}</small></span>${ico("pijl")}</button>` + _meer.apply(this, arguments);
  };
}

/* ---------- Klikken ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-ci],[data-belofte],[data-focus-start],[data-wk-keuze],[data-wk-klaar]"); if (!el) return;
  const d = el.dataset;
  if (d.ci) {
    if (d.ci === "niet") return nietGeluktBlad(d.id);
    await belofteAntwoord(d.id, d.ci); tril(d.ci === "gedaan" ? [15, 30, 15] : 8); teken();
    const b = vind("beloftes", d.id);
    if (d.ci === "gedaan") toast("Gedaan. Afspraak met jezelf nagekomen.");
    else toast("Half is ook vooruit.", "Rest beloven", () => belofteBlad(b.projectId, `Rest van: ${b.tekst}`));
    return;
  }
  if (d.belofte) return belofteBlad(d.belofte);
  if (d.focusStart) {
    if (d.duur) { await zetInst("timer", { projectId: d.focusStart, stapId: (ptVolgendeStap(vind("projecten", d.focusStart), S.stappen) || {}).id || null, start: Date.now(), duur: +d.duur, pauzeOp: null, gepauzeerd: 0 }); tril(10); return timerTeken(); }
    return focusBlad(d.focusStart);
  }
  if (d.wkKeuze) { V.weekKeuzes = Object.assign({}, V.weekKeuzes, { [d.id]: d.wkKeuze }); V.weekTekst = ($("#wk-mee") || {}).value || V.weekTekst; return teken(); }
  if (d.wkKlaar !== undefined) {
    const tekst = $("#wk-mee").value.trim(), w = ptWeekStart(Date.now());
    for (const [id, k] of Object.entries(V.weekKeuzes || {})) {
      const p = vind("projecten", id); if (!p || k === "door" || p.status === k) continue;
      const oud = p.status; p.status = k; await bewaar("projecten", p); await log(p.id, "fase", `Weekreview: ${PT_STATUS[oud].naam} → ${PT_STATUS[k].naam}`);
    }
    await zetInst("weekreviews", (inst("weekreviews", []) || []).filter(r => r.week !== w).concat({ week: w, tekst, ts: new Date().toISOString() }).slice(-104));
    V.weekKeuzes = {}; V.weekTekst = "";
    tril([15, 30, 15]); ga("commando"); toast("Weekreview klaar. Volgende week begint met een plan.");
  }
});
// Een lopend blok overleeft herladen en schermwissel.
NA_TEKENEN.push(() => { if (inst("timer", null) && !$("#timer")) timerTeken(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && inst("timer", null)) timerTeken(); });
