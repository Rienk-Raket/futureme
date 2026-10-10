"use strict";
// === SCHERMEN: Commandocentrum, Projecten, Project, Log, Archief, Meer, en de wizard ===
const nu = () => Date.now();
const wipLimiet = () => +inst("wipLimiet", 3);
const stappenVan = id => S.stappen.filter(s => s.projectId === id).sort((a, b) => (a.af - b.af) || (a.volgorde || 0) - (b.volgorde || 0));
const logsVan = id => S.logs.filter(l => l.projectId === id).sort((a, b) => b.ts.localeCompare(a.ts));
const kleurVan = p => p.kleur || PT_KLEUREN[0];
const clusters = () => [...new Set(S.projecten.map(p => p.cluster).filter(Boolean))].sort((a, b) => a.localeCompare(b, "nl"));
const tags = () => [...new Set(S.projecten.flatMap(p => p.tags || []))].sort((a, b) => a.localeCompare(b, "nl"));
async function log(projectId, soort, tekst, extra) {
  const l = Object.assign({ id: uid(), projectId, soort, tekst: tekst || "", ts: new Date().toISOString() }, extra || {});
  await bewaar("logs", l);
  const p = vind("projecten", projectId); if (p) await bewaar("projecten", p);   // bijgewerkt
  return l;
}
const sectie = (titel, extra) => `<div class="sectie"><h2>${esc(titel)}</h2>${extra || ""}</div>`;

