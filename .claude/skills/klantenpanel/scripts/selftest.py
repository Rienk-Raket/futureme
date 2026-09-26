#!/usr/bin/env python3
"""Zelftest van de klantenpanel-scripts. Draait in een tijdelijke map en laat niets achter.

Gebruik: python3 scripts/selftest.py
Test:
 1. validate_personas.py: 60 persona's, gewichten 100, geen fouten.
 2. generate_variants.py: 10 persona's -> 40 varianten, 13 -> 45, 15 -> 45 (doel), 15 met --doel 50 -> 50;
    altijd 3-4 per persona, minimaal 3 per kansgroep; zelfde seed -> identiek; andere seed -> anders;
    binnen een persona verschillen stemming, tijd, ervaring en context bij alle varianten.
 3. --alleen/--intensiteit 2 vervangt alleen de gevraagde persona's en zet een negatieve en positieve pool.
 4. aggregate_round.py: gevarieerde nepdata -> geen alarm op spreiding/positiviteit; ingezakte nepdata
    (iedereen 6, zelfde tekst) -> exitcode 2 en alle vier inzakcontroles falen.
 5. build_prompt.py en segmenten.py draaien zonder fouten op de nepdata.
"""
import json, os, random, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
def run(*args, check=True):
    p = subprocess.run([sys.executable, *args], capture_output=True, text=True)
    if check and p.returncode not in (0,):
        raise AssertionError(f"{args} faalde ({p.returncode}): {p.stderr or p.stdout}")
    return p
S = lambda n: os.path.join(HERE, n)
fails = []
def ok(cond, msg):
    print(("OK   " if cond else "FOUT ") + msg)
    if not cond: fails.append(msg)

p = run(S("validate_personas.py"), "--json")
v = json.loads(p.stdout)
ok(v["aantal"] == 60 and abs(v["som_gewichten"] - 100) < 0.05 and not v["fouten"], f"bibliotheek: {v['aantal']} persona's, som {v['som_gewichten']}, fouten {len(v['fouten'])}, kansgroepen {v['kansgroepen']}")
ok(v["kansgroepen"] == 12, "12 kansgroepen gemarkeerd")

