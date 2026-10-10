"use strict";
// === OPSLAG: IndexedDB op het toestel. Alles staat ook in het geheugen (S), zodat lezen synchroon is. ===
const DB_NAAM = "futureme-projecten", DB_VERSIE = 2;   // 2: beloftes (fase 2)
const WINKELS = ["projecten", "stappen", "mijlpalen", "logs", "beloftes", "instellingen"];
const S = { projecten: [], stappen: [], mijlpalen: [], logs: [], beloftes: [], instellingen: {} };
let DB = null;

function dbOpen() {
  return new Promise((ok, fout) => {
    if (!("indexedDB" in window)) return ok(null);
    const r = indexedDB.open(DB_NAAM, DB_VERSIE);
    r.onupgradeneeded = () => {
      const db = r.result;
      for (const w of WINKELS) if (!db.objectStoreNames.contains(w)) db.createObjectStore(w, { keyPath: w === "instellingen" ? "sleutel" : "id" });
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fout(r.error);
  });
}
function dbAlles(w) {
  return new Promise((ok, fout) => {
    if (!DB) return ok([]);
    const r = DB.transaction(w).objectStore(w).getAll();
    r.onsuccess = () => ok(r.result || []); r.onerror = () => fout(r.error);
  });
}
function dbZet(w, obj) {
  return new Promise((ok, fout) => {
    if (!DB) return ok();
    const t = DB.transaction(w, "readwrite"); t.objectStore(w).put(obj);
    t.oncomplete = () => ok(); t.onerror = () => fout(t.error);
  });
}
function dbWis(w, id) {
  return new Promise((ok, fout) => {
    if (!DB) return ok();
    const t = DB.transaction(w, "readwrite"); t.objectStore(w).delete(id);
    t.oncomplete = () => ok(); t.onerror = () => fout(t.error);
  });
}
async function dbLaad() {
  try { DB = await dbOpen(); } catch (e) { DB = null; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  for (const w of WINKELS) {
    const l = await dbAlles(w).catch(() => []);
    if (w === "instellingen") { S.instellingen = {}; for (const x of l) S.instellingen[x.sleutel] = x.waarde; }
    else S[w] = l;
  }
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const vind = (w, id) => S[w].find(x => x.id === id) || null;
async function bewaar(w, obj) {
  obj.bijgewerkt = new Date().toISOString();
  const l = S[w], i = l.findIndex(x => x.id === obj.id);
  if (i >= 0) l[i] = obj; else l.push(obj);
  try { await dbZet(w, obj); } catch (e) { toast("Opslaan lukte niet. Maak een export als dat vaker gebeurt."); }
  return obj;
}
async function verwijder(w, id, geenSpoor) {
  const i = S[w].findIndex(x => x.id === id); if (i >= 0) S[w].splice(i, 1);
  try { await dbWis(w, id); } catch (e) {}
  // Een spoor van wat weg is, zodat samenvoegen met een oude export het niet terugbrengt.
  if (!geenSpoor) await sporen([w + ":" + id]);
}
/** Sporen in één keer bijschrijven; sporen ouder dan een jaar vallen weg. */
async function sporen(sleutels, nieuweKaart) {
  const nu = new Date().toISOString(), grens = new Date(Date.now() - 365 * 86400000).toISOString(), weg = {};
  for (const [k, v] of Object.entries(Object.assign({}, inst("weg", {}), nieuweKaart || {}))) if (v >= grens) weg[k] = v > (weg[k] || "") ? v : weg[k];
  for (const k of sleutels || []) weg[k] = nu;
  await zetInst("weg", weg);
}
const inst = (k, std) => S.instellingen[k] === undefined ? std : S.instellingen[k];
async function zetInst(k, v) { S.instellingen[k] = v; try { await dbZet("instellingen", { sleutel: k, waarde: v }); } catch (e) {} }

/* ---------- Export en import (één JSON-bestand) ---------- */
function exportJSON() {
  return JSON.stringify({ app: "FutureMe Projecten", versie: 1, gemaakt: new Date().toISOString(),
    projecten: S.projecten, stappen: S.stappen, mijlpalen: S.mijlpalen, logs: S.logs, beloftes: S.beloftes, instellingen: S.instellingen }, null, 1);
}
/** Importeren: samenvoegen (nieuwste per id wint) of vervangen. Geeft het aantal per winkel terug. */
const IMPORT_WINKELS = ["projecten", "stappen", "mijlpalen", "logs", "beloftes"];
async function importJSON(tekst, vervangen) {
  let d;
  try { d = JSON.parse(tekst); } catch (e) { throw new Error("Dit bestand is geen geldige export."); }
  if (!d || d.app !== "FutureMe Projecten") throw new Error("Dit is geen export van FutureMe Projecten.");
  // Eerst alles controleren, pas daarna iets wissen: een kapot bestand laat je gegevens met rust.
  for (const w of IMPORT_WINKELS) if (d[w] !== undefined && (!Array.isArray(d[w]) || d[w].some(x => !x || typeof x !== "object" || !x.id)))
    throw new Error("Dit bestand is beschadigd. Er is niets veranderd.");
  if (!Array.isArray(d.projecten)) throw new Error("Dit bestand bevat geen projecten. Er is niets veranderd.");
  // Samenvoegen: sporen uit het bestand gelden ook hier (wat daar verwijderd is na de versie hier, gaat hier ook weg).
  const bestandWeg = (d.instellingen && d.instellingen.weg && typeof d.instellingen.weg === "object") ? d.instellingen.weg : {};
  if (!vervangen) for (const [k, ts] of Object.entries(bestandWeg)) {
    const [w, id] = [k.slice(0, k.indexOf(":")), k.slice(k.indexOf(":") + 1)];
    const lokaal = IMPORT_WINKELS.includes(w) && vind(w, id);
    if (lokaal && String(ts) >= String(lokaal.bijgewerkt || "")) await verwijder(w, id, true);
  }
  const weg = vervangen ? {} : Object.assign({}, bestandWeg, inst("weg", {}) || {});
  const tel = {};
  for (const w of IMPORT_WINKELS) {
    const nieuw = d[w] || [];
    if (vervangen) for (const x of S[w].slice()) await verwijder(w, x.id, true);
    let n = 0;
    for (const x of nieuw) {
      const verwijderd = weg[w + ":" + x.id];
      if (verwijderd && verwijderd >= String(x.bijgewerkt || "")) continue;   // hier al verwijderd, na deze versie
      const oud = vind(w, x.id);
      if (!oud || String(x.bijgewerkt || "") >= String(oud.bijgewerkt || "")) {
        const i = S[w].findIndex(y => y.id === x.id); if (i >= 0) S[w][i] = x; else S[w].push(x);
        try { await dbZet(w, x); } catch (e) {}
        n++;
      }
    }
    tel[w] = n;
  }
  if (d.instellingen && typeof d.instellingen === "object") for (const [k, v] of Object.entries(d.instellingen)) {
    if (k === "weg" && !vervangen) await sporen([], v || {});
    else if (vervangen || S.instellingen[k] === undefined) await zetInst(k, v);
  }
  return tel;
}
