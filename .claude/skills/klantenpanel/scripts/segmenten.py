#!/usr/bin/env python3
"""Rekent per segment (een groep persona's die je zelf kiest) de gewogen en ongewogen cijfers uit.

Gebruik:  python3 scripts/segmenten.py --run <runmap> --ronde N \
              --segment "55-plus=P30,P35,P40" --segment "gezinnen=P13,P16" [--segment ...]
Zonder --segment worden alleen 'hoofdgroep' en 'kansgroep' berekend (die komen er altijd bij).
Schrijft: <runmap>/ronde-N/segmenten.json en segmenten.md, en print de tabel.

Gewogen binnen een segment = per persona het gemiddelde over zijn varianten, gewogen met het
bevolkingsgewicht van de persona. Ongewogen = elke persona telt één keer. 'Aandeel positief' is het
gewogen aandeel varianten met intentie 5-7. 'Voorkeur' (ronde 3 en 4) is het gewogen aandeel varianten
van het segment dat dit object als voorkeur koos.
"""
import argparse, glob, json, os, statistics
from collections import defaultdict

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True); ap.add_argument("--ronde", type=int, required=True)
    ap.add_argument("--segment", action="append", default=[])
    a = ap.parse_args()
    run = os.path.abspath(a.run); rdir = os.path.join(run, f"ronde-{a.ronde}")
    sel = json.load(open(os.path.join(run, "selectie.json"), encoding="utf-8"))
    gew = {p["id"]: p["gewicht_pct"] for p in sel["personas"]}
    kans = {p["id"]: p["kansgroep"] for p in sel["personas"]}
    recs = [json.loads(l) for f in sorted(glob.glob(os.path.join(rdir, "reacties", "*.jsonl"))) for l in open(f, encoding="utf-8") if l.strip()]
    objecten = list(dict.fromkeys(r["object"] for r in recs))
    segs = {"hoofdgroep": [p for p in gew if not kans[p]], "kansgroep": [p for p in gew if kans[p]]}
    for s in a.segment:
        naam, _, ids = s.partition("=")
        ids = [i.strip() for i in ids.split(",") if i.strip()]
        onbekend = [i for i in ids if i not in gew]
        if onbekend: raise SystemExit(f"segment {naam}: onbekende of niet-geselecteerde persona's {onbekend}")
        segs[naam.strip()] = ids
    per = defaultdict(lambda: defaultdict(list))
    for r in recs: per[r["object"]][r["persona_id"]].append(r)
    voorkeur = {}
    for r in recs:
        if "voorkeur" in r: voorkeur.setdefault(r["variant_id"], (r["persona_id"], r["voorkeur"]))
    out = {"ronde": a.ronde, "segmenten": {k: v for k, v in segs.items()}, "resultaten": {}}
    for naam, ids in segs.items():
        out["resultaten"][naam] = {}
        for o in objecten:
            pids = [p for p in ids if per[o].get(p)]
            if not pids: continue
            pm = {p: statistics.mean(x["scores"]["intentie"] for x in per[o][p]) for p in pids}
            tw = sum(gew[p] for p in pids)
            posw = sum(gew[p] * sum(1 for x in per[o][p] if x["scores"]["intentie"] >= 5) / len(per[o][p]) for p in pids)
            res = {"personas": len(pids), "varianten": sum(len(per[o][p]) for p in pids), "gewicht_pct_samen": round(tw, 1),
                   "intentie_gewogen": round(sum(pm[p] * gew[p] for p in pids) / tw, 2), "intentie_ongewogen": round(statistics.mean(pm.values()), 2),
                   "aandeel_positief_gewogen_pct": round(100 * posw / tw, 1)}
            if voorkeur:
                vw = 0.0
                for p in pids:
                    vs = [v for v, (pp, _) in voorkeur.items() if pp == p]
                    if vs: vw += gew[p] * sum(1 for v in vs if voorkeur[v][1] == o) / len(vs)
                res["voorkeur_gewogen_pct"] = round(100 * vw / tw, 1)
            out["resultaten"][naam][o] = res
    json.dump(out, open(os.path.join(rdir, "segmenten.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    L = [f"# Segmenten ronde {a.ronde}", ""]
    for naam, ids in segs.items():
        L += [f"## {naam} ({', '.join(ids)})", "", "| object | personas | varianten | gewicht% | intentie gewogen | intentie ongewogen | positief gewogen % | voorkeur gewogen % |", "|---|---|---|---|---|---|---|---|"]
        for o, r in out["resultaten"][naam].items():
            L.append(f"| {o} | {r['personas']} | {r['varianten']} | {r['gewicht_pct_samen']} | {r['intentie_gewogen']} | {r['intentie_ongewogen']} | {r['aandeel_positief_gewogen_pct']} | {r.get('voorkeur_gewogen_pct', '-')} |")
        L.append("")
    md = "\n".join(L)
    open(os.path.join(rdir, "segmenten.md"), "w", encoding="utf-8").write(md)
    print(md)

if __name__ == "__main__":
    main()
