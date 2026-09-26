# Review eindrapport: Zorgeloos Thuis (landingspagina klusjesabonnement)

- Gereviewd bestand: `klantenpanel-runs/2026-09-26-zorgeloos-thuis-landingspagina/eindrapport.md`
- Werkwijze: eigen Python-scripts over `ronde-1..4/reacties/*.jsonl` (niet `reacties-poging-1/`), `selectie.json` (gewicht_pct, som 29,7), `varianten.json`, `aggregatie.json`, `realisme.json`, `ronde-4/segmenten.json`, `samenvatting.md`, `opzet*.json` en `materiaal/`.
- Definitie gewogen: per persona het gemiddelde over de eigen varianten, gewogen met gewicht_pct en genormaliseerd binnen de (deel)selectie.
- Omvang: 81 beweringen beoordeeld. Van de 179 variantverwijzingen in het rapport zijn alle 100 onder "Gevaren en bezwaren" en "Kansen" gecontroleerd, plus vrijwel alle overige (de secties "Wat anders", "Toets", en de citaten). Alle 21 citaten met een variant-id zijn gecontroleerd.

## Tabel met gecontroleerde beweringen

| # | Sectie | Bewering | Bron | Oordeel | Toelichting / juiste waarde |
|---|---|---|---|---|---|
| 1 | Kop | 14 persona's, 45 varianten, seed 42, vier rondes | varianten.json, selectie.json | klopt | seed 42, totaal 45, 14 persona's; 4 rondemappen met reacties |
| 2 | Het panel | Tabel met naam, gewicht, rol en aantal varianten per persona | selectie.json, varianten.json | klopt | Alle 14 gewichten en aantallen varianten (4/3/3/3/4/3/3/3/3/3/4/3/3/3) kloppen; P39 is `aangrenzend`, K-persona's zijn `kansgroep` |
| 3 | Het panel / Betrouwbaarheid | Persona's staan samen voor 29,7% van de (Nederlandse) volwassen bevolking | selectie.json | klopt deels | `som_gewicht_pct` = 29,7 klopt. Dat het om "volwassen" en "Nederlandse" bevolking gaat, staat niet in de runmap; dat komt uit de persona-bibliotheek van de skill |
| 4 | Samenvatting, ronde 1 | Gewogen intentie origineel 1,91; 95,6% negatief | ronde-1 jsonl, aggregatie.json | klopt | Nagerekend: 1,91; gewogen 95,6% intentie 1-3 (ongewogen ook 43/45 = 95,6%) |
| 5 | Samenvatting | Concept 1: 66,9% gewogen voorkeur, 47,6% "bewaart voor later" | ronde-4 jsonl | klopt | Nagerekend: 66,92% en 47,62% (ongewogen: 31/45 en 21/45) |
| 6 | Samenvatting | "Het grootste risico is concurrentie met de gratis buurman" | ronde-4 aggregatie.json | klopt deels | Dit is een oordeel van de schrijver. In de data is **vertrouwen** het grootste bezwaar tegen concept 1 (31,5%); "alternatief" komt op de tweede plaats (27,9%) |
| 7 | Samenvatting / Ronde 4 | Per klus betalen wint "bij bijna elke groep" | segmenten.json | klopt | Op voorkeur wint concept 1 in alle 7 segmenten; op intentie in 6 van de 7 (niet bij "75-plus of via familie") |
| 8 | Ronde 1 | Begrip 4,87, intentie 1,91, vertrouwen 2,78, 95,6% negatief, 0% positief | ronde-1 jsonl, aggregatie.json | klopt | Zelf nagerekend, identiek |
| 9 | Ronde 1 | Bezwaren: vertrouwen 32,6, prijs 20,8, opzegbaarheid 15,6, digitaal 13,0 | ronde-1/aggregatie.json | klopt | Identiek |
| 10 | Ronde 1 | Alle 14 persona's noemen "onbeperkt" tegenover "maximaal 2" (20 van de 45 varianten, zoekwoord) | ronde-1 jsonl | klopt | De zoekregel geeft 20 varianten over 14 persona's. Inhoudelijk noemt P13-a alleen "onbeperkt" (ongeloof) zonder "maximaal 2", dus 19 varianten benoemen de tegenstrijdigheid echt. P13 is via P13-b toch gedekt |
| 11 | Ronde 1 / Betrouwbaarheid | Realisme-controle: waarschuwing negativiteit in ronde 1 | ronde-1/realisme.json | klopt | status `ok_met_waarschuwing`, negativiteit_waarschuwing = true |
| 12 | Ronde 1 | Aanpassing naar v1 (eerlijke prijs, maandelijks opzeggen, bellen/WhatsApp, wie wij zijn, voor uw ouders) | ronde-1/samenvatting.md | klopt | Staat er zo |
| 13 | Ronde 2 / Betrouwbaarheid | Eerste poging gearchiveerd, want de opzet zette panelleden buiten Apeldoorn buitenspel | opzet-poging-1.json en opzet.json | klopt | De context van poging 1 noemt "Nieuw bedrijf in Apeldoorn"; de herhaling zegt expliciet "ga ervan uit dat jouw plaats erbij hoort" |
| 14 | Ronde 2 | Vertrouwen 4,21, intentie 2,58 | ronde-2 jsonl | klopt | Nagerekend: 4,21 en 2,58 |
| 15 | Ronde 2 | Grootste bezwaar prijs (36%) | aggregatie.json | klopt | 36,3% |
| 16 | Ronde 2 | Van Westendorp ca. €7-12 per maand, mediaan "te duur" €22,50 | aggregatie.json | klopt | PMC 7,07, PME 12,06, mediaan te_duur 22,5 |
| 17 | Ronde 2 | 27 van de 45 varianten noemen betalen per klus "als alternatief" | ronde-2 jsonl, ronde-2/samenvatting.md | klopt deels | De zoekregel uit de samenvatting geeft precies 27. Die zoekt echter in `alternatief` **of** `verbeteridee` en telt ook varianten mee die beschrijven dat ze nu al per keer betalen. "Als alternatief" is dus iets te sterk |
| 18 | Concept 1 | De wensprijs voor een losse klus lag in ronde 2 meestal tussen €20 en €30 | ronde-2 jsonl | klopt | Van ca. 19 genoemde bedragen liggen er 13 tussen €20 en €30, 4 erboven (€35-40) en 2 eronder (€15) |
| 19 | Ronde 3 | A wint met 58,8% gewogen voorkeur, intentie 3,32 | ronde-3 jsonl | klopt | Nagerekend: 58,8% en 3,32 |
| 20 | Ronde 3 | Origineel: intentie 1,08, 100% negatief | ronde-3 jsonl, aggregatie.json | klopt | 1,08; 100,0% |
| 21 | Ronde 3 | B werkte voor mantelzorgers (P13, K10, P45) "en voor niemand anders" | ronde-3 jsonl | klopt deels | Op intentie klopt het: B > A alleen bij P13, K10 en P45. Maar B werd ook als voorkeur gekozen door **P30-c** (voor zijn moeder) en **P39-c** (voor zijn zus). Het gaat dus om mensen in een familierol, breder dan de drie genoemde persona's |
| 22 | Ronde 3 / Concept 3 | "Klusbuffer" niet begrepen (K06-a, P13-a, P30-c, P31-a, P40-a, P45-a) | ronde-3 jsonl, object C | klopt | Alle zes noemen het woord onbegrijpelijk; C-bezwaar "begrip" 24,9% |
| 23 | Ronde 4 / Betrouwbaarheid | Realisme-controle in alle rondes doorlopen; geen herhaling met sterkere varianten nodig | realisme.json ronde 1-4 | klopt | Alle 7 controles per ronde aanwezig; `herhalen_personas` is in alle vier leeg |
| 24 | Concept 1 | Propositie: €25 tot 30 min, kaart 3 voor €69, deelbaar, cadeaubon, twee werkdagen of gratis, niet opgelost dan niet betalen | ronde-4/materiaal/concept-1.md | klopt | Identiek aan het materiaal |
| 25 | Concept 1 | "Geen nieuwe vaste last" was de meest genoemde reden voor A (K06-c, K10-a, P06-c, P16-a, P35-c, P39-b, P39-d, P40-b, P42-c, P47-b) | ronde-3 jsonl, voorkeur_reden | klopt | Alle tien noemen geen vaste last of maandlast; 23 van de 26 A-kiezers noemen geen abonnement of vaste last |
| 26 | Concept 1 | "€29 voor een lampje" grootste bezwaar tegen A (42,7%; P40-c, P16-a, P35-b) | ronde-3 jsonl, aggregatie.json | klopt | 42,7% is de hele categorie prijs; de drie varianten zeggen het letterlijk (lampje/lamp) |
| 27 | Concept 1 | €12 per kwartier schrok af (P30-b, P35-c, P42-a) | ronde-3 jsonl, A | klopt | Alle drie letterlijk in `bezwaar` |
| 28 | Concept 1 | Factuur naar familie, niet betalen aan de deur (K10-a, K10-c, P45-d, ronde 3) | ronde-3 jsonl, A | klopt | In `verbeteridee`/`bezwaar` |
| 29 | Concept 1 | Voorbeeldklussen, begin- en eindtijd, avond en zaterdag, adres (P06-b, P31-a, P47-a, P39-b) | ronde-3 jsonl, A | klopt deels | P06-b/P31-a: avond en zaterdag; P47-a: begin- en eindtijd; P39-b: adres. Voorbeeldklussen worden door geen van de vier genoemd (wel door P35-b in ronde 3) |
| 30 | Concept 1 | Segmenten gewogen: 55+ zelfstandig 3,20 (69,1%), krap budget 3,04, kansgroepen 3,19 (88,9%), tweeverdieners 2,84, zelfklussers 2,47 | segmenten.json, eigen herberekening | klopt | Alle waarden identiek aan eigen berekening |
| 31 | Concept 1 | Alleen bij "75-plus of via familie" verliest het van concept 2: 2,83 tegenover 3,28 | segmenten.json | klopt | Op intentie. Op voorkeur wint concept 1 daar wel (55,6% tegenover 44,4%) |
| 32 | Concept 1 | Ongewogen sterkst K10 4,0, P35/P40/P47 3,67; zwakst P45 2,25, P06 2,33, P39 2,5 | ronde-4 jsonl | klopt | P30 staat ook op 2,5, gelijk met P39 |
| 33 | Concept 1 | Hoogste of gedeeld hoogste intentie bij 11 van 14 persona's; gelijk met concept 2 bij P06 | ronde-4 jsonl | klopt | Concept 2 hoger bij K10, P13 en P45; gelijk bij P06 (2,33) |
| 34 | Concept 1, gevaren | Niet urgent: 47,6% gewogen; K06-c nummer weg; P31-a en P40-c vergeten tussendoor | ronde-4 jsonl, concept-1, `risico` | klopt | Alle drie letterlijk in `risico` |
| 35 | Concept 1, gevaren | Gratis concurrentie 27,9%: P40-a, P45-b, P13-b, P30-d, K12-b; P42-c corporatie | ronde-4 jsonl | klopt | 27,9% = gewogen aandeel bezwaarcategorie "alternatief"; alle zes varianten kloppen |
| 36 | Concept 1, gevaren | "Of gratis" als lokkertje (P35-b, P39-d, P42-b, P45-a, P47-c); P06-b buurtapp | ronde-4 jsonl | klopt | Alle zes kloppen (P45-a staat onder bezwaarcategorie prijs, maar de reactie noemt het wantrouwen) |
| 37 | Concept 1, gevaren | 30-minutengrens: P16-a, P16-c, P30-b, P39-a, P39-c, P47-b | ronde-4 jsonl, `risico`/`bezwaar` | klopt | Alle zes noemen dit |
| 38 | Concept 1, gevaren | Bewaarzin botst met fiscale bewaarplicht van 7 jaar (K12-c); wanneer ben je klant (P31-c) | ronde-4 jsonl + concept-1.md | klopt | Letterlijk in bezwaar en citaat |
| 39 | Concept 1, kansen | Kaart als cadeau van kinderen (P06-a, P30-a, P31-a, P35-a, P39-c, K06-a, K10-b) | ronde-4 jsonl, `kans` | klopt | Alle zeven noemen de kaart als cadeau; de momenten (verjaardag, Moederdag, Sinterklaas) staan erin |
| 40 | Concept 1, kansen | Via KBO, kerk, kaartclub, bridgeclub, dorpsvereniging (P40-a, P40-c, P45-c, P47-a); portiek/galerij (P42-a) | ronde-4 jsonl, `kans` | klopt | Letterlijk |
| 41 | Concept 1, kansen | Betrouwbare reserve (P13-b, P31-b, K12-b); tijdelijke hulp (P39-a) | ronde-4 jsonl, `kans` | klopt | Letterlijk |
| 42 | Concept 1, kansen | Kansgroepen: K12 zonder app/account/tracking; K06 magneet met prijs en nummer; K10 papieren folder | K12-c, K06-c, K10-a `kans` | klopt | "Zodat je niets hoeft te lezen" is een parafrase van K06-c |
| 43 | Concept 1, citaten | K12-a, P40-b, P47-b, P40-a, P45-d | ronde-4 jsonl, `citaat` | klopt | Alle vijf letterlijk in `citaat` van concept 1 |
| 44 | Concept 1, toets | Verwijzingen P16-a, P30-b, P39-a, P47-b en P13-b, P31-b, K12-b | `toets_bij_echte_mensen` / `kans` | klopt | Passend |
| 45 | Concept 2 | Propositie: €9,95, 1 klus, sparen tot 6, nooit aan de deur, kosten delen, gratis kennismaking, pauzeren | concept-2.md | klopt | Identiek |
| 46 | Concept 2 | Bouwt op B; sterkst bij P13-c, K10-b, P45-d; 79% van de bezwaren over relevantie | ronde-3 jsonl, aggregatie.json | klopt | Intentie 5/5/4, alle drie kozen B; relevantie 79,3% |
| 47 | Concept 2 | B voelde als "over mij heen praten" (P40-a, P42-b, P47-c) | ronde-3 jsonl, B | klopt | P40-a letterlijk; P42-b "onder toezicht"; P47-c "zo zie ik mezelf niet" |
| 48 | Concept 2 | Bellen met een ouder met dementie of slecht gehoor werkt niet (P13-a, P13-c, K10-b, K10-c) | ronde-3 jsonl, B | klopt | Letterlijk in `bezwaar` |
| 49 | Concept 2 | Eerste bezoek samen met familie (K06-b, P30-c, P45-d) | ronde-3 jsonl, B, `verbeteridee` | klopt | Letterlijk |
| 50 | Concept 2 | "Wint alleen bij 75-plus of via familie, met intentie 3,28 en 44,4% voorkeur" | segmenten.json | klopt deels | Het wint daar alleen op **intentie**. Op voorkeur verliest het ook in dat segment: concept 1 55,6%, concept 2 44,4% |
| 51 | Concept 2 | 55+ zelfstandig 1,86, zelfklussers 1,91 | segmenten.json, eigen berekening | klopt | Identiek |
| 52 | Concept 2 | Ongewogen sterkst K10 4,33, P13 4,0; zwakst P16 1,0, K12 1,33, P47 1,33 | ronde-4 jsonl | klopt | Identiek |
| 53 | Concept 2 | Hoogste losse scores: K10-b en P13-c intentie 6, melden zich aan voor kennismaking | ronde-4 jsonl | klopt | Enige twee 6'en in ronde 4, gedrag "meldt zich aan of koopt", trigger: gratis kennismaking |
| 54 | Concept 2 | 19 van de 45 zetten het bij "nooit" | ronde-4 jsonl | klopt | 19 |
| 55 | Concept 2, gevaren | Veertien varianten noemen betutteling (zoekregel in samenvatting); P35-b, P40-a, P47-c | ronde-4 jsonl, `risico` concept-2 | klopt | De zoekregel reproduceert 14 (alleen bij concept 2). Alle 14 zijn inhoudelijk raak; K12-b en K12-c gaan over "toezicht" vanuit privacy |
| 56 | Concept 2, gevaren | Prijs 23% van de bezwaren; P30-b rekent €119; P40-b, P42-a | aggregatie.json, jsonl | klopt | 23,1%; P30-b citaat letterlijk |
| 57 | Concept 2, gevaren | Privacy: K12-b, K12-c (citaat), foto's; P31-c dunste voorwaarden | ronde-4 jsonl | klopt | K12-b noemt foto's in de reactie; P31-c `risico` letterlijk |
| 58 | Concept 2, gevaren | Verkeerde lezer (K10-a, P16-a) | ronde-4 jsonl, `risico` | klopt | Letterlijk |
| 59 | Concept 2, kansen | Kinderen "van 45 tot 65" als kopers (P16-b, P31-b, P42-a, P45-a, P47-a) | ronde-4 jsonl, `kans` | klopt deels | Alle vijf noemen de kinderen als kopers. De leeftijdsgrens 45-65 staat nergens in de data (P31-b spreekt van "kinderen van zestig") |
| 60 | Concept 2, kansen | Kosten delen (P13-c, P06-b, K06-b); dementie (K10-c); tijdelijk (P39-a); wijkzuster (P45-d); familieberichtje los bij concept 1 (P13-b, P39-b, P42-c) | ronde-4 jsonl, `kans`/`citaat` | klopt | Alle elf verwijzingen kloppen |
| 61 | Concept 2, citaten | K10-b, P13-c, P31-b, P35-b, K12-c, plus P40-a, P30-b, P45-d in de lopende tekst | ronde-4 jsonl, `citaat` | klopt | Alle acht letterlijk in `citaat` van concept 2 |
| 62 | Vergelijking | Mantelzorgers K10, P13, P45 samen 4,7% gewicht | selectie.json | klopt | 0,9 + 2,0 + 1,8 = 4,7 |
| 63 | Concept 3 | Propositie: €7,95, sparen tot 6, gezin €13,95, prijs 2 jaar vast, pauzeren, jaaroverzicht, rekenvoorbeeld | concept-3.md | klopt | Identiek |
| 64 | Concept 3 | Rekenvoorbeeld (P06-b, P16-a, P30-b), prijsgarantie (P30-d), pauzeknop (P42-c, P47-b), gezinsvariant (P16-b) in ronde 3 | ronde-3 jsonl, C | klopt | Letterlijk in `verbeteridee` |
| 65 | Concept 3 | Gewogen in geen segment boven 1,66; 75-plus 1,11; kansgroepen 1,26 | segmenten.json, eigen berekening | klopt | Maximum 1,66 (tweeverdieners) |
| 66 | Concept 3 | Ongewogen sterkst P16 2,67, P47 2,0; zwakst K12, P06, P45 (1,0) | ronde-4 jsonl | klopt | Identiek |
| 67 | Concept 3 | Eén positieve variant: P16-b (intentie 5) | ronde-4 jsonl | klopt | Enige ≥5 bij concept 3 |
| 68 | Concept 3, gevaren | Rekenvoorbeeld werkt tegen (P13-c, P16-a, P35-c, P40-b, P42-a, P45-b, P47-a); vooral veelgebruikers over (P40-b, K10-c) | ronde-4 jsonl, `risico`/`bezwaar` | klopt | Alle negen kloppen (P13-c en P45-b alleen in `risico`) |
| 69 | Concept 3, gevaren | Rekenfout: ook bij 3 klussen per keer goedkoper (€75 tegen €95,40); K12-c citaat | concept-3.md, ronde-4 jsonl | klopt | 3 × €25 = €75 < €95,40; citaat letterlijk |
| 70 | Concept 3, gevaren | Vervallende klussen voelen als verlies (P06-b, P16-c, P39-a, P39-b, P45-c); P39-c sportschool | ronde-4 jsonl | klopt | Alle zes kloppen |
| 71 | Concept 3, gevaren | Sparen niet begrepen (K10-a, P35-a, P42-b, P45-a, P45-d) | ronde-4 jsonl | klopt | Alle vijf |
| 72 | Concept 3, kansen | Jaaroverzicht als advies (K12-b, K12-c, P30-a, P35-c, P40-b, P42-c); jaarbundel (K12-a, P30-b, P40-a, P42-a, P47-a); gezinsbundel (P16-b); huis-APK (P16-a, P39-a, P45-b) | ronde-4 jsonl, `kans` | klopt | Alle vijftien; P45-b is een ruimere lezing (terugkerende klussen zoals rookmelder) |
| 73 | Concept 3, citaten | P16-b, P16-a, P39-c, P45-d, K12-c | ronde-4 jsonl, `citaat` | klopt | Alle vijf letterlijk |
| 74 | Concept 3, toets | Huischeck bij gezinnen met warmtepomp of zonnepanelen (P16-a) | ronde-4 jsonl | klopt | P16-a noemt de warmtepomp bij concept 3; warmtepomp en zonnepanelen staan samen in de `kans` van P16-a bij concept 1 |
| 75 | Vergelijking | Intentie gewogen 3,06 / 2,09 / 1,55 | ronde-4 jsonl + gewichten | klopt | Nagerekend: 3,057 / 2,090 / 1,552 |
| 76 | Vergelijking | Intentie ongewogen 3,07 / 2,21 / 1,48 | aggregate_round.py, jsonl | klopt deels | Dit is het gemiddelde van de 14 persona-gemiddelden (definitie van het script). Het gemiddelde over de 45 varianten is **3,02 / 2,20 / 1,47**. Het rapport zegt niet welke definitie het gebruikt |
| 77 | Vergelijking | Voorkeur gewogen 66,9 / 26,1 / 7,0; ongewogen 31 / 12 / 2 | ronde-4 jsonl | klopt | Identiek; voorkeur is per variant consistent over de drie regels |
| 78 | Vergelijking | Nooit: 1 / 19 / 25 | ronde-4 jsonl | klopt | Identiek (de ene is P45-d) |
| 79 | Vergelijking | Sterkste/zwakste persona's per concept in de tabel | ronde-4 jsonl | klopt deels | Concept 3 "sterkste P35": P35, P31 en P40 staan gelijk op 1,67. Concept 1 "zwakste P39": P39 en P30 staan gelijk op 2,5. Keuze bij gelijkstand wordt niet vermeld |
| 80 | Betrouwbaarheid | Bibliotheek bijgewerkt naar 1.1 na review; ronde 1 opnieuw geaggregeerd; reacties op oude teksten | ronde-1/samenvatting.md | klopt | Staat daar, met de gewijzigde gewichten; eigen herberekening van ronde 1 met de huidige gewichten geeft de rapportcijfers |
| 81 | Betrouwbaarheid | "Alle 45 panelleden komen uit hetzelfde taalmodel"; "geen portemonnee" | geen bestand | niet te herleiden | Methodische uitleg van de schrijver, geen runmapdata. Acceptabel als toelichting, maar niet herleidbaar |

