"use strict";
// === APP: toestand, navigatie, onderblad, meldingen ===
const V = { view: "commando", param: null, stapel: [], filter: { status: "open", zoek: "" }, cluster: "fase", sorteer: "prioriteit", logFilter: "" };
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const vandaagISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function datumKort(iso) {
  if (!iso) return "";
  const v = vandaagISO(), d = new Date(iso.slice(0, 10) + "T12:00:00");
  const verschil = Math.round((d - new Date(v + "T12:00:00")) / PT_DAG);
  if (verschil === 0) return "vandaag"; if (verschil === 1) return "morgen"; if (verschil === -1) return "gisteren";
  return `${d.getDate()} ${MAANDEN[d.getMonth()]}${d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : ""}`;
}
const tijdKort = iso => { const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const duurTekst = min => !min ? "0 min" : min < 60 ? `${min} min` : `${Math.floor(min / 60)} u${min % 60 ? " " + (min % 60) : ""}`;
const tril = ms => { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} };

/* Iconen: inline SVG, geen externe bestanden. */
const ICO = {
  commando: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  projecten: '<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', log: '<path d="M4 6h16M4 12h10M4 18h13"/>', meer: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  terug: '<path d="M15 5l-7 7 7 7"/>', check: '<path d="M5 12l5 5 9-10"/>', zoek: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  pijl: '<path d="M9 5l7 7-7 7"/>', archief: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>', ster: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  vlag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', klok: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', pin: '<path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v8"/>',
  omhoog: '<path d="M6 15l6-6 6 6"/>', omlaag: '<path d="M6 9l6 6 6-6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', export: '<path d="M12 4v11M7 9l5-5 5 5M5 20h14"/>'
};
const ico = (n, k) => `<svg class="ico ${k || ""}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ""}</svg>`;

/* ---------- Navigatie ---------- */
const TABS = ["commando", "projecten", "log", "meer"];
const KOPPEN = {};   // view → () => [titel, ondertitel]
const VIEWS = {};    // view → () => html
function ga(view, param, terugStap) {
  if (!terugStap && V.view !== view && !TABS.includes(view)) V.stapel.push({ view: V.view, param: V.param });
  if (TABS.includes(view)) V.stapel = [];
  V.view = view; V.param = param == null ? null : param;
  teken();
  const s = $("#scherm"); if (s) s.scrollTop = 0;
}
function terug() { const v = V.stapel.pop(); if (v) { V.view = v.view; V.param = v.param; teken(); } else ga("commando"); }

function teken() {
  const k = (KOPPEN[V.view] || (() => ["FutureMe", ""]))();
  $("#titel").textContent = k[0]; $("#subtitel").textContent = k[1] || "";
  $("#terugknop").hidden = !V.stapel.length;
  let html = "";
  try { html = (VIEWS[V.view] || VIEWS.commando)(); } catch (e) { console.error(e); html = `<div class="paneel"><p>Er ging iets mis bij dit scherm.</p></div>`; }
  $("#scherm").innerHTML = html;
  document.querySelectorAll("#tabs [data-tab]").forEach(b => b.setAttribute("aria-current", b.dataset.tab === V.view || (b.dataset.tab === "projecten" && V.view === "project") ? "page" : "false"));
  for (const f of NA_TEKENEN) { try { f(); } catch (e) { console.error(e); } }
}
const NA_TEKENEN = [];

/* ---------- Onderblad en meldingen ---------- */
let bladTerug = null;
function bladOpen(titel, inhoud, knoppen) {
  if (!$("#blad").classList.contains("open")) bladTerug = document.activeElement;
  for (const s of ["#scherm", "#tabs", ".kop"]) { const el = $(s); if (el) el.inert = true; }
  $("#bladtitel").textContent = titel;
  $("#bladinhoud").innerHTML = inhoud;
  $("#bladknoppen").innerHTML = knoppen || "";
  $("#blad").classList.add("open"); $("#blad").setAttribute("aria-hidden", "false"); $("#dek").classList.add("open");
  setTimeout(() => { const f = $("#blad input, #blad textarea, #blad button"); if (f && !matchMedia("(hover: none)").matches) f.focus(); }, 60);
}
function bladSluit() {
  $("#blad").classList.remove("open"); $("#blad").setAttribute("aria-hidden", "true"); $("#dek").classList.remove("open");
  for (const s of ["#scherm", "#tabs", ".kop"]) { const el = $(s); if (el) el.inert = false; }
  if (bladTerug && document.body.contains(bladTerug)) bladTerug.focus({ preventScroll: true });
}
let toastTimer = null;
function toast(tekst, knop, doe, ms) {
  const t = $("#toast");
  t.innerHTML = `<span>${esc(tekst)}</span>${knop ? `<button type="button" id="toastknop">${esc(knop)}</button>` : ""}`;
  t.classList.add("open");
  if (knop) $("#toastknop").onclick = () => { t.classList.remove("open"); doe && doe(); };
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("open"), ms || (knop ? 6000 : 2600));
}

/* ---------- Thema en beweging ---------- */
function pasInstellingenToe() {
  const h = document.documentElement;
  h.dataset.thema = inst("thema", "donker");
  h.dataset.beweging = inst("beweging", "vol");
}

/* ---------- Start ---------- */
async function start() {
  await dbLaad();
  pasInstellingenToe();
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-tab]"); if (t) { e.preventDefault(); return t.dataset.tab === "nieuw" ? nieuwProject() : ga(t.dataset.tab); }
    const g = e.target.closest("[data-ga]"); if (g) { e.preventDefault(); return ga(g.dataset.ga, g.dataset.param || null); }
  });
  // Terugvegen in Safari: één schildwacht in de geschiedenis. Was er iets terug te doen (blad dicht, scherm terug),
  // dan komt de schildwacht terug; anders niet, en verlaat de volgende veeg de app zoals gewoonlijk.
  $("#terugknop").onclick = terug;
  try { history.pushState({ fm: 1 }, ""); } catch (e) {}
  window.addEventListener("popstate", () => {
    const blad = $("#blad").classList.contains("open"), timer = !!$("#timer");
    if (timer) {} else if (blad) bladSluit(); else if (V.stapel.length) terug(); else return;
    try { history.pushState({ fm: 1 }, ""); } catch (e) {}
  });
  $("#dek").onclick = bladSluit;
  $("#bladsluit").onclick = bladSluit;
  document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#blad").classList.contains("open")) bladSluit(); });
  teken();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}
