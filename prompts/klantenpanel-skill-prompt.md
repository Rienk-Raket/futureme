# Opdracht: bouw de skill "klantenpanel": een synthetisch test- en klantenpanel

## Waarom deze skill bestaat
Ik ben ondernemer en wil ideeën, producten, diensten, teksten, prijzen, websites en campagnes snel en goedkoop toetsen voordat ik tijd en geld investeer in echt klantonderzoek. De skill simuleert een klantenpanel: een groep mensen die op mijn materiaal reageert, in meerdere rondes steeds scherpere feedback geeft en uitkomt op concrete, verbeterde concepten. De uitkomst gebruik ik om te kiezen welke richting ik verder uitwerk en wat ik daarna bij echte klanten toets. Het panel is dus richtinggevend: het vindt blinde vlekken, bezwaren en kansen. Het is geen vervanging van echte meting, en het rapport moet dat eerlijk zeggen.

Bouw de skill met de skill-creator-skill en volg de conventies daarvan (SKILL.md met een goede triggerbeschrijving, `references/` voor kennis, `scripts/` voor deterministisch werk). De skill praat Nederlands met de gebruiker.

## Wat de skill moet doen (functionele eisen)

1. **Intake.** De skill vraagt eerst wat er getest wordt (de gebruiker levert tekst, bestand, link, afbeelding of beschrijving aan), welke doelgroep of welk soort klant gewenst is, welke beslissing de gebruiker met de uitkomst wil nemen, en in welke markt (standaard: Nederland). Vraag alleen wat je niet uit het aangeleverde materiaal kunt afleiden, in één beurt. Als de gebruiker geen doelgroep weet, stel de skill zelf een doelgroep voor op basis van het materiaal en laat die bevestigen.

2. **Kennisbank van 100 persona's** (vast bestand in `references/`, eenmalig gebouwd door jou). De 100 persona's dekken samen de volwassen bevolking van Nederland zo volledig mogelijk. Elke persona krijgt een **populatiegewicht** (geschat aandeel van de bevolking; alle gewichten tellen op tot 100%), zodat de grote groepen zwaar meetellen en je toch ziet wat kleinere groepen vinden. Gebruik CBS-cijfers en andere openbare bronnen als basis en noteer per dimensie de bron. Dimensies die in de set gespreid moeten zijn: leeftijd, gender, huishouden en levensfase, opleiding (praktisch/theoretisch), inkomen en financiële ruimte, werk (loondienst, zzp, ondernemer, werkloos, gepensioneerd, student, mantelzorger), regio en stedelijkheid, migratieachtergrond en taal, geloof en waarden, digitale vaardigheid en laaggeletterdheid, gezondheid en beperking, mediagebruik, aankoop- en beslisstijl, innovatie-adoptie (van innovator tot achterblijver), prijsgevoeligheid, duurzaamheidshouding en vertrouwen in bedrijven en instanties.
   Circa 80 persona's beschrijven de grote groepen. Circa 20 zijn **kansgroepen**: kleinere groepen die vaak over het hoofd worden gezien maar een niche, vroege adoptie, een onvervulde behoefte of juist een risico kunnen blootleggen. Markeer ze zo. Maak iedere persona concreet (een naam, een dagelijkse situatie, wat ze belangrijk vinden, waar ze zich aan ergeren, hoe ze beslissen, hun budget) zonder karikatuur: echte mensen binnen een groep verschillen, en stereotypen maken de feedback voorspelbaar en daarmee waardeloos. Gebruik een vast schema per persona zodat een script ze kan lezen.

3. **Selectie.** Na de intake kiest de skill uit de 100 persona's de persona's die bij de opgegeven doelgroep passen, en voegt bewust enkele aangrenzende persona's en relevante kansgroepen toe, zodat het beeld binnen de doelgroep compleet is en er ook zicht is op groepen net buiten de doelgroep. Toon de gebruiker kort welke persona's gekozen zijn, met gewicht en reden, en laat bijsturen voordat het panel draait.

4. **1000 varianten.** Uit de gekozen persona's maakt de skill in totaal 1000 varianten, verdeeld naar populatiegewicht, met een minimum per persona (bijvoorbeeld 10) zodat kleine groepen niet wegvallen. Varianten verschillen van hun basispersona op kenmerken die gedrag echt veranderen: stemming, beschikbare tijd en aandacht, eerdere ervaring in de categorie, budgetdruk deze maand, scepsis, gevoeligheid voor sociale bewijskracht, context van het moment (mobiel onderweg, rustig thuis) en kleine verschillen in waarden. Laat een script met vaste seed de varianten genereren, zodat een run herhaalbaar is en de spreiding gecontroleerd is in plaats van aan het model overgelaten.

