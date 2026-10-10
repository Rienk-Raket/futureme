"use strict";
// === ACTIES: wizard, loggen, status, stappen, mijlpalen, filters, instellingen, gegevens ===

/* ---------- Nieuw project: vier korte vragen ---------- */
const WZ = { stap: 0, d: null };
function nieuwProject(opnieuw) {
  // Per ongeluk dichtgetikt? Dan ga je verder waar je was.
  if (!opnieuw && WZ.d && (WZ.d.titel || WZ.d.waarom)) return wizardTeken();
  WZ.stap = 0;
  WZ.d = { titel: "", waarom: "", klaar: "", eersteStap: "", cluster: "", tags: "", energie: "", deadline: "", kleur: PT_KLEUREN[S.projecten.length % PT_KLEUREN.length], status: "actief", prioriteit: 2 };
  wizardTeken();
}
function wizardTeken() {
  const d = WZ.d, n = WZ.stap, wip = ptWip(S.projecten, wipLimiet());
  const stappen = [
    () => `<div class="veld"><label for="wz-titel">Hoe heet je project?</label><input class="invoer" id="wz-titel" maxlength="80" value="${esc(d.titel)}" placeholder="Bijvoorbeeld: Fotoboek Japan" autocomplete="off"></div>
      <div class="veld"><label for="wz-waarom">Waarom wil je dit? <small>(mag kort)</small></label><textarea class="invoer" id="wz-waarom" rows="3" maxlength="300" placeholder="Wat levert het je op als het af is?">${esc(d.waarom)}</textarea></div>
      <details class="waarom"><summary>Waarom deze vraag?</summary><p>Een eigen reden om iets te doen houdt je langer gaande dan een opgelegde. Op een zware dag lees je hem terug. Indirect: uit onderzoek naar motivatie, niet specifiek bij ADHD.</p></details>`,
    () => `<div class="veld"><label for="wz-klaar">Wanneer is het af?</label><textarea class="invoer" id="wz-klaar" rows="3" maxlength="300" placeholder="Bijvoorbeeld: het boek is besteld en ligt op tafel">${esc(d.klaar)}</textarea></div>
      <details class="waarom"><summary>Waarom deze vraag?</summary><p>Zonder duidelijk eindpunt blijft een project eindeloos groeien. Een zichtbaar 'klaar' maakt afronden mogelijk. Praktisch: een experiment, kijk of het bij jou werkt.</p></details>`,
    () => `<div class="veld"><label for="wz-stap">Wat is de eerste handeling?</label><input class="invoer" id="wz-stap" maxlength="120" value="${esc(d.eersteStap)}" placeholder="Bijvoorbeeld: map met foto's openen" autocomplete="off"></div>
      <p class="hint" id="wz-hint" aria-live="polite">${d.eersteStap && ptStapVaag(d.eersteStap) ? "Nog wat vaag. Wat doen je handen als eerste?" : ""}</p>
      <div class="chips">${["Map openen", "Lijstje maken", "Eén zin schrijven", "Spullen klaarleggen"].map(v => `<button type="button" class="chip-knop" data-wz-vb="${esc(v)}">${esc(v)}</button>`).join("")}</div>
      <details class="waarom"><summary>Waarom deze vraag?</summary><p>Een stap die met een werkwoord begint en meteen kan starten, is makkelijker te beginnen dan een vaag plan. Indirect: uit onderzoek naar plannen en taakopdeling.</p></details>`,
    () => `<div class="veld"><label for="wz-cluster">Cluster <small>(bv. Werk, Thuis, Creatief)</small></label><input class="invoer" id="wz-cluster" list="wz-clusters" value="${esc(d.cluster)}" maxlength="40" autocomplete="off"><datalist id="wz-clusters">${clusters().map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
      <div class="veld"><label for="wz-tags">Tags <small>(met komma's)</small></label><input class="invoer" id="wz-tags" value="${esc(d.tags)}" maxlength="100" autocomplete="off"></div>
      <p class="hud-label">Energie die het vraagt</p><div class="segment">${Object.entries(PT_ENERGIE).map(([k, l]) => `<button type="button" data-wz-energie="${k}" aria-pressed="${d.energie === k}">${l.replace(" energie", "").replace("Gemiddeld", "Midden")}</button>`).join("")}</div>
      <div class="veld"><label for="wz-deadline">Deadline <small>(mag leeg)</small></label><input class="invoer" id="wz-deadline" type="date" value="${esc(d.deadline)}"></div>
      <p class="hud-label">Kleur</p><div class="kleuren">${PT_KLEUREN.map(k => `<button type="button" class="kleur" data-wz-kleur="${k}" aria-pressed="${d.kleur === k}" style="--k:${k}" aria-label="Kleur ${k}"></button>`).join("")}</div>
      <p class="hud-label">Starten</p><div class="segment"><button type="button" data-wz-status="actief" aria-pressed="${d.status === "actief"}">Nu actief</button><button type="button" data-wz-status="idee" aria-pressed="${d.status === "idee"}">Ideeënbak</button></div>
      ${d.status === "actief" && !wip.vrij ? `<p class="hint">Er zijn al ${wip.actief} projecten actief (limiet ${wip.limiet}). De ideeënbak houdt dit project veilig tot er ruimte is.</p>` : ""}`
  ];
  const titels = ["Wat ga je maken?", "Wanneer is het klaar?", "De eerste stap", "Indelen"];
  bladOpen(`${titels[n]} · ${n + 1}/4`, `${d.titel && n === 0 ? `<button type="button" class="link klein" data-wz="opnieuw">Opnieuw beginnen</button>` : ""}<div class="wz-voortgang" aria-hidden="true">${[0, 1, 2, 3].map(i => `<i class="${i <= n ? "aan" : ""}"></i>`).join("")}</div>${stappen[n]()}`,
    `${n ? `<button class="knop rand" data-wz="terug">Terug</button>` : ""}<button class="knop primair" data-wz="verder">${n < 3 ? "Verder" : "Project starten"}</button>`);
  const stap = $("#wz-stap");
  if (stap) stap.addEventListener("input", () => { $("#wz-hint").textContent = stap.value.trim() && ptStapVaag(stap.value) ? "Nog wat vaag. Wat doen je handen als eerste?" : ""; });
}
function wizardLees() {
  const d = WZ.d, w = id => { const el = $(id); return el ? el.value.trim() : null; };
  [["#wz-titel", "titel"], ["#wz-waarom", "waarom"], ["#wz-klaar", "klaar"], ["#wz-stap", "eersteStap"], ["#wz-cluster", "cluster"], ["#wz-tags", "tags"], ["#wz-deadline", "deadline"]]
    .forEach(([id, k]) => { const v = w(id); if (v !== null) d[k] = v; });
}
async function wizardKlaar() {
  const d = WZ.d, t = new Date().toISOString();
  const p = { id: uid(), titel: d.titel, waarom: d.waarom, klaar: d.klaar, fase: "idee", status: d.status, cluster: d.cluster,
    tags: d.tags.split(",").map(x => x.trim().replace(/^#/, "")).filter(Boolean), energie: d.energie, deadline: d.deadline || null, kleur: d.kleur, prioriteit: d.prioriteit, gemaakt: t };
  await bewaar("projecten", p);
  if (d.eersteStap) await bewaar("stappen", { id: uid(), projectId: p.id, tekst: d.eersteStap, af: false, volgorde: 1, gemaakt: t });
  await log(p.id, "fase", "Project gestart", { fase: "idee" });
  WZ.d = null; WZ.stap = 0;
  bladSluit(); tril(10);
  ga("project", p.id);
  toast(d.status === "idee" ? "In de ideeënbak. Hij loopt niet weg." : "Project gestart. De eerste stap staat klaar.");
}

/* ---------- Loggen ---------- */
function snelLog(projectId) {
  const p = vind("projecten", projectId); if (!p) return;
  let soort = "werk", min = 25;
  bladOpen(`Loggen · ${p.titel}`, `<p class="hud-label">Wat wil je vastleggen?</p>
    <div class="chips" id="log-soorten">${["werk", "notitie", "winst", "blokkade", "energie"].map(k => `<button type="button" class="chip-knop" data-log-soort="${k}" aria-pressed="${k === soort}">${PT_LOGSOORTEN[k].ico} ${PT_LOGSOORTEN[k].naam}</button>`).join("")}</div>
    <div id="log-min-veld"><p class="hud-label">Hoe lang?</p><div class="chips">${[5, 15, 25, 45, 60, 90].map(m => `<button type="button" class="chip-knop" data-log-min="${m}" aria-pressed="${m === min}">${m} min</button>`).join("")}</div></div>
    <div class="veld"><label for="log-tekst">Notitie <small>(mag leeg)</small></label><textarea class="invoer" id="log-tekst" rows="3" maxlength="400" placeholder="Wat deed je, wat merkte je?"></textarea></div>`,
    `<button class="knop primair breed" id="log-bewaar">Vastleggen</button>`);
  const inhoud = $("#bladinhoud");
  inhoud.onclick = e => {
    const s = e.target.closest("[data-log-soort]"), m = e.target.closest("[data-log-min]");
    if (s) { soort = s.dataset.logSoort; inhoud.querySelectorAll("[data-log-soort]").forEach(b => b.setAttribute("aria-pressed", String(b === s))); $("#log-min-veld").hidden = soort !== "werk"; }
    if (m) { min = +m.dataset.logMin; inhoud.querySelectorAll("[data-log-min]").forEach(b => b.setAttribute("aria-pressed", String(b === m))); }
  };
  $("#log-bewaar").onclick = async () => {
    const tekst = $("#log-tekst").value.trim();
    if (soort !== "werk" && !tekst) { toast("Schrijf er kort iets bij"); return; }
    await log(p.id, soort, tekst, soort === "werk" ? { minuten: min } : {});
    bladSluit(); tril(8); teken(); toast(soort === "werk" ? `${duurTekst(min)} gelogd. De draad loopt.` : "Vastgelegd");
  };
}

/* ---------- Status ---------- */
async function zetStatus(id, status) {
  const p = vind("projecten", id); if (!p) return;
  if (status === "actief" && p.status !== "actief") {
    const wip = ptWip(S.projecten, wipLimiet(), p.id);
    if (!wip.vrij) {
      bladOpen("Even kiezen", `<p>Er zijn al <b>${wip.actief}</b> projecten actief, je limiet is ${wip.limiet}. Minder tegelijk maakt afmaken makkelijker.</p>
        <p class="klein">Zet er een op pauze, of maak dit project toch actief.</p>
        <details class="waarom"><summary>Waarom?</summary><p>Wisselen tussen taken kost tijd en aandacht; met minder lopend werk komt er meer af. Indirect: onderzocht bij taakwisselen en werkprocessen, niet specifiek bij ADHD.</p></details>
        <div class="lijst">${S.projecten.filter(x => x.status === "actief").map(x => `<button class="knop rand breed" data-wip-pauze="${esc(x.id)}" data-nieuw="${esc(p.id)}">${esc(x.titel)} pauzeren</button>`).join("")}</div>`,
        `<button class="knop rand breed" data-wip-toch="${esc(p.id)}">Toch actief maken</button>`);
      return;
    }
  }
  if (status === "klaar") return afrondBlad(p);
  await statusToepassen(p, status);
  tril(8); teken();
  toast({ actief: "Actief. Kies een volgende stap.", wacht: "Op wacht gezet.", pauze: "Gepauzeerd. Pauze is ook een keuze.", idee: "Terug in de ideeënbak.", archief: "Gearchiveerd." }[status] || "Bijgewerkt");
}
/** De enige plek die een status zet (behalve afronden): afgerondOp en focus kloppen altijd. */
async function statusToepassen(p, status, reden) {
  const oud = p.status;
  p.status = status;
  p.afgerondOp = status === "archief" ? p.afgerondOp || null : null;
  await bewaar("projecten", p);
  if (status !== "actief" && inst("focusId", null) === p.id) await zetInst("focusId", null);
  await log(p.id, "fase", `${reden ? reden + ": " : "Status: "}${PT_STATUS[oud].naam} → ${PT_STATUS[status].naam}`);
}
function afrondBlad(p) {
  bladOpen(`Afronden · ${p.titel}`, `<p class="hud-label">Klaar als</p><p>${esc(p.klaar || "Geen eindpunt vastgelegd.")}</p>
    <div class="veld"><label for="ev-werkte">Wat werkte?</label><textarea class="invoer" id="ev-werkte" rows="2" maxlength="300"></textarea></div>
    <div class="veld"><label for="ev-schuurde">Wat schuurde?</label><textarea class="invoer" id="ev-schuurde" rows="2" maxlength="300"></textarea></div>
    <div class="veld"><label for="ev-mee">Wat neem je mee?</label><textarea class="invoer" id="ev-mee" rows="2" maxlength="300"></textarea></div>
    <details class="waarom"><summary>Waarom deze vragen?</summary><p>Kort terugkijken maakt zichtbaar wat je volgende keer weer zo doet. Het hoeft niet; leeg laten mag. Praktisch: een experiment.</p></details>`,
    `<button class="knop primair breed" id="ev-klaar">Afronden</button>`);
  $("#ev-klaar").onclick = async () => {
    const delen = [["Werkte", "#ev-werkte"], ["Schuurde", "#ev-schuurde"], ["Meenemen", "#ev-mee"]].map(([l, id]) => [l, $(id).value.trim()]).filter(([, v]) => v);
    p.status = "klaar"; p.fase = "evalueren"; p.afgerondOp = new Date().toISOString();
    if (delen.length) p.evaluatie = Object.fromEntries(delen);
    await bewaar("projecten", p);
    await log(p.id, "winst", "Afgerond" + (delen.length ? ". " + delen.map(([l, v]) => `${l}: ${v}`).join(" · ") : ""));
    if (inst("focusId", null) === p.id) await zetInst("focusId", null);
    bladSluit(); tril([20, 40, 20]); teken();
    feest(p);
  };
}
function feest(p) {
  if (inst("beweging", "vol") === "vol" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const f = document.createElement("div"); f.className = "feest"; f.setAttribute("aria-hidden", "true");
    f.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="--i:${i};--k:${PT_KLEUREN[i % PT_KLEUREN.length]}"></i>`).join("");
    document.body.appendChild(f); setTimeout(() => f.remove(), 1800);
  }
  toast(`${p.titel} is af. Dat is van A tot Z.`);
}

/* ---------- Bewerken en verwijderen ---------- */
function bewerkBlad(p) {
  bladOpen("Project bewerken", `<div class="veld"><label for="pb-titel">Titel</label><input class="invoer" id="pb-titel" maxlength="80" value="${esc(p.titel)}"></div>
    <div class="veld"><label for="pb-waarom">Waarom</label><textarea class="invoer" id="pb-waarom" rows="2" maxlength="300">${esc(p.waarom || "")}</textarea></div>
    <div class="veld"><label for="pb-klaar">Klaar als</label><textarea class="invoer" id="pb-klaar" rows="2" maxlength="300">${esc(p.klaar || "")}</textarea></div>
    <div class="veld"><label for="pb-cluster">Cluster</label><input class="invoer" id="pb-cluster" list="pb-clusters" maxlength="40" value="${esc(p.cluster || "")}"><datalist id="pb-clusters">${clusters().map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
    <div class="veld"><label for="pb-tags">Tags</label><input class="invoer" id="pb-tags" maxlength="100" value="${esc((p.tags || []).join(", "))}"></div>
    <div class="veld"><label for="pb-deadline">Deadline</label><input class="invoer" id="pb-deadline" type="date" value="${esc(p.deadline || "")}"></div>
    <p class="hud-label">Prioriteit</p><div class="segment">${[[1, "Laag"], [2, "Gewoon"], [3, "Hoog"]].map(([v, l]) => `<button type="button" data-pb-prio="${v}" aria-pressed="${(p.prioriteit || 2) === v}">${l}</button>`).join("")}</div>
    <p class="hud-label">Energie</p><div class="segment">${Object.entries(PT_ENERGIE).map(([k, l]) => `<button type="button" data-pb-energie="${k}" aria-pressed="${p.energie === k}">${l.replace(" energie", "").replace("Gemiddeld", "Midden")}</button>`).join("")}</div>
    <p class="hud-label">Kleur</p><div class="kleuren">${PT_KLEUREN.map(k => `<button type="button" class="kleur" data-pb-kleur="${k}" aria-pressed="${p.kleur === k}" style="--k:${k}" aria-label="Kleur ${k}"></button>`).join("")}</div>`,
    `<button class="knop primair breed" id="pb-bewaar">Bewaren</button>`);
  const tmp = { prioriteit: p.prioriteit || 2, energie: p.energie || "", kleur: p.kleur };
  $("#bladinhoud").onclick = e => {
    const pr = e.target.closest("[data-pb-prio]"), en = e.target.closest("[data-pb-energie]"), kl = e.target.closest("[data-pb-kleur]");
    const kies = (sel, el) => document.querySelectorAll(sel).forEach(b => b.setAttribute("aria-pressed", String(b === el)));
    if (pr) { tmp.prioriteit = +pr.dataset.pbPrio; kies("[data-pb-prio]", pr); }
    if (en) { tmp.energie = en.dataset.pbEnergie; kies("[data-pb-energie]", en); }
    if (kl) { tmp.kleur = kl.dataset.pbKleur; kies("[data-pb-kleur]", kl); }
  };
  $("#pb-bewaar").onclick = async () => {
    const titel = $("#pb-titel").value.trim(); if (!titel) { toast("Een titel is nodig"); return; }
    Object.assign(p, tmp, { titel, waarom: $("#pb-waarom").value.trim(), klaar: $("#pb-klaar").value.trim(), cluster: $("#pb-cluster").value.trim(),
      tags: $("#pb-tags").value.split(",").map(x => x.trim().replace(/^#/, "")).filter(Boolean), deadline: $("#pb-deadline").value || null });
    await bewaar("projecten", p); bladSluit(); teken(); toast("Bewaard");
  };
}
function bevestig(titel, tekst, knop, doe) {
  bladOpen(titel, `<p>${esc(tekst)}</p>`, `<button class="knop rand" id="bv-nee">Annuleren</button><button class="knop primair gevaar" id="bv-ja">${esc(knop)}</button>`);
  $("#bv-nee").onclick = bladSluit; $("#bv-ja").onclick = async () => { bladSluit(); await doe(); };
}

/* ---------- Mijlpaal gehaald: kort terugkijken (mag overslaan) ---------- */
function mijlpaalTerugblik(m) {
  bladOpen(`Mijlpaal gehaald`, `<p class="blok-klaar">${esc(m.titel)}</p>
    <div class="veld"><label for="mt-werkte">Wat werkte? <small>(mag leeg)</small></label><textarea class="invoer" id="mt-werkte" rows="2" maxlength="300"></textarea></div>
    <div class="veld"><label for="mt-mee">Wat neem je mee naar het volgende stuk?</label><textarea class="invoer" id="mt-mee" rows="2" maxlength="300"></textarea></div>`,
    `<button class="knop rand" id="mt-over">Overslaan</button><button class="knop primair" id="mt-bewaar">Bewaren</button>`);
  $("#mt-over").onclick = bladSluit;
  $("#mt-bewaar").onclick = async () => {
    const delen = [["Werkte", $("#mt-werkte").value.trim()], ["Meenemen", $("#mt-mee").value.trim()]].filter(([, v]) => v);
    if (delen.length) { m.evaluatie = Object.fromEntries(delen); await bewaar("mijlpalen", m); await log(m.projectId, "notitie", `Terugblik ${m.titel}: ` + delen.map(([l, v]) => `${l}: ${v}`).join(" · ")); }
    bladSluit(); teken();
  };
}

const BEZIG = new Set(), PRULLENBAK = [];

/* ---------- Eén klikafhandeling voor alles ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-wz],[data-wz-vb],[data-wz-energie],[data-wz-kleur],[data-wz-status],[data-stap-af],[data-stap-vink],[data-stap-pin],[data-stap-op],[data-stap-weg],[data-mijl-nieuw],[data-mijl-vink],[data-mijl-weg],[data-snel-log],[data-status],[data-wip-pauze],[data-wip-toch],[data-project-bewerk],[data-project-weg],[data-fase],[data-filter-status],[data-filter-cluster],[data-filter-tag],[data-log-filter],[data-inst],[data-export],[data-focus-kies],[data-focus-zet]");
  if (!el) return;
  const d = el.dataset;
  if (d.wz) {
    wizardLees();
    if (d.wz === "terug") { WZ.stap--; return wizardTeken(); }
    if (d.wz === "opnieuw") return nieuwProject(true);
    if (WZ.stap === 0 && !WZ.d.titel) { toast("Geef je project een naam"); return; }
    if (WZ.stap < 3) { WZ.stap++; return wizardTeken(); }
    return wizardKlaar();
  }
  if (d.wzVb !== undefined) { const i = $("#wz-stap"); i.value = d.wzVb; i.dispatchEvent(new Event("input")); return; }
  if (d.wzEnergie) { wizardLees(); WZ.d.energie = WZ.d.energie === d.wzEnergie ? "" : d.wzEnergie; return wizardTeken(); }
  if (d.wzKleur) { wizardLees(); WZ.d.kleur = d.wzKleur; return wizardTeken(); }
  if (d.wzStatus) { wizardLees(); WZ.d.status = d.wzStatus; return wizardTeken(); }
  if (d.stapAf || d.stapVink) {
    const id = d.stapAf || d.stapVink, s = vind("stappen", id); if (!s || BEZIG.has(id)) return;
    if (d.stapAf && s.af) return;   // "Stap klaar" zet af, nooit terug
    BEZIG.add(id); setTimeout(() => BEZIG.delete(id), 400);
    s.af = !s.af; s.afOp = s.af ? new Date().toISOString() : null; await bewaar("stappen", s);
    if (s.af) await log(s.projectId, "winst", `Stap: ${s.tekst}`);
    tril(s.af ? 12 : 6); teken();
    if (s.af) { const p = vind("projecten", s.projectId), v = p && ptVolgendeStap(p, S.stappen); toast(v ? `Mooi. Volgende: ${v.tekst}` : "Mooi. Wat is de volgende stap?"); }
    return;
  }
  if (d.stapPin) { const s = vind("stappen", d.stapPin); for (const x of S.stappen.filter(x => x.projectId === s.projectId && x.pin && x.id !== s.id)) { x.pin = false; await bewaar("stappen", x); } s.pin = !s.pin; await bewaar("stappen", s); return teken(); }
  if (d.stapOp) {
    const s = vind("stappen", d.stapOp), l = stappenVan(s.projectId).filter(x => !x.af), i = l.indexOf(s);
    if (i > 0) { l.forEach((x, j) => { x.volgorde = j; }); [l[i - 1].volgorde, s.volgorde] = [s.volgorde, l[i - 1].volgorde]; await bewaar("stappen", s); await bewaar("stappen", l[i - 1]); for (const x of l) await bewaar("stappen", x); }
    return teken();
  }
  if (d.stapWeg) {
    const s = vind("stappen", d.stapWeg); if (!s) return;
    PRULLENBAK.push(s); clearTimeout(PRULLENBAK.timer); PRULLENBAK.timer = setTimeout(() => { PRULLENBAK.length = 0; }, 6500);
    await verwijder("stappen", d.stapWeg); teken();
    const n = PRULLENBAK.length;
    toast(n > 1 ? `${n} stappen verwijderd` : "Stap verwijderd", "Ongedaan", async () => { for (const x of PRULLENBAK.splice(0)) await bewaar("stappen", x); teken(); });
    return;
  }
  if (d.mijlNieuw) {
    bladOpen("Mijlpaal", `<div class="veld"><label for="mp-titel">Tussendoel</label><input class="invoer" id="mp-titel" maxlength="80" placeholder="Bijvoorbeeld: eerste versie klaar"></div>
      <div class="veld"><label for="mp-datum">Wanneer? <small>(mag leeg)</small></label><input class="invoer" id="mp-datum" type="date"></div>`, `<button class="knop primair breed" id="mp-bewaar">Toevoegen</button>`);
    $("#mp-bewaar").onclick = async () => { const t = $("#mp-titel").value.trim(); if (!t) { toast("Geef de mijlpaal een naam"); return; }
      await bewaar("mijlpalen", { id: uid(), projectId: d.mijlNieuw, titel: t, datum: $("#mp-datum").value || null, af: false, gemaakt: new Date().toISOString() }); bladSluit(); teken(); };
    return;
  }
  if (d.mijlVink) { const m = vind("mijlpalen", d.mijlVink); m.af = !m.af; m.afOp = m.af ? new Date().toISOString() : null; await bewaar("mijlpalen", m); if (m.af) await log(m.projectId, "winst", `Mijlpaal: ${m.titel}`); tril(m.af ? [15, 30, 15] : 6); teken();
    if (m.af) mijlpaalTerugblik(m);
    return; }
  if (d.mijlWeg) { await verwijder("mijlpalen", d.mijlWeg); return teken(); }
  if (d.snelLog) return snelLog(d.snelLog);
  if (d.status) return zetStatus(d.id, d.status);
  if (d.wipPauze) { await statusToepassen(vind("projecten", d.wipPauze), "pauze"); bladSluit(); return zetStatus(d.nieuw, "actief"); }
  if (d.wipToch) { await statusToepassen(vind("projecten", d.wipToch), "actief"); bladSluit(); teken(); toast("Actief. Kies een volgende stap."); return; }
  if (d.projectBewerk) return bewerkBlad(vind("projecten", d.projectBewerk));
  if (d.projectWeg) {
    const p = vind("projecten", d.projectWeg);
    return bevestig("Project verwijderen?", `${p.titel} en alle stappen, mijlpalen en logs verdwijnen. Archiveren bewaart alles.`, "Verwijderen", async () => {
      for (const w of ["stappen", "mijlpalen", "logs", "beloftes"]) for (const x of S[w].filter(x => x.projectId === p.id)) await verwijder(w, x.id);
      await verwijder("projecten", p.id); ga("projecten"); toast("Verwijderd");
    });
  }
  if (d.fase) {
    const p = vind("projecten", V.param); if (!p || p.fase === d.fase) return;
    const van = PT_FASES[ptFaseIndex(p.fase)], naar = PT_FASES[ptFaseIndex(d.fase)];
    p.fase = d.fase; await bewaar("projecten", p); await log(p.id, "fase", `${van.letter} ${van.naam} → ${naar.letter} ${naar.naam}`, { fase: d.fase });
    tril(10); teken(); toast(`Fase ${naar.letter}: ${naar.naam}. ${naar.vraag}`); return;
  }
  if (d.filterStatus) { V.filter.status = d.filterStatus === "open" ? "open" : [d.filterStatus]; return teken(); }
  if (d.filterCluster !== undefined) { V.filter.cluster = V.filter.cluster === d.filterCluster ? "" : d.filterCluster; return teken(); }
  if (d.filterTag !== undefined) { V.filter.tag = V.filter.tag === d.filterTag ? "" : d.filterTag; return teken(); }
  if (d.logFilter !== undefined) { V.logFilter = d.logFilter; return teken(); }
  if (d.inst) { await zetInst(d.inst, d.inst === "wipLimiet" ? +d.waarde : d.waarde); pasInstellingenToe(); return teken(); }
  if (d.export !== undefined) {
    const blob = new Blob([exportJSON()], { type: "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `futureme-projecten-${vandaagISO()}.json`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000); await zetInst("laatsteExport", new Date().toISOString()); toast("Export gemaakt"); return;
  }
  if (d.focusKies !== undefined) {
    bladOpen("Focus kiezen", `<div class="lijst">${S.projecten.filter(p => p.status === "actief").map(p => `<button class="knop rand breed" data-focus-zet="${esc(p.id)}">${esc(p.titel)}</button>`).join("")}</div>`);
    return;
  }
  if (d.focusZet) { await zetInst("focusId", d.focusZet); bladSluit(); return teken(); }
});
// Formulieren en invoer
document.addEventListener("submit", async e => {
  const f = e.target.closest("[data-stap-nieuw]"); if (!f) return;
  e.preventDefault();
  const i = f.querySelector("input"), tekst = i.value.trim(); if (!tekst) return;
  const id = f.dataset.stapNieuw, max = Math.max(0, ...S.stappen.filter(s => s.projectId === id).map(s => s.volgorde || 0));
  await bewaar("stappen", { id: uid(), projectId: id, tekst, af: false, volgorde: max + 1, gemaakt: new Date().toISOString() });
  tril(6); teken();
  const nieuw = $("#stap-tekst"); if (nieuw) nieuw.focus();
  if (ptStapVaag(tekst)) { const h = $("#stap-hint"); if (h) h.textContent = "Toegevoegd. Tip: begin met een werkwoord, dan weet je straks meteen wat je doet (indirect onderbouwd: taakopdeling en plannen)."; }
});
document.addEventListener("input", e => {
  if (e.target.id === "zoek") { V.filter.zoek = e.target.value; const pos = e.target.selectionStart; teken(); const z = $("#zoek"); if (z) { z.focus(); z.setSelectionRange(pos, pos); } }
});
document.addEventListener("change", async e => {
  if (e.target.id === "cluster-op") { V.cluster = e.target.value; teken(); }
  if (e.target.id === "sorteer-op") { V.sorteer = e.target.value; teken(); }
  if (e.target.id === "import-bestand" && e.target.files[0]) {
    const tekst = await e.target.files[0].text();
    bladOpen("Importeren", `<p>Samenvoegen houdt wat je hebt en voegt nieuwere versies toe. Wat je hier verwijderd hebt, komt niet terug.</p><p class="hint">Vervangen wist eerst alles op dit toestel. Maak eerst een export als je twijfelt.</p>`,
      `<button class="knop rand" id="im-vervang">Vervangen</button><button class="knop primair" id="im-samen">Samenvoegen</button>`);
    const doe = async vervangen => { try { const t = await importJSON(tekst, vervangen); bladSluit(); pasInstellingenToe(); teken(); toast(`Geïmporteerd: ${t.projecten} projecten, ${t.logs} logs`); } catch (err) { bladSluit(); toast(err.message || "Importeren lukte niet"); } };
    $("#im-samen").onclick = () => doe(false); $("#im-vervang").onclick = () => doe(true);
    e.target.value = "";
  }
});
