"use strict";
/* ==========================================================================
   60. Wishlist — dingen die je wilt kopen
   Per wens: naam, prijs en (optioneel) motivatie. Twee vinkjes per regel:
   ✓ gekocht of ✕ niet gekocht. Een gekozen regel schuift uit de actieve
   lijst naar de inklapbare tabel "Gekocht" of "Niet gekocht" eronder, en kan
   daar terug naar de wishlist. Bij "gekocht" kun je hem meteen als uitgave
   loggen. Opslag: winkel wl_items.
   ========================================================================== */
WINKELS.wl_items = "id";
if (!S.wl_items) S.wl_items = [];
V.wlOpen = V.wlOpen || { gekocht: false, niet: false };

const wlAlle = status => S.wl_items.filter(x => (x.status || "actief") === status);
const wlSom = lijst => lijst.reduce((a, x) => a + (+x.prijs || 0), 0);
const wlPrijs = n => eur(+n || 0);
function wlOnderschrift() {
  const a = wlAlle("actief");
  return a.length ? `${a.length} wens${a.length === 1 ? "" : "en"} · ${wlPrijs(wlSom(a))}` : "Wat je graag wilt kopen";
}
Object.defineProperty(KOPPEN, "wishlist", { get: () => ["Wishlist", wlOnderschrift], configurable: true, enumerable: true });

/* ---------- Scherm ---------- */
function wlRijActief(x) {
  return `<div class="wl-rij" data-wl-rij="${x.id}">
    <button class="wl-info" data-act="wl-bewerk" data-id="${x.id}">
      <span class="wl-naam">${esc(x.naam)}</span>
      ${x.motivatie ? `<span class="wl-mot">${esc(x.motivatie)}</span>` : ""}
    </button>
    <span class="wl-prijs">${wlPrijs(x.prijs)}</span>
    <span class="wl-knoppen">
      <button class="wl-vink ja" data-act="wl-zet" data-id="${x.id}" data-s="gekocht" aria-label="Gekocht: ${esc(x.naam)}" title="Gekocht">${ico("check")}</button>
      <button class="wl-vink nee" data-act="wl-zet" data-id="${x.id}" data-s="niet" aria-label="Niet gekocht: ${esc(x.naam)}" title="Niet gekocht">${ico("x")}</button>
    </span>
  </div>`;
}
function wlRijKlaar(x) {
  return `<div class="wl-rij klaar ${x.status}" data-wl-rij="${x.id}">
    <button class="wl-info" data-act="wl-bewerk" data-id="${x.id}">
      <span class="wl-naam">${esc(x.naam)}</span>
      <span class="wl-mot">${x.besloten ? esc(datumLabel(x.besloten.slice(0, 10), true)) : ""}${x.motivatie ? " · " + esc(x.motivatie) : ""}</span>
    </button>
    <span class="wl-prijs">${wlPrijs(x.prijs)}</span>
    <span class="wl-knoppen"><button class="wl-terug" data-act="wl-zet" data-id="${x.id}" data-s="actief" aria-label="Terug naar de wishlist: ${esc(x.naam)}" title="Terug naar de wishlist">${ico("herhaal")}</button></span>
  </div>`;
}
function wlSectie(status, titel, uitleg) {
  const r = wlAlle(status).sort((a, b) => (b.besloten || "").localeCompare(a.besloten || ""));
  if (!r.length) return "";
  const open = V.wlOpen[status];
  return `<div class="card wl-klaar ${status}">
    <button class="wl-klaarkop" data-act="wl-klap" data-s="${status}" aria-expanded="${open}">
      <span class="wl-klaaricoon">${ico(status === "gekocht" ? "check" : "x")}</span>
      <span class="wl-klaartitel"><b>${titel}</b><small>${r.length} ${r.length === 1 ? "item" : "items"} · ${uitleg}</small></span>
      <span class="wl-klaarsom">${wlPrijs(wlSom(r))}</span>
      ${ico("pijlr", `width:16px;height:16px;color:var(--faint);transform:rotate(${open ? 90 : 0}deg);transition:transform .25s`)}
    </button>
    ${open ? `<div class="wl-tabel">${r.map(wlRijKlaar).join("")}</div>` : ""}
  </div>`;
}
function vwWishlist() {
  const actief = wlAlle("actief").sort((a, b) => (b.volgorde || 0) - (a.volgorde || 0));
  const gekocht = wlAlle("gekocht"), niet = wlAlle("niet");
  let h = `<div class="card wl-held">
    <div><span class="wl-label">Op je wishlist</span><div class="wl-totaal">${wlPrijs(wlSom(actief))}</div>
      <span class="klein">${actief.length} wens${actief.length === 1 ? "" : "en"}</span></div>
    <div class="wl-mini">
      <div><b>${wlPrijs(wlSom(gekocht))}</b><span>gekocht</span></div>
      <div><b>${wlPrijs(wlSom(niet))}</b><span>bespaard</span></div>
    </div></div>
  <div class="card wl-nieuw">
    <div class="wl-nieuwrij">
      <input class="invoer" id="wl-naam" type="text" placeholder="Wat wil je kopen?" enterkeyhint="next" autocomplete="off" aria-label="Naam">
      <label class="wl-prijsvak"><span>€</span><input class="invoer" id="wl-prijs" type="text" inputmode="decimal" placeholder="0,00" enterkeyhint="next" aria-label="Prijs"></label>
    </div>
    <input class="invoer" id="wl-mot" type="text" placeholder="Waarom wil je het? (optioneel)" enterkeyhint="done" autocomplete="off" aria-label="Motivatie">
    <button class="knop breed primair" data-act="wl-toevoegen">${ico("plus")} Op de wishlist</button>
  </div>`;
  h += sectie("Wishlist", actief.length || null);
  h += actief.length
    ? `<div class="card wl-tabel wl-actief"><div class="wl-kop"><span>Product</span><span>Prijs</span><span class="wl-kopknoppen"><i>gekocht</i><i>niet</i></span></div>${actief.map(wlRijActief).join("")}</div>`
    : `<div class="card">${leeg("🎁", "Je wishlist is leeg", "Zet hierboven iets op je lijst. Vink het later af als gekocht of niet gekocht.")}</div>`;
  h += wlSectie("gekocht", "Gekocht", "uitgegeven") + wlSectie("niet", "Niet gekocht", "bewust laten liggen");
  if (actief.length > 2) h += `<p class="klein" style="text-align:center;margin-top:12px">Tip: laat een wens een week staan. Wil je hem dan nog steeds? Dan is het een goede aankoop.</p>`;
  return h;
}

