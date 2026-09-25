# FutureMe

Persoonlijke taken- en logboek-app. Alles in één bestand, geen externe bronnen, alle
gegevens blijven op het toestel (IndexedDB). Zet `index.html` en `sw.js` naast elkaar op
een webserver (of open ze lokaal) en voeg de pagina toe aan je beginscherm.

## Bestanden

| Pad | Wat |
|---|---|
| `index.html` | **De app**: basis plus de ruimtelijke interface, HobbySkills en de logischere koppelingen tussen schermen |
| `sw.js` | Service worker: netwerk eerst, anders de opgeslagen kopie |
| `basis/index.html` | De basis-app zonder de toegevoegde lagen (bron voor het bouwscript) |
| `ruimtelijk/src/` | De toegevoegde lagen als losse bronbestanden: `ruimte.css/js` (glas, diepte, overgangen), `hobbyskills.css/js` (HobbySkills), `hs-sjablonen.js` (checklist-sjablonen per soort hobby of skill), `mm-bron.js` (hobby's, skills en side hustles als mindmap, met synchroon afvinken), `koppelingen.js` (Verder naar, gegroepeerd Meer-scherm, widgets, scrollpositie van filterbalken), en voor Side Hustle `sh-theorie.js`, `sh-modellen.js`, `sh-scrum.js`, `sh-dashboard.js` en `sh-tabs.css` (de vier tabbladen Theorie, Modellen, SCRUM en Dashboard) |
| `ruimtelijk/bouw.py` | Bouwt `index.html` uit `basis/index.html` + `src/` |
| `docs/ruimtelijke-interface-prompt.md` | De aangescherpte ontwerpprompt, toegespitst op FutureMe |

## Opnieuw bouwen na een wijziging in `basis/` of `src/`

```
python3 ruimtelijk/bouw.py
```

De laag zit ook als instelling in de app: Instellingen → Weergave → **Ruimtelijke
interface** (standaard aan, automatisch uit bij de prikkelarme modus en bij
`prefers-reduced-motion`). De databaseversie is 8 (nieuwe winkel `hs_items`);
een back-up uit de basis-app is gewoon te importeren.
