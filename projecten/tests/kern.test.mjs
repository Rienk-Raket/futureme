// Tests voor de kern van FutureMe Projecten.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const src = readFileSync(fileURLToPath(new URL("../src/kern.js", import.meta.url)), "utf8");
const i = src.indexOf("/* PT-KERN-BEGIN */"), j = src.indexOf("/* PT-KERN-EINDE */");
const ctx = vm.createContext({});
vm.runInContext(src.slice(i, j) + ";globalThis.K = { PT_FASES, ptVoortgang, ptDagenStil, ptGezondheid, ptVolgendeStap, ptFilter, ptSorteer, ptCluster, ptDraad, ptMinuten, ptWip, ptStapVaag, ptStatusZin };", ctx);
const K = ctx.K, kaal = x => JSON.parse(JSON.stringify(x));
const NU = Date.parse("2026-10-10T12:00:00");
const dagen = n => new Date(NU - n * 86400000).toISOString();
const p = (id, x) => Object.assign({ id, titel: id, fase: "idee", status: "actief", gemaakt: dagen(30) }, x || {});

test("zeven fases van A tot G", () => {
  assert.equal(K.PT_FASES.length, 7);
  assert.deepEqual(kaal(K.PT_FASES.map(f => f.letter)), ["A", "B", "C", "D", "E", "F", "G"]);
});

test("voortgang: fase plus stappen binnen de fase, nooit 100 zolang het open is", () => {
  const st = [{ projectId: "a", af: true }, { projectId: "a", af: false }, { projectId: "b", af: true }];
  assert.equal(K.ptVoortgang(p("a"), st), 7);                    // fase A, helft van de stappen: 0 + 0.5 * 14.3
  assert.equal(K.ptVoortgang(p("a", { fase: "bouwen" }), st), 50); // fase D: 3 * 14.3 + 7.1
  assert.equal(K.ptVoortgang(p("b", { fase: "evalueren" }), st), 99);
  assert.equal(K.ptVoortgang(p("c", { status: "klaar" }), []), 100);
});

test("gezondheid: op koers, koelt af, stil, deadline, verlopen, rust", () => {
  const logs = [{ projectId: "a", ts: dagen(2) }, { projectId: "b", ts: dagen(8) }, { projectId: "c", ts: dagen(20) }];
  assert.equal(K.ptGezondheid(p("a"), logs, NU).id, "koers");
  assert.equal(K.ptGezondheid(p("b"), logs, NU).id, "afkoelend");
  assert.equal(K.ptGezondheid(p("c"), logs, NU).id, "stil");
  assert.equal(K.ptGezondheid(p("d", { gemaakt: dagen(1) }), [], NU).id, "koers");
  assert.equal(K.ptGezondheid(p("a", { deadline: "2026-10-12" }), logs, NU).id, "deadline");
  assert.equal(K.ptGezondheid(p("a", { deadline: "2026-10-09" }), logs, NU).id, "verlopen");
  assert.equal(K.ptGezondheid(p("a", { status: "pauze" }), logs, NU).id, "rust");
  assert.equal(K.ptGezondheid(p("a", { status: "klaar" }), logs, NU).id, "rust");
});

test("volgende stap: gepind eerst, dan op volgorde", () => {
  const st = [{ id: 1, projectId: "a", volgorde: 2, af: false }, { id: 2, projectId: "a", volgorde: 1, af: true }, { id: 3, projectId: "a", volgorde: 3, af: false, pin: true }];
  assert.equal(K.ptVolgendeStap(p("a"), st).id, 3);
  assert.equal(K.ptVolgendeStap(p("a"), st.slice(0, 2)).id, 1);
  assert.equal(K.ptVolgendeStap(p("x"), st), null);
});

