#!/usr/bin/env python3
"""Helpt bij het kiezen van 10-15 persona's uit de bibliotheek en legt de selectie vast.

Stap 1 (overzicht):   python3 scripts/select_personas.py --lijst [--tags gezin,krap]
Stap 2 (vastleggen):  python3 scripts/select_personas.py --run <runmap> --kies P06,P13,K09 \
                          --redenen redenen.json --doelgroep "..." [--aangrenzend P30]
   redenen.json: {"P06": "waarom deze persona", ...}  (mag ook via --reden P06="..." meerdere keren)
Schrijft <runmap>/selectie.json en print een tabel voor de gebruiker (id, naam, gewicht, kansgroep, reden).
Controleert: 10-15 persona's, 2-3 kansgroepen (waarschuwing daarbuiten), ids bestaan.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BIB = os.path.join(HERE, "..", "references", "personas.json")

def laad():
    return json.load(open(BIB, encoding="utf-8"))["personas"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lijst", action="store_true")
    ap.add_argument("--tags", default="", help="komma-gescheiden tags; toont persona's met minstens één van deze tags")
    ap.add_argument("--run")
    ap.add_argument("--kies", help="komma-gescheiden persona-ids")
    ap.add_argument("--redenen", help="json-bestand {id: reden}")
    ap.add_argument("--reden", action="append", default=[], help='P06="reden" (herhaalbaar)')
    ap.add_argument("--aangrenzend", default="", help="ids die net buiten de doelgroep vallen maar meelopen")
    ap.add_argument("--doelgroep", default="")
    a = ap.parse_args()
    ps = laad()
    by = {p["id"]: p for p in ps}

    if a.lijst or not a.kies:
        tags = [t.strip() for t in a.tags.split(",") if t.strip()]
        print(f"{'id':<4} {'naam':<22} {'gew%':>5} {'K':<2} {'lft':>3} {'werk':<26} kernzin")
        for p in ps:
            if tags and not any(t in p["tags"] for t in tags):
                continue
            print(f"{p['id']:<4} {p['naam']:<22} {p['gewicht_pct']:>5} {'K' if p['kansgroep'] else '':<2} {p['demografie']['leeftijd']:>3} {p['demografie']['werk'][:26]:<26} {p['kernzin'][:110]}")
        if not a.kies:
            return

    if not a.run:
        sys.exit("--run <runmap> is verplicht bij --kies")
    ids = [i.strip() for i in a.kies.split(",") if i.strip()]
    onbekend = [i for i in ids if i not in by]
    if onbekend:
        sys.exit(f"onbekende ids: {onbekend}")
    redenen = {}
    if a.redenen:
        redenen.update(json.load(open(a.redenen, encoding="utf-8")))
    for r in a.reden:
        k, _, v = r.partition("=")
        redenen[k.strip()] = v.strip().strip('"')
    aangr = [i.strip() for i in a.aangrenzend.split(",") if i.strip()]
    waarsch = []
    nk = sum(1 for i in ids if by[i]["kansgroep"])
    if not 10 <= len(ids) <= 15: waarsch.append(f"{len(ids)} persona's gekozen; richtlijn is 10 tot 15")
    if not 2 <= nk <= 3: waarsch.append(f"{nk} kansgroepen gekozen; richtlijn is 2 tot 3")
    ontbreekt = [i for i in ids if i not in redenen]
    if ontbreekt: waarsch.append(f"geen reden opgegeven voor: {ontbreekt}")
    sel = {"doelgroep": a.doelgroep, "personas": [], "waarschuwingen": waarsch}
    for i in ids:
        p = by[i]
        sel["personas"].append({"id": i, "naam": p["naam"], "gewicht_pct": p["gewicht_pct"], "kansgroep": p["kansgroep"], "aangrenzend": i in aangr, "reden": redenen.get(i, ""), "kernzin": p["kernzin"]})
    som = round(sum(x["gewicht_pct"] for x in sel["personas"]), 1)
    sel["som_gewicht_pct"] = som
    os.makedirs(a.run, exist_ok=True)
    json.dump(sel, open(os.path.join(a.run, "selectie.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Selectie voor doelgroep: {a.doelgroep or '(niet opgegeven)'}\n")
    print(f"{'id':<4} {'naam':<22} {'gew%':>5} {'rol':<12} reden")
    for x in sel["personas"]:
        rol = "kansgroep" if x["kansgroep"] else ("aangrenzend" if x["aangrenzend"] else "doelgroep")
        print(f"{x['id']:<4} {x['naam']:<22} {x['gewicht_pct']:>5} {rol:<12} {x['reden']}")
    print(f"\n{len(ids)} persona's, {nk} kansgroepen, samen {som}% van de volwassen bevolking.")
    for w in waarsch: print("WAARSCHUWING:", w)
    print(f"\nOpgeslagen: {os.path.join(a.run, 'selectie.json')}")

if __name__ == "__main__":
    main()
