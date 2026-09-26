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
vervang('const DB_NAAM = "futureme", DB_VERSIE = 7;', 'const DB_NAAM = "futureme", DB_VERSIE = 9;')  # 8: hs_items, 9: wl_items

# 2. Views van HobbySkills in de tekenkaart.
vervang('shles: (typeof vwShLes === "function" ? vwShLes : vwStart)',
        'shles: (typeof vwShLes === "function" ? vwShLes : vwStart),\n'
        '    hobbyskills: (typeof vwHobbySkills === "function" ? vwHobbySkills : vwStart),\n'
        '    hobbyskill: (typeof vwHobbySkill === "function" ? vwHobbySkill : vwStart),\n'
        '    wishlist: (typeof vwWishlist === "function" ? vwWishlist : vwStart),\n'
        '    wens: (typeof vwWens === "function" ? vwWens : vwStart)')

# 3b. Categorieën: terugvallen op "overig" op naam, niet op positie (ruimte voor eigen categorieën).
vervang("(CATEGORIEEN.find(c => c[0] === k) || CATEGORIEEN[6])", '(CATEGORIEEN.find(c => c[0] === k) || CATEGORIEEN.find(c => c[0] === "overig"))', 2)
vervang("(VLCATS.find(c => c[0] === k) || VLCATS[6])", '(VLCATS.find(c => c[0] === k) || VLCATS.find(c => c[0] === "overig"))', 2)

# 3c. Checklists: kopjes tellen niet mee als punt.
vervang('onder = c ? c.items.filter(i => i.af).length + " van " + c.items.length + " af" : "";',
        'onder = c ? c.items.filter(i => i.af && !clSectie(i)).length + " van " + c.items.filter(i => !clSectie(i)).length + " af" : "";')
vervang("if (c.items.length && c.items.every(x => x.af)) {", "if (c.items.some(x => !clSectie(x)) && c.items.every(x => x.af || clSectie(x))) {")

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
CADEAU = ('<symbol id="i-cadeau" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
          '<rect x="3.5" y="8.5" width="17" height="4.5" rx="1.2"/><path d="M5 13v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V13M12 8.5V21"/>'
          '<path d="M12 8.5S10.8 3.5 8 3.5a2.5 2.5 0 0 0 0 5h4zM12 8.5s1.2-5 4-5a2.5 2.5 0 0 1 0 5h-4z"/></symbol>')
vervang('<symbol id="i-ster"', ICOON + '\n' + CADEAU + '\n<symbol id="i-ster"')
ILL_WL = ('<symbol id="ill-wishlist" viewBox="0 0 100 80"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">\n'
          '  <rect x="14" y="36" width="46" height="36" rx="5" fill="currentColor" fill-opacity=".18" stroke-opacity=".8"/>\n'
          '  <rect x="10" y="25" width="54" height="12" rx="4" fill="currentColor" fill-opacity=".4" stroke-opacity=".85"/>\n'
          '  <path d="M37 25v47" stroke-opacity=".7"/>\n'
          '  <path d="M37 25s-3-12-11-12a5.5 5.5 0 0 0 0 11zM37 25s3-12 11-12a5.5 5.5 0 0 1 0 11z" stroke-opacity=".9"/>\n'
          '  <path d="M80 34c-2.5-5-11-5-11 2 0 6 11 12 11 12s11-6 11-12c0-7-8.5-7-11-2z" fill="currentColor" fill-opacity=".92" stroke="none"/>\n'
          '  <path d="M86 6l1.6 4.4L92 12l-4.4 1.6L86 18l-1.6-4.4L80 12l4.4-1.6z" fill="currentColor" fill-opacity=".8" stroke="none"/>\n'
          '</g></symbol>')
vervang('<symbol id="ill-persoonlijk"', ILL + '\n' + ILL_WL + '\n<symbol id="ill-persoonlijk"')

# 5. Stijl: achteraan in het bestaande <style>-blok.
css = "\n\n" + lees("ruimte.css") + "\n\n" + lees("hobbyskills.css") + "\n\n" + lees("sh-tabs.css") + "\n\n" + lees("eigen-categorieen.css") + "\n\n" + lees("fin-vast.css") + "\n\n" + lees("wishlist.css") + "\n\n" + lees("nieuw-rail.css") + "\n\n" + lees("mm-export.css") + "\n"
vervang('</style>\n</head>', css + '</style>\n</head>')

# 6. Scripts: vlak vóór het blok dat start() aanroept.
marker = "/* Alles is geladen — de app kan starten. */"
assert html.count(marker) == 1, "startmarker niet gevonden"
i = html.index(marker)
j = html.rfind("<script>", 0, i)
blokken = "".join(f"<script>\n{lees(naam)}\n</script>\n" for naam in ("sh-theorie.js", "sh-modellen.js", "sh-scrum.js", "sh-dashboard.js", "ruimte.js", "hobbyskills.js", "hs-sjablonen.js", "mm-bron.js", "koppelingen.js", "eigen-categorieen.js", "fin-vast.js", "wishlist.js", "nieuw-rail.js", "mm-export.js"))
html = html[:j] + blokken + html[j:]

UIT.write_text(html, encoding="utf-8")
print(f"Gebouwd: {UIT} ({len(html.encode('utf-8')) // 1024} KB)")
