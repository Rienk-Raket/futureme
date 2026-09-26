---
name: klantenpanel
description: "Synthetisch test- en klantenpanel voor Nederlandse ondernemers: laat 40-50 gesimuleerde panelleden (varianten van 10-15 persona's uit een bibliotheek van 60 met CBS-gewichten) in vier rondes reageren op een idee, product, dienst, tekst, prijs, website, landingspagina, naam, advertentie of campagne, en lever drie (of vijf) verbeterde concepten met segmentanalyse en een eerlijke betrouwbaarheidsparagraaf. Gebruik deze skill zodra iemand feedback, een toets, een panel, een pretest, een 'wat vinden klanten hiervan', een doelgroepcheck, een prijstest of 'test dit even voor mij' vraagt op zakelijk materiaal, ook als het woord klantenpanel niet valt en ook bij één losse tekst of één prijs. Niet voor B2B-inkoopcommissies, echte enquêtes of juridische toetsing."
---

# Klantenpanel: synthetisch test- en klantenpanel

Deze skill simuleert een klantenpanel: een groep fictieve Nederlanders die in vier rondes steeds scherper reageert op materiaal van de gebruiker, zodat die kan kiezen welke richting hij verder uitwerkt en wat hij daarna bij echte klanten toetst. Het panel is richtinggevend: het vindt blinde vlekken, bezwaren en kansen. Het meet niets. Zeg dat eerlijk in het rapport en in het gesprek. Praat Nederlands met de gebruiker, in gewone taal; leg vaktermen (Van Westendorp, gewogen) in één zin uit als ze voor het eerst vallen.

Kernkeuze: **rekenwerk in scripts, oordeel in het model.** Varianten genereren, verdelen, scores aggregeren, spreiding en segmentverschillen berekenen en realisme controleren gebeurt met de scripts in `scripts/`; dat is herhaalbaar en controleerbaar. Het model doet alleen wat een model kan: reageren als een panellid (in subagents) en de rondes synthetiseren tot verbeteringen en concepten (jij, de orkestrator).

## Bestanden

| Pad | Gebruik |
|---|---|
| `references/personas.json` | 60 persona's met bevolkingsgewicht (som 100%), 12 kansgroepen. Schema: `references/personas-schema.md`. Bronnen: `references/bronnen.md`. |
| `references/rondes.json` | Vragen, scorevelden en vaste keuzelijsten per ronde. Toelichting en volgorde: `references/rondes.md`. |
| `references/subagent-prompt.md` | Sjabloon voor de persona-subagent; `build_prompt.py` vult het. |
| `references/rapport-template.md` | Vaste opbouw van het eindrapport. |
| `scripts/new_run.py` | Runmap aanmaken. |
| `scripts/select_personas.py` | Persona's bekijken (`--lijst`, `--tags`) en de selectie vastleggen. |
| `scripts/generate_variants.py` | 3-4 varianten per persona met vaste seed; `--alleen` en `--intensiteit 2` voor herhaling. |
| `scripts/build_prompt.py` | Subagent-opdracht per persona en ronde. |
| `scripts/aggregate_round.py` | Aggregatie (gewogen en ongewogen), Van Westendorp, voorkeuren, realisme-controles. Exitcode 2 = herhalen. |
| `scripts/validate_personas.py` | Alleen nodig als je de bibliotheek aanpast. |

Alle scripts zijn pure Python 3, zonder externe pakketten. Roep ze aan met een absoluut pad naar de skillmap. Alles wat een run produceert staat in één runmap (standaard `./klantenpanel-runs/<datum>-<naam>/`), zodat het eindrapport herleidbaar is tot losse panelreacties en een run later vergeleken kan worden.

## Werkwijze in het kort

1. Intake in één beurt; maak de runmap.
2. Kies 10-15 persona's (2-3 kansgroepen, waar zinvol een aangrenzende), toon ze met gewicht en reden, laat bijsturen.
3. Genereer varianten (40-50 panelleden) met het script.
4. Vier rondes: per ronde materiaal klaarzetten, subagents parallel laten reageren, aggregeren, realisme controleren (zo nodig herhalen), samenvatten, verbeteren, door.
5. Eindrapport met drie (of vijf) concepten, aanbeveling en betrouwbaarheidsparagraaf.

Meld bij elke mijlpaal kort wat er gebeurd is (selectie klaar, ronde 1 klaar met de kern van de uitkomst, enzovoort) zodat de gebruiker kan meelezen. Ga daarna door zonder op toestemming te wachten, tenzij de gebruiker bij de intake vroeg om per ronde te stoppen.

