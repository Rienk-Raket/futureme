# PLAN — Keuzemachine (sectie 82)

Status: **wacht op akkoord**. Nog niets gebouwd.

## 1. Wat de verkenning liet zien (en waar de spec afwijkt van de huidige app)

| Spec zegt | Werkelijkheid nu | Gevolg |
| --- | --- | --- |
| `DB_VERSIE` 9 → 10 | De app staat op **13** (10 Anker, 11 Voortgang, 12 Huishouden, 13 Lijstjes) | Keuzemachine wordt **13 → 14**. Upgrade-test vanaf v9 (zoals gevraagd) én vanaf v13 (jouw telefoon) |
| index.html ≈ 21.700 regels, met de hand bewerkt | `index.html` wordt gebouwd door `ruimtelijk/bouw.py` uit `basis/index.html` + `ruimtelijk/src/*` | Module komt als `ruimtelijk/src/keuzemachine.js` + `.css`; bouw.py voegt het script-blok in. Dat is de bestaande werkwijze, geen nieuwe build-stap |
| Sectie 67 | Laatste sectie is 81 (Lijstjes) | Wordt **sectie 82** |
| `docs/keuzemachine-spec.md`, `tests/fixtures/index-v9.html` | Bestaan nog niet | Spec-bijlage wordt `docs/keuzemachine-spec.md`; fixture = `git show babdc57:index.html` (laatste build met `DB_VERSIE = 9`) |

Inhaakpunten (allemaal via het bestaande patroon van HobbySkills, Wishlist en Lijstjes):
- **Opslag**: `WINKELS.km_profielen = "id"`, `WINKELS.km_dilemmas = "id"`, `S.* = S.* || []`. `start()`, back-up, import en "Wis alles" lopen al over `Object.keys(WINKELS)`, dus de winkels gaan vanzelf mee.
- **Koppen**: `Object.defineProperty(KOPPEN, "keuze" | "keuzetest" | "keuzedilemma" | "keuzetheorie", …)`.
- **View-map in `teken()`**: vier regels erbij in de `vervang('shles: …')` van bouw.py.
- **Meer**: `vwMeer` omwikkelen; twee kaarten na HobbySkills in de groep "Doen en groeien".
- **Tikken**: eigen `document.addEventListener("click")` met `[data-act^='km-']` en één `switch`.
- **Verder naar**: `VERWANT.keuze` en `VERWANT.keuzetheorie` naar elkaar (+ `VERWANT_ICO`).
- **Taak bij "Nog niet"**: `maakTaakUitTekst(tekst, { datum })`. Die taak verschijnt in Vandaag of Komend.
- **Nazorg na 2 dagen**: de Inbox heeft geen "vanaf"-veld. Ik gebruik het patroon van Side Hustle (`shOnderhoud`): een dagelijkse controle bij start en bij dagwissel maakt via `meldingMaak({ actieView: "keuzedilemma", actieParam: id })` de melding zodra 2 dagen voorbij zijn, en onthoudt in een `km_`-sleutel welke al gemaakt zijn. Er verandert niets aan de Inbox zelf.
- **Export**: `exportJSON` neemt **alle** `instellingen` mee, dus een `km_sleutel` zou in de back-up belanden.

## 2. Bestaande regels die ik aanraak

1. `ruimtelijk/bouw.py`
   - `DB_VERSIE = 13` → `14`
   - vier regels in de view-map
   - nieuwe iconen en illustratie (zelfde plek als Lijstjes)
   - `keuzemachine.css` in de CSS-lijst
   - `keuzemachine.js` in de scriptlijst, na `lijstjes.js`

   Alleen de eerste twee veranderen bestaand gedrag. De rest is toevoegen, precies zoals bij Lijstjes.
2. Geen enkele regel in `basis/index.html` of in bestaande `src/`-bestanden.

**Hiervoor heb ik je akkoord nodig (buiten de twee genoemde plekken):**

- **A. Sleutel buiten de back-up.** Ik stel voor dat de module `exportJSON` en `importJSON` omwikkelt, net zoals andere modules `vwMeer` omwikkelen.
  - Bij export haalt de wrapper `km_sleutel` tijdelijk uit `S.instellingen` en zet hem daarna terug.
  - Bij import blijft de huidige sleutel staan; een `km_sleutel` in het bestand wordt genegeerd.

  Zonder zo'n omwikkeling kan de eis "sleutel nooit in back-up" niet waar worden. De base-code zelf blijft onaangeroerd.
