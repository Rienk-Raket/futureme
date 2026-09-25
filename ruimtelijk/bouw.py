#!/usr/bin/env python3
"""Bouwt de hoofd-index.html: de basis-app (basis/index.html) plus de ruimtelijke
laag, HobbySkills en de koppelingen uit src/. Alles blijft één bestand zonder
externe bronnen. Gebruik: python3 ruimtelijk/bouw.py [pad-naar-basis-index.html]"""
import pathlib, sys

HIER = pathlib.Path(__file__).resolve().parent
SRC = HIER / "src"
BRON = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else HIER.parent / "basis" / "index.html"
UIT = HIER.parent / "index.html"
html = BRON.read_text(encoding="utf-8")
lees = lambda naam: (SRC / naam).read_text(encoding="utf-8")


def vervang(oud, nieuw, n=1):
    global html
    k = html.count(oud)
    assert k == n, f"verwacht {n}x maar {k}x gevonden: {oud[:80]!r}"
    html = html.replace(oud, nieuw)


# 1. Opslag: nieuwe winkel (hs_items) vraagt een hogere databaseversie.
vervang('const DB_NAAM = "futureme", DB_VERSIE = 7;', 'const DB_NAAM = "futureme", DB_VERSIE = 8;')

# 2. Views van HobbySkills in de tekenkaart.
vervang('shles: (typeof vwShLes === "function" ? vwShLes : vwStart)',
        'shles: (typeof vwShLes === "function" ? vwShLes : vwStart),\n'
        '    hobbyskills: (typeof vwHobbySkills === "function" ? vwHobbySkills : vwStart),\n'
        '    hobbyskill: (typeof vwHobbySkill === "function" ? vwHobbySkill : vwStart)')

# 3. HobbySkills staat niet in de onderbalk; bereikbaar via Nieuw, Meer, Persoonlijk en het dagoverzicht.

# 4. Iconen: tabicoon en illustratie voor de startscherm-tegel.
ICOON = ('<symbol id="i-hobby" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
         '<path d="M11 3.5l1.9 5.3 5.3 1.9-5.3 1.9L11 17.9l-1.9-5.3-5.3-1.9 5.3-1.9z"/>'
         '<path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></symbol>')
ILL = ('<symbol id="ill-hobby" viewBox="0 0 100 80"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">\n'
       '  <rect x="12" y="50" width="14" height="24" rx="4" fill="currentColor" fill-opacity=".35" stroke-opacity=".7"/>\n'
       '  <rect x="34" y="36" width="14" height="38" rx="4" fill="currentColor" fill-opacity=".5" stroke-opacity=".8"/>\n'
       '  <rect x="56" y="20" width="14" height="54" rx="4" fill="currentColor" fill-opacity=".7" stroke-opacity=".9"/>\n'
       '  <path d="M84 6l2.6 7.4 7.4 2.6-7.4 2.6L84 26l-2.6-7.4L74 16l7.4-2.6z" fill="currentColor" fill-opacity=".95" stroke="none"/>\n'
       '  <path d="M14 30c10-6 20-4 28-12" stroke-opacity=".5"/>\n'
       '</g></symbol>')
vervang('<symbol id="i-ster"', ICOON + '\n<symbol id="i-ster"')
vervang('<symbol id="ill-persoonlijk"', ILL + '\n<symbol id="ill-persoonlijk"')

# 5. Stijl: achteraan in het bestaande <style>-blok.
css = "\n\n" + lees("ruimte.css") + "\n\n" + lees("hobbyskills.css") + "\n"
vervang('</style>\n</head>', css + '</style>\n</head>')

# 6. Scripts: vlak vóór het blok dat start() aanroept.
marker = "/* Alles is geladen — de app kan starten. */"
assert html.count(marker) == 1, "startmarker niet gevonden"
i = html.index(marker)
j = html.rfind("<script>", 0, i)
blokken = "".join(f"<script>\n{lees(naam)}\n</script>\n" for naam in ("ruimte.js", "hobbyskills.js", "koppelingen.js"))
html = html[:j] + blokken + html[j:]

UIT.write_text(html, encoding="utf-8")
print(f"Gebouwd: {UIT} ({len(html.encode('utf-8')) // 1024} KB)")