## Stap 1: Intake

Lees eerst wat de gebruiker heeft aangeleverd (tekst, bestand, link, afbeelding, beschrijving). Haal daaruit wat je kunt: wat het is, voor wie het lijkt bedoeld, welke prijs of eenheid erin staat, welk kanaal. Vraag daarna **in één beurt** alleen wat je niet kunt afleiden:

- Wat wordt getest en in welke vorm zien klanten het (landingspagina, folder, advertentie, gesprek)?
- Voor welke doelgroep of welk soort klant? Weet de gebruiker het niet, stel dan zelf een doelgroep voor op basis van het materiaal en laat die bevestigen.
- Welke beslissing wil de gebruiker met de uitkomst nemen (lanceren of niet, welke prijs, welke versie, welk kanaal)? Dit bepaalt waar het panel op moet letten en hoe het rapport eindigt.
- Markt (standaard Nederland; de bibliotheek is Nederlands).
- Drie of vijf concepten in het eindrapport (standaard drie), en of de gebruiker per ronde wil stoppen (standaard niet).

Maak de runmap en leg de antwoorden vast:

```bash
RUN=$(python3 <skill>/scripts/new_run.py --naam "korte naam")   # print het pad
```

Schrijf de intake in `$RUN/intake.md` en zet het materiaal als tekst in `$RUN/materiaal/` (bij een link: de opgehaalde tekst; bij een afbeelding: een precieze beschrijving van wat erop staat, inclusief letterlijke teksten; bij een bestand: de inhoud). De subagents krijgen alleen die tekstversie te zien, dus wees volledig.

## Stap 2: Persona's selecteren

Bekijk de bibliotheek compact en kies:

```bash
python3 <skill>/scripts/select_personas.py --lijst                 # alle 60
python3 <skill>/scripts/select_personas.py --lijst --tags gezin,krap  # filter op tags
```

Kies 10 tot 15 persona's zodat het beeld **binnen** de doelgroep compleet is (verschillende leeftijden, inkomens, opleidingen, regio's, beslisstijlen en digitale vaardigheid binnen die doelgroep) en er zicht is op groepen **net buiten** de doelgroep: neem 2 tot 3 kansgroepen (`K01`-`K12`) die voor dit materiaal iets kunnen blootleggen (een taalbarrière bij een tekst, opzegbaarheid bij een abonnement, toegankelijkheid bij een app, beslisser-is-niet-gebruiker bij een dienst voor ouderen) en waar zinvol één aangrenzende persona die de gebruiker niet als klant ziet maar die wel met het aanbod in aanraking komt. Neem geen persona op alleen omdat het gewicht groot is; neem hem op omdat hij een ander soort reactie kan geven.

Leg de selectie vast met een reden per persona en toon de tabel aan de gebruiker:

```bash
python3 <skill>/scripts/select_personas.py --run $RUN --doelgroep "..." \
  --kies P06,P13,...,K06,K10 --aangrenzend P30 --redenen redenen.json
```

Laat de gebruiker bijsturen (wisselen, toevoegen, schrappen) voordat het panel draait. Bij geen reactie binnen dezelfde beurt in een autonome run: ga door met je eigen selectie en zeg dat.

## Stap 3: Varianten

```bash
python3 <skill>/scripts/generate_variants.py --run $RUN     # seed uit run.json (standaard 42)
```

Het script maakt 3 tot 4 varianten per persona (grotere groepen 4, kansgroepen minimaal 3) en komt uit op 40-50 panelleden. Elke variant is dezelfde persoon op een andere dag: stemming, tijd en aandacht, ervaring in de categorie, budgetdruk deze maand, scepsis, gevoeligheid voor sociale bewijskracht, context van het moment en een waarde-accent. Dat aantal is bewust klein: bij kwalitatief onderzoek komen de meeste thema's boven na 12 tot 30 gesprekken, en meer synthetische varianten uit hetzelfde model voegen vooral schijnprecisie toe. Wijzig `--doel` alleen als de gebruiker daar reden voor geeft.

## Stap 4: De vier rondes

Elke ronde bouwt op de vorige. De volgorde en de reden staan in `references/rondes.md`; de vragen komen uit `references/rondes.json` en hoeven niet overgetypt te worden.

