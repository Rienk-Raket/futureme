#!/usr/bin/env python3
"""Aggregeert de panelreacties van één ronde en voert de realisme-controles uit.

Gebruik:  python3 scripts/aggregate_round.py --run <runmap> --ronde N [--drempel naam=waarde ...]
Leest:    <runmap>/ronde-N/reacties/*.jsonl, selectie.json (gewichten), varianten.json, ronde-N/opzet.json
Schrijft: <runmap>/ronde-N/aggregatie.json, aggregatie.md, realisme.json
Exitcode: 0 = ok of waarschuwing, 2 = realisme-controle vraagt om herhaling van (een deel van) de batch.

Gewogen = per persona het gemiddelde van de varianten, daarna gewogen met het bevolkingsgewicht van
de persona (genormaliseerd binnen de selectie). Ongewogen = gemiddelde per persona, elke persona telt 1.
"""
import argparse, glob, json, math, os, re, statistics, sys
from collections import defaultdict, Counter

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "..", "references")

DREMPELS = {
    # Spreiding binnen persona: aandeel persona's waarvan de standaardafwijking van 'intentie' over de
    # varianten kleiner is dan 0,5 (op een 7-puntsschaal). Boven 50% zijn de varianten ingezakt.
    "min_spreiding_std": 0.5, "max_aandeel_zonder_spreiding": 0.5,
    # Positiviteit: gewogen aandeel varianten met intentie >= 5. Een nieuw aanbod dat door meer dan 65%
    # 'gekocht' zou worden, is in een echt panel zeldzaam. Geldt per object; bij meerdere objecten alleen als alle objecten erboven zitten.
    "max_aandeel_positief": 0.65, "max_gem_begrip": 6.3,
    # Negativiteit (spiegelbeeld): als bij alle objecten minder dan 5% positief is, kan het materiaal echt slecht
    # zijn óf heeft het panel overgecorrigeerd. Dit is een waarschuwing, geen reden tot herhalen.
    "min_aandeel_positief": 0.05,
    # Gelijkvormigheid tussen persona's: aandeel paren (van verschillende persona's) met Jaccard-overlap
    # van inhoudswoorden >= 0,35. Boven 5% praten de persona's elkaar na. Ook: één bezwaar-categorie > 70%.
    "jaccard_gelijk": 0.35, "max_aandeel_gelijke_paren": 0.05, "max_aandeel_een_bezwaar": 0.70,
}
STOP = set("de het een en of maar want dus ook nog wel niet geen ik je jij u hij zij ze we wij jullie mij me mijn jouw zijn haar hun ons onze dit dat deze die er hier daar wat wie waar hoe wanneer als dan toch al zo te om van voor met bij naar uit over door aan op in is ben bent was waren zijn wordt worden word werd heb hebt heeft hebben had hadden kan kun kunt kunnen kon zal zou zouden wil wilt willen moet moeten mag mogen gaat gaan ging doe doet doen deed echt gewoon best wel heel erg meer veel weinig iets niets alles dan nu dus omdat maar toch eigenlijk even weer zelf zo'n zoiets vind vindt lijkt lijken staat staan zie zien".split())

def woorden(t):
    return {w for w in re.findall(r"[a-zà-ÿ]+", t.lower()) if len(w) >= 4 and w not in STOP}

def jaccard(a, b):
    if not a or not b: return 0.0
    return len(a & b) / len(a | b)