/* ---------- Bewerken ---------- */
function wlBlad(id) {
  const x = vind("wl_items", id); if (!x) return;
  bladOpen("Wens bewerken", `
    <div class="veld"><label for="wlb-naam">Product</label><input class="invoer" id="wlb-naam" value="${esc(x.naam)}"></div>
    <div class="veld"><label for="wlb-prijs">Prijs (€)</label><input class="invoer" id="wlb-prijs" inputmode="decimal" value="${x.prijs ? String(x.prijs).replace(".", ",") : ""}"></div>
    <div class="veld"><label for="wlb-mot">Motivatie</label><textarea class="invoer" id="wlb-mot" style="min-height:80px" placeholder="Waarom wil je het?">${esc(x.motivatie || "")}</textarea></div>
    <div class="veld"><span class="labeltekst">Status</span><div class="segment">${[["actief", "Op de lijst"], ["gekocht", "Gekocht"], ["niet", "Niet gekocht"]].map(([s, n]) =>
      `<button data-wlb-s="${s}" aria-pressed="${(x.status || "actief") === s}">${n}</button>`).join("")}</div></div>
    <button class="knop klein gevaar" id="wlb-weg" style="margin-top:6px">${ico("prullenbak")} Verwijderen</button>`,
    `<button class="knop breed primair" id="wlb-ok">Opslaan</button>`);
  let status = x.status || "actief";
  $("#bladinhoud").addEventListener("click", e => {
    const s = e.target.closest("[data-wlb-s]");
    if (s) { status = s.dataset.wlbS; $$("[data-wlb-s]").forEach(b => b.setAttribute("aria-pressed", String(b === s))); }
    if (e.target.closest("#wlb-weg")) bevestigVerwijderen(async () => { await verwijder("wl_items", x.id); teken(); toast("Verwijderd"); });
  });
  $("#wlb-ok").onclick = async () => {
    const naam = $("#wlb-naam").value.trim(); if (!naam) { toast("Vul een naam in"); return; }
    x.naam = naam; x.prijs = Math.round(csvGetal($("#wlb-prijs").value) * 100) / 100 || 0; x.motivatie = $("#wlb-mot").value.trim();
    if (status !== (x.status || "actief")) { x.status = status; x.besloten = status === "actief" ? null : new Date().toISOString(); }
    await bewaar("wl_items", x); bladSluit(); teken(); toast("Opgeslagen");
  };
}