| Ronde | Wat het panel ziet | Wat jij daarna maakt |
|---|---|---|
| 1 Eerste indruk en begrip | het origineel | `v1`: één verbeterde versie die de begripsproblemen oplost |
| 2 Waarde, prijs en bezwaren | `v1` | twee tot drie duidelijk verschillende versies `A`, `B`, `C` (verschillende richting, niet drie keer dezelfde tekst) |
| 3 Verbeterde versies vergelijken | origineel, `v1`, `A`, `B`, `C` | drie (of vijf) kandidaat-concepten, elk met prijs en propositie |
| 4 Eindtoets van de concepten | de concepten | het eindrapport |

Per ronde:

1. **Materiaal en opzet.** Zet elke versie als eigen bestand in `$RUN/ronde-N/materiaal/` en schrijf `$RUN/ronde-N/opzet.json`:
   ```json
   {"objecten": [{"id": "origineel", "titel": "Landingspagina", "bestand": "ronde-1/materiaal/origineel.md"}],
    "context": "Wat de panelleden verder moeten weten: kanaal, eenheid voor de prijs (per maand, per keer), plaats, wat de opdrachtgever wil beslissen.",
    "vragen_extra": []}
   ```
   Object-ids kort en zonder spaties (`origineel`, `v1`, `A`, `concept-1`). Zet in `context` de prijseenheid voor ronde 2, anders zijn de Van Westendorp-antwoorden onvergelijkbaar.
2. **Prompts bouwen.** `python3 <skill>/scripts/build_prompt.py --run $RUN --ronde N --alle` schrijft per persona `ronde-N/prompts/<id>.md`.
3. **Subagents starten, allemaal in dezelfde beurt.** Eén subagent per persona (`general-purpose`, op de achtergrond), met als volledige opdracht: "Lees `<absoluut pad>/ronde-N/prompts/<id>.md` en voer de opdracht daarin uit. Schrijf alleen het gevraagde JSONL-bestand." Wacht op de meldingen; start de subagents niet één voor één en vat de prompt niet samen in de opdracht. Verwijder vóór een herhaling het oude `ronde-N/reacties/<id>.jsonl` van die persona.
4. **Aggregeren en realisme controleren.** `python3 <skill>/scripts/aggregate_round.py --run $RUN --ronde N` schrijft `aggregatie.json`, `aggregatie.md` en `realisme.json` en print de samenvatting. Exitcode 2 betekent: de batch is ingezakt naar het gemiddelde (zie "Realisme bewaken"); herhaal de genoemde persona's met sterkere variantkenmerken en aggregeer opnieuw. Meld de gebruiker dat dit gebeurd is.
5. **Samenvatten en verbeteren.** Schrijf `$RUN/ronde-N/samenvatting.md`: wat het panel vond (gewogen én per persona, met verwijzing naar variant-ids en citaten), welke bezwaren en triggers terugkwamen, wat kansgroepen zagen wat de hoofdgroepen misten, en welke aanpassingen de volgende ronde test en waarom. Geef de gebruiker die samenvatting in hooguit 10 regels en ga door.

Lees bij het verbeteren de losse reacties (`ronde-N/reacties/*.jsonl` of de citaten in `aggregatie.md`), niet alleen de gemiddelden: de bruikbare verbeterideeën staan in de tekst. Verschillende versies in ronde 2 en 3 moeten in richting verschillen (andere belofte, ander prijsmodel, andere doelgroep of ander instapmoment), niet in woordkeus. Een concept in ronde 4 heeft een naam, een propositie in twee zinnen, een prijs en een eerste kanaal.

## Stap 5: Eindrapport

Schrijf `$RUN/eindrapport.md` volgens `references/rapport-template.md` en geef de gebruiker het pad en de kern in het gesprek. Regels die het rapport bruikbaar maken:

- Elke bewering over een segment verwijst naar cijfers uit `aggregatie.json` (gewogen én ongewogen) of naar variant-ids en citaten. Schrijf niet "ouderen haken af" maar "de drie 75-plus-persona's scoren intentie 1,7 tot 2,5 (ronde 4, concept 2); P45-b: '...'."
- Per concept: wat er anders is dan het origineel en waarom, sterkste en zwakste segmenten (gewogen naar bevolking én ongewogen per persona), gevaren en bezwaren, kansen (ook uit kansgroepen), representatieve citaten, en wat de gebruiker als volgende stap bij echte mensen moet toetsen.
- Sluit af met een aanbeveling (welk concept, voor wie, tegen welke prijs, eerste stap) en een betrouwbaarheidsparagraaf die zegt wat een synthetisch panel wel en niet kan: het vindt begripsproblemen, bezwaren, taal- en toegankelijkheidsdrempels en kansen; het voorspelt geen conversie, geen marktaandeel en geen betalingsbereidheid in euro's, en alle panelleden komen uit hetzelfde model en dezelfde persona-tekst.

