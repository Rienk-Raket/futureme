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

### Review fase 1 (verwerkt)
- **Import:** wordt eerst helemaal gecontroleerd. Een kapot bestand verandert niets, ook niet bij Vervangen. Verwijderde items krijgen een spoor (`weg`), zodat samenvoegen met een oude export ze niet terugbrengt. Bij Vervangen staat het advies om eerst te exporteren.
- **Draad** telt kalenderdagen, dus nooit meer 15/14.
- **Status:** één helper (`statusToepassen`) voor alle statuswissels. `afgerondOp` en focus kloppen altijd, ook via "Toch actief" en via pauzeren bij de WIP-keuze.
- **Stappen:**
  - Ongedaan zet alle stappen terug die je in de laatste seconden verwijderd hebt.
  - "Stap klaar" zet altijd op af en is beschermd tegen dubbel tikken.
- **Wizard:** per ongeluk dichtgetikt? Dan ga je verder waar je was, met "Opnieuw beginnen" als keuze.
- **Toegankelijkheid:**
  - Het dichte onderblad staat uit de tabvolgorde. Achter een open blad is alles `inert`, en de focus gaat terug naar de knop waarmee je het blad opende.
  - Licht thema: donkere tekst op de neonfase en donkerder projectkleur als tekst. `--vaag` voldoet aan contrast AA.
- **Radar:** hooguit 8 projecten plus "+N", een ruimere viewBox, en labels aan de onderkant naar binnen.
- **Waarom?:** staat nu bij de focuszin (stil of koelt af) en bij de WIP-keuze. De staptip noemt het bewijs, de wacht-toast is neutraal, en de lege mijlpalen zijn een neutrale regel.
- **PWA:**
  - Een echte `manifest.webmanifest` en PNG-iconen van 180 en 512 px, voor het iPhone-beginscherm.
  - De service worker wacht hooguit 3 seconden op het netwerk en bewaart alleen goede antwoorden.
- **Kleiner:**
  - Geen deadline-alarm voor ideeën en gepauzeerde projecten.
  - De werkwoordcheck kent ga, doe, neem en kijk; één los woord is te kaal.
  - Terugvegen in Safari gaat een scherm terug.
  - Opslag wordt vastgehouden (`storage.persist`), en er is een back-upherinnering na 14 dagen zonder export.

## Fase 2: accountability

`src/accountability.js` (de pure kern zit tussen `PT-ACC-BEGIN` en `PT-ACC-EINDE`). DB-versie 2 voegt de winkel `beloftes` toe.
- **Belofte:** "wat doe je, wanneer check ik bij je in". Vandaag, morgen of een andere dag, met een tijd. Staat voorgevuld met de volgende stap.
- **Check-in** bovenaan het Commandocentrum zodra het moment voorbij is.
  - **Gedaan:** de gekoppelde stap gaat af en er komt een winst in de log.
  - **Half:** "Rest beloven".
  - **Niet:** "geen oordeel". Je kiest eventueel een reden (te groot, geen tijd, vergeten, geen zin, onduidelijk, anders) en daarna kleiner maken, een nieuw moment of loslaten.
  - Een terugkerende reden geeft een tip in de weekreview.
- **Focusblok** van 5–60 minuten op een stap:
  - Timer op het hele scherm, met pauze, +5 minuten en klaar. Het scherm blijft aan (wake lock) en een lopend blok overleeft herladen.
  - Na het blok: "Wat deed je?" en eventueel "Stap klaar", daarna wordt het blok gelogd.
- **Weer in beweging:** voor projecten die afkoelen of stil liggen, één tik op "5 minuten aan X".
- **Weekreview:**
  - Tellers: gewerkt, stappen, beloftes, dagen.
  - Een patroon uit je check-ins.
  - Per project kies je door, pauze of ideeënbak, plus "Wat neem je mee?".
  - Van vrijdag tot maandag staat er een kaart op het Commandocentrum tot je de weekreview hebt gedaan.
- **Mijlpaal gehaald:** kort terugkijken; overslaan mag.

**Tests:**
- `tests/kern.test.mjs` (14) en `tests/accountability.test.mjs` (5).
- `tests/app.e2e.cjs` (42) en `tests/accountability.e2e.cjs` (28).
