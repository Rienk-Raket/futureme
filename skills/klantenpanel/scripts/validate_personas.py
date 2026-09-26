#!/usr/bin/env python3
"""Controleert references/personas.json: schema, gewichten (som 100), kansgroepen en
de verdeling per dimensie tegenover CBS-richtcijfers (zie references/bronnen.md).

Gebruik:  python3 scripts/validate_personas.py [--json]
Exitcode 0 = geldig; 1 = schema- of gewichtsfout. Afwijkingen van CBS-cijfers zijn
waarschuwingen, geen fouten: 60 persona's kunnen nooit elke marge exact raken.
"""
import json, sys, os
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
PAD = os.path.join(HERE, "..", "references", "personas.json")

VERPLICHT_TOP = ["id", "naam", "kansgroep", "kansgroep_reden", "gewicht_pct", "kernzin", "demografie", "profiel", "gedrag", "tags"]
VERPLICHT_DEMO = ["leeftijd", "leeftijdsgroep", "gender", "huishouden", "levensfase", "opleiding", "opleidingsrichting", "werk", "beroep", "inkomen", "financiele_ruimte", "woonsituatie", "regio", "provincie", "stedelijkheid", "plaats_type", "herkomst", "taal_thuis", "nederlands_niveau", "geloof", "gezondheid", "beperking"]
VERPLICHT_PROFIEL = ["dagelijkse_situatie", "belangrijk", "ergernissen", "waarden", "beslisstijl", "budget", "stem"]
VERPLICHT_GEDRAG = ["digitale_vaardigheid", "geletterdheid", "mediagebruik", "aankoopstijl", "innovatie_adoptie", "prijsgevoeligheid", "duurzaamheid", "vertrouwen_bedrijven", "vertrouwen_instanties", "scepsis", "sociale_bewijskracht"]
SCHALEN = ["prijsgevoeligheid", "duurzaamheid", "vertrouwen_bedrijven", "vertrouwen_instanties", "scepsis", "sociale_bewijskracht"]

# Richtcijfers (procent van de volwassen bevolking, afgerond; bronnen in references/bronnen.md)
RICHT = {
    "leeftijdsgroep": {"18-24": 11, "25-34": 16, "35-44": 15, "45-54": 16, "55-64": 17, "65-74": 14, "75+": 11},
    "gender": {"man": 49, "vrouw": 50, "non-binair": 1},
    "opleidingsrichting": {"praktisch": 58, "theoretisch": 42},
    "regio": {"Randstad": 47, "Zuid": 23, "Oost": 19, "Noord": 10},
    "herkomst_klasse": {"Nederland": 72, "Europa": 12, "buiten Europa": 16},
    "stedelijkheid_klasse": {"(zeer) sterk stedelijk": 52, "matig stedelijk": 16, "weinig/niet stedelijk": 32},
    "werk_klasse": {"loondienst": 52, "zelfstandig": 9, "gepensioneerd": 24, "student": 6, "werkloos/uitkering": 6, "anders": 3},
    "digitaal_klasse": {"laag of geen": 18, "gemiddeld": 42, "hoog": 40},
    "innovatie_adoptie": {"innovator": 2.5, "early adopter": 13.5, "early majority": 34, "late majority": 34, "achterblijver": 16},
    "geloof_klasse": {"geen": 56, "katholiek": 17, "protestants": 14, "islam": 7, "anders": 6},
}

def klasse_herkomst(h):
    h = h.lower()
    if h.startswith("nederland") and "geboren" not in h: return "Nederland"
    europees = ["duits", "belgi", "polen", "pools", "ier", "spanje", "ital", "portug", "roemen", "bulgaar", "oekra", "frankrijk", "engel", "brit"]
    if any(e in h for e in europees): return "Europa"
    return "buiten Europa"

def klasse_stedelijk(s):
    s = s.lower()
    if "sterk" in s: return "(zeer) sterk stedelijk"
    if "matig" in s: return "matig stedelijk"
    return "weinig/niet stedelijk"

def klasse_werk(w):
    w = w.lower()
    if "gepensioneerd" in w: return "gepensioneerd"
    if "student" in w and "loondienst" not in w: return "student"
    if "werkloos" in w or "arbeidsongeschikt" in w or "bijstand" in w or "flexwerk" in w: return "werkloos/uitkering"
    if "zzp" in w or "ondernemer" in w or "investeerder" in w: return "zelfstandig"
    if "loondienst" in w: return "loondienst"
    return "anders"

def klasse_digitaal(d):
    d = d.lower()
    if d.startswith("geen") or d.startswith("laag"): return "laag of geen"
    if d.startswith("hoog") or d.startswith("zeer hoog"): return "hoog"
    return "gemiddeld"

def klasse_adoptie(a):
    a = a.lower()
    for k in ["innovator", "early adopter", "early majority", "late majority", "achterblijver"]:
        if a.startswith(k): return k
    return a

def klasse_geloof(g):
    g = g.lower()
    if g.startswith("geen"): return "geen"
    if "islam" in g: return "islam"
    if "katholiek" in g: return "katholiek"
    if any(k in g for k in ["pinkster", "ebg", "evangelis", "orthodox", "hindoe", "boeddh", "joods"]): return "anders"
    if any(k in g for k in ["protestant", "gereformeerd", "reformator", "hervormd", "pkn", "christelijk", "remonstrant"]): return "protestants"
    return "anders"