/* ---------- Acties ---------- */
async function wlToevoegen() {
  const n = $("#wl-naam"), p = $("#wl-prijs"), m = $("#wl-mot");
  const naam = n.value.trim();
  if (!naam) { toast("Vul in wat je wilt kopen"); n.classList.add("rt-fout"); n.focus(); setTimeout(() => n.classList.remove("rt-fout"), 600); return; }
  const prijs = Math.round(csvGetal(p.value) * 100) / 100 || 0;
  const x = { id: uid(), naam, prijs, motivatie: m.value.trim(), status: "actief", besloten: null, gemaakt: new Date().toISOString(), volgorde: Date.now() };
  await bewaar("wl_items", x);
  tril(8); teken();
  const rij = document.querySelector(`[data-wl-rij="${x.id}"]`); if (rij) rij.classList.add("wl-in");
  const n2 = $("#wl-naam"); if (n2) n2.focus();
}
async function wlZet(id, status) {
  const x = vind("wl_items", id); if (!x) return;
  const oud = { status: x.status || "actief", besloten: x.besloten };
  const rij = document.querySelector(`[data-wl-rij="${id}"]`);
  const stil = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rij && !stil) {
    if (status === "gekocht" && typeof rtBurst === "function" && typeof rtAan === "function" && rtAan()) { const r = rij.querySelector(".wl-vink.ja").getBoundingClientRect(); rtBurst(r.left + r.width / 2, r.top + r.height / 2); }
    rij.style.height = rij.offsetHeight + "px"; void rij.offsetHeight;
    rij.classList.add("wl-weg", status === "actief" ? "terug" : status);
    await new Promise(r => setTimeout(r, 360));
  }
  x.status = status; x.besloten = status === "actief" ? null : new Date().toISOString();
  if (status !== "actief") V.wlOpen[status] = V.wlOpen[status] || false;
  await bewaar("wl_items", x);
  tril(status === "gekocht" ? 12 : 8);
  teken();
  const terug = async () => { x.status = oud.status; x.besloten = oud.besloten; await bewaar("wl_items", x); teken(); };
  if (status === "gekocht") toast(`${x.naam} gekocht`, x.prijs ? "Als uitgave loggen" : "Ongedaan maken", x.prijs ? () => {
    uitgaveBlad(null);
    setTimeout(() => { const b = $("#u-bedrag"), o = $("#u-oms"); if (b) b.value = x.prijs; if (o) o.value = x.naam; }, 30);
  } : terug, 7000);
  else if (status === "niet") toast(`${x.naam} niet gekocht · ${wlPrijs(x.prijs)} bespaard`, "Ongedaan maken", terug, 6000);
  else toast(`${x.naam} staat weer op je wishlist`);
}
document.addEventListener("click", async e => {
  const el = e.target.closest && e.target.closest("[data-act]");
  if (!el || !el.dataset.act.startsWith("wl-")) return;
  switch (el.dataset.act) {
    case "wl-toevoegen": await wlToevoegen(); break;
    case "wl-zet": await wlZet(el.dataset.id, el.dataset.s); break;
    case "wl-bewerk": wlBlad(el.dataset.id); break;
    case "wl-klap": V.wlOpen[el.dataset.s] = !V.wlOpen[el.dataset.s]; teken(); break;
  }
});
RT_NA.push(() => {
  if (V.view !== "wishlist") return;
  const n = $("#wl-naam"), p = $("#wl-prijs"), m = $("#wl-mot");
  if (n) n.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); p.focus(); } };
  if (p) p.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); m.focus(); } };
  if (m) m.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); wlToevoegen(); } };
});

/* ---------- Ingangen: Meer, Financieel en "Verder naar" ---------- */
if (typeof VERWANT === "object") {
  VERWANT.wishlist = [["financieel", "Financieel"], ["overzicht", "Overzicht"]];
  (VERWANT.financieel || (VERWANT.financieel = [])).unshift(["wishlist", "Wishlist"]);
  VERWANT_ICO.wishlist = "cadeau";
}
{
  const _meer = vwMeer;
  vwMeer = function () {
    const h = _meer();
    const kaart = `<button class="menu-kaart" data-act="ga" data-view="wishlist">${ico("cadeau")}<span class="nm">Wishlist</span><span class="ds">${esc(wlOnderschrift())}</span></button>`;
    const merk = `data-view="financieel"`, i = h.indexOf(merk);
    if (i < 0) return h;
    const eind = h.indexOf("</button>", i) + 9;
    return h.slice(0, eind) + kaart + h.slice(eind);
  };
  const _fin = vwFinancieel;
  vwFinancieel = function () {
    const a = wlAlle("actief");
    return _fin() + `<button class="startstrip" style="margin-top:14px" data-act="ga" data-view="wishlist">
      ${ico("cadeau", "width:20px;height:20px;color:var(--muted)")}
      <span class="nm">Wishlist${a.length ? `: ${a.length} wens${a.length === 1 ? "" : "en"} · ${wlPrijs(wlSom(a))}` : " — zet iets op je lijst"}</span>
      ${ico("pijlr", "width:16px;height:16px;color:var(--line2)")}</button>`;
  };
}