def wmean(pairs):
    tw = sum(w for _, w in pairs)
    return round(sum(v * w for v, w in pairs) / tw, 2) if tw else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True); ap.add_argument("--ronde", type=int, required=True)
    ap.add_argument("--drempel", action="append", default=[])
    a = ap.parse_args()
    for d in a.drempel:
        k, _, v = d.partition("="); DREMPELS[k] = float(v)
    run = os.path.abspath(a.run); rdir = os.path.join(run, f"ronde-{a.ronde}")
    sel = json.load(open(os.path.join(run, "selectie.json"), encoding="utf-8"))
    var = json.load(open(os.path.join(run, "varianten.json"), encoding="utf-8"))["varianten"]
    opzet = json.load(open(os.path.join(rdir, "opzet.json"), encoding="utf-8"))
    rondes = json.load(open(os.path.join(REF, "rondes.json"), encoding="utf-8"))
    R = rondes["rondes"][str(a.ronde)]
    gewicht = {p["id"]: p["gewicht_pct"] for p in sel["personas"]}
    naam = {p["id"]: p["naam"] for p in sel["personas"]}
    kans = {p["id"]: p["kansgroep"] for p in sel["personas"]}
    objecten = [o["id"] for o in opzet["objecten"]]
    verwacht = {(v["variant_id"], o) for v in var for o in objecten}

    # inlezen
    recs, fouten = [], []
    for f in sorted(glob.glob(os.path.join(rdir, "reacties", "*.jsonl"))):
        for ln, line in enumerate(open(f, encoding="utf-8"), 1):
            line = line.strip()
            if not line: continue
            try: r = json.loads(line)
            except Exception as e: fouten.append(f"{os.path.basename(f)}:{ln} geen geldige JSON ({e})"); continue
            for k in ["variant_id", "persona_id", "object", "reactie", "gedrag", "scores"]:
                if k not in r: fouten.append(f"{os.path.basename(f)}:{ln} veld {k} ontbreekt")
            if r.get("object") not in objecten: fouten.append(f"{r.get('variant_id')}: onbekend object {r.get('object')}")
            if r.get("persona_id") not in gewicht: fouten.append(f"{r.get('variant_id')}: persona niet in selectie"); continue
            for s in R["scores"]:
                v = r.get("scores", {}).get(s)
                if not isinstance(v, (int, float)) or not 1 <= v <= 7: fouten.append(f"{r.get('variant_id')}/{r.get('object')}: score {s} ongeldig ({v})")
            recs.append(r)
    gezien = {(r["variant_id"], r["object"]) for r in recs}
    ontbrekend = sorted(verwacht - gezien)
    dubbel = [k for k, c in Counter((r["variant_id"], r["object"]) for r in recs).items() if c > 1]

    # aggregatie per object
    agg = {"ronde": a.ronde, "titel": R["titel"], "n_records": len(recs), "n_varianten": len({r["variant_id"] for r in recs}), "objecten": {}}
    per_persona_obj = defaultdict(lambda: defaultdict(list))  # obj -> pid -> records
    for r in recs: per_persona_obj[r["object"]][r["persona_id"]].append(r)
    for o in objecten:
        pp = per_persona_obj[o]
        pids = [p for p in gewicht if p in pp]
        d = {"n": sum(len(v) for v in pp.values()), "scores_gewogen": {}, "scores_ongewogen": {}, "intentie_verdeling_gewogen": {}, "gedrag_gewogen_pct": {}, "bezwaar_gewogen_pct": {}, "per_persona": {}, "kansgroep_vs_hoofdgroep": {}}
        for s in R["scores"]:
            pm = {p: statistics.mean(x["scores"][s] for x in pp[p]) for p in pids}
            d["scores_gewogen"][s] = wmean([(pm[p], gewicht[p]) for p in pids])
            d["scores_ongewogen"][s] = round(statistics.mean(pm.values()), 2) if pm else None
        # intentie verdeling (gewogen per variant: gewicht persona / aantal varianten)
        tw = 0; cat = Counter(); ged = Counter(); bez = Counter()
        for p in pids:
            w = gewicht[p] / len(pp[p])
            for x in pp[p]:
                tw += w; i = x["scores"]["intentie"]
                cat["positief (5-7)" if i >= 5 else ("neutraal (4)" if i == 4 else "negatief (1-3)")] += w
                ged[x.get("gedrag", "?")] += w; bez[x.get("bezwaar_categorie", "?")] += w
        d["intentie_verdeling_gewogen"] = {k: round(100 * v / tw, 1) for k, v in cat.items()} if tw else {}
        d["gedrag_gewogen_pct"] = {k: round(100 * v / tw, 1) for k, v in ged.most_common()} if tw else {}
        d["bezwaar_gewogen_pct"] = {k: round(100 * v / tw, 1) for k, v in bez.most_common()} if tw else {}
        for p in pids:
            xs = pp[p]; ints = [x["scores"]["intentie"] for x in xs]
            d["per_persona"][p] = {"naam": naam[p], "kansgroep": kans[p], "gewicht_pct": gewicht[p], "n": len(xs),
                                   "intentie_gem": round(statistics.mean(ints), 2), "intentie_std": round(statistics.pstdev(ints), 2) if len(ints) > 1 else 0.0,
                                   "scores_gem": {s: round(statistics.mean(x["scores"][s] for x in xs), 2) for s in R["scores"]},
                                   "gedrag": dict(Counter(x.get("gedrag") for x in xs)), "bezwaren": [x.get("bezwaar_categorie") for x in xs],
                                   "citaten": [f"{x['variant_id']}: {x.get('citaat', '')}" for x in xs]}
        for lbl, flt in [("kansgroep", True), ("hoofdgroep", False)]:
            sub = [p for p in pids if kans[p] == flt]
            d["kansgroep_vs_hoofdgroep"][lbl] = {s: (round(statistics.mean(d["per_persona"][p]["scores_gem"][s] for p in sub), 2) if sub else None) for s in R["scores"]}
        # ranglijst
        rank = sorted(pids, key=lambda p: -d["per_persona"][p]["intentie_gem"])
        d["sterkste_personas"] = [(p, naam[p], d["per_persona"][p]["intentie_gem"]) for p in rank[:3]]
        d["zwakste_personas"] = [(p, naam[p], d["per_persona"][p]["intentie_gem"]) for p in rank[-3:][::-1]]
        # Van Westendorp
        prijzen = [(x["prijs"], gewicht[x["persona_id"]] / len(pp[x["persona_id"]])) for p in pids for x in pp[p] if isinstance(x.get("prijs"), dict)]
        if prijzen:
            d["van_westendorp"] = van_westendorp(prijzen)
        d["verbeterideeen"] = [f"{x['variant_id']}: {x.get('verbeteridee', '')}" for p in pids for x in pp[p] if x.get("verbeteridee")]
        d["triggers"] = [f"{x['variant_id']}: {x.get('trigger', '')}" for p in pids for x in pp[p] if x.get("trigger")]
        agg["objecten"][o] = d
    # voorkeuren (ronde 3/4)
    if any("voorkeur" in r for r in recs):
        eerste = {}
        for r in recs: eerste.setdefault(r["variant_id"], r)
        vk = Counter(); vku = Counter(); tw = 0; nooit = Counter(); per_p = defaultdict(Counter)
        for vid, r in eerste.items():
            p = r["persona_id"]; w = gewicht[p] / sum(1 for v in eerste.values() if v["persona_id"] == p)
            vk[r.get("voorkeur")] += w; vku[r.get("voorkeur")] += 1; tw += w; per_p[p][r.get("voorkeur")] += 1
            if r.get("nooit"): nooit[r["nooit"]] += 1
        agg["voorkeur_gewogen_pct"] = {k: round(100 * v / tw, 1) for k, v in vk.most_common()}
        agg["voorkeur_ongewogen_aantal"] = dict(vku.most_common())
        agg["voorkeur_per_persona"] = {p: dict(c) for p, c in per_p.items()}
        if nooit: agg["nooit_aantal"] = dict(nooit.most_common())
        agg["voorkeur_redenen"] = [f"{vid}: {r.get('voorkeur')} omdat {r.get('voorkeur_reden', '')}" for vid, r in eerste.items()]
    if a.ronde == 4:
        agg["risicos"] = [f"{r['variant_id']}/{r['object']}: {r.get('risico', '')}" for r in recs if r.get("risico")]
        agg["kansen"] = [f"{r['variant_id']}/{r['object']}: {r.get('kans', '')}" for r in recs if r.get("kans")]
        agg["toetsen_bij_echte_mensen"] = [f"{r['variant_id']}: {r.get('toets_bij_echte_mensen', '')}" for r in recs if r.get("toets_bij_echte_mensen")]

    # realisme-controles
    checks = []; herhaal = set()
    # 1 spreiding binnen persona (over het eerste/enige object, plus alle objecten samen)
    pids_all = sorted({r["persona_id"] for r in recs})
    zonder = []
    for p in pids_all:
        stds = []
        for o in objecten:
            ints = [x["scores"]["intentie"] for x in per_persona_obj[o].get(p, [])]
            if len(ints) > 1: stds.append(statistics.pstdev(ints))
        if stds and max(stds) < DREMPELS["min_spreiding_std"]: zonder.append(p)
    aandeel = len(zonder) / len(pids_all) if pids_all else 0
    ok = aandeel <= DREMPELS["max_aandeel_zonder_spreiding"]
    checks.append({"controle": "spreiding_binnen_persona", "ok": ok, "waarde": round(aandeel, 2), "drempel": DREMPELS["max_aandeel_zonder_spreiding"], "toelichting": f"persona's zonder spreiding in intentie (std < {DREMPELS['min_spreiding_std']}): {zonder}"})
    if not ok: herhaal |= set(zonder)
    # 2 positiviteit
    pos = {o: agg["objecten"][o]["intentie_verdeling_gewogen"].get("positief (5-7)", 0) / 100 for o in objecten}
    begrip = {o: agg["objecten"][o]["scores_gewogen"].get("begrip") for o in objecten if agg["objecten"][o]["scores_gewogen"].get("begrip") is not None}
    ok = not (pos and all(v > DREMPELS["max_aandeel_positief"] for v in pos.values()))
    checks.append({"controle": "positiviteit", "ok": ok, "waarde": pos, "drempel": DREMPELS["max_aandeel_positief"], "toelichting": "gewogen aandeel intentie >= 5 per object; faalt als alle objecten erboven zitten"})
    if not ok: herhaal |= set(pids_all)
    okn = not (pos and all(v < DREMPELS["min_aandeel_positief"] for v in pos.values()))
    checks.append({"controle": "negativiteit_waarschuwing", "ok": True, "waarschuwing": not okn, "waarde": pos, "drempel": DREMPELS["min_aandeel_positief"], "toelichting": "alleen een waarschuwing: bij alle objecten minder dan 5% positief. Controleer of het materiaal een objectieve fout bevat die iedereen raakt (dan is het echt) en benoem het in samenvatting en rapport; geen herhaling nodig."})
    okb = not (begrip and all(v > DREMPELS["max_gem_begrip"] for v in begrip.values()))
    checks.append({"controle": "begrip_te_hoog", "ok": okb, "waarde": begrip, "drempel": DREMPELS["max_gem_begrip"], "toelichting": "gewogen gemiddeld begrip per object; bijna niemand snapt alles"})
    # 3 gelijkvormigheid tussen persona's
    ws = [(r["persona_id"], woorden(r.get("reactie", ""))) for r in recs]
    paren = 0; gelijk = 0; verdachte = Counter()
    for i in range(len(ws)):
        for j in range(i + 1, len(ws)):
            if ws[i][0] == ws[j][0]: continue
            paren += 1
            if jaccard(ws[i][1], ws[j][1]) >= DREMPELS["jaccard_gelijk"]:
                gelijk += 1; verdachte[ws[i][0]] += 1; verdachte[ws[j][0]] += 1
    aandeel_gelijk = gelijk / paren if paren else 0
    ok = aandeel_gelijk <= DREMPELS["max_aandeel_gelijke_paren"]
    checks.append({"controle": "gelijkvormigheid_tussen_personas", "ok": ok, "waarde": round(aandeel_gelijk, 3), "drempel": DREMPELS["max_aandeel_gelijke_paren"], "toelichting": f"aandeel paren van verschillende persona's met woordoverlap >= {DREMPELS['jaccard_gelijk']}; meest betrokken: {verdachte.most_common(4)}"})
    if not ok: herhaal |= {p for p, _ in verdachte.most_common(4)}
    bez_max = {o: (max(agg["objecten"][o]["bezwaar_gewogen_pct"].values()) / 100 if agg["objecten"][o]["bezwaar_gewogen_pct"] else 0) for o in objecten}
    ok = not (bez_max and all(v > DREMPELS["max_aandeel_een_bezwaar"] for v in bez_max.values()))
    checks.append({"controle": "een_bezwaar_domineert", "ok": ok, "waarde": bez_max, "drempel": DREMPELS["max_aandeel_een_bezwaar"], "toelichting": "gewogen aandeel van de grootste bezwaar-categorie per object"})
    # 4 volledigheid
    ok = not ontbrekend and not dubbel and not fouten
    checks.append({"controle": "volledigheid", "ok": ok, "waarde": {"ontbrekend": len(ontbrekend), "dubbel": len(dubbel), "fouten": len(fouten)}, "drempel": 0, "toelichting": f"ontbrekend: {ontbrekend[:10]}; dubbel: {dubbel[:5]}; fouten: {fouten[:5]}"})
    if not ok: herhaal |= {v.split("-")[0] for v, _ in ontbrekend} | {v.split("-")[0] for v, _ in dubbel}
    status = "ok" if all(c["ok"] for c in checks) else "herhalen"
    if status == "ok" and any(c.get("waarschuwing") for c in checks): status = "ok_met_waarschuwing"
    real = {"ronde": a.ronde, "status": status, "controles": checks, "herhalen_personas": sorted(herhaal), "advies": ("Geen actie nodig." if status == "ok" else "Draai generate_variants.py --alleen <ids> --intensiteit 2, bouw de prompts opnieuw en laat die persona's opnieuw reageren; verwijder eerst hun oude jsonl.")}
    json.dump(agg, open(os.path.join(rdir, "aggregatie.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    rj = os.path.join(run, "run.json")
    if os.path.exists(rj):
        rundoc = json.load(open(rj, encoding="utf-8"))
        klaar = set(rundoc.get("rondes_klaar", []))
        if status != "herhalen": klaar.add(a.ronde)
        else: klaar.discard(a.ronde)
        rundoc["rondes_klaar"] = sorted(klaar)
        rundoc["status"] = f"ronde {a.ronde}: {status}"
        json.dump(rundoc, open(rj, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(real, open(os.path.join(rdir, "realisme.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(os.path.join(rdir, "aggregatie.md"), "w", encoding="utf-8").write(markdown(agg, real, R, gewicht))
    print(open(os.path.join(rdir, "aggregatie.md"), encoding="utf-8").read())
    sys.exit(0 if status == "ok" else 2)

def van_westendorp(prijzen):
    """prijzen: lijst van ({te_goedkoop, goedkoop, duur, te_duur}, gewicht). Snijpunten op een prijsraster."""
    geldig = [(p, w) for p, w in prijzen if all(isinstance(p.get(k), (int, float)) for k in ["te_goedkoop", "goedkoop", "duur", "te_duur"])]
    if not geldig: return {"fout": "geen geldige prijsantwoorden"}
    tw = sum(w for _, w in geldig)
    lo = min(p["te_goedkoop"] for p, _ in geldig); hi = max(p["te_duur"] for p, _ in geldig)
    if hi <= lo: return {"fout": "prijsbereik leeg"}
    stap = (hi - lo) / 400
    def curve(key, richting):
        pts = []
        x = lo
        while x <= hi + 1e-9:
            if richting == "af":  # aandeel dat bij prijs x nog 'te goedkoop'/'goedkoop' zegt (antwoord >= x)
                s = sum(w for p, w in geldig if p[key] >= x)
            else:                 # aandeel dat bij prijs x 'duur'/'te duur' vindt (antwoord <= x)
                s = sum(w for p, w in geldig if p[key] <= x)
            pts.append((x, s / tw)); x += stap
        return pts
    tg, g, d, td = curve("te_goedkoop", "af"), curve("goedkoop", "af"), curve("duur", "op"), curve("te_duur", "op")
    def snij(A, B):
        for (x1, a1), (_, b1) in zip(A, B):
            if a1 <= b1: return round(x1, 2)
        return None
    med = lambda key: round(statistics.median([p[key] for p, _ in geldig]), 2)
    return {"n": len(geldig), "PMC_ondergrens": snij(tg, d), "OPP_optimaal": snij(tg, td), "IPP_onverschillig": snij(g, d), "PME_bovengrens": snij(g, td),
            "mediaan_antwoorden": {k: med(k) for k in ["te_goedkoop", "goedkoop", "duur", "te_duur"]},
            "uitleg": "PMC = te goedkoop snijdt duur; OPP = te goedkoop snijdt te duur; IPP = goedkoop snijdt duur; PME = goedkoop snijdt te duur. Acceptabel bereik ligt tussen PMC en PME. Gewogen naar bevolkingsgewicht."}

def markdown(agg, real, R, gewicht):
    L = [f"# Ronde {agg['ronde']}: {agg['titel']}", "", f"Records: {agg['n_records']}, varianten: {agg['n_varianten']}. Realisme: **{real['status']}**", ""]
    for c in real["controles"]:
        L.append(f"- {'WAARSCHUWING' if c.get('waarschuwing') else ('OK' if c['ok'] else 'FAALT')} {c['controle']}: {c['waarde']} (drempel {c['drempel']}). {c['toelichting']}")
    if real["herhalen_personas"]: L.append(f"- Opnieuw draaien: {real['herhalen_personas']}")
    for o, d in agg["objecten"].items():
        L += ["", f"## Object `{o}` (n={d['n']})", "", "| score | gewogen | ongewogen |", "|---|---|---|"]
        for s in R["scores"]: L.append(f"| {s} | {d['scores_gewogen'][s]} | {d['scores_ongewogen'][s]} |")
        L.append(f"\nIntentie gewogen: {d['intentie_verdeling_gewogen']}")
        L.append(f"Gedrag gewogen %: {d['gedrag_gewogen_pct']}")
        L.append(f"Bezwaren gewogen %: {d['bezwaar_gewogen_pct']}")
        L.append(f"Kansgroep vs hoofdgroep (ongewogen gem.): {d['kansgroep_vs_hoofdgroep']}")
        L.append(f"Sterkst: {d['sterkste_personas']}  |  Zwakst: {d['zwakste_personas']}")
        if "van_westendorp" in d: L.append(f"Van Westendorp: {d['van_westendorp']}")
        L += ["", "| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |", "|---|---|---|---|---|---|---|---|---|"]
        for p, x in d["per_persona"].items():
            L.append(f"| {p} {x['naam']} | {x['gewicht_pct']} | {'K' if x['kansgroep'] else ''} | {x['n']} | {x['intentie_gem']} | {x['intentie_std']} | {x['scores_gem']} | {x['gedrag']} | {x['bezwaren']} |")
        L += ["", "Citaten:"] + [f"- {c}" for x in d["per_persona"].values() for c in x["citaten"]]
        L += ["", "Verbeterideeën:"] + [f"- {v}" for v in d["verbeterideeen"]]
        L += ["", "Triggers:"] + [f"- {v}" for v in d["triggers"]]
    if "voorkeur_gewogen_pct" in agg:
        L += ["", "## Voorkeur", f"Gewogen %: {agg['voorkeur_gewogen_pct']}", f"Ongewogen aantal: {agg['voorkeur_ongewogen_aantal']}", f"Per persona: {agg['voorkeur_per_persona']}"]
        if "nooit_aantal" in agg: L.append(f"Nooit: {agg['nooit_aantal']}")
        L += ["Redenen:"] + [f"- {r}" for r in agg["voorkeur_redenen"]]
    for k in ["risicos", "kansen", "toetsen_bij_echte_mensen"]:
        if k in agg: L += ["", f"## {k}"] + [f"- {r}" for r in agg[k]]
    return "\n".join(L) + "\n"

if __name__ == "__main__":
    main()
