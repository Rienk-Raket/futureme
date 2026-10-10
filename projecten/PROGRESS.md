# FutureMe Projecten — voortgang

## Fase 1: fundament (10 oktober 2026)

**Bestanden:**
- `src/kern.js`: pure functies (fases, voortgang, gezondheid, filter, cluster, sorteren, draad, WIP, werkwoordcheck).
- `src/db.js`: IndexedDB, export en import.
- `src/app.js`: navigatie, onderblad, meldingen.
- `src/schermen.js`: de schermen.
- `src/acties.js`: wizard, loggen, status, stappen, mijlpalen, instellingen.
- `src/stijl.css`, `src/schil.html`.
- `bouw.py` maakt `index.html`; `sw.js` zorgt voor offline.

**Wat er werkt:**
- **Commandocentrum**:
  - Focusproject met voortgangsring, gezondheid, statuszin, en de knoppen "Stap klaar" en "Loggen".
  - Vier tellers: actief/limiet, deze week, dagen draad, af dit jaar.
  - Radar met de actieve projecten op gezondheid (binnen op koers, buiten stil).
  - "Vraagt aandacht", de WIP-waarschuwing en de ideeënbak.
- **Wizard** in 4 stappen:
  1. Titel en waarom.
  2. Wanneer is het klaar?
  3. Eerste handeling, met werkwoordcheck en voorbeelden.
  4. Cluster, tags, energie, deadline, kleur, en Actief of Ideeënbak. Bij een volle WIP krijg je een hint.
- **Project**:
  - Fasebalk A–G (tik om te wisselen; elke wissel wordt gelogd) en de vraag van de fase.
  - Waarom en Klaar als.
  - Stappen: afvinken logt een winst; vastpinnen, omhoog, verwijderen met Ongedaan.
  - Mijlpalen, de log, statusknoppen, bewerken en verwijderen.
- **Afronden** met drie korte evaluatievragen (mag leeg), plus een feestje. Bij Minder beweging is het feestje uit.
- **WIP-limiet** (standaard 3): bij een volgend actief project kies je wat er pauzeert, of je maakt het toch actief.
- **Projecten**: zoeken (zonder accenten), filter op status, groeperen (fase, status, cluster, energie, deadline, geen), sorteren, en chips voor cluster en tag.
- **Log**: tijdlijn per dag met filter op soort. **Archief**: afgerond en gearchiveerd.
- **Meer**: thema (donker, licht, systeem), beweging, WIP-limiet, export en import (samenvoegen of vervangen).

**Tests:** `node --test tests/kern.test.mjs` (11) en `tests/app.e2e.cjs` (37, met schermafbeeldingen).