/* ---------- Bouwstenen ---------- */
function ring(pct, grootte, kleur) {
  const r = 42, o = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 100 100" width="${grootte}" height="${grootte}" role="img" aria-label="${pct}% voortgang">
    <circle cx="50" cy="50" r="${r}" class="ring-baan"/><circle cx="50" cy="50" r="${r}" class="ring-voor" style="stroke:${kleur};stroke-dasharray:${o.toFixed(1)};stroke-dashoffset:${(o * (1 - pct / 100)).toFixed(1)}" transform="rotate(-90 50 50)"/>
    <text x="50" y="56" class="ring-tekst">${pct}<tspan class="ring-pct">%</tspan></text></svg>`;
}
function fasebalk(p, klikbaar) {
  const i = ptFaseIndex(p.fase);
  return `<ol class="fasebalk" aria-label="Fase ${PT_FASES[i].letter}: ${PT_FASES[i].naam}">${PT_FASES.map((f, j) => {
    const kl = j < i ? "gedaan" : j === i ? "nu" : "";
    return `<li class="${kl}">${klikbaar ? `<button type="button" data-fase="${f.id}" aria-pressed="${j === i}" aria-label="Fase ${f.letter}: ${f.naam}">` : "<span>"}<b>${f.letter}</b><small>${esc(f.naam)}</small>${klikbaar ? "</button>" : "</span>"}</li>`;
  }).join("")}</ol>`;
}
const gezondheidChip = g => `<span class="chip g-${g.id}"><i class="stip"></i>${esc(g.naam)}</span>`;
function projectKaart(p) {
  const st = S.stappen, g = ptGezondheid(p, S.logs, nu()), pct = ptVoortgang(p, st), stap = ptVolgendeStap(p, st), f = PT_FASES[ptFaseIndex(p.fase)];
  return `<button type="button" class="kaart" data-ga="project" data-param="${esc(p.id)}" style="--pk:${kleurVan(p)}">
    <span class="kaart-kop"><span class="fase-letter" aria-hidden="true">${f.letter}</span><span class="kaart-titel"><b>${esc(p.titel)}</b><small>${esc(f.naam)}${p.cluster ? " · " + esc(p.cluster) : ""}</small></span>${gezondheidChip(g)}</span>
    <span class="balk" aria-hidden="true"><i style="width:${pct}%"></i></span>
    <span class="kaart-voet"><span class="mono">${pct}%</span><span class="kaart-stap">${stap ? "→ " + esc(stap.tekst) : p.status === "idee" ? "In de ideeënbak" : "Nog geen volgende stap"}</span>${p.deadline ? `<span class="mono">${ico("vlag")}${esc(datumKort(p.deadline))}</span>` : ""}</span>
  </button>`;
}

/* ---------- Commandocentrum ---------- */
function focusProject() {
  const f = vind("projecten", inst("focusId", null));
  if (f && f.status === "actief") return f;
  return ptSorteer(S.projecten.filter(p => p.status === "actief"), "prioriteit", S.stappen)[0] || null;
}
function orbit(actief) {
  const banen = { koers: 70, afkoelend: 105, deadline: 70, stil: 140, verlopen: 105 };
  const per = {};
  actief.forEach(p => { const g = ptGezondheid(p, S.logs, nu()).id; (per[g] = per[g] || []).push(p); });
  // Per baan gelijk verdeeld (geen overlap); elke baan begint op een andere hoek.
  const opBaan = {};
  for (const [g, l] of Object.entries(per)) for (const p of l) (opBaan[banen[g] || 105] = opBaan[banen[g] || 105] || []).push([g, p]);
  let knopen = "";
  for (const [r0, l] of Object.entries(opBaan)) l.forEach(([g, p], i) => {
    const r = +r0, hoek = ((r === 70 ? -60 : r === 105 ? 25 : 110) + i * 360 / l.length) * Math.PI / 180, x = 160 + r * Math.cos(hoek), y = 160 + r * Math.sin(hoek);
    knopen += `<a href="#" class="knoop g-${g}" data-ga="project" data-param="${esc(p.id)}" aria-label="${esc(p.titel)}: ${esc(ptGezondheid(p, S.logs, nu()).naam)}">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" style="fill:${kleurVan(p)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" class="knoop-halo" style="stroke:${kleurVan(p)}"/>
      <text x="${x.toFixed(1)}" y="${(y + 36).toFixed(1)}" class="knoop-naam">${esc(p.titel.length > 14 ? p.titel.slice(0, 13) + "…" : p.titel)}</text></a>`;
  });
  return `<svg class="orbit" viewBox="0 0 320 320" role="group" aria-label="Actieve projecten op gezondheid: binnen op koers, buiten stil">
    <circle cx="160" cy="160" r="70" class="baan"/><circle cx="160" cy="160" r="105" class="baan"/><circle cx="160" cy="160" r="140" class="baan"/>
    <line x1="160" y1="10" x2="160" y2="310" class="kruis"/><line x1="10" y1="160" x2="310" y2="160" class="kruis"/>
    <g class="sweep"><path d="M160 160 L160 18 A142 142 0 0 1 280 85 Z"/></g>
    <circle cx="160" cy="160" r="6" class="kern"/>${knopen}</svg>`;
}
function vwCommando() {
  const actief = S.projecten.filter(p => p.status === "actief"), open = S.projecten.filter(ptIsOpen);
  if (!S.projecten.length) return `<section class="paneel welkom"><p class="hud-label">Systeem gereed</p><h2>Wat wil je afmaken?</h2>
    <p>Leg je eerste project vast. Vier korte vragen, en je hebt meteen een eerste stap.</p>
    <button class="knop primair breed" data-tab="nieuw">${ico("plus")} Eerste project</button></section>`;
  const f = focusProject(), weekStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); })();
  const jaarStart = new Date(new Date().getFullYear(), 0, 1).getTime();
  const draad = ptDraad(S.logs, nu(), 14), wip = ptWip(S.projecten, wipLimiet());
  let h = "";
  if (f) {
    const g = ptGezondheid(f, S.logs, nu()), stap = ptVolgendeStap(f, S.stappen), pct = ptVoortgang(f, S.stappen);
    h += `<section class="paneel focus" style="--pk:${kleurVan(f)}" aria-label="Focusproject">
      <div class="focus-kop"><p class="hud-label">Focus</p>${gezondheidChip(g)}</div>
      <div class="focus-midden">${ring(pct, 92, kleurVan(f))}<div><h2><button type="button" class="link" data-ga="project" data-param="${esc(f.id)}">${esc(f.titel)}</button></h2>
        <p class="focus-zin">${esc(ptStatusZin(f, g, stap))}</p></div></div>
      ${stap ? `<div class="knoprij"><button class="knop primair" data-stap-af="${esc(stap.id)}">${ico("check")} Stap klaar</button><button class="knop rand" data-snel-log="${esc(f.id)}">${ico("klok")} Loggen</button></div>`
        : `<div class="knoprij"><button class="knop primair" data-ga="project" data-param="${esc(f.id)}">Volgende stap kiezen</button></div>`}
      ${actief.length > 1 ? `<button class="link klein" data-focus-kies>Ander project in focus</button>` : ""}
    </section>`;
  }
  h += `<section class="tellers" aria-label="Tellers">
    <div class="teller${wip.actief > wip.limiet ? " te-veel" : ""}"><b class="mono">${wip.actief}<small>/${wip.limiet}</small></b><span>actief</span></div>
    <div class="teller"><b class="mono">${duurTekst(ptMinuten(S.logs, weekStart)).replace(" min", "<small>m</small>").replace(" u", "<small>u</small>")}</b><span>deze week</span></div>
    <div class="teller"><b class="mono">${draad.actief}<small>/${draad.van}</small></b><span>dagen draad</span></div>
    <div class="teller"><b class="mono">${S.projecten.filter(p => p.afgerondOp && Date.parse(p.afgerondOp) >= jaarStart).length}</b><span>af dit jaar</span></div></section>`;
  if (actief.length) h += `<section class="paneel radar">${orbit(actief)}<p class="klein legenda"><i class="stip g-koers"></i>op koers <i class="stip g-afkoelend"></i>koelt af <i class="stip g-stil"></i>stil</p></section>`;
  const aandacht = open.map(p => ({ p, g: ptGezondheid(p, S.logs, nu()) })).filter(x => ["verlopen", "deadline", "stil", "afkoelend"].includes(x.g.id));
  if (aandacht.length) h += sectie("Vraagt aandacht") + `<div class="lijst">${aandacht.map(x => projectKaart(x.p)).join("")}</div>`;
  if (wip.actief > wip.limiet) h += `<section class="paneel let"><p><b>${wip.actief} projecten actief, je limiet is ${wip.limiet}.</b> Minder tegelijk maakt afmaken makkelijker. Zet er een op pauze of in de ideeënbak.</p>
    <details class="waarom"><summary>Waarom?</summary><p>Wisselen tussen taken kost tijd en aandacht; met minder lopend werk komt er meer af. Indirect: onderzocht bij taakwisselen en werkprocessen, niet specifiek bij ADHD.</p></details></section>`;
  const ideeen = S.projecten.filter(p => p.status === "idee").length;
  if (ideeen) h += `<button class="paneel rij-knop" data-ga="projecten" data-param="idee">${ico("ster")}<span><b>Ideeënbak</b><small>${ideeen} ${ideeen === 1 ? "idee wacht" : "ideeën wachten"}. Ze lopen niet weg.</small></span>${ico("pijl")}</button>`;
  return h;
}
KOPPEN.commando = () => ["Commandocentrum", new Date().toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })];
VIEWS.commando = vwCommando;

/* ---------- Projecten: filteren, clusteren, sorteren ---------- */
const FILTERS = [["open", "Open"], ["actief", "Actief"], ["wacht", "Wacht"], ["pauze", "Pauze"], ["idee", "Ideeën"]];
const CLUSTERS = [["fase", "Fase"], ["status", "Status"], ["cluster", "Cluster"], ["energie", "Energie"], ["deadline", "Deadline"], ["", "Geen"]];
function vwProjecten() {
  if (V.param) { V.filter.status = V.param === "open" ? "open" : [V.param]; V.param = null; }
  const st = V.filter.status, actiefF = st === "open" ? "open" : (st || [])[0];
  let h = `<div class="zoekbalk">${ico("zoek")}<label class="sr-only" for="zoek">Zoek in projecten</label><input id="zoek" type="search" placeholder="Zoek in titel, waarom, cluster of tag" value="${esc(V.filter.zoek)}" autocomplete="off"></div>
    <div class="chips" role="group" aria-label="Status">${FILTERS.map(([k, l]) => `<button type="button" class="chip-knop" data-filter-status="${k}" aria-pressed="${actiefF === k}">${l}</button>`).join("")}</div>
    <div class="regel"><label for="cluster-op" class="klein">Groeperen</label><select id="cluster-op">${CLUSTERS.map(([k, l]) => `<option value="${k}"${V.cluster === k ? " selected" : ""}>${l}</option>`).join("")}</select>
      <label for="sorteer-op" class="klein">Sorteren</label><select id="sorteer-op">${[["prioriteit", "Prioriteit"], ["deadline", "Deadline"], ["voortgang", "Voortgang"], ["bijgewerkt", "Laatst bijgewerkt"], ["titel", "Titel"]].map(([k, l]) => `<option value="${k}"${V.sorteer === k ? " selected" : ""}>${l}</option>`).join("")}</select></div>`;
  if (clusters().length || tags().length) h += `<div class="chips klein-chips" role="group" aria-label="Cluster en tag">${clusters().map(c => `<button type="button" class="chip-knop" data-filter-cluster="${esc(c)}" aria-pressed="${V.filter.cluster === c}">◆ ${esc(c)}</button>`).join("")}${tags().map(t => `<button type="button" class="chip-knop" data-filter-tag="${esc(t)}" aria-pressed="${V.filter.tag === t}">#${esc(t)}</button>`).join("")}</div>`;
  const lijst = ptSorteer(ptFilter(S.projecten, V.filter), V.sorteer, S.stappen);
  if (!lijst.length) return h + `<div class="paneel leeg"><p>${S.projecten.length ? "Niets gevonden met dit filter." : "Nog geen projecten."}</p><button class="knop primair" data-tab="nieuw">${ico("plus")} Nieuw project</button></div>`;
  const groepen = V.cluster ? ptCluster(lijst, V.cluster, nu()) : [{ sleutel: "alles", naam: "", projecten: lijst }];
  for (const g of groepen) h += (g.naam ? sectie(g.naam, `<span class="mono telling">${g.projecten.length}</span>`) : "") + `<div class="lijst">${g.projecten.map(projectKaart).join("")}</div>`;
  return h;
}
KOPPEN.projecten = () => ["Projecten", `${S.projecten.filter(ptIsOpen).length} open · ${S.projecten.filter(p => p.status === "actief").length} actief`];
VIEWS.projecten = vwProjecten;

/* ---------- Eén project ---------- */
function vwProject() {
  const p = vind("projecten", V.param);
  if (!p) return `<div class="paneel"><p>Dit project bestaat niet meer.</p></div>`;
  const g = ptGezondheid(p, S.logs, nu()), pct = ptVoortgang(p, S.stappen), stappen = stappenVan(p.id), logs = logsVan(p.id);
  const mijl = S.mijlpalen.filter(m => m.projectId === p.id).sort((a, b) => (a.af - b.af) || String(a.datum || "9").localeCompare(String(b.datum || "9")));
  const f = PT_FASES[ptFaseIndex(p.fase)], draad = ptDraad(S.logs, nu(), 14, p.id);
  let h = `<section class="paneel held" style="--pk:${kleurVan(p)}">
    <div class="held-kop">${ring(pct, 84, kleurVan(p))}<div><p class="hud-label">${esc(PT_STATUS[p.status].naam)}${p.cluster ? " · ◆ " + esc(p.cluster) : ""}</p><h2>${esc(p.titel)}</h2>${gezondheidChip(g)}</div></div>
    ${fasebalk(p, true)}
    <p class="fase-vraag"><b>${f.letter} · ${esc(f.naam)}</b> ${esc(f.vraag)}</p>
    <div class="held-meta mono"><span>${ico("klok")}${duurTekst(ptMinuten(S.logs, 0, p.id))}</span><span>draad ${draad.actief}/${draad.van}</span>${p.deadline ? `<span>${ico("vlag")}${esc(datumKort(p.deadline))}</span>` : ""}${p.energie ? `<span>⚡ ${esc(PT_ENERGIE[p.energie])}</span>` : ""}</div>
  </section>`;
  if (p.waarom || p.klaar) h += `<section class="paneel duo">${p.waarom ? `<div><p class="hud-label">Waarom</p><p>${esc(p.waarom)}</p></div>` : ""}${p.klaar ? `<div><p class="hud-label">Klaar als</p><p>${esc(p.klaar)}</p></div>` : ""}</section>`;
  // Stappen
  h += sectie("Stappen", `<span class="mono telling">${stappen.filter(s => s.af).length}/${stappen.length}</span>`);
  h += `<form class="paneel invoer-rij" data-stap-nieuw="${esc(p.id)}"><label class="sr-only" for="stap-tekst">Nieuwe stap</label><input id="stap-tekst" maxlength="120" placeholder="Nieuwe stap, begin met een werkwoord" autocomplete="off"><button class="knop primair" aria-label="Stap toevoegen">${ico("plus")}</button></form><p class="hint" id="stap-hint" aria-live="polite"></p>`;
  if (stappen.length) h += `<ul class="paneel stappen">${stappen.map((s, i) => `<li class="${s.af ? "af" : ""}${s.pin ? " gepind" : ""}">
    <button type="button" class="vink" data-stap-vink="${esc(s.id)}" aria-pressed="${!!s.af}" aria-label="${esc(s.tekst)} ${s.af ? "afgevinkt" : "afvinken"}">${ico("check")}</button>
    <span class="stap-tekst">${esc(s.tekst)}${s.duur ? ` <small class="mono">${s.duur}m</small>` : ""}</span>
    ${s.af ? "" : `<button type="button" class="mini" data-stap-pin="${esc(s.id)}" aria-pressed="${!!s.pin}" aria-label="Als volgende stap vastzetten">${ico("pin")}</button>
    <button type="button" class="mini" data-stap-op="${esc(s.id)}" aria-label="Omhoog"${i === 0 ? " disabled" : ""}>${ico("omhoog")}</button>`}
    <button type="button" class="mini" data-stap-weg="${esc(s.id)}" aria-label="Stap verwijderen">${ico("x")}</button></li>`).join("")}</ul>`;
  // Mijlpalen
  h += sectie("Mijlpalen", `<button class="link klein" data-mijl-nieuw="${esc(p.id)}">${ico("plus")} Mijlpaal</button>`);
  h += mijl.length ? `<ul class="paneel mijlpalen">${mijl.map(m => `<li class="${m.af ? "af" : ""}"><button type="button" class="vink" data-mijl-vink="${esc(m.id)}" aria-pressed="${!!m.af}" aria-label="${esc(m.titel)} ${m.af ? "gehaald" : "afvinken"}">${ico("vlag")}</button>
    <span><b>${esc(m.titel)}</b>${m.datum ? `<small class="mono">${esc(datumKort(m.datum))}</small>` : ""}</span><button type="button" class="mini" data-mijl-weg="${esc(m.id)}" aria-label="Mijlpaal verwijderen">${ico("x")}</button></li>`).join("")}</ul>`
    : `<p class="klein leeg-regel">Nog geen mijlpalen. Een tussendoel met een datum maakt een groot project overzichtelijk.</p>`;
  // Log
  h += sectie("Log", `<button class="link klein" data-snel-log="${esc(p.id)}">${ico("plus")} Loggen</button>`);
  h += logs.length ? tijdlijn(logs.slice(0, 30), false) : `<p class="klein leeg-regel">Nog niets gelogd. Ook vijf minuten telt.</p>`;
  // Acties
  h += sectie("Project") + `<div class="paneel acties">${statusKnoppen(p)}
    <button class="knop rand" data-project-bewerk="${esc(p.id)}">Bewerken</button>
    <button class="knop rand gevaar" data-project-weg="${esc(p.id)}">Verwijderen</button></div>`;
  return h;
}
function statusKnoppen(p) {
  const k = (s, l, kl) => `<button class="knop ${kl || "rand"}" data-status="${s}" data-id="${esc(p.id)}">${l}</button>`;
  if (p.status === "klaar" || p.status === "archief") return k("actief", "Weer oppakken") + (p.status === "klaar" ? k("archief", "Archiveren") : "");
  return (p.status !== "actief" ? k("actief", "Actief maken", "primair") : "") + (p.status !== "wacht" ? k("wacht", "Wacht op iets") : "") + (p.status !== "pauze" ? k("pauze", "Pauzeren") : "")
    + (p.status !== "idee" ? k("idee", "Naar ideeënbak") : "") + k("klaar", "Afronden", "primair") + k("archief", "Archiveren");
}
KOPPEN.project = () => { const p = vind("projecten", V.param); return [p ? p.titel : "Project", p ? `${PT_FASES[ptFaseIndex(p.fase)].letter} · ${PT_FASES[ptFaseIndex(p.fase)].naam}` : ""]; };
VIEWS.project = vwProject;

/* ---------- Log (alles, per dag) ---------- */
function tijdlijn(logs, metProject) {
  let dag = "", h = `<ol class="tijdlijn">`;
  for (const l of logs) {
    const d = l.ts.slice(0, 10), lok = new Date(l.ts), dl = `${lok.getFullYear()}-${pad(lok.getMonth() + 1)}-${pad(lok.getDate())}`;
    if (dl !== dag) { dag = dl; h += `<li class="dag">${esc(datumKort(dl))}</li>`; }
    const p = metProject ? vind("projecten", l.projectId) : null, s = PT_LOGSOORTEN[l.soort] || PT_LOGSOORTEN.notitie;
    h += `<li class="log s-${esc(l.soort)}"><span class="mono tijd">${tijdKort(l.ts)}</span><span class="log-ico" aria-hidden="true">${s.ico}</span>
      <span class="log-tekst"><b>${esc(s.naam)}${l.minuten ? ` · ${duurTekst(+l.minuten)}` : ""}</b>${l.tekst ? ` ${esc(l.tekst)}` : ""}${p ? `<button type="button" class="link klein" data-ga="project" data-param="${esc(p.id)}">${esc(p.titel)}</button>` : ""}</span></li>`;
    void d;
  }
  return h + `</ol>`;
}
function vwLog() {
  const l = S.logs.filter(x => !V.logFilter || x.soort === V.logFilter).sort((a, b) => b.ts.localeCompare(a.ts));
  let h = `<div class="chips" role="group" aria-label="Soort"><button type="button" class="chip-knop" data-log-filter="" aria-pressed="${!V.logFilter}">Alles</button>${Object.entries(PT_LOGSOORTEN).map(([k, s]) => `<button type="button" class="chip-knop" data-log-filter="${k}" aria-pressed="${V.logFilter === k}">${s.ico} ${s.naam}</button>`).join("")}</div>`;
  h += l.length ? tijdlijn(l.slice(0, 300), true) : `<div class="paneel leeg"><p>Nog niets gelogd.</p></div>`;
  return h;
}
KOPPEN.log = () => ["Log", `${duurTekst(ptMinuten(S.logs, Date.now() - 7 * PT_DAG))} gewerkt de laatste 7 dagen`];
VIEWS.log = vwLog;

/* ---------- Archief ---------- */
function vwArchief() {
  const klaar = S.projecten.filter(p => p.status === "klaar").sort((a, b) => String(b.afgerondOp || "").localeCompare(String(a.afgerondOp || "")));
  const arch = S.projecten.filter(p => p.status === "archief");
  let h = sectie("Afgerond", `<span class="mono telling">${klaar.length}</span>`) + (klaar.length ? `<div class="lijst">${klaar.map(projectKaart).join("")}</div>` : `<p class="klein leeg-regel">Nog niets afgerond. Dat komt.</p>`);
  h += sectie("Gearchiveerd", `<span class="mono telling">${arch.length}</span>`) + (arch.length ? `<div class="lijst">${arch.map(projectKaart).join("")}</div>` : `<p class="klein leeg-regel">Het archief is leeg.</p>`);
  return h;
}
KOPPEN.archief = () => ["Archief", "Afgerond en opgeborgen"];
VIEWS.archief = vwArchief;

/* ---------- Meer: instellingen en gegevens ---------- */
function vwMeer() {
  const seg = (k, opties, w) => `<div class="segment" role="group" aria-label="${k}">${opties.map(([v, l]) => `<button type="button" data-inst="${k}" data-waarde="${v}" aria-pressed="${w === v}">${l}</button>`).join("")}</div>`;
  return `<button class="paneel rij-knop" data-ga="archief">${ico("archief")}<span><b>Archief</b><small>${S.projecten.filter(p => ["klaar", "archief"].includes(p.status)).length} projecten afgerond of opgeborgen</small></span>${ico("pijl")}</button>
  ${sectie("Weergave")}<div class="paneel instellingen">
    <p class="hud-label">Thema</p>${seg("thema", [["donker", "Donker"], ["licht", "Licht"], ["systeem", "Systeem"]], inst("thema", "donker"))}
    <p class="hud-label">Beweging</p>${seg("beweging", [["vol", "Vol"], ["rustig", "Rustig"]], inst("beweging", "vol"))}
    <p class="hud-label">Hooguit tegelijk actief</p>${seg("wipLimiet", [1, 2, 3, 4, 5, 7].map(n => [String(n), String(n)]), String(wipLimiet()))}
    <details class="waarom"><summary>Waarom een limiet?</summary><p>Met minder projecten tegelijk komt er meer af en kost wisselen minder energie. De app houdt je niet tegen; hij stelt voor om te parkeren. Indirect: uit onderzoek naar taakwisselen en lopend werk.</p></details>
  </div>
  ${sectie("Je gegevens")}<div class="paneel acties">
    <button class="knop primair" data-export>${ico("export")} Exporteren</button>
    <label class="knop rand" for="import-bestand">Importeren<input type="file" id="import-bestand" accept="application/json,.json" hidden></label>
    <p class="klein">Alles staat alleen op dit toestel. Een export is je back-up; bewaar hem in Bestanden of iCloud Drive.</p>
  </div>
  <p class="klein voet">FutureMe Projecten · offline · geen account · ${S.projecten.length} projecten, ${S.logs.length} logs</p>`;
}
KOPPEN.meer = () => ["Meer", "Instellingen en gegevens"];
VIEWS.meer = vwMeer;
