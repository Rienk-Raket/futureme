#!/usr/bin/env python3
"""Genereert met een vaste seed 3-4 varianten per gekozen persona (samen 40-50 panelleden).

Gebruik:  python3 scripts/generate_variants.py --run <runmap> [--seed 42] [--doel 45] [--intensiteit 1|2] [--alleen P07,P13]
Leest:    <runmap>/selectie.json (en run.json voor de seed als --seed ontbreekt)
Schrijft: <runmap>/varianten.json  (bij --alleen worden alleen die persona's opnieuw gegenereerd en vervangen)

Verdeling: elke persona krijgt minimaal 3 varianten; hoofdgroepen krijgen in volgorde van gewicht een
vierde variant tot het doel (standaard 45, altijd binnen 40-50) is bereikt. Kansgroepen krijgen pas een
vierde als het doel anders niet gehaald wordt. Varianten verschillen binnen één persona altijd in
stemming, tijd/aandacht, ervaring met de categorie en context (zonder teruglegging getrokken).
Intensiteit 2 (voor het opnieuw draaien van een ingezakte batch) zet één variant op de negatieve pool,
één op de positieve pool en vergroot de verschillen in scepsis en budgetdruk.
"""
import argparse, json, os, random, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BIB = os.path.join(HERE, "..", "references", "personas.json")

STEMMING = ["gehaast", "ontspannen", "geïrriteerd", "nieuwsgierig", "moe", "afgeleid", "opgewekt", "bezorgd"]
TIJD = ["30 seconden, scrollend", "2 minuten, half aandachtig", "10 minuten, rustig", "leest grondig en vergelijkt met alternatieven"]
ERVARING = ["geen ervaring met dit soort aanbod", "eens iets vergelijkbaars geprobeerd en teleurgesteld", "gebruikt nu al iets vergelijkbaars en is daar redelijk tevreden over", "kent de categorie goed en is er kritisch over"]
BUDGET = ["krap deze maand (onverwachte rekening of hoge energienota)", "normaal", "ruimer dan normaal (vakantiegeld of bonus)"]
CONTEXT = ["op de telefoon, onderweg in trein of bus", "op de bank thuis, tv aan", "achter een laptop op het werk, tussendoor", "aan tafel samen met partner, huisgenoot of familielid", "op de telefoon in bed, laat op de avond", "in de wachtkamer of de rij, met iemand die meekijkt"]
TWIST = ["is vandaag ongeduldiger dan normaal", "heeft net een slechte klantervaring gehad bij een ander bedrijf", "heeft net van een bekende iets positiefs gehoord over dit soort aanbod", "let vandaag vooral op de kleine lettertjes", "heeft vandaag vooral zin in iets leuks of nieuws", "is bezig met bezuinigen en zet alle vaste lasten op een rij", "twijfelt of dit iets voor een familielid zou zijn in plaats van voor zichzelf", "heeft weinig zin om iets nieuws uit te zoeken en wil dat het meteen duidelijk is"]

def klem(v): return max(1, min(5, v))

def verdeel(sel, doel):
    ps = sel["personas"]
    n = {p["id"]: 3 for p in ps}
    tot = 3 * len(ps)
    doel = max(40, min(50, doel))
    hoofd = sorted([p for p in ps if not p["kansgroep"]], key=lambda p: -p["gewicht_pct"])
    kans = sorted([p for p in ps if p["kansgroep"]], key=lambda p: -p["gewicht_pct"])
    for p in hoofd + kans:
        if tot >= doel: break
        n[p["id"]] = 4; tot += 1
    if tot < 40:
        # minder dan 10 persona's: vul kansgroepen en hoofdgroepen tot 4 waar mogelijk
        for p in hoofd + kans:
            if tot >= 40: break
            if n[p["id"]] < 4: n[p["id"]] = 4; tot += 1
    return n, tot