tmp = tempfile.mkdtemp(prefix="klantenpanel-selftest-")
try:
    runmap = run(S("new_run.py"), "--naam", "selftest", "--basis", tmp).stdout.strip()
    bib = json.load(open(os.path.join(HERE, "..", "references", "personas.json"), encoding="utf-8"))["personas"]
    kans_ids = [p["id"] for p in bib if p["kansgroep"]]; hoofd_ids = [p["id"] for p in bib if not p["kansgroep"]]
    def kies(n_hoofd, n_kans, seed=1):
        r = random.Random(seed); return r.sample(hoofd_ids, n_hoofd) + r.sample(kans_ids, n_kans)
    for (nh, nk, doel, verwacht) in [(7, 3, 45, 40), (10, 3, 45, 45), (12, 3, 45, 45), (12, 3, 50, 50), (13, 2, 45, 45)]:
        ids = kies(nh, nk)
        run(S("select_personas.py"), "--run", runmap, "--kies", ",".join(ids), "--doelgroep", "test")
        run(S("generate_variants.py"), "--run", runmap, "--doel", str(doel))
        d = json.load(open(os.path.join(runmap, "varianten.json")))
        per = d["aantal_per_persona"]
        ok(d["totaal"] == verwacht, f"{nh + nk} persona's, doel {doel}: {d['totaal']} varianten (verwacht {verwacht})")
        ok(all(3 <= n <= 4 for n in per.values()), f"  3-4 varianten per persona ({sorted(set(per.values()))})")
        ok(all(per[k] >= 3 for k in ids if k in kans_ids), "  minimaal 3 per kansgroep")
        ok(40 <= d["totaal"] <= 50, "  totaal binnen 40-50")
        uniek = all(len({v[f] for v in d["varianten"] if v["persona_id"] == pid}) == per[pid] for pid in ids for f in ["stemming", "tijd_aandacht", "ervaring_categorie", "context"])
        ok(uniek, "  binnen elke persona verschillen stemming, tijd, ervaring en context per variant")
    # herhaalbaarheid
    a1 = open(os.path.join(runmap, "varianten.json")).read()
    run(S("generate_variants.py"), "--run", runmap); a2 = open(os.path.join(runmap, "varianten.json")).read()
    ok(a1 == a2, "zelfde seed geeft identieke varianten")
    run(S("generate_variants.py"), "--run", runmap, "--seed", "7"); a3 = open(os.path.join(runmap, "varianten.json")).read()
    ok(a1 != a3, "andere seed geeft andere varianten")
    run(S("generate_variants.py"), "--run", runmap)
    # --alleen / intensiteit 2
    sel = json.load(open(os.path.join(runmap, "selectie.json")))["personas"]; doel_id = sel[0]["id"]
    voor = {v["variant_id"]: v for v in json.load(open(os.path.join(runmap, "varianten.json")))["varianten"]}
    run(S("generate_variants.py"), "--run", runmap, "--alleen", doel_id, "--intensiteit", "2")
    na = {v["variant_id"]: v for v in json.load(open(os.path.join(runmap, "varianten.json")))["varianten"]}
    ok(all(voor[k] == na[k] for k in voor if not k.startswith(doel_id + "-")), "--alleen laat andere persona's ongemoeid")
    pool = [v for k, v in na.items() if k.startswith(doel_id + "-")]
    ok(pool[0]["stemming"] == "geïrriteerd" and pool[1]["stemming"] == "nieuwsgierig" and pool[0]["intensiteit"] == 2, "intensiteit 2 zet een negatieve en een positieve pool")
    run(S("generate_variants.py"), "--run", runmap)
    # nepreacties
    var = json.load(open(os.path.join(runmap, "varianten.json")))["varianten"]
    os.makedirs(os.path.join(runmap, "ronde-1", "materiaal"), exist_ok=True)
    open(os.path.join(runmap, "ronde-1", "materiaal", "x.md"), "w").write("# Test\nEen testaanbod voor €10 per maand.")
    json.dump({"objecten": [{"id": "x", "titel": "test", "bestand": "ronde-1/materiaal/x.md"}], "context": "test", "vragen_extra": []}, open(os.path.join(runmap, "ronde-1", "opzet.json"), "w"))
    rng = random.Random(3)
    zinnen = ["De prijs springt eruit en dat vind ik veel.", "Ik snap niet wat er precies inbegrepen is.", "Mijn buurman doet dit voor koffie.", "Klinkt handig voor mijn moeder.", "Ik wil eerst weten wie erachter zit.", "Weer een abonnement, nee.", "Als ik kan bellen zou ik het proberen.", "De toon is vriendelijk en duidelijk."]
    def schrijf(ingezakt):
        d = os.path.join(runmap, "ronde-1", "reacties"); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
        for v in var:
            if ingezakt:
                sc = {k: 6 for k in ["begrip", "relevantie", "aantrekkelijkheid", "vertrouwen", "intentie"]}; tekst = "Klinkt goed, handig en betaalbaar, ik zou het zeker proberen want het scheelt tijd."; bez = "prijs"
            else:
                sc = {k: rng.randint(1, 7) for k in ["begrip", "relevantie", "aantrekkelijkheid", "vertrouwen"]}; sc["intentie"] = rng.choice([1, 1, 2, 2, 3, 3, 4, 5, 6])
                tekst = " ".join(rng.sample(zinnen, 3)) + f" {v['variant_id']} {v['stemming']} {v['context']}"; bez = rng.choice(["prijs", "begrip", "vertrouwen", "relevantie", "alternatief"])
            r = {"variant_id": v["variant_id"], "persona_id": v["persona_id"], "ronde": 1, "object": "x", "reactie": tekst, "gedrag": "leest verder", "scores": sc,
                 "bezwaar": "b", "bezwaar_categorie": bez, "trigger": "t", "verbeteridee": "i", "citaat": "c"}
            open(os.path.join(d, v["persona_id"] + ".jsonl"), "a").write(json.dumps(r, ensure_ascii=False) + "\n")
    schrijf(False)
    p = run(S("aggregate_round.py"), "--run", runmap, "--ronde", "1", check=False)
    rj = json.load(open(os.path.join(runmap, "ronde-1", "realisme.json")))
    c = {x["controle"]: x["ok"] for x in rj["controles"]}
    ok(p.returncode in (0, 2) and c["spreiding_binnen_persona"] and c["positiviteit"] and c["volledigheid"], f"gevarieerde nepdata: spreiding/positiviteit/volledigheid OK (status {rj['status']})")
    schrijf(True)
    p = run(S("aggregate_round.py"), "--run", runmap, "--ronde", "1", check=False)
    rj = json.load(open(os.path.join(runmap, "ronde-1", "realisme.json")))
    c = {x["controle"]: x["ok"] for x in rj["controles"]}
    ok(p.returncode == 2 and rj["status"] == "herhalen", "ingezakte nepdata: exitcode 2 en status herhalen")
    ok(not c["spreiding_binnen_persona"] and not c["positiviteit"] and not c["gelijkvormigheid_tussen_personas"] and not c["een_bezwaar_domineert"], "ingezakte nepdata: alle vier inzakcontroles falen")
    ok(len(rj["herhalen_personas"]) == len(sel), "ingezakte nepdata: alle persona's gemarkeerd om te herhalen")
    run(S("build_prompt.py"), "--run", runmap, "--ronde", "1", "--alle")
    ok(len(os.listdir(os.path.join(runmap, "ronde-1", "prompts"))) == len(sel), "build_prompt.py maakt één prompt per persona")
    run(S("segmenten.py"), "--run", runmap, "--ronde", "1", "--segment", f"test={sel[0]['id']},{sel[1]['id']}")
    ok(os.path.exists(os.path.join(runmap, "ronde-1", "segmenten.json")), "segmenten.py schrijft segmenten.json")
finally:
    shutil.rmtree(tmp, ignore_errors=True)
print(f"\n{'ALLES GESLAAGD' if not fails else str(len(fails)) + ' TEST(S) GEFAALD'}")
sys.exit(1 if fails else 0)