def main():
    as_json = "--json" in sys.argv
    doc = json.load(open(PAD, encoding="utf-8"))
    ps = doc["personas"]
    fouten, waarschuwingen = [], []
    ids = set()
    for p in ps:
        for k in VERPLICHT_TOP:
            if k not in p: fouten.append(f"{p.get('id','?')}: veld '{k}' ontbreekt")
        if p["id"] in ids: fouten.append(f"dubbel id {p['id']}")
        ids.add(p["id"])
        for k in VERPLICHT_DEMO:
            if k not in p.get("demografie", {}): fouten.append(f"{p['id']}: demografie.{k} ontbreekt")
        for k in VERPLICHT_PROFIEL:
            if k not in p.get("profiel", {}): fouten.append(f"{p['id']}: profiel.{k} ontbreekt")
        for k in VERPLICHT_GEDRAG:
            if k not in p.get("gedrag", {}): fouten.append(f"{p['id']}: gedrag.{k} ontbreekt")
        for s in SCHALEN:
            v = p.get("gedrag", {}).get(s)
            if not isinstance(v, int) or not 1 <= v <= 5: fouten.append(f"{p['id']}: gedrag.{s} moet 1-5 zijn, is {v}")
        if p["kansgroep"] and not p.get("kansgroep_reden"): fouten.append(f"{p['id']}: kansgroep zonder kansgroep_reden")
        if len(p["profiel"]["dagelijkse_situatie"]) < 120: waarschuwingen.append(f"{p['id']}: dagelijkse_situatie erg kort")
    n = len(ps); som = round(sum(p["gewicht_pct"] for p in ps), 3)
    nk = sum(1 for p in ps if p["kansgroep"])
    if n != 60: fouten.append(f"verwacht 60 persona's, gevonden {n}")
    if abs(som - 100) > 0.05: fouten.append(f"gewichten tellen op tot {som}, niet 100")
    if not 10 <= nk <= 14: waarschuwingen.append(f"{nk} kansgroepen gemarkeerd (richtlijn: circa 12)")

    # Marginale verdelingen (gewogen)
    verdeling = {}
    def tel(dim, f):
        d = defaultdict(float)
        for p in ps: d[f(p)] += p["gewicht_pct"]
        verdeling[dim] = {k: round(v, 1) for k, v in sorted(d.items(), key=lambda kv: -kv[1])}
    tel("leeftijdsgroep", lambda p: p["demografie"]["leeftijdsgroep"])
    tel("gender", lambda p: "non-binair" if "non-binair" in p["demografie"]["gender"] else p["demografie"]["gender"])
    tel("opleidingsrichting", lambda p: p["demografie"]["opleidingsrichting"])
    tel("regio", lambda p: p["demografie"]["regio"])
    tel("herkomst_klasse", lambda p: klasse_herkomst(p["demografie"]["herkomst"]))
    tel("stedelijkheid_klasse", lambda p: klasse_stedelijk(p["demografie"]["stedelijkheid"]))
    tel("werk_klasse", lambda p: klasse_werk(p["demografie"]["werk"]))
    tel("digitaal_klasse", lambda p: klasse_digitaal(p["gedrag"]["digitale_vaardigheid"]))
    tel("innovatie_adoptie", lambda p: klasse_adoptie(p["gedrag"]["innovatie_adoptie"]))
    tel("geloof_klasse", lambda p: klasse_geloof(p["demografie"]["geloof"]))
    tel("laaggeletterd_of_beperkt", lambda p: "ja" if p["gedrag"]["geletterdheid"].lower().startswith(("laag", "beperkt")) else "nee")
    tel("chronisch_of_beperking", lambda p: "ja" if (p["demografie"]["beperking"].lower() not in ("geen",) or "chronisch" in p["demografie"]["gezondheid"].lower() or "kwetsbaar" in p["demografie"]["gezondheid"].lower()) else "nee")
    tel("kansgroep", lambda p: "kansgroep" if p["kansgroep"] else "hoofdgroep")

    vergelijking = {}
    for dim, richt in RICHT.items():
        rows = []
        for k, doel in richt.items():
            w = verdeling[dim].get(k, 0.0)
            afw = round(w - doel, 1)
            rows.append({"klasse": k, "panel_pct": w, "cbs_richt_pct": doel, "afwijking": afw})
            if abs(afw) > 5: waarschuwingen.append(f"{dim}/{k}: panel {w}% versus richtcijfer {doel}% (afwijking {afw:+})")
        vergelijking[dim] = rows

    out = {"aantal": n, "som_gewichten": som, "kansgroepen": nk, "fouten": fouten, "waarschuwingen": waarschuwingen, "verdeling": verdeling, "vergelijking_met_richtcijfers": vergelijking}
    if as_json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
    else:
        print(f"Persona's: {n} | som gewichten: {som} | kansgroepen: {nk}")
        print("\nVerdeling versus CBS-richtcijfers (gewogen %):")
        for dim, rows in vergelijking.items():
            print(f"  {dim}")
            for r in rows:
                print(f"    {r['klasse']:<28} panel {r['panel_pct']:>5}  richt {r['cbs_richt_pct']:>5}  ({r['afwijking']:+})")
        for dim in ["laaggeletterd_of_beperkt", "chronisch_of_beperking", "kansgroep"]:
            print(f"  {dim}: {verdeling[dim]}")
        print("\nFouten:", *fouten, sep="\n  " if fouten else " geen")
        print("Waarschuwingen:", *waarschuwingen, sep="\n  " if waarschuwingen else " geen")
    sys.exit(1 if fouten else 0)

if __name__ == "__main__":
    main()
