# Sjabloon eindrapport

Sla het rapport op als `<runmap>/eindrapport.md`. Gebruik deze kopjes in deze volgorde. Elke bewering over een segment verwijst naar een cijfer uit `ronde-N/aggregatie.json` (noem ronde, object en of het gewogen of ongewogen is) of naar een variant-id met citaat. Schrijf in gewone taal; de gebruiker is ondernemer, geen onderzoeker.

---

# Klantenpanel: [naam van wat getest is]

Datum, runmap, doelgroep, beslissing die de gebruiker wil nemen, aantal persona's en panelleden, aantal rondes.

## Samenvatting in tien regels
Het advies in één zin. Daarna: wat het origineel deed (gewogen intentie, grootste bezwaar), wat de concepten anders doen, welk concept wint bij wie, het grootste risico, en wat eerst bij echte mensen getoetst moet worden.

## Het panel
Tabel: persona-id, naam, gewicht, rol (doelgroep, aangrenzend, kansgroep), aantal varianten. Eén zin over waarom deze selectie. Verwijs naar `selectie.json` en `varianten.json`.

## Wat het panel vond per ronde
Per ronde drie tot zes regels met de kerncijfers (gewogen intentie en verdeling, sterkste en zwakste persona's, bezwaren-top 3, bij ronde 2 het Van Westendorp-bereik) en de aanpassing die daaruit volgde. Vermeld of de realisme-controle is doorlopen en of er herhaald is. Verwijs naar `ronde-N/samenvatting.md`.

## Concept 1: [naam]
- **Propositie en prijs.** Twee zinnen plus prijs en eerste kanaal.
- **Wat anders is dan het origineel en waarom.** Koppel elke wijziging aan een bezwaar of trigger uit het panel (variant-id of aggregatiecijfer).
- **Sterkste en zwakste segmenten.** Gewogen (welke grote groepen) én ongewogen (welke persona's), met intentiecijfers uit ronde 4 en de voorkeursaandelen.
- **Gevaren en bezwaren.** Uit `risico` en `bezwaar` in ronde 4, met wie het zegt.
- **Kansen.** Ook uit kansgroepen; noem de persona en wat hij ziet dat anderen missen.
- **Representatieve citaten.** Drie tot vijf, met variant-id, uit verschillende persona's, waaronder minstens één negatief.
- **Toets dit bij echte mensen.** Twee tot vier concrete toetsen (wie, wat, hoe goedkoop), uit `toets_bij_echte_mensen` en je eigen analyse.

## Concept 2: [naam]
(zelfde opbouw)

## Concept 3: [naam]
(zelfde opbouw; bij vijf concepten ook 4 en 5)

## Vergelijking van de concepten
Tabel: concept, gewogen intentie, ongewogen intentie, voorkeur gewogen %, voorkeur ongewogen aantal, aantal "nooit", sterkste persona's, zwakste persona's, grootste risico. Eén alinea over wat de gewogen en ongewogen uitkomst verschillend laten zien.

## Aanbeveling
Welk concept, voor wie, tegen welke prijs, via welk kanaal, en de goedkoopste eerste stap bij echte klanten. Noem ook wat de gebruiker níet moet doen op basis van dit panel.

## Betrouwbaarheid: wat dit panel wel en niet kan zeggen
Vaste inhoud, in eigen woorden aangepast aan deze run:
- Het panel is synthetisch: alle panelleden komen uit hetzelfde taalmodel en dezelfde persona-teksten. Het vindt begripsproblemen, bezwaren, taal- en toegankelijkheidsdrempels, kansen en verschillen tussen groepen; het meet geen echte conversie, marktaandeel of betalingsbereidheid.
- Gewichten maken de uitkomst niet representatief; ze laten alleen grote groepen zwaarder meetellen. Prijsbandbreedtes zijn richtinggevend, geen prijsadvies.
- Realisme-controles: welke zijn doorlopen, welke persona's zijn herhaald, wat bleef twijfelachtig.
- Wat de gebruiker moet doen voordat hij investeert: de genoemde toetsen bij echte mensen, met een succescriterium dat hij zelf vooraf kiest.

## Herleidbaarheid
Lijst van bestanden in de runmap waarop dit rapport steunt: `intake.md`, `selectie.json`, `varianten.json`, `ronde-1..4/reacties/*.jsonl`, `ronde-1..4/aggregatie.json`, `ronde-1..4/realisme.json`, `ronde-1..4/samenvatting.md`.
