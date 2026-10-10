// Tests voor de accountability-kern (fase 2).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
const src = readFileSync(fileURLToPath(new URL("../src/accountability.js", import.meta.url)), "utf8");
const i = src.indexOf("/* PT-ACC-BEGIN */"), j = src.indexOf("/* PT-ACC-EINDE */");
const ctx = vm.createContext({});
vm.runInContext(src.slice(i, j) + ";globalThis.A = { ptCheckinsNodig, ptBeloftesCijfers, ptVaaksteReden, ptTimer, ptWeekStart, ptWeekCijfers, ptKlok };", ctx);
const A = ctx.A, kaal = x => JSON.parse(JSON.stringify(x));
const NU = new Date(2026, 9, 10, 12, 0).getTime();

test("check-ins: alleen open beloftes waarvan het moment voorbij is, oudste eerst", () => {
  const l = [{ id: 1, status: "open", moment: "2026-10-10T11:00" }, { id: 2, status: "open", moment: "2026-10-10T13:00" }, { id: 3, status: "gedaan", moment: "2026-10-09T10:00" }, { id: 4, status: "open", moment: "2026-10-09T09:00" }];
  assert.deepEqual(kaal(A.ptCheckinsNodig(l, NU).map(b => b.id)), [4, 1]);
});

test("cijfers: half telt half, losgelaten telt niet mee", () => {
  const t = "2026-10-10T10:00:00Z";
  const c = A.ptBeloftesCijfers([{ status: "gedaan", antwoordOp: t }, { status: "half", antwoordOp: t }, { status: "niet", antwoordOp: t }, { status: "los", antwoordOp: t }, { status: "open" }], 0);
  assert.equal(c.totaal, 3); assert.equal(c.score, 50); assert.equal(c.los, 1);
  assert.equal(A.ptBeloftesCijfers([], 0).score, null);
});

test("vaakste reden pas vanaf twee keer", () => {
  assert.equal(A.ptVaaksteReden([{ status: "niet", reden: "groot" }]), null);
  assert.equal(A.ptVaaksteReden([{ status: "niet", reden: "groot" }, { status: "niet", reden: "groot" }, { status: "niet", reden: "tijd" }]), "groot");
});

test("timer: rest, pauze, klaar", () => {
  const t = { start: NU - 10 * 60000, duur: 25, pauzeOp: null, gepauzeerd: 0 };
  assert.equal(A.ptTimer(t, NU).rest, 15 * 60);
  assert.equal(A.ptTimer(t, NU).minuten, 10);
  const p = { start: NU - 10 * 60000, duur: 25, pauzeOp: NU - 5 * 60000, gepauzeerd: 0 };
  assert.equal(A.ptTimer(p, NU).rest, 20 * 60);
  assert.equal(A.ptTimer(p, NU).gepauzeerd, true);
  const g = { start: NU - 30 * 60000, duur: 25, pauzeOp: null, gepauzeerd: 10 * 60000 };
  assert.equal(A.ptTimer(g, NU).klaar, false);
  assert.equal(A.ptTimer({ start: NU - 26 * 60000, duur: 25, gepauzeerd: 0 }, NU).klaar, true);
  assert.equal(A.ptKlok(65), "1:05");
});

test("week: maandag 00:00 en cijfers per project binnen de week", () => {
  const w = A.ptWeekStart(NU);
  assert.equal(new Date(w).getDay(), 1); assert.equal(new Date(w).getHours(), 0);
  const c = A.ptWeekCijfers([{ id: "a", titel: "A" }], [{ projectId: "a", af: true, afOp: new Date(NU - 3600000).toISOString() }],
    [{ projectId: "a", soort: "werk", minuten: 25, ts: new Date(NU - 7200000).toISOString() }, { projectId: "a", soort: "werk", minuten: 40, ts: new Date(w - 1000).toISOString() }], [], w, w + 7 * 86400000);
  assert.equal(c.minuten, 25); assert.equal(c.stappen, 1);
});
