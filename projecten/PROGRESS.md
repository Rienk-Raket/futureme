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

### Review fase 2 (verwerkt)
- **Terug:** de terugknop roept zelf `terug()` aan. Terugvegen werkt met één schildwacht in de geschiedenis: is er iets terug te doen (blad dicht, scherm terug), dan komt de schildwacht terug, anders verlaat de volgende veeg de app. Je komt nooit meer per ongeluk buiten de app.
- **Check-in:** een belofte krijgt maar één antwoord, ook bij dubbel tikken.
- **Weekreview:**
  - Op maandag kijkt hij naar de week die net voorbij is (`ptReviewWeek`).
  - Het weekeinde klopt rond de zomertijd.
  - De statuswissel gaat via `statusToepassen`.
  - Elk bezoek begint vers, en getypte tekst blijft bewaard.
- **Focusblok:**
  - De minuten worden meteen gelogd, ook als je het blad wegveegt.
  - Een blok korter dan een minuut wordt niet gelogd.
  - Het blok is echt modaal (de rest is `inert`, en de focus komt terug), en meldingen staan erboven.
  - Er start geen tweede blok over een lopend blok.
  - Het scherm-aan-slot wordt opnieuw gevraagd na wegschakelen.
- **Beloftes van een project dat pauzeert, in de ideeënbak gaat, gearchiveerd of afgerond wordt:** die worden losgelaten, dus geen check-ins meer.
- **Sporen:**
  - Een verwijdering uit een andere export wordt toegepast.
  - Bij het verwijderen van een project wordt de lijst met sporen één keer geschreven.
  - Sporen ouder dan een jaar vallen weg.
- **Service worker:**
  - Een fout van de server (404, 500, de inlogpagina van een wifi) maakt plaats voor de opgeslagen app.
  - Een ontbrekend icoon houdt de installatie niet tegen.
  - Zonder kopie wacht hij op het netwerk.
- **Waarom?:** staat nu ook bij "Weer in beweging" en bij de keuzes na "niet gelukt".
- **Check-ins** verschijnen ook als het moment voorbijgaat terwijl de app openstaat (controle elke minuut).
- **Tests:** `accountability.test.mjs` (6) en `accountability.e2e.cjs` (39).

## Fase 3: profiel en vastloop-hulp

**Nieuwe bestanden:**
- `src/score.js`: de scorekern uit Brain-Mate Nate, ongewijzigd.
- `src/profiel.js`: kennismaking en Mijn aanpak (kern `PT-PROFIEL`).
- `src/vastlopen.js`: Ik loop vast, kiezen, dagniveau, energie, ochtendstart en zachte check-ins (kern `PT-VAST`).
- `bouw.py` zet `kennis/vragenbank.json` en `kennis/scoreweging.json` (dezelfde bestanden als Brain-Mate Nate) als `PT_VRAGENBANK` en `PT_WEGING` in de app. Daarbij wordt gecontroleerd dat er 96 vragen en 7 patronen zijn, en dat er geen totaalscore en geen diagnosekans in zit.

**Kennismaking:**
- Eerst een intro met disclaimer. Daarna 16 kernvragen, elk met 5 antwoorden plus "Niet van toepassing" en "Liever niet".
- Er is een knop Vorige, en je kunt pauzeren en later verdergaan.
- Na de kernvragen volgt automatisch de verdieping, want daar komen de patronen uit. Een tussenstop komt pas als er al patronen zijn.
- Het resultaat is hooguit drie patronen, als metafoor (De Jongleur, De Vonk …), zonder winnaar en zonder diagnose.

**Mijn aanpak:** je patronen, met per patroon wat de app doet, en 8 aanpassingen met een schakelaar. Bij een voorstel staat het label "Voorgesteld", en elke aanpassing heeft een "Waarom?" met bewijsniveau. Niets gaat vanzelf aan.

| Aanpassing | Voor | Wat |
|---|---|---|
| Hooguit 2 projecten tegelijk | P1 | WIP-limiet 2 (uitzetten zet je vorige limiet terug) |
| Nieuwe ideeën eerst in de ideeënbak | P2 | de wizard start in de ideeënbak |
| Korte focusblokken | P2, P7 | een nieuw blok staat op 15 minuten |
| Rustige weergave | P3 | geen beweging |
| Grotere tekst | P4 | zoom 1.13 |
| Zachte check-ins | P5 | alleen "Gedaan" en "Nog niet", geen tellers van wat niet lukte |
| Ochtendstart | P6 | voor 12 uur: welke ene stap doe je vandaag? |
| Kiezen op energie | P7 | laag, midden of hoog, en welke projecten passen |

**Vastloop-hulp:**
- **Ik loop vast** (op de focuskaart en het projectscherm), met 6 keuzes:
  - Onduidelijk of Te groot: een eerste handeling (vastgepind) en een blok van 5 minuten.
  - Saai of Spannend: een blok van 10 minuten.
  - Leeg: 2 minuten of een nieuw moment.
  - Kan niet kiezen: zie hieronder.
  - "Vandaag niet, morgen weer" mag ook.
- **Kiezen tussen projecten** in twee minuten:
  - Drie vragen (zin, energie, dichtst bij klaar) en dan een voorstel, of een munt. De winnaar komt in focus.
- **Dagniveau** Minimum, Standaard of Extra (per dag). Bij Minimum zie je alleen de focus, de check-ins en "Vijf minuten, meer hoeft niet".

**Tests:** `tests/profiel.test.mjs` (6, met de echte vragenbank) en `tests/profiel.e2e.cjs` (25).

### Review fase 3 (verwerkt)
- **Kiezen:** antwoorden worden bewaard als a of b, en pas bij het kiezen omgezet. Wissel je "Tegen", dan wint het juiste project.
- **Kennismaking:**
  - "Af" betekent pas dat er patronen zijn of geen vragen meer (`profielAf`). Na alleen de 16 kernvragen zegt de app "nog niet af" in plaats van "weinig gemelde behoefte", en de uitnodiging blijft staan.
  - De introtekst noemt 20 tot 45 vragen.
  - De tussenstop "Eerste beeld" komt pas als alle open domeinen hun verdiepingsvragen hebben.
  - De focus gaat naar de kop van het nieuwe scherm. Een live-regio op een steeds nieuw element is weggehaald.
- **Zachte check-ins:** twee kolommen (CSS-klasse). "Nog niet" geeft een nieuw moment, zonder "niet gelukt"; de belofte wordt verzet en telt niet mee.
- **Aanpassingen overschrijven je eigen keuzes niet meer:**
  - "Hooguit 2" maakt een strengere limiet niet losser en zet bij uitzetten precies je eigen limiet terug. Wijzig je de limiet zelf, dan gaat de schakelaar uit.
  - "Korte blokken" is een standaard in het focusblok; je eigen gekozen duur blijft bewaard.
  - "Rustige weergave" werkt in `pasInstellingenToe` zonder je instelling te wijzigen.
- **Grotere tekst:** zoomt alleen de inhoud van het blad, niet het blad zelf, zodat het niet meer onder de statusbalk schuift.
- **Ochtendstart:** verdwijnt pas na een belofte van vandaag of "Vandaag niet", niet al als je het blad opent.
- **Ik loop vast:** kijkt eerst of er al een blok loopt, en schrijft dan niets.
- **Waarom?:** staat nu ook bij Energie en Ochtendstart.
- **Minimum:** toont ook "En nog N check-ins".
- **Klein:** de klikafhandeling in bladen gebruikt `onclick`, zodat er geen luisteraars meer opstapelen.
- **Tests:** `profiel.e2e.cjs` (32).