Losse observatie (geen bewering in het rapport): `run.json` staat nog op `"status": "intake"` met `"rondes_klaar": []`. Dat is in strijd met vier afgeronde rondes.

## Moet gecorrigeerd worden

1. **Concept 2, sterkste segmenten (r. 95)**: "dit concept wint alleen bij '75-plus of via familie' ... met intentie 3,28 en 44,4% voorkeur" moet worden: "dit concept scoort alleen bij '75-plus of via familie' (P45, K10) de hoogste intentie (3,28 tegenover 2,83). Op voorkeur wint ook daar concept 1 (55,6% tegenover 44,4%)." Voeg bij concept 1 (r. 58) hetzelfde toe: het verliest daar alleen op intentie.
2. **Vergelijkingstabel (r. 152-156)**: geef aan dat "intentie ongewogen" het gemiddelde van de persona-gemiddelden is. Of vervang de waarden door het gemiddelde over de 45 varianten: 3,02 / 2,20 / 1,47.
3. **Ronde 3 (r. 46)**: "B werkte voor mantelzorgers (P13, K10, P45) en voor niemand anders" moet worden: "B had alleen bij P13, K10 en P45 de hoogste intentie. Daarnaast kozen P30-c (voor zijn moeder) en P39-c (voor zijn zus) B, dus ook mensen die iets voor een familielid regelen. Voor de rest was B niet relevant."
4. **Ronde 2 (r. 45)**: "Zevenentwintig van de 45 varianten noemden betalen per klus als alternatief" moet worden: "... noemden betalen per klus in hun alternatief of verbeteridee (zoekregel in `ronde-2/samenvatting.md`; inclusief enkele die nu al per keer betalen)".
5. **Samenvatting (r. 17) en tabel "grootste risico"**: markeer "gratis buurman" als oordeel, of vermeld dat vertrouwen in de "of gratis"-belofte het grootste bezwaar is (31,5%) en alternatief het tweede (27,9%).
6. **Concept 1, "Wat anders" (r. 56)**: voorbeeldklussen worden niet door P06-b, P31-a, P47-a of P39-b genoemd. Voeg P35-b (ronde 3) toe of haal "voorbeeldklussen" uit deze opsomming.
7. **Concept 2, kansen (r. 105)**: haal "van 45 tot 65" weg of markeer het als aanname. De data noemt alleen volwassen kinderen (P31-b: "kinderen van zestig").
8. **Vergelijkingstabel en concept 1**: vermeld de gelijkstanden: P35 = P31 = P40 (1,67) bij concept 3; P39 = P30 (2,5) bij concept 1.
9. Klein: "29,7% van de Nederlandse volwassen bevolking" (r. 40, 180). De runmap geeft alleen `som_gewicht_pct` = 29,7. Verwijs voor de betekenis naar de persona-bibliotheek.
10. Klein, buiten het rapport: werk `run.json` bij (status en rondes_klaar).

## Eindoordeel

Het rapport is in hoge mate herleidbaar. Alle kerncijfers van ronde 1-4, alle segmentcijfers, alle vier de zoekregeltellingen en alle 21 citaten met een variant-id zijn reproduceerbaar, en de 100 variantverwijzingen bij Gevaren en Kansen zeggen wat het rapport beweert. De afwijkingen zijn geen verzonnen feiten maar formuleringen die iets te stellig zijn: concept 2 "wint" in het 75-plussegment alleen op intentie en niet op voorkeur, "ongewogen" is niet gedefinieerd, en "B voor niemand anders" en "27 als alternatief" zijn iets ruimer dan de data toelaat. Met de correcties 1 tot en met 5 is het rapport geschikt om te delen; 6 tot en met 10 zijn cosmetisch.