def maak_varianten(persona, aantal, rng, intensiteit):
    g = persona["gedrag"]
    stem = rng.sample(STEMMING, aantal); tijd = rng.sample(TIJD, aantal)
    erv = rng.sample(ERVARING, aantal)
    werk = persona["demografie"]["werk"].lower()
    contexten = list(CONTEXT)
    if any(k in werk for k in ["gepensioneerd", "werkloos", "arbeidsongeschikt"]):
        contexten = [c if "op het werk" not in c else "aan de keukentafel, met de post en een kop koffie" for c in contexten]
    if "geen" in persona["gedrag"]["digitale_vaardigheid"].lower()[:4]:
        contexten = [c.replace("op de telefoon", "met een uitgeprinte versie of voorgelezen door een familielid") for c in contexten]
    ctx = rng.sample(contexten, aantal)
    twist = rng.sample(TWIST, aantal)
    waarden = persona["profiel"]["waarden"]
    out = []
    for k in range(aantal):
        letter = "abcd"[k]
        if intensiteit >= 2 and k == 0:   # negatieve pool
            s, t, e, b, sd, sbd = "geïrriteerd", TIJD[0], ERVARING[1], BUDGET[0], 2, -1
        elif intensiteit >= 2 and k == 1:  # positieve pool
            s, t, e, b, sd, sbd = "nieuwsgierig", TIJD[2], ERVARING[2], BUDGET[2], -1, 1
        else:
            s, t, e = stem[k], tijd[k], erv[k]
            b = rng.choice(BUDGET)
            sd = rng.choice([-1, 0, 0, 1] if intensiteit == 1 else [-2, -1, 1, 2])
            sbd = rng.choice([-1, 0, 0, 1] if intensiteit == 1 else [-1, 1])
        scepsis = klem(g["scepsis"] + sd); sociaal = klem(g["sociale_bewijskracht"] + sbd)
        accent = rng.choice(waarden)
        v = {"variant_id": f"{persona['id']}-{letter}", "persona_id": persona["id"], "naam": f"{persona['naam'].split()[0]} ({letter})",
             "stemming": s, "tijd_aandacht": t, "ervaring_categorie": e, "budgetdruk": b, "context": ctx[k],
             "scepsis": scepsis, "sociale_bewijskracht": sociaal, "waarde_accent": accent, "twist": twist[k],
             "intensiteit": intensiteit}
        v["samenvatting"] = (f"Vandaag ben je {s}. Tijd en aandacht: {t}. Plek en moment: {ctx[k]}. Budget: {b}. "
                             f"Ervaring: {e}. Scepsis {scepsis}/5, gevoeligheid voor wat anderen vinden {sociaal}/5. "
                             f"Wat vandaag extra zwaar weegt: {accent}. Bijzonderheid: {twist[k]}.")
        if intensiteit >= 2:
            v["samenvatting"] += " Reageer uitgesproken en blijf strikt bij je eigen situatie; een lauw 'wel aardig' is niet geloofwaardig voor jou vandaag."
        out.append(v)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    ap.add_argument("--seed", type=int)
    ap.add_argument("--doel", type=int, default=45)
    ap.add_argument("--intensiteit", type=int, default=1, choices=[1, 2])
    ap.add_argument("--alleen", default="", help="alleen deze persona-ids opnieuw genereren")
    a = ap.parse_args()
    sel = json.load(open(os.path.join(a.run, "selectie.json"), encoding="utf-8"))
    runj = os.path.join(a.run, "run.json")
    seed = a.seed if a.seed is not None else (json.load(open(runj)).get("seed", 42) if os.path.exists(runj) else 42)
    by = {p["id"]: p for p in json.load(open(BIB, encoding="utf-8"))["personas"]}
    n, tot = verdeel(sel, a.doel)
    pad = os.path.join(a.run, "varianten.json")
    alleen = [i.strip() for i in a.alleen.split(",") if i.strip()]
    bestaand = json.load(open(pad, encoding="utf-8")) if (alleen and os.path.exists(pad)) else {"varianten": []}
    varianten = [v for v in bestaand["varianten"] if v["persona_id"] not in alleen] if alleen else []
    herhaling = (bestaand.get("herhalingen", 0) + 1) if alleen else 0
    for p in sel["personas"]:
        if alleen and p["id"] not in alleen: continue
        rng = random.Random(f"{seed}:{p['id']}:{herhaling}:{a.intensiteit}")
        varianten += maak_varianten(by[p["id"]], n[p["id"]], rng, a.intensiteit)
    varianten.sort(key=lambda v: v["variant_id"])
    doc = {"seed": seed, "doel": a.doel, "intensiteit_laatste": a.intensiteit, "herhalingen": herhaling, "opnieuw_gegenereerd": alleen,
           "aantal_per_persona": {p["id"]: n[p["id"]] for p in sel["personas"]}, "totaal": len(varianten), "varianten": varianten}
    json.dump(doc, open(pad, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(varianten)} varianten voor {len(sel['personas'])} persona's (seed {seed}, intensiteit {a.intensiteit}{', opnieuw: ' + ','.join(alleen) if alleen else ''})")
    for p in sel["personas"]:
        print(f"  {p['id']} {p['naam']:<22} {'K' if p['kansgroep'] else ' '} x{n[p['id']]}")
    print(f"Opgeslagen: {pad}")

if __name__ == "__main__":
    main()
