#!/usr/bin/env python3
"""Maakt een runmap aan voor één klantenpanel-run.

Gebruik:  python3 scripts/new_run.py --naam "landingspagina zorgeloos thuis" [--basis klantenpanel-runs] [--seed 42]
Maakt:    <basis>/<YYYY-MM-DD>-<slug>/ met run.json, intake.md (leeg sjabloon), materiaal/, ronde-1..4/reacties/
Print het pad van de runmap. Bestaat de map al, dan wordt hij hergebruikt.
"""
import argparse, datetime, json, os, re, sys

def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:40] or "run"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--naam", required=True, help="korte naam van wat er getest wordt")
    ap.add_argument("--basis", default="klantenpanel-runs", help="map waarin runs komen (standaard: ./klantenpanel-runs)")
    ap.add_argument("--seed", type=int, default=42, help="vaste seed voor de variantgeneratie")
    ap.add_argument("--datum", default=datetime.date.today().isoformat())
    a = ap.parse_args()
    pad = os.path.join(a.basis, f"{a.datum}-{slug(a.naam)}")
    for sub in ["materiaal"] + [f"ronde-{i}/reacties" for i in range(1, 5)] + [f"ronde-{i}/prompts" for i in range(1, 5)]:
        os.makedirs(os.path.join(pad, sub), exist_ok=True)
    rj = os.path.join(pad, "run.json")
    if not os.path.exists(rj):
        json.dump({"naam": a.naam, "datum": a.datum, "seed": a.seed, "status": "intake", "rondes_klaar": []}, open(rj, "w"), ensure_ascii=False, indent=1)
    im = os.path.join(pad, "intake.md")
    if not os.path.exists(im):
        open(im, "w").write("# Intake\n\n## Wat wordt getest\n\n## Doelgroep\n\n## Beslissing die de gebruiker wil nemen\n\n## Markt\nNederland\n\n## Aantal concepten in het eindrapport\n3\n\n## Stoppen per ronde?\nnee\n\n## Aangeleverd materiaal\n- materiaal/...\n")
    print(pad)

if __name__ == "__main__":
    main()
