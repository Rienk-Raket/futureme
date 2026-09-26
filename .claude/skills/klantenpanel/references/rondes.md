# De vier rondes: opbouw en reden

De vragen en scorevelden per ronde staan in `rondes.json`; `build_prompt.py` zet ze automatisch in de subagent-opdracht. Dit bestand legt uit waarom de rondes zo zijn opgebouwd en wat de orkestrator tussen de rondes maakt.

## Volgorde

| Ronde | Vraag die het panel beantwoordt | Wat het panel ziet | Wat de orkestrator daarna maakt |
|---|---|---|---|
| 1 Eerste indruk en begrip | Snapt men binnen seconden wat het is, voor wie en waarom? Wat stoort, wat mist, wat roept het op? | het origineel | `v1`: één verbeterde versie die de begripsproblemen en de grootste ergernissen wegneemt, zonder de propositie te veranderen |
| 2 Waarde, prijs en bezwaren | Zou men het gebruiken of kopen, wat mag het kosten, wat zijn de alternatieven, wat maakt wantrouwend, wat houdt in de praktijk tegen? | `v1` | twee tot drie versies `A`, `B`, `C` die in richting verschillen (andere belofte, ander prijsmodel, andere instap, andere doelgroepfocus), gebouwd op de bezwaren en triggers uit ronde 1 en 2 |
| 3 Verbeterde versies vergelijken | Welke versie wint van het origineel en waarom, wat blijft er per versie over aan bezwaar? | origineel, `v1`, `A`, `B`, `C` | drie (of vijf) kandidaat-concepten met naam, propositie in twee zinnen, prijs en eerste kanaal; de sterkste elementen gecombineerd, de zwakste geschrapt |
| 4 Eindtoets van de concepten | Welk concept kiest men, welk nooit, wat is per concept het risico en de kans, wat moet bij echte mensen getoetst worden? | de concepten | het eindrapport |

Waarom eerst begrip en dan pas prijs: een prijsoordeel over iets dat niet begrepen is, meet het onbegrip en niet de prijs. Waarom in ronde 2 de verbeterde versie en niet het origineel: het panel bouwt voort, en de gebruiker wil weten wat de verbeterde versie waard is. Waarom in ronde 3 het origineel toch weer meeloopt: als het origineel wint, moet dat zichtbaar worden. Waarom ronde 4 concepten test en geen teksten: de gebruiker beslist over richtingen, en een concept dwingt tot een prijs, een doelgroep en een kanaal.

## Vrije tekst eerst, dan scores

Onderzoek naar taalmodellen als synthetische respondenten laat zien dat modellen die meteen om cijfers gevraagd worden, te positieve en te gelijkvormige scores geven. Daarom staat in elke opdracht: eerst 4-8 zinnen in eigen woorden met verwijzingen naar het materiaal, dan het gedrag (wegklikken, verder lezen, aanmelden), en pas daarna scores die uit die tekst volgen. `aggregate_round.py` controleert of dat gelukt is (spreiding, positiviteit, gelijkvormigheid).

## Scores en vaste lijsten

- Scores 1-7: `begrip`, `relevantie`, `aantrekkelijkheid`, `vertrouwen`, `intentie` (ronde 2 vervangt begrip en aantrekkelijkheid door `waarde_voor_geld`). Intentie is de hoofdmaat: 1-3 negatief, 4 onverschillig, 5-7 positief.
- `gedrag`: wat de variant echt zou doen. Gedrag is vaak eerlijker dan een score; "bewaart voor later" betekent meestal "nooit".
- `bezwaar_categorie`: vaste lijst zodat bezwaren geteld kunnen worden. De vrije tekst in `bezwaar` geeft de nuance.
- Ronde 2: Van Westendorp-prijsvragen (te goedkoop, goedkoop, duur, te duur) per variant. Het script berekent de snijpunten gewogen naar bevolking. Gebruik ze als bandbreedte, niet als prijsadvies: synthetische panelleden hebben geen echte portemonnee.
- Ronde 3 en 4: `voorkeur` per variant (geforceerde keuze) en in ronde 4 ook `nooit`, `risico`, `kans` en `toets_bij_echte_mensen`.

## Gewogen en ongewogen

Gewogen: per persona het gemiddelde van de varianten, daarna gewogen met het bevolkingsgewicht van de persona (genormaliseerd binnen de selectie). Dat laat zien wat de grote groepen vinden. Ongewogen: elke persona telt één keer, zodat kansgroepen en kleine groepen zichtbaar blijven. Rapporteer altijd allebei; een concept dat gewogen wint maar bij drie kleine groepen hard verliest, heeft een risico dat de gebruiker moet kennen.

## Tussen de rondes

Schrijf per ronde `samenvatting.md` met: de kern (drie tot vijf zinnen), de belangrijkste cijfers (gewogen intentie, verdeling, sterkste en zwakste persona's), terugkerende bezwaren en triggers met variant-ids, wat kansgroepen zagen wat de rest miste, of de realisme-controle is doorlopen en of er herhaald is, en de aanpassingen voor de volgende ronde met de reden. Geef de gebruiker de kern in hooguit tien regels en ga door, tenzij bij de intake is afgesproken per ronde te stoppen.