5. **Zes testrondes.** Elke ronde bouwt voort op de vorige: de panelreacties leveren verbeteringen op en de volgende ronde test het verbeterde materiaal. Richtinggevende opbouw, die je mag aanscherpen als je een betere volgorde onderbouwt:
   - Ronde 1, eerste indruk: wat valt op in de eerste seconden, wat snapt men, wat roept het op.
   - Ronde 2, begrip en waardepropositie: begrijpt men wat het is, voor wie en waarom; wat is onduidelijk.
   - Ronde 3, relevantie, koopintentie en prijs: zou men het gebruiken of kopen, wat mag het kosten (bijvoorbeeld Van Westendorp-vragen), wat zijn alternatieven.
   - Ronde 4, bezwaren, vertrouwen en drempels: waarom niet, wat maakt wantrouwig, wat houdt tegen in de praktijk (toegankelijkheid, taal, digitaal, geld).
   - Ronde 5, verbeterde varianten vergelijken: het panel vergelijkt de verbeterde versies uit ronde 1 tot en met 4 met elkaar en met het origineel.
   - Ronde 6, eindtoets van vijf concepten: het panel beoordeelt de vijf kandidaat-concepten, inclusief risico's en kansen per segment.

   Per ronde geeft elke variant eerst een reactie in eigen woorden en pas daarna scores. Onderzoek laat zien dat taalmodellen die direct om cijfers gevraagd worden onrealistisch gelijkvormige en te positieve scores geven; eerst vrije tekst en dan scoren (of vrije tekst laten mappen op een schaal) geeft realistischere spreiding. Onverschilligheid, niet snappen, afhaken en afwijzen zijn net zo geldige reacties als enthousiasme: het panel is waardeloos als iedereen het ongeveer goed vindt.

6. **Eindrapport: vijf concepten.** De skill levert vijf concrete concepten op (herziene versies of richtingen van wat de gebruiker aanleverde). Per concept: wat er anders is dan het origineel en waarom, welke segmenten het sterkst en zwakst reageren (gewogen naar bevolking én ongewogen per persona), de belangrijkste gevaren en bezwaren, de kansen (ook uit kansgroepen), representatieve citaten van varianten, en wat de gebruiker als volgende stap bij echte mensen zou moeten toetsen. Sluit af met een aanbeveling welk concept, voor wie, en met een eerlijke betrouwbaarheidsparagraaf: wat een synthetisch panel wel en niet kan zeggen.

## Hoe ik de uitvoering voor me zie (ontwerpkeuzes met reden)

- **Rekenwerk in scripts, oordeel in het model.** Varianten genereren, verdelen, scores aggregeren, spreiding en segmentverschillen berekenen doe je met scripts; dat is herhaalbaar en controleerbaar. Het model doet wat alleen een model kan: reageren als een variant en de rondes synthetiseren.
- **1000 varianten × 6 rondes is veel.** Draai de simulatie parallel met subagents, bijvoorbeeld één subagent per persona of cluster persona's die zijn varianten in batches afwerkt en compacte gestructureerde output teruggeeft (reactie in 1 tot 3 zinnen, scores, belangrijkste bezwaar, belangrijkste trigger, verbeteridee). Zoek zelf de balans tussen realisme, snelheid en kosten, en documenteer die in de skill.
- **Bewaken van realisme.** Bouw controles in die na elke ronde draaien: als de spreiding binnen een persona te klein is, als vrijwel iedereen positief is, of als varianten van verschillende persona's hetzelfde zeggen, is de simulatie ingezakt naar het gemiddelde; laat de skill dat melden en die batch opnieuw draaien met sterkere variantkenmerken.
- **Tussen de rondes** vat de skill kort samen wat het panel vond en welke aanpassingen de volgende ronde getest worden, zodat de gebruiker kan meelezen en eventueel bijsturen. Daarna gaat hij door zonder op toestemming te wachten, tenzij de gebruiker heeft gevraagd per ronde te stoppen.
- **Opslag.** Sla per run de selectie, varianten, ruwe reacties en rondesamenvattingen op in een runmap, zodat het eindrapport herleidbaar is tot panelreacties en een run later te vergelijken is.

## Wanneer de skill af is
- De persona-bibliotheek bevat 100 persona's volgens één schema, gewichten tellen op tot 100%, circa 20 kansgroepen zijn gemarkeerd, en een bronnenoverzicht laat zien waarop de verdeling rust.
- Een fresh-context subagent heeft de persona-set gecontroleerd op dekking (ontbreekt er een grote groep?), op realistische gewichten ten opzichte van CBS-cijfers en op stereotypering, en de punten die hij vond zijn verwerkt.
- Het variantenscript maakt met een vaste seed exact 1000 varianten met het minimum per persona, en dat is getest.
- Je hebt de volledige skill minstens één keer end-to-end gedraaid op een realistisch testcase (bijvoorbeeld een landingspagina-tekst voor een nieuwe dienst), met alle zes rondes en een eindrapport met vijf concepten, en de realisme-controles hebben gewerkt.
- Een fresh-context subagent heeft het eindrapport van die testrun gecontroleerd: elke bewering over segmenten is herleidbaar tot panelreacties in de runmap.

Rapporteer aan het eind: wat je gebouwd hebt en waar het staat, hoe de testrun verliep met de belangrijkste cijfers, welke ontwerpkeuzes je anders maakte dan hierboven en waarom, en welke beperkingen je zag. Controleer elke bewering over voortgang tegen een tool-resultaat uit deze sessie; als iets niet geverifieerd is, zeg dat.

## Grenzen
- Persona's zijn fictief. Gebruik geen echte, herkenbare personen en geen namen van bestaande merken als persona.
- Behandel gevoelige kenmerken (afkomst, geloof, gezondheid, beperking, inkomen) respectvol en als context voor behoeften en drempels, niet als verklaring voor gedrag.
- Houd de skill bij wat hierboven staat. Ideeën voor uitbreidingen (bijvoorbeeld een B2B-panel of koppeling met echte enquêtedata) noem je aan het eind als suggestie, je bouwt ze niet.

Werk autonoom tot alles onder "Wanneer de skill af is" klaar is. Geef bij de start in één regel aan wat je gaat doen en onderweg korte updates bij elke mijlpaal (persona's klaar, script klaar, testrun ronde X), zodat ik kan meelezen. Stop alleen voor een keuze die echt bij mij ligt.