test("filteren op status, fase, cluster, tag, energie en zoekwoord (zonder accenten)", () => {
  const l = [p("Fotoboek Japan", { cluster: "Creatief", tags: ["foto"], energie: "laag" }), p("Belasting", { status: "pauze", cluster: "Thuis" }),
    p("Café-website", { status: "klaar", fase: "evalueren" }), p("Idee app", { status: "idee" })];
  assert.deepEqual(kaal(K.ptFilter(l, { status: "open" }).map(x => x.id)), ["Fotoboek Japan", "Belasting", "Idee app"]);
  assert.deepEqual(kaal(K.ptFilter(l, { status: ["pauze"] }).map(x => x.id)), ["Belasting"]);
  assert.equal(K.ptFilter(l, { cluster: "Creatief" }).length, 1);
  assert.equal(K.ptFilter(l, { tag: "foto" }).length, 1);
  assert.equal(K.ptFilter(l, { energie: "laag" }).length, 1);
  assert.deepEqual(kaal(K.ptFilter(l, { zoek: "cafe" }).map(x => x.id)), ["Café-website"]);
  assert.equal(K.ptFilter(l, { status: "alles" }).length, 4);
});

test("clusteren op fase, status, cluster en deadline, in vaste volgorde", () => {
  const l = [p("a", { fase: "bouwen" }), p("b", { fase: "idee" }), p("c", { fase: "bouwen", cluster: "Werk" }), p("d", { deadline: "2026-10-09" }), p("e", { deadline: "2026-12-30" })];
  assert.deepEqual(kaal(K.ptCluster(l, "fase", NU).map(g => [g.sleutel, g.projecten.length])), [["idee", 3], ["bouwen", 2]]);
  assert.deepEqual(kaal(K.ptCluster(l, "cluster", NU).map(g => g.naam)), ["Werk", "Zonder cluster"]);
  assert.deepEqual(kaal(K.ptCluster(l, "deadline", NU).map(g => g.sleutel)), ["verlopen", "later", "geen"]);
});

test("sorteren op prioriteit en deadline", () => {
  const l = [p("a", { prioriteit: 1 }), p("b", { prioriteit: 3, deadline: "2026-11-01" }), p("c", { prioriteit: 3, deadline: "2026-10-20" })];
  assert.deepEqual(kaal(K.ptSorteer(l, "prioriteit", []).map(x => x.id)), ["c", "b", "a"]);
  assert.deepEqual(kaal(K.ptSorteer(l, "deadline", []).map(x => x.id)), ["c", "b", "a"]);
});

test("draad: aantal dagen met een log in de laatste 14, per project", () => {
  const logs = [{ projectId: "a", ts: dagen(0) }, { projectId: "a", ts: dagen(0.1) }, { projectId: "b", ts: dagen(3) }, { projectId: "a", ts: dagen(20) }];
  assert.deepEqual(kaal(K.ptDraad(logs, NU, 14)), { actief: 2, van: 14 });
  assert.equal(K.ptDraad(logs, NU, 14, "a").actief, 1);
});

test("minuten en WIP", () => {
  const logs = [{ soort: "werk", minuten: 25, ts: dagen(1), projectId: "a" }, { soort: "werk", minuten: 15, ts: dagen(9), projectId: "a" }, { soort: "notitie", ts: dagen(1) }];
  assert.equal(K.ptMinuten(logs, NU - 7 * 86400000), 25);
  assert.equal(K.ptMinuten(logs, 0, "a"), 40);
  const l = [p("a"), p("b"), p("c"), p("d", { status: "pauze" })];
  assert.deepEqual(kaal(K.ptWip(l, 3)), { actief: 3, limiet: 3, vrij: false });
  assert.equal(K.ptWip(l, 3, "a").vrij, true);
});

test("werkwoordcheck voor de eerste stap", () => {
  for (const t of ["Map met foto's openen", "Bel de drukker", "Schets de cover"]) assert.equal(K.ptStapVaag(t), false, t);
  for (const t of ["Foto's", "Dingen regelen", "Website", ""]) assert.equal(K.ptStapVaag(t), true, t);
});

test("statuszin: kort en zonder 'moet'", () => {
  const zinnen = [K.ptStatusZin(p("Boek"), { id: "stil", dagen: 15 }), K.ptStatusZin(p("Boek"), { id: "koers" }, { tekst: "Map openen" }), K.ptStatusZin(p("Boek"), { id: "verlopen" })];
  for (const z of zinnen) { assert.ok((z.match(/[.?!](\s|$)/g) || []).length <= 2, z); assert.ok(!/\bmoet/i.test(z), z); }
});
