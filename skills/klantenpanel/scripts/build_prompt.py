#!/usr/bin/env python3
"""Bouwt per persona en ronde de opdracht voor een subagent uit references/subagent-prompt.md.

Gebruik:  python3 scripts/build_prompt.py --run <runmap> --ronde N [--persona P07 | --alle]
Leest:    <runmap>/selectie.json, varianten.json, ronde-N/opzet.json, references/rondes.json, personas.json
          opzet.json: {"objecten": [{"id": "origineel", "titel": "...", "bestand": "ronde-1/materiaal/origineel.md"}],
                       "context": "wat de subagent verder moet weten (prijs, eenheid, kanaal, beslissing)",
                       "vragen_extra": ["optionele extra vraag"]}
Schrijft: <runmap>/ronde-N/prompts/<persona>.md en print de paden.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "..", "references")

def persona_tekst(p):
    d, pr, g = p["demografie"], p["profiel"], p["gedrag"]
    regels = [f"**{p['naam']}** ({p['id']}{', kansgroep' if p['kansgroep'] else ''}): {p['kernzin']}", ""]
    regels.append("Demografie: " + "; ".join(f"{k}: {v}" for k, v in d.items()))
    regels.append(f"\nDagelijkse situatie: {pr['dagelijkse_situatie']}")
    regels.append("Belangrijk: " + "; ".join(pr["belangrijk"]))
    regels.append("Ergernissen: " + "; ".join(pr["ergernissen"]))
    regels.append("Waarden: " + ", ".join(pr["waarden"]))
    regels.append(f"Beslisstijl: {pr['beslisstijl']}")
    regels.append(f"Budget: {pr['budget']}")
    regels.append(f"Stem (zo praat deze persoon): {pr['stem']}")
    regels.append("Gedrag: " + "; ".join(f"{k}: {v if not isinstance(v, list) else ', '.join(v)}" for k, v in g.items()))
    if p["kansgroep"]:
        regels.append(f"Waarom deze groep meedoet: {p['kansgroep_reden']}")
    return "\n".join(regels)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    ap.add_argument("--ronde", type=int, required=True)
    ap.add_argument("--persona")
    ap.add_argument("--alle", action="store_true")
    a = ap.parse_args()
    run = os.path.abspath(a.run)
    rondes = json.load(open(os.path.join(REF, "rondes.json"), encoding="utf-8"))
    R = rondes["rondes"][str(a.ronde)]
    sjabloon = open(os.path.join(REF, "subagent-prompt.md"), encoding="utf-8").read().split("\n---\n", 1)[1].strip()
    bib = {p["id"]: p for p in json.load(open(os.path.join(REF, "personas.json"), encoding="utf-8"))["personas"]}
    sel = json.load(open(os.path.join(run, "selectie.json"), encoding="utf-8"))
    var = json.load(open(os.path.join(run, "varianten.json"), encoding="utf-8"))["varianten"]
    rdir = os.path.join(run, f"ronde-{a.ronde}")
    opzet = json.load(open(os.path.join(rdir, "opzet.json"), encoding="utf-8"))
    objecten = opzet["objecten"]
    mat = []
    for o in objecten:
        pad = os.path.join(run, o["bestand"])
        mat.append(f"### Object `{o['id']}`: {o.get('titel', o['id'])}\n\n{open(pad, encoding='utf-8').read().strip()}\n")
    materiaal = "## Materiaal\n\n" + (f"Er zijn {len(objecten)} objecten. Schrijf per variant één regel per object; de reactie per object mag dan 2 tot 4 zinnen zijn (in plaats van 4 tot 8), zolang je concreet verwijst naar wat in dat object anders is. Geef daarna je voorkeur.\n\n" if len(objecten) > 1 else "") + "\n".join(mat)
    vragen = "\n".join(f"{i+1}. {v}" for i, v in enumerate(R["vragen"] + opzet.get("vragen_extra", [])))
    context = ("## Context van de opdrachtgever\n\n" + opzet["context"].strip()) if opzet.get("context") else ""
    # schema
    velden = ["variant_id", "persona_id", "ronde", "object", "reactie", "gedrag"]
    schema = ['"variant_id": "P07-a"', '"persona_id": "P07"', f'"ronde": {a.ronde}', f'"object": "{objecten[0]["id"]}"  (id van het object waarop deze regel reageert)',
              '"reactie": "4-8 zinnen in eigen woorden"', '"gedrag": "één waarde uit de lijst"',
              '"scores": {' + ", ".join(f'"{s}": 1-7' for s in R["scores"]) + '}',
              '"bezwaar": "belangrijkste bezwaar in één zin"', '"bezwaar_categorie": "één waarde uit de lijst"',
              '"trigger": "wat zou deze variant wél overhalen, één zin"', '"verbeteridee": "één concreet idee"', '"citaat": "max 20 woorden, in de stem van de persona"']
    if "prijs" in R["velden_extra"]:
        schema.append('"prijs": {"te_goedkoop": euro, "goedkoop": euro, "duur": euro, "te_duur": euro}  (getallen, oplopend)')
        schema.append('"alternatief": "wat deze variant nu doet of zou doen in plaats van dit aanbod"')
    if "voorkeur" in R["velden_extra"]:
        schema.append(f'"voorkeur": "object-id van de gekozen versie ({", ".join(o["id"] for o in objecten)}); zelfde waarde op elke regel van deze variant"')
        schema.append('"voorkeur_reden": "één zin"')
    if "nooit" in R["velden_extra"]:
        schema += ['"nooit": "object-id dat deze variant nooit zou kiezen"', '"risico": "grootste risico voor het bedrijf bij dit object, één zin"', '"kans": "onbenutte kans voor mensen zoals deze variant, één zin"', '"toets_bij_echte_mensen": "wat het bedrijf bij echte mensen moet toetsen, één zin"']
    schema_txt = "\n".join(f"- {s}" for s in schema)
    per_object = f", per object dus {len(objecten)} regels per variant" if len(objecten) > 1 else ""
    ids = [p["id"] for p in sel["personas"]] if a.alle else [a.persona]
    if not ids or ids == [None]: sys.exit("geef --persona of --alle")
    os.makedirs(os.path.join(rdir, "prompts"), exist_ok=True)
    for pid in ids:
        p = bib[pid]; vs = [v for v in var if v["persona_id"] == pid]
        uit = os.path.join(rdir, "reacties", f"{pid}.jsonl")
        vtxt = "\n".join(f"- **{v['variant_id']}** ({v['naam']}): {v['samenvatting']}" for v in vs)
        t = sjabloon
        for k, v in {"AANTAL_VARIANTEN": str(len(vs)), "UITVOERPAD": uit, "PERSONA": persona_tekst(p), "VARIANTEN": vtxt, "RONDE": str(a.ronde),
                     "RONDE_TITEL": R["titel"], "RONDE_DOEL": R["doel"], "CONTEXT": context, "MATERIAAL": materiaal, "VRAGEN": vragen,
                     "BASISVERWACHTING": rondes["basisverwachting"], "PER_OBJECT": per_object, "SCHEMA": schema_txt,
                     "GEDRAG_OPTIES": ", ".join(rondes["gedrag_opties"]), "BEZWAAR_CATEGORIEEN": ", ".join(rondes["bezwaar_categorieen"]),
                     "SCORES_UITLEG": rondes["scores_uitleg"] + " Betekenis: " + "; ".join(f"{k}: {v}" for k, v in rondes["score_velden"].items() if k in R["scores"]) + ("; waarde_voor_geld: is de prijs in het materiaal het waard, gezien mijn alternatieven?" if "waarde_voor_geld" in R["scores"] else "")}.items():
            t = t.replace("{{" + k + "}}", v)
        pp = os.path.join(rdir, "prompts", f"{pid}.md")
        open(pp, "w", encoding="utf-8").write(t)
        print(pp)

if __name__ == "__main__":
    main()