## Realisme bewaken

Taalmodellen die direct om cijfers gevraagd worden geven onrealistisch gelijkvormige en te positieve scores. Daarom reageert elke variant eerst in eigen woorden en scoort pas daarna, en daarom draaien na elke ronde vier controles (`aggregate_round.py`):

| Controle | Signaal van inzakken | Drempel |
|---|---|---|
| spreiding_binnen_persona | varianten van één persona geven (bijna) dezelfde intentie | meer dan de helft van de persona's heeft std < 0,5 |
| positiviteit | vrijwel iedereen zou het gebruiken of kopen | gewogen aandeel intentie 5-7 boven 65% bij alle objecten; of gemiddeld begrip boven 6,3 |
| gelijkvormigheid_tussen_personas | varianten van verschillende persona's zeggen hetzelfde | meer dan 5% van de paren met woordoverlap ≥ 0,35; of één bezwaar-categorie boven 70% |
| volledigheid | ontbrekende, dubbele of ongeldige regels | 0 |

Bij status `herhalen`:

```bash
python3 <skill>/scripts/generate_variants.py --run $RUN --alleen P39,P45 --intensiteit 2
python3 <skill>/scripts/build_prompt.py --run $RUN --ronde N --alle
rm $RUN/ronde-N/reacties/P39.jsonl $RUN/ronde-N/reacties/P45.jsonl   # dan die subagents opnieuw
python3 <skill>/scripts/aggregate_round.py --run $RUN --ronde N
```

Intensiteit 2 zet per persona één variant op de negatieve en één op de positieve pool en vergroot de verschillen in scepsis en budgetdruk. Herhaal hooguit twee keer; blijft de controle falen, meld dat dan in de samenvatting en in het rapport als beperking in plaats van eindeloos te herhalen. Een sterk positieve uitkomst is soms echt (een goed aanbod voor een goed gekozen doelgroep); de controle dwingt je alleen om dat te toetsen, niet om het weg te schrijven. Drempels zijn aan te passen met `--drempel naam=waarde` als de context daarom vraagt (bijvoorbeeld bij een panel dat bewust alleen uit fans bestaat).

## Balans tussen realisme, snelheid en kosten

- **Eén subagent per persona, alle persona's tegelijk.** Gescheiden contexten zijn de beste benadering van onafhankelijke respondenten; meerdere persona's in één subagent gaan elkaar napraten. Een ronde kost dus 10-15 subagent-runs van elk drie tot vier korte reacties; vier rondes samen 40-60 runs. Dat is bewust goedkoper dan één subagent per variant (dat zou 160-200 runs zijn) en realistischer dan één subagent voor het hele panel.
- **Rijke reacties boven grote aantallen.** 40-50 panelleden met 4-8 zinnen per reactie geeft meer bruikbare verbeterideeën dan 200 panelleden met één zin, en de gebruiker kan ze nog lezen.
- **Scripts voor alles wat telt.** Gewichten, gemiddelden, spreiding, Van Westendorp-snijpunten en voorkeuren komen uit het script; het model rekent niet zelf. Zo zijn cijfers in het rapport reproduceerbaar uit de runmap.
- **Vier rondes, niet meer.** Meer rondes op hetzelfde model leveren vooral herhaling op. Wil de gebruiker een vijfde toets, doe die dan bij echte mensen.

## Grenzen

- Persona's zijn fictief. Voeg geen echte, herkenbare personen toe en gebruik geen merknamen als persona. Vraag de subagents nooit om zich als een bestaande klant of bekende persoon voor te doen.
- Gevoelige kenmerken (afkomst, geloof, gezondheid, beperking, inkomen) zijn context voor behoeften en drempels, niet de verklaring van gedrag. Schrijf in samenvattingen en rapport dus niet "moslims vinden" of "laagopgeleiden snappen niet", maar wat de persona in zijn situatie tegenhoudt of aantrekt.
- Deze skill test consumentenmateriaal voor de Nederlandse markt. Voor een B2B-inkoopproces, een andere markt of koppeling met echte enquêtedata is de bibliotheek niet gebouwd; zeg dat en bied aan wat wel kan (bijvoorbeeld de ondernemers-persona's als ruwe indicatie).
- Het panel vervangt geen meting bij echte klanten. Elk rapport eindigt met wat de gebruiker bij echte mensen moet toetsen.
