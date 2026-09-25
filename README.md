# FutureMe

Persoonlijke taken- en logboek-app. Alles in één bestand, geen externe bronnen, alle
gegevens blijven op het toestel (IndexedDB). Zet `index.html` en `sw.js` naast elkaar op
een webserver (of open ze lokaal) en voeg de pagina toe aan je beginscherm.

## Bestanden

| Pad | Wat |
|---|---|
| `index.html` | De basis-app (met herhalingen als reeks en de Side Hustle-module) |
| `sw.js` | Service worker: netwerk eerst, anders de opgeslagen kopie |
| `ruimtelijk/index.html` | **Kopie van de app met de ruimtelijke interface, het HobbySkills-tabblad en de logischere koppelingen tussen schermen** |
| `ruimtelijk/sw.js` | Service worker voor die kopie (eigen cachenaam) |
| `ruimtelijk/src/` | De toegevoegde lagen als losse bronbestanden: `ruimte.css/js` (glas, diepte, overgangen), `hobbyskills.css/js` (nieuw tabblad), `koppelingen.js` (Verder naar, gegroepeerd Meer-scherm, widgets) |
| `ruimtelijk/bouw.py` | Bouwt `ruimtelijk/index.html` uit `index.html` + `src/` |
| `docs/ruimtelijke-interface-prompt.md` | De aangescherpte ontwerpprompt, toegespitst op FutureMe |

## Ruimtelijke kopie opnieuw bouwen

```
python3 ruimtelijk/bouw.py
```

De laag zit ook als instelling in de app: Instellingen → Weergave → **Ruimtelijke
interface** (standaard aan, automatisch uit bij de prikkelarme modus en bij
`prefers-reduced-motion`). De databaseversie van de kopie is 8 (nieuwe winkel `hs_items`);
een back-up uit de basis-app is gewoon te importeren.