- **B. "Instellingen → Keuzemachine".** Dit komt er door `vwInstellingen` te omwikkelen met een extra sectie (AI-laag, sleutel, "Sleutel wissen"). Het alternatief is een instellingenblad binnen de Keuzemachine zelf, dan raak ik Instellingen niet aan.
- **C. Open beslissingen uit de spec.** Mijn voorstel, tenzij je anders zegt:
  - AI-laag: wel in v1, standaard uit, als laatste gebouwd.
  - Model: `claude-opus-5-5`, effort `low`.
  - Tegel op Nieuw: **nee**, alleen via Meer, zoals de spec het nu beschrijft.
  - "Test opnieuw doen": na 90 dagen aangeboden.
  - Type-namen: blijven zoals ze zijn.

## 3. Waar het nieuwe blok komt

- `ruimtelijk/src/keuzemachine.js`, een eigen `<script>`-blok na `lijstjes.js` en vóór het blok dat `start()` aanroept. De opbouw binnen het bestand:
  1. data (`KM_VRAGEN`, `KM_ROUTES`, `KM_TEKSTEN`, `KM_THEORIE`, `KM_GEVOELIG`, `KM_BADGES`)
  2. rekenkern: `kmScore`, `kmBudget`, `kmAdvies`, `kmVeiligheid` en de XP- en level-functies, allemaal zonder DOM of opslag. Het blok staat tussen `/* KM-KERN-BEGIN */` en `/* KM-KERN-EINDE */`, zodat de Node-test het uit de gebouwde `index.html` kan knippen.
  3. opslag
  4. views
  5. band
  6. munt-test
  7. koppelingen
  8. AI-laag
- `ruimtelijk/src/keuzemachine.css` gebruikt alleen app-tokens (`--card`, `--card2`, `--accent`, `--purple`, `--green`, `--amber`, `--red`, `--red-soft`, `--radius`, `--tap`, `--t`, `--shadow`) en valt onder de "Vermijden"-lijst.
- De theorieteksten komen uit het bijgevoegde literatuurrapport, ingekort tot 3–5 alinea's per hoofdstuk. Diagnosewoorden staan alleen op de theoriepagina.

## 4. Takenlijst (werk ik bij tijdens het bouwen)

- [ ] 0. `docs/keuzemachine-spec.md` en `tests/fixtures/index-v9.html` klaarzetten
- [ ] 1. Data-constanten (25 vragen, 7 routes, tekstbank, theorie, gevoelige woorden, badges, levels)
- [ ] 2. Rekenkern als pure functies
- [ ] 3. `tests/keuzemachine.test.mjs`, groen, met:
  - 7 routeprofielen
  - gemengd, laag en een gelijke stand
  - 9 budgetcellen en een eerdere deadline
  - de adviesregels (gewichten, 0 → terugdraaien, anders gelijk)
  - de veiligheidswoorden (blokkeren en disclaimer)
- [ ] 4. Opslag (`km_profielen`, `km_dilemmas`, DB 14, `kmBewaarProfiel`, `kmBewaarDilemma`)
- [ ] 5. Views: `keuze` (profiel, nieuw dilemma, open/besloten, XP), `keuzetest` (intro, vraag, hervatten, profielkaart), `keuzedilemma` (invoer A/B, checks, uitkomst, besluit, nazorg), `keuzetheorie` (lijst, lezen, gelezen)
- [ ] 6. Lopende band (SVG, ±4,4 s, overslaan, reduced motion, 2 s bij de tweede keer), munt-test, haptiek
- [ ] 7. Koppelingen: Meer, Verder naar, taak bij "Nog niet", nazorgmelding, XP, badges en reeks, plus A en B hierboven (na akkoord)
- [ ] 8. AI-laag achter `km_ai.aan = false`:
  - de veiligheid draait altijd eerst
  - time-out na 8 s, terugvallen op de lokale uitkomst
  - de sleutel komt niet in de back-up
- [ ] 9. Playwright-test:
  - upgrade v9 → 14 en v13 → 14 met aantallen per winkel
  - back-up-roundtrip in een schone browser
  - zoeken op de testsleutel in de export
  - geen console-fouten in de 4 views
  - de flows
- [ ] 10. Schermafbeeldingen van testvraag, profielkaart, invoer A/B, band halverwege, uitkomstkaart en theoriehoofdstuk, op 390×844 en 360×740, licht en donker (24 stuks). Zelf nakijken en herstellen.
- [ ] 11. Subagent in schone context legt de diff naast de spec; gaten oplossen
- [ ] 12. Regressie op de bestaande suites, README, commit en push (branch en main)
