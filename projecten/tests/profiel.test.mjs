// Tests voor fase 3: profiel, aanpassingen en vastloop-hulp (pure kernen), met de echte vragenbank.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
const lees = f => readFileSync(fileURLToPath(new URL(f, import.meta.url)), "utf8");
const stuk = (src, naam) => { const i = src.indexOf(`/* ${naam}-BEGIN */`), j = src.indexOf(`/* ${naam}-EINDE */`); assert.ok(i >= 0 && j > i, naam); return src.slice(i, j); };
const ctx = vm.createContext({});
vm.runInContext(stuk(lees("../src/score.js"), "NATE-SCORE") + stuk(lees("../src/profiel.js"), "PT-PROFIEL") + stuk(lees("../src/vastlopen.js"), "PT-VAST") +
  ";globalThis.P = { nsProfiel, nsRoute, nsVolgende, nsKernIds, ptVoorgesteld, ptKmVoortgang, ptKiesScore, ptPastBijEnergie, PT_AANPASSINGEN, PT_PATROON, PT_OORZAKEN };", ctx);
const P = ctx.P, BANK = JSON.parse(lees("../../kennis/vragenbank.json")), W = JSON.parse(lees("../../kennis/scoreweging.json"));

test("elk patroon heeft een beschrijving en minstens één voorgestelde aanpassing", () => {
  for (const id of ["P1", "P2", "P3", "P4", "P5", "P6", "P7"]) { assert.ok(P.PT_PATROON[id], id); assert.ok(P.ptVoorgesteld([id]).length >= 1, id); }
  assert.deepEqual(JSON.parse(JSON.stringify(P.ptVoorgesteld([{ id: "P2" }]))), ["ideeEerst", "kortBlok"]);
});

test("route: 16 kernvragen eerst; alles 'zeer vaak' geeft een profiel met hooguit drie patronen", () => {
  const ant = {};
  let id, n = 0;
  while ((id = P.nsVolgende(P.nsRoute(BANK, ant, {}, W, {}), ant)) && n++ < 80) ant[id] = "very_often";
  const kern = P.nsKernIds(BANK);
  assert.equal(kern.length, 16);
  const p = P.nsProfiel(BANK, ant, {}, {}, W, {});
  assert.ok(p.kernKlaar);
  assert.ok(p.top.length >= 1 && p.top.length <= 3);
  assert.ok(p.top.every(c => c.metafoor && c.metafoor.startsWith("De ")));
  assert.ok(!("totaal" in p), "nooit een totaalscore");
});

test("route: alles 'nooit' geeft geen patronen (weinig gemelde behoefte)", () => {
  const ant = {};
  for (const id of P.nsKernIds(BANK)) ant[id] = "never";
  assert.equal(P.nsProfiel(BANK, ant, {}, {}, W, {}).top.length, 0);
});

test("voortgang kennismaking", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(P.ptKmVoortgang(["a", "b", "c", "d"], { a: "never", b: null }))), { n: 1, van: 4, pct: 25 });
});

test("kiezen tussen projecten: dichtst bij klaar weegt het zwaarst; energie past", () => {
  const a = { id: "a", prioriteit: 2 }, b = { id: "b", prioriteit: 2 };
  const ant = { zin: "a", energie: "a", dichtbij: "b" };
  assert.ok(P.ptKiesScore(a, ant, 0) > P.ptKiesScore(b, ant, 0));   // 4 tegen 3
  assert.ok(P.ptKiesScore(b, { zin: "a", dichtbij: "b" }, 0) > P.ptKiesScore(a, { zin: "a", dichtbij: "b" }, 0));
  assert.equal(P.ptPastBijEnergie({ energie: "hoog" }, "laag"), false);
  assert.equal(P.ptPastBijEnergie({ energie: "laag" }, "midden"), true);
  assert.equal(P.ptPastBijEnergie({}, "laag"), true);
});

test("teksten: elke aanpassing en oorzaak heeft een waarom; nergens 'moet'", () => {
  for (const a of P.PT_AANPASSINGEN) { assert.ok(a.waarom && a.bewijs, a.id); assert.ok(!/\bmoet/i.test(a.waarom + a.uitleg + a.label), a.id); }
  for (const o of P.PT_OORZAKEN) { assert.ok(o.waarom, o.id); assert.ok(!/\bmoet/i.test(o.zin + o.waarom), o.id); }
});
