"use strict";
// === OPSLAG: IndexedDB op het toestel. Alles staat ook in het geheugen (S), zodat lezen synchroon is. ===
const DB_NAAM = "futureme-projecten", DB_VERSIE = 1;
const WINKELS = ["projecten", "stappen", "mijlpalen", "logs", "instellingen"];
const S = { projecten: [], stappen: [], mijlpalen: [], logs: [], instellingen: {} };
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
async function verwijder(w, id) {
  const i = S[w].findIndex(x => x.id === id); if (i >= 0) S[w].splice(i, 1);
  try { await dbWis(w, id); } catch (e) {}
}
const inst = (k, std) => S.instellingen[k] === undefined ? std : S.instellingen[k];
async function zetInst(k, v) { S.instellingen[k] = v; try { await dbZet("instellingen", { sleutel: k, waarde: v }); } catch (e) {} }

/* ---------- Export en import (één JSON-bestand) ---------- */
function exportJSON() {
  return JSON.stringify({ app: "FutureMe Projecten", versie: 1, gemaakt: new Date().toISOString(),
    projecten: S.projecten, stappen: S.stappen, mijlpalen: S.mijlpalen, logs: S.logs, instellingen: S.instellingen }, null, 1);
}
/** Importeren: samenvoegen (nieuwste per id wint) of vervangen. Geeft het aantal per winkel terug. */
async function importJSON(tekst, vervangen) {
  const d = JSON.parse(tekst);
  if (!d || d.app !== "FutureMe Projecten") throw new Error("Dit is geen export van FutureMe Projecten.");
  const tel = {};
  for (const w of ["projecten", "stappen", "mijlpalen", "logs"]) {
    const nieuw = Array.isArray(d[w]) ? d[w] : [];
    if (vervangen) for (const x of S[w].slice()) await verwijder(w, x.id);
    let n = 0;
    for (const x of nieuw) {
      if (!x || !x.id) continue;
      const oud = vind(w, x.id);
      if (!oud || String(x.bijgewerkt || "") >= String(oud.bijgewerkt || "")) {
        const i = S[w].findIndex(y => y.id === x.id); if (i >= 0) S[w][i] = x; else S[w].push(x);
        try { await dbZet(w, x); } catch (e) {}
        n++;
      }
    }
    tel[w] = n;
  }
  if (d.instellingen && typeof d.instellingen === "object") for (const [k, v] of Object.entries(d.instellingen)) if (vervangen || S.instellingen[k] === undefined) await zetInst(k, v);
  return tel;
}
