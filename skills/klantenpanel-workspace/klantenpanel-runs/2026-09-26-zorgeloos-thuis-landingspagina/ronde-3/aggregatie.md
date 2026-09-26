# Ronde 3: Verbeterde versies vergelijken

Records: 225, varianten: 45. Realisme: **ok**

- OK spreiding_binnen_persona: 0.14 (drempel 0.5). persona's zonder spreiding in intentie (std < 0.5): ['K12', 'P47']
- OK positiviteit: {'origineel': 0.0, 'v1': 0.048, 'A': 0.055, 'B': 0.033, 'C': 0.027000000000000003} (drempel 0.65). gewogen aandeel intentie >= 5 per object; faalt als alle objecten erboven zitten
- OK negativiteit_waarschuwing: {'origineel': 0.0, 'v1': 0.048, 'A': 0.055, 'B': 0.033, 'C': 0.027000000000000003} (drempel 0.05). alleen een waarschuwing: bij alle objecten minder dan 5% positief. Controleer of het materiaal een objectieve fout bevat die iedereen raakt (dan is het echt) en benoem het in samenvatting en rapport; geen herhaling nodig.
- OK begrip_te_hoog: {'origineel': 4.4, 'v1': 5.5, 'A': 6.39, 'B': 5.6, 'C': 4.85} (drempel 6.3). gewogen gemiddeld begrip per object; bijna niemand snapt alles
- OK gelijkvormigheid_tussen_personas: 0.001 (drempel 0.05). aandeel paren van verschillende persona's met woordoverlap >= 0.35; meest betrokken: [('P30', 4), ('P45', 3), ('P47', 3), ('P16', 3)]
- OK een_bezwaar_domineert: {'origineel': 0.365, 'v1': 0.61, 'A': 0.42700000000000005, 'B': 0.7929999999999999, 'C': 0.368} (drempel 0.7). gewogen aandeel van de grootste bezwaar-categorie per object
- OK volledigheid: {'ontbrekend': 0, 'dubbel': 0, 'fouten': 0} (drempel 0). ontbrekend: []; dubbel: []; fouten: []

## Object `origineel` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| begrip | 4.4 | 4.41 |
| relevantie | 2.27 | 2.25 |
| aantrekkelijkheid | 2.18 | 2.08 |
| vertrouwen | 2.02 | 1.96 |
| intentie | 1.08 | 1.07 |

Intentie gewogen: {'negatief (1-3)': 100.0}
Gedrag gewogen %: {'klikt weg': 67.9, 'leest verder': 14.0, 'negeert': 12.5, 'zoekt een alternatief': 5.6}
Bezwaren gewogen %: {'opzegbaarheid': 36.5, 'vertrouwen': 26.1, 'digitaal': 23.6, 'prijs': 6.7, 'alternatief': 2.7, 'kwaliteit': 2.4, 'relevantie': 2.1}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'begrip': 4.22, 'relevantie': 1.89, 'aantrekkelijkheid': 1.45, 'vertrouwen': 1.56, 'intentie': 1}, 'hoofdgroep': {'begrip': 4.46, 'relevantie': 2.35, 'aantrekkelijkheid': 2.25, 'vertrouwen': 2.07, 'intentie': 1.09}}
Sterkst: [('P35', 'Hennie Bosman', 1.33), ('P40', 'Ria van den Heuvel', 1.33), ('P16', 'Jeroen Smit', 1.33)]  |  Zwakst: [('K12', 'Jasper Hoek', 1), ('K06', 'Johan Wubbels', 1), ('K10', 'Nel Hoogendoorn', 1)]

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 1 | 0.0 | {'begrip': 4.5, 'relevantie': 1.75, 'aantrekkelijkheid': 2.25, 'vertrouwen': 1.75, 'intentie': 1} | {'leest verder': 2, 'klikt weg': 1, 'negeert': 1} | ['opzegbaarheid', 'vertrouwen', 'relevantie', 'opzegbaarheid'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 1.33 | 0.47 | {'begrip': 4.33, 'relevantie': 3.33, 'aantrekkelijkheid': 2.67, 'vertrouwen': 2.33, 'intentie': 1.33} | {'leest verder': 1, 'klikt weg': 2} | ['digitaal', 'digitaal', 'vertrouwen'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 1.33 | 0.47 | {'begrip': 4.33, 'relevantie': 3, 'aantrekkelijkheid': 2.33, 'vertrouwen': 2.33, 'intentie': 1.33} | {'klikt weg': 2, 'leest verder': 1} | ['opzegbaarheid', 'opzegbaarheid', 'digitaal'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 1 | 0.0 | {'begrip': 4.33, 'relevantie': 2, 'aantrekkelijkheid': 1.67, 'vertrouwen': 2, 'intentie': 1} | {'klikt weg': 2, 'negeert': 1} | ['opzegbaarheid', 'digitaal', 'vertrouwen'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 1 | 0.0 | {'begrip': 4, 'relevantie': 2, 'aantrekkelijkheid': 2, 'vertrouwen': 1.75, 'intentie': 1} | {'negeert': 1, 'klikt weg': 3} | ['digitaal', 'opzegbaarheid', 'vertrouwen', 'digitaal'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 1 | 0.0 | {'begrip': 4, 'relevantie': 2, 'aantrekkelijkheid': 2.33, 'vertrouwen': 1.67, 'intentie': 1} | {'klikt weg': 2, 'zoekt een alternatief': 1} | ['opzegbaarheid', 'opzegbaarheid', 'vertrouwen'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 2.67, 'aantrekkelijkheid': 2, 'vertrouwen': 2, 'intentie': 1} | {'klikt weg': 3} | ['digitaal', 'opzegbaarheid', 'vertrouwen'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 2.67, 'aantrekkelijkheid': 3, 'vertrouwen': 2.33, 'intentie': 1} | {'klikt weg': 2, 'leest verder': 1} | ['opzegbaarheid', 'opzegbaarheid', 'digitaal'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 1.33 | 0.47 | {'begrip': 4.33, 'relevantie': 2.67, 'aantrekkelijkheid': 2.33, 'vertrouwen': 2.33, 'intentie': 1.33} | {'klikt weg': 3} | ['opzegbaarheid', 'alternatief', 'vertrouwen'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 2, 'aantrekkelijkheid': 2.67, 'vertrouwen': 2.33, 'intentie': 1} | {'klikt weg': 2, 'negeert': 1} | ['opzegbaarheid', 'vertrouwen', 'prijs'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 1 | 0.0 | {'begrip': 4.25, 'relevantie': 1.75, 'aantrekkelijkheid': 1.5, 'vertrouwen': 2, 'intentie': 1} | {'klikt weg': 2, 'leest verder': 1, 'negeert': 1} | ['digitaal', 'vertrouwen', 'kwaliteit', 'prijs'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 1 | 0.0 | {'begrip': 3.67, 'relevantie': 2, 'aantrekkelijkheid': 1.67, 'vertrouwen': 1.67, 'intentie': 1} | {'klikt weg': 2, 'negeert': 1} | ['opzegbaarheid', 'digitaal', 'vertrouwen'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 1 | 0.0 | {'begrip': 3.67, 'relevantie': 2, 'aantrekkelijkheid': 1.67, 'vertrouwen': 1.67, 'intentie': 1} | {'klikt weg': 2, 'zoekt een alternatief': 1} | ['digitaal', 'vertrouwen', 'prijs'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 1 | 0.0 | {'begrip': 5.33, 'relevantie': 1.67, 'aantrekkelijkheid': 1, 'vertrouwen': 1.33, 'intentie': 1} | {'klikt weg': 3} | ['digitaal', 'digitaal', 'vertrouwen'] |

Citaten:
- P30-a: Eerste maand een euro, en dan zit je een jaar vast. Kennen we.
- P30-b: Onbeperkt, en onderaan maximaal twee. Dan hoef ik de rest niet te lezen.
- P30-c: Ik ben hier zelf de klusjesman.
- P30-d: Lokprijs van een euro en een jaar vast. Daar ben ik net aan gebrand.
- P35-a: Een vast gezicht is fijn, maar weer een app en een jaarcontract in de kleine lettertjes.
- P35-b: Nooit meer wachten? Dat zeggen ze allemaal. En dan eerst weer een app, laat maar.
- P35-c: Onbeperkt in de grote letters, maximaal twee in de kleine. Zo ga je niet met mensen om.
- P40-a: Jaarabonnement in van die kleine lettertjes, en dan moet ik nog een app ook. Nee hoor.
- P40-b: Een jaar vastzitten aan €14,95, terwijl ik net mijn vaste lasten aan het schrappen ben. Liever niet.
- P40-c: Eerst een app en een account? Dan laat ik het maar, ik wil gewoon iemand bellen.
- P42-a: Een jaar vast, en dat pas onderaan? Nee kind, daar ben ik net vanaf bij de energie.
- P42-b: Weer een app, weer mijn dochter bellen. Dan laat ik die lamp maar kapot.
- P42-c: Onbeperkt, en dan twee per maand. Die trucjes ken ik wel.
- P45-a: Een app? Nee, dat is niks voor mij. Die gaat bij het oud papier.
- P45-b: Een jaarabonnement via een app? Daar kom je nooit meer vanaf, dat ken ik wel.
- P45-c: Bovenaan onbeperkt en onderaan maximaal twee. Dan geloof ik de rest ook niet.
- P45-d: Een vreemde aan de deur die geld wil zien? Nee, daar begin ik niet aan.
- P47-a: Onbeperkt, staat er, en onderaan toch maar twee. Daar begin ik niet aan.
- P47-b: Een jaar vast, dat staat helemaal onderaan. Zo ga je toch niet met mensen om?
- P47-c: Nooit meer wachten, zeggen ze. Heb ik eerder gehoord. Weg ermee.
- P31-a: Nooit meer? Dat zegt elke folder. En eerst een app, nee.
- P31-b: Zorgeloos heet het, en dan een jaarcontract in de kleine letters.
- P31-c: Onbeperkt blijkt twee, en een maand blijkt een jaar. Zo lees ik dat.
- P13-a: Eerste maand een euro en dan een jaar vast? Dat trucje ken ik wel.
- P13-b: Een jaar vast voor een klusjesman die ik niet ken? Deze maand zeker niet.
- P13-c: Mijn moeder met een app en geld aan de deur? Dat gaat mis.
- P16-a: Onbeperkt in de kop, maximaal twee in de kleine letters. Zo begin je geen klantrelatie.
- P16-b: Weer een app. Ik heb al iemand die ik kan bellen.
- P16-c: Onbeperkt, behalve in de kleine letters. Die truc ken ik.
- P06-a: Een jaarabonnement in de kleine lettertjes, dan ben ik snel klaar met lezen.
- P06-b: Nooit meer wachten? Dat hoorden we eerder, en toen wachtten we twee keer voor niks.
- P06-c: Weer vijftien euro per maand erbij? Niet deze maand.
- P39-a: Eerst een app downloaden en dan een jaar vastzitten? Daar ben ik te oud voor.
- P39-b: Bovenaan onbeperkt, onderaan maximaal twee. Dan weet ik genoeg.
- P39-c: Een klemmende deur in een half uur? Dan heb je hem alleen geschaafd, niet gemaakt.
- P39-d: Nog een vaste last? Ik ben ze juist aan het schrappen.
- K10-a: Eén euro, en dan onderaan een jaar vast. Nee, mam, die gaat bij het oud papier.
- K10-b: App, foto, jaarcontract. Na vorige week begin ik daar echt niet meer aan.
- K10-c: Onbeperkt, en dan onderaan toch een grens. Zo is het vorige keer ook gegaan.
- K06-a: Eerst een app en een account? Dan ben ik al weg.
- K06-b: Bovenaan onbeperkt, onderaan twee. Dan hoef ik de rest niet meer.
- K06-c: We zijn net aan 't schrappen. Nog een maandbedrag? Nee.
- K12-a: Twee keer 'download de app' in dertig seconden. Dan ben ik al weg.
- K12-b: Een jaarcontract in de kleine letters en eerst een app. Mijn klusser neemt gewoon de telefoon op.
- K12-c: 'Onbeperkt' in de kop, 'maximaal 2' in de kleine letters, en eerst een app. Dat is niet eerlijk.

Verbeterideeën:
- P30-a: Zet de looptijd naast de prijs in de kop, niet in de kleine letters.
- P30-b: Schrap 'onbeperkt' uit de kop.
- P30-c: Laat in de kop zien voor wie het bedoeld is.
- P30-d: Zet looptijd, KvK en telefoonnummer zichtbaar boven de aanmeldknop.
- P35-a: Zet een telefoonnummer naast de knop 'Download de app'.
- P35-b: Haal de grote belofte uit de kop en zet het nummer bovenaan.
- P35-c: Haal het woord 'onbeperkt' weg en zet het jaarcontract gewoon bij de prijs.
- P40-a: Zet de voorwaarden in dezelfde letter als de prijs, niet schuin eronder.
- P40-b: Laat materiaal met bon op de factuur komen in plaats van afrekenen aan de deur.
- P40-c: Zet een telefoonnummer naast de knop 'Download de app'.
- P42-a: Zet het jaarcontract niet onderaan in kleine letters, maar schrap het.
- P42-b: Schrap de app als enige weg en zet een telefoonnummer bovenaan.
- P42-c: Zeg bovenaan meteen hoeveel klusjes je krijgt in plaats van 'onbeperkt'.
- P45-a: Zet een telefoonnummer in grote letters bovenaan in plaats van de knop 'Download de app'.
- P45-b: Zet het jaarcontract niet onderaan in kleine letters maar bovenaan bij de prijs.
- P45-c: Schrap 'onbeperkt' en zet 'twee klusjes per maand, één jaar vast' in de kop.
- P45-d: Laat de klusser zich vooraf voorstellen met naam en foto, en reken niets af aan de deur.
- P47-a: Schrap 'onbeperkt' en zet het jaarcontract in de kop, niet onderaan.
- P47-b: Laat mensen ook telefonisch melden en zet de looptijd bovenaan.
- P47-c: Zet de prijs per klus en een echte naam in de kop, niet de app.
- P31-a: Haal 'nooit meer' uit de kop en zet een telefoonnummer naast de appknop.
- P31-b: Zet de looptijd van het abonnement naast de prijs in de kop.
- P31-c: Schrap 'onbeperkt' en zet 'twee klusjes per maand, jaarcontract' gewoon bovenaan.
- P13-a: Zet 'jaarabonnement' bovenaan bij de prijs, of schrap het.
- P13-b: Laat tien echte reviews van buurtgenoten zien in plaats van alleen beloftes.
- P13-c: Laat het afrekenen aan de deur weg en zet materiaal op de factuur.
- P16-a: Zet het jaarcontract in de kop, of haal het weg.
- P16-b: Laat de app als enige ingang los en zet prijs en voorwaarden in de kop.
- P16-c: Schrap 'onbeperkt' en zet looptijd en maximum in de kop.
- P06-a: Zet de voorwaarden bovenaan in plaats van in de kleine letters.
- P06-b: Zeg wat ik terugkrijg als de 48 uur niet gehaald wordt.
- P06-c: Laat in de kop zien wat dit anders maakt dan een gewone klusjesman.
- P39-a: Zet het telefoonnummer bovenaan en het jaarcontract gewoon in de kop.
- P39-b: Schrap 'onbeperkt' en zet de twee klusjes en het jaarcontract in de kop.
- P39-c: Haal 'een deur die klemt' en 'smart home' uit het rijtje van halfuurklussen.
- P39-d: Zet in de kop dat je ook per keer kunt betalen.
- K10-a: Zet looptijd en opzeggen in de kop, niet onder de knop.
- K10-b: Laat de app los als enige ingang en zet een telefoonnummer bovenaan.
- K10-c: Haal 'onbeperkt' weg als er een maximum geldt.
- K06-a: Zet het telefoonnummer groot bovenaan en haal het jaarcontract weg.
- K06-b: Zet 'twee klusjes per maand, een jaar vast' gewoon in de kop.
- K06-c: Telefoonnummer in de kop in plaats van de app.
- K12-a: Maak bellen de eerste meldroute en de app optioneel.
- K12-b: Zet het jaarcontract in de kop of schaf het af, en laat de app vallen als voorwaarde.
- K12-c: Schrap 'onbeperkt' en zet aantal klusjes en looptijd in de kop.

Triggers:
- P30-a: Als meteen bovenaan staat dat je elke maand kunt stoppen.
- P30-b: Eerlijk vooraan zeggen wat je krijgt en hoe lang je vastzit.
- P30-c: Niets op dit moment.
- P30-d: Een bereikbaar nummer, een adres en maandelijks opzeggen vanaf dag één.
- P35-a: Als ik gewoon kon bellen en iemand aan de lijn kreeg.
- P35-b: Een telefoonnummer waar gewoon een mens opneemt.
- P35-c: Als alle voorwaarden eerlijk bovenaan stonden.
- P40-a: Als bovenaan in gewone letters staat dat je elke maand kunt stoppen en dat je kunt bellen.
- P40-b: Geen contract en vooraf weten wat alles kost, ook het materiaal.
- P40-c: Een telefoonnummer waar een mens opneemt.
- P42-a: Als er bovenaan in gewone woorden staat dat ik elke maand kan stoppen en dat ik kan bellen.
- P42-b: Een telefoonnummer waar een echt mens opneemt.
- P42-c: Een eerlijke kop zonder 'onbeperkt' en zonder jaarcontract.
- P45-a: Als de thuiszorg of iemand uit het dorp zegt dat het goed is en ik gewoon kan bellen.
- P45-b: Als ze eerlijk zeggen wat ze doen dat de woningbouw niet doet.
- P45-c: Als alles wat in de kleine letters staat ook gewoon bovenaan staat.
- P45-d: Als ik vooraf weet wie er komt en mijn kinderen alles betalen.
- P47-a: Eerlijk vooraan zeggen wat je krijgt en dat je maandelijks weg kunt.
- P47-b: Geen contract en ook bellen kunnen in plaats van alleen de app.
- P47-c: Duidelijk zien dat er geen abonnement aan vastzit.
- P31-a: Als ik gewoon kon bellen zonder eerst een app te moeten downloaden.
- P31-b: Een pagina die het jaarcontract bovenaan zet of, beter, gewoon niet heeft.
- P31-c: Een pagina waar kop en voorwaarden hetzelfde verhaal vertellen.
- P13-a: Geen app verplicht en geen jaar vast, gewoon maandelijks stoppen.
- P13-b: Geen vast contract en reviews van mensen hier uit de buurt.
- P13-c: Melden per telefoon en alles via mijn factuur.
- P16-a: Een versie zonder vaste looptijd en met alle kosten bovenaan.
- P16-b: Een duidelijke reden waarom dit beter is dan mijn huidige klusjesman.
- P16-c: Een pagina waarop kop en kleine letters hetzelfde zeggen.
- P06-a: Maandelijks opzegbaar vooraan en gewoon kunnen bellen.
- P06-b: Een harde garantie voor als de klusser niet komt.
- P06-c: Geen vaste maandkosten.
- P39-a: Een telefoonnummer bovenaan en vanaf dag één maandelijks opzegbaar.
- P39-b: Als de kop net zo eerlijk is als de kleine lettertjes.
- P39-c: Eerlijk zeggen wat je in een half uur wel en niet goed kunt doen.
- P39-d: Niets, niet nu ik aan het bezuinigen ben.
- K10-a: Dat er bovenaan gewoon staat dat je elke maand kunt stoppen.
- K10-b: Een telefoonnummer waar een mens opneemt.
- K10-c: Dat er van begin af aan eerlijk staat wat je krijgt.
- K06-a: Een telefoonnummer waar een mens opneemt.
- K06-b: Vooraf eerlijk zeggen wat je krijgt en hoe lang je vastzit.
- K06-c: Niks vast per maand.
- K12-a: Een telefoonnummer bovenaan in plaats van een app-knop.
- K12-b: Gewoon kunnen bellen en geen jaarcontract.
- K12-c: Eerlijke voorwaarden bovenaan en geen app als toegangspoort.

## Object `v1` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| begrip | 5.5 | 5.51 |
| relevantie | 3.26 | 3.33 |
| aantrekkelijkheid | 3.95 | 3.89 |
| vertrouwen | 4.68 | 4.64 |
| intentie | 2.2 | 2.27 |

Intentie gewogen: {'negatief (1-3)': 89.2, 'positief (5-7)': 4.8, 'neutraal (4)': 5.9}
Gedrag gewogen %: {'leest verder': 57.0, 'negeert': 26.1, 'klikt weg': 6.1, 'bewaart voor later': 5.9, 'deelt met iemand': 2.7, 'vraagt iemand anders': 2.1}
Bezwaren gewogen %: {'prijs': 61.0, 'alternatief': 15.0, 'vertrouwen': 10.4, 'relevantie': 7.7, 'tijd': 2.5, 'begrip': 2.1, 'toegankelijkheid': 1.3}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'begrip': 5.56, 'relevantie': 3.33, 'aantrekkelijkheid': 3.44, 'vertrouwen': 4.44, 'intentie': 2.22}, 'hoofdgroep': {'begrip': 5.49, 'relevantie': 3.33, 'aantrekkelijkheid': 4.01, 'vertrouwen': 4.7, 'intentie': 2.28}}
Sterkst: [('P35', 'Hennie Bosman', 3), ('P31', 'Annemarie Kok', 3), ('P16', 'Jeroen Smit', 3)]  |  Zwakst: [('P39', 'Henk Groothuis', 1.5), ('K06', 'Johan Wubbels', 1.67), ('P06', 'Sanne de Groot', 1.67)]

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 1.75 | 0.43 | {'begrip': 5.5, 'relevantie': 2.25, 'aantrekkelijkheid': 3.5, 'vertrouwen': 4.75, 'intentie': 1.75} | {'leest verder': 2, 'klikt weg': 1, 'negeert': 1} | ['prijs', 'vertrouwen', 'begrip', 'prijs'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 3 | 1.41 | {'begrip': 5.33, 'relevantie': 4, 'aantrekkelijkheid': 4.33, 'vertrouwen': 4.67, 'intentie': 3} | {'vraagt iemand anders': 1, 'negeert': 1, 'leest verder': 1} | ['prijs', 'prijs', 'prijs'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 2.33 | 0.47 | {'begrip': 5.33, 'relevantie': 3.67, 'aantrekkelijkheid': 4.33, 'vertrouwen': 5.33, 'intentie': 2.33} | {'negeert': 1, 'leest verder': 2} | ['prijs', 'prijs', 'prijs'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 2.33 | 1.25 | {'begrip': 5.67, 'relevantie': 3.67, 'aantrekkelijkheid': 4, 'vertrouwen': 4.67, 'intentie': 2.33} | {'leest verder': 1, 'bewaart voor later': 1, 'negeert': 1} | ['prijs', 'vertrouwen', 'prijs'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 2.5 | 0.5 | {'begrip': 5, 'relevantie': 3.5, 'aantrekkelijkheid': 3.5, 'vertrouwen': 3.75, 'intentie': 2.5} | {'negeert': 2, 'leest verder': 2} | ['prijs', 'alternatief', 'prijs', 'vertrouwen'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 1.67 | 0.47 | {'begrip': 5.67, 'relevantie': 3, 'aantrekkelijkheid': 4, 'vertrouwen': 4.33, 'intentie': 1.67} | {'leest verder': 2, 'negeert': 1} | ['prijs', 'prijs', 'vertrouwen'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 3 | 0.82 | {'begrip': 5.33, 'relevantie': 4, 'aantrekkelijkheid': 4.67, 'vertrouwen': 5, 'intentie': 3} | {'negeert': 1, 'bewaart voor later': 1, 'leest verder': 1} | ['tijd', 'alternatief', 'prijs'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 2.33 | 0.47 | {'begrip': 6, 'relevantie': 3.67, 'aantrekkelijkheid': 4.33, 'vertrouwen': 4.67, 'intentie': 2.33} | {'negeert': 1, 'leest verder': 2} | ['prijs', 'alternatief', 'prijs'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 3 | 1.41 | {'begrip': 5.67, 'relevantie': 4, 'aantrekkelijkheid': 4.33, 'vertrouwen': 5, 'intentie': 3} | {'leest verder': 2, 'deelt met iemand': 1} | ['prijs', 'alternatief', 'prijs'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 1.67 | 0.47 | {'begrip': 5.67, 'relevantie': 2.67, 'aantrekkelijkheid': 3.67, 'vertrouwen': 5, 'intentie': 1.67} | {'leest verder': 2, 'klikt weg': 1} | ['relevantie', 'prijs', 'alternatief'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 1.5 | 0.5 | {'begrip': 5.25, 'relevantie': 2.25, 'aantrekkelijkheid': 3.5, 'vertrouwen': 4.5, 'intentie': 1.5} | {'leest verder': 3, 'negeert': 1} | ['relevantie', 'prijs', 'prijs', 'relevantie'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 3 | 0.82 | {'begrip': 6, 'relevantie': 4.67, 'aantrekkelijkheid': 4, 'vertrouwen': 4.67, 'intentie': 3} | {'klikt weg': 1, 'leest verder': 1, 'bewaart voor later': 1} | ['prijs', 'alternatief', 'prijs'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 1.67 | 0.94 | {'begrip': 4.67, 'relevantie': 2.33, 'aantrekkelijkheid': 3, 'vertrouwen': 4.33, 'intentie': 1.67} | {'leest verder': 2, 'negeert': 1} | ['prijs', 'alternatief', 'toegankelijkheid'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 2 | 0.0 | {'begrip': 6, 'relevantie': 3, 'aantrekkelijkheid': 3.33, 'vertrouwen': 4.33, 'intentie': 2} | {'negeert': 1, 'leest verder': 2} | ['prijs', 'alternatief', 'prijs'] |

Citaten:
- P30-a: Honderdnegenenzeventig euro per jaar voor vier klusjes, dat is geen koopje.
- P30-b: Eén tevreden mevrouw uit Apeldoorn. Ik wil weten wat de andere honderd vinden.
- P30-c: Te lang. Twee klusjes per maand heb ik niet eens.
- P30-d: Van deze weet ik wie het is. Alleen is Henk goedkoper.
- P35-a: Gewoon bellen en elke keer dezelfde Rik over de vloer, dat vind ik wel wat.
- P35-b: Opzegbaar, zeggen ze. Ik ben al eens ergens ingetrapt, ik betaal niet meer voor niks.
- P35-c: Netjes uitgelegd, maar €180 per jaar voor een paar lampjes kan er nu gewoon niet bij.
- P40-a: Honderdtachtig euro per jaar en wat je niet gebruikt vervalt. Dat vind ik zonde.
- P40-b: Netjes geregeld, maar vier klusjes per jaar voor honderdtachtig euro, dan betaal ik voor lucht.
- P40-c: Een vaste klusser die je bij naam kent, dat is net als vroeger. Alleen best prijzig.
- P42-a: Dat is €179,40 per jaar, en de helft van de maanden heb ik niks.
- P42-b: Zelf bellen en elke keer dezelfde man, dat is fatsoenlijk. Mijn dochter schrijft het nummer op.
- P42-c: Eerlijker, ja. Maar ik streep juist dingen weg, ik zet er niks bij.
- P45-a: Elke maand betalen voor een lamp die het gewoon doet? Nee, dat hoeft niet.
- P45-b: Klusjes die vervallen, dan betaal je voor niks. Dat doet de diaconie beter.
- P45-c: Nu staat het eerlijk op papier. Alleen zonde van de klusjes die vervallen.
- P45-d: Niets afrekenen aan de deur, dat is fijn. Maar ik ken die Rik niet.
- P47-a: Eerlijker dan eerst, dat wel. Maar veertien euro per maand voor lucht, dat doe ik niet.
- P47-b: Keurig opgeschreven, maar honderdtachtig euro per jaar is deze maand echt niet aan de orde.
- P47-c: Te lang om even te lezen. En een maandbedrag, daar ben ik klaar mee.
- P31-a: Eerlijker dan het eerste, maar die kop is een halve alinea.
- P31-b: Netjes en volledig. Maar ik heb al iemand, en die belt ook gewoon terug.
- P31-c: Eindelijk staan de voorwaarden gewoon bovenaan. Maar vervallen klusjes blijven zonde.
- P13-a: Twee klusjes per maand? Bij ons blijft dat gewoon liggen.
- P13-b: Netjes uitgelegd, maar Henk komt ook als ik app, zonder maandbedrag.
- P13-c: Goed geregeld, maar twee klusjes per maand voor mijn moeder? Die vervallen gewoon.
- P16-a: Netjes opgeschreven, maar in een maand zonder klus betaal ik gewoon voor niets.
- P16-b: Twee klusjes, maandelijks opzegbaar. Scheelt ons een zaterdag. Stuur ik door.
- P16-c: Netjes, maar wie niets laat doen, betaalt gewoon door. Ken ik.
- P06-a: Eindelijk een telefoonnummer en een adres. Alleen twee klusjes per maand, die hebben wij niet.
- P06-b: Het is eerlijker geworden, maar wij betalen dan vooral voor klusjes die vervallen.
- P06-c: Netjes dat je maandelijks kunt opzeggen, maar ik heb onze klusjesman al.
- P39-a: Netjes opgeschreven, maar twee klusjes per maand heb ik nooit. Die laat ik vervallen.
- P39-b: Eerlijk opgeschreven, dat wel. Maar er kan deze maand geen vijftien euro bij.
- P39-c: Beter dan het eerste, maar twee klusjes per maand, dat heeft Riek in een jaar nog niet.
- P39-d: Maandelijks opzegbaar, mooi. Maar de lampen bij mijn dochter hang ik zelf op.
- K10-a: Twee klusjes per maand die vervallen? Mama heeft misschien twee per jaar.
- K10-b: Netjes opgeschreven, maar de huismeester vervangt die lamp ook al gratis.
- K10-c: Hij belt mij vooraf, niet mama. Dat is het eerste wat ik hier geloof.
- K06-a: Bellen kan, dat is goed. Maar honderdtachtig euro voor drie keer de tv? Nee.
- K06-b: Vijftien euro per maand terwijl Jesse van hiernaast het voor een krat bier doet?
- K06-c: Opzegbaar staat er, dat is goed. Maar dat hele stuk lees ik niet.
- K12-a: Beter dan de eerste, maar ik zit juist abonnementen op te zeggen.
- K12-b: Redelijk, maar niet beter dan wat ik heb. En over mijn gegevens zwijgen ze.
- K12-c: Eerlijker dan het origineel, maar vervallende klusjes zijn het verdienmodel. Dat zie ik heus.

Verbeterideeën:
- P30-a: Laat ongebruikte klusjes niet vervallen maar doorschuiven.
- P30-b: Zet een reviewscore met aantal beoordelingen bovenaan.
- P30-c: Knip de kop in tweeën: wat het is, en daaronder de prijs.
- P30-d: Laat zien wat het per klus kost bij normaal gebruik, niet alleen per maand.
- P35-a: Laat de klusser bij het eerste bezoek even kennismaken, met een kopje koffie erbij.
- P35-b: Maak de kop korter, dan zie je in één keer wat het is.
- P35-c: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- P40-a: Maak de kop korter en zet de jaarprijs net zo groot als de maandprijs.
- P40-b: Reken op de pagina voor wat het per klus kost als je er maar een paar per jaar hebt.
- P40-c: Begin met 'Bel ons' en het nummer, en zet de rest eronder.
- P42-a: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- P42-b: Neem de 'komt hij niet, dan gratis'-belofte uit A over in deze versie.
- P42-c: Laat zien voor wie het zich terugbetaalt en voor wie niet.
- P45-a: Zet bovenaan in grote letters wat het per jaar kost en wat je daarvoor terugkrijgt.
- P45-b: Laat niet gebruikte klusjes niet vervallen, want dat voelt als weggegooid geld.
- P45-c: Laat niet gebruikte klusjes een paar maanden staan, zoals bij de Klusbuffer.
- P45-d: Zet een foto van de klusser erbij, zodat ik weet wie er voor de deur staat.
- P47-a: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- P47-b: Zet naast het maandbedrag wat je betaalt als je weinig gebruikt.
- P47-c: Maak de kop korter: klusser, prijs, opzegbaar, meer niet.
- P31-a: Knip de kop in tweeën: eerst wat het is, dan pas de voorwaarden.
- P31-b: Zet bovenaan in één zin waarin dit beter is dan een eigen klusjesman.
- P31-c: Laat ongebruikte klusjes minstens drie maanden staan in plaats van ze te laten vervallen.
- P13-a: Knip de kop in tweeën: eerst wat het is, dan pas prijs en opzegbaar.
- P13-b: Zet een reviewscore met aantal beoordelingen bij de prijs.
- P13-c: Maak een variant met één klus per maand die je kunt opsparen.
- P16-a: Laat ongebruikte klusjes een paar maanden doorlopen in plaats van ze te laten vervallen.
- P16-b: Zet de eerste maand voor €1 in de kop; dan is proberen naast de huidige klusser een no-brainer.
- P16-c: Zet 'ongebruikte klusjes vervallen' niet onderaan maar bij de prijs, of schaf het af.
- P06-a: Zet de betrouwbaarheidsinfo in een kort blokje bovenaan, zodat ik het in tien seconden zie.
- P06-b: Voeg dezelfde niet-op-tijd-garantie toe als in de andere versies.
- P06-c: Maak de kop korter, zodat de kern in één regel op mijn telefoon past.
- P39-a: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- P39-b: Laat zien hoeveel je per jaar kwijt bent als je bijna niks gebruikt.
- P39-c: Bied een kleiner pakket aan met één klusje dat je kunt bewaren.
- P39-d: Maak in de kop duidelijk voor wie het is, niet voor iedereen.
- K10-a: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- K10-b: Bied een lichter pakket aan voor ouderen in een aanleunwoning met huismeester.
- K10-c: Laat ongebruikte klusjes een paar maanden staan.
- K06-a: Minder tekst: kop, prijs en telefoonnummer, de rest kan weg.
- K06-b: Een lidmaatschap dat een paar buren samen kunnen nemen.
- K06-c: Haal de helft van de tekst weg.
- K12-a: Laat ongebruikte klusjes doorschuiven naar de volgende maand.
- K12-b: Voeg een korte, concrete privacyparagraaf toe zoals in versie A.
- K12-c: Laat ongebruikte klusjes doorschuiven en noem welke gegevens bewaard worden.

Triggers:
- P30-a: Een pakket dat past bij iemand die maar af en toe iets heeft.
- P30-b: Een beoordeling op een onafhankelijke site of in de Consumentengids.
- P30-c: Een korte kop met alleen wat het kost en wat je krijgt.
- P30-d: Als Henk ermee stopt en ik iemand betrouwbaars nodig heb.
- P35-a: Als mijn dochter of een vriendin zegt dat het goed bevalt.
- P35-b: Als ik alleen betaal wanneer ik echt iemand nodig heb.
- P35-c: Als ik niet elke maand hoef te betalen voor klusjes die vervallen.
- P40-a: Als niet gebruikte klusjes gewoon blijven staan.
- P40-b: Als de klusjes die ik niet gebruik blijven staan.
- P40-c: Als de buurvrouw hem ook heeft en er blij mee is.
- P42-a: Als ongebruikte klusjes blijven staan, of als ik alleen betaal in een maand dat er iets is.
- P42-b: Een belofte dat ik niets betaal als hij niet op tijd komt, zoals bij A.
- P42-c: Als het goedkoper is dan wat ik nu kwijt ben aan losse klusjes.
- P45-a: Als ik alleen hoef te betalen als er echt iets kapot is.
- P45-b: Als de diaconie zelf zegt dat ze het niet meer redden en dit aanraden.
- P45-c: Als de klusser iemand uit ons eigen dorp was die ze bij de kerk ook kennen.
- P45-d: Als die vrouw van de kerk zegt dat het dezelfde klusser is die bij haar kwam.
- P47-a: Niet gebruikte klusjes laten staan in plaats van laten vervallen.
- P47-b: Een goedkopere variant zonder vervallende klusjes.
- P47-c: Een kortere kop en een belofte wat er gebeurt als ze niet komen.
- P31-a: Een korte kop met alleen de prijs en 'maandelijks opzegbaar'.
- P31-b: Als mijn huidige klusjesman stopt of niet meer op tijd komt.
- P31-c: Als ongebruikte klusjes een paar maanden bewaard bleven, zoals in versie C.
- P13-a: Als ongebruikte klusjes blijven staan in plaats van vervallen.
- P13-b: Een flinke stapel reviews van gezinnen uit mijn omgeving.
- P13-c: Een kleiner pakket voor één ouderenhuis.
- P16-a: Als ongebruikte klusjes blijven staan, wordt het een serieuze optie.
- P16-b: Als mijn vrouw ook ziet dat het ons weekenden scheelt, proberen we het.
- P16-c: Als niet gebruikte klusjes niet verloren gaan.
- P06-a: Een lichtere variant zonder vaste twee klusjes per maand.
- P06-b: Klusjes die blijven staan als je ze niet gebruikt.
- P06-c: Iets wat onze buurtklusser niet kan, zoals wifi of de tv instellen.
- P39-a: Als niet gebruikte klusjes blijven staan in plaats van te vervallen.
- P39-b: Een maand waarin het geld er gewoon is en er echt iets kapot is.
- P39-c: Minder klusjes voor minder geld, en dat ze niet vervallen.
- P39-d: Alleen als ik het zelf echt niet meer kan.
- K10-a: Een maand waarin je niets gebruikt ook niets laten kosten.
- K10-b: Een kleiner pakket voor iemand die maar af en toe iets heeft.
- K10-c: Een maand proberen en zien of het echt elke keer dezelfde man is.
- K06-a: Alleen betalen als er echt wat is.
- K06-b: Iets wat we met de straat samen kunnen delen.
- K06-c: Een kop die in één regel zegt wat 't is en wat 't kost.
- K12-a: Alleen betalen als er echt iets te doen is.
- K12-b: Een duidelijke zin over welke gegevens ze bewaren en hoe lang.
- K12-c: Klusjes die blijven staan in plaats van vervallen.

## Object `A` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| begrip | 6.39 | 6.32 |
| relevantie | 4.1 | 4.05 |
| aantrekkelijkheid | 4.79 | 4.74 |
| vertrouwen | 4.72 | 4.64 |
| intentie | 3.32 | 3.25 |

Intentie gewogen: {'negatief (1-3)': 57.5, 'neutraal (4)': 37.0, 'positief (5-7)': 5.5}
Gedrag gewogen %: {'bewaart voor later': 48.8, 'leest verder': 22.8, 'deelt met iemand': 11.3, 'negeert': 8.2, 'vraagt iemand anders': 6.7, 'klikt weg': 2.2}
Bezwaren gewogen %: {'prijs': 42.7, 'alternatief': 21.1, 'vertrouwen': 14.5, 'gemak': 12.1, 'relevantie': 4.4, 'kwaliteit': 3.0, 'toegankelijkheid': 2.2}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'begrip': 6.11, 'relevantie': 3.78, 'aantrekkelijkheid': 4.78, 'vertrouwen': 4.33, 'intentie': 3}, 'hoofdgroep': {'begrip': 6.37, 'relevantie': 4.13, 'aantrekkelijkheid': 4.73, 'vertrouwen': 4.73, 'intentie': 3.32}}
Sterkst: [('P40', 'Ria van den Heuvel', 4), ('P35', 'Hennie Bosman', 3.67), ('P47', 'Els Bruinsma', 3.67)]  |  Zwakst: [('P45', 'Corrie Nijland', 2.5), ('K12', 'Jasper Hoek', 3), ('K06', 'Johan Wubbels', 3)]

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 3 | 0.71 | {'begrip': 7, 'relevantie': 3.25, 'aantrekkelijkheid': 4.75, 'vertrouwen': 4.5, 'intentie': 3} | {'leest verder': 2, 'bewaart voor later': 2} | ['prijs', 'prijs', 'prijs', 'alternatief'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 3.67 | 0.47 | {'begrip': 6, 'relevantie': 4.67, 'aantrekkelijkheid': 4.67, 'vertrouwen': 4.67, 'intentie': 3.67} | {'leest verder': 1, 'vraagt iemand anders': 1, 'bewaart voor later': 1} | ['relevantie', 'prijs', 'prijs'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 4 | 0.82 | {'begrip': 6.67, 'relevantie': 5, 'aantrekkelijkheid': 5.67, 'vertrouwen': 5.67, 'intentie': 4} | {'deelt met iemand': 1, 'bewaart voor later': 1, 'vraagt iemand anders': 1} | ['alternatief', 'gemak', 'prijs'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 3.33 | 0.47 | {'begrip': 6, 'relevantie': 4.67, 'aantrekkelijkheid': 4.33, 'vertrouwen': 4.67, 'intentie': 3.33} | {'deelt met iemand': 1, 'leest verder': 2} | ['prijs', 'prijs', 'alternatief'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 2.5 | 0.5 | {'begrip': 5.75, 'relevantie': 3.5, 'aantrekkelijkheid': 3.5, 'vertrouwen': 3.75, 'intentie': 2.5} | {'vraagt iemand anders': 1, 'negeert': 2, 'deelt met iemand': 1} | ['vertrouwen', 'prijs', 'prijs', 'gemak'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 3.67 | 0.47 | {'begrip': 7, 'relevantie': 4.67, 'aantrekkelijkheid': 5.33, 'vertrouwen': 4.67, 'intentie': 3.67} | {'bewaart voor later': 2, 'deelt met iemand': 1} | ['prijs', 'prijs', 'vertrouwen'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 3.33 | 1.25 | {'begrip': 6, 'relevantie': 4.33, 'aantrekkelijkheid': 4.67, 'vertrouwen': 4.67, 'intentie': 3.33} | {'leest verder': 1, 'negeert': 1, 'bewaart voor later': 1} | ['gemak', 'alternatief', 'prijs'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 3.33 | 0.94 | {'begrip': 7, 'relevantie': 4.33, 'aantrekkelijkheid': 5, 'vertrouwen': 4.67, 'intentie': 3.33} | {'klikt weg': 1, 'bewaart voor later': 2} | ['relevantie', 'alternatief', 'toegankelijkheid'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 3 | 0.82 | {'begrip': 6, 'relevantie': 4, 'aantrekkelijkheid': 4, 'vertrouwen': 5, 'intentie': 3} | {'bewaart voor later': 1, 'negeert': 1, 'leest verder': 1} | ['prijs', 'alternatief', 'prijs'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 3.67 | 0.47 | {'begrip': 6.67, 'relevantie': 4, 'aantrekkelijkheid': 5.33, 'vertrouwen': 5, 'intentie': 3.67} | {'bewaart voor later': 2, 'leest verder': 1} | ['vertrouwen', 'gemak', 'alternatief'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 3 | 0.71 | {'begrip': 6, 'relevantie': 3, 'aantrekkelijkheid': 4.75, 'vertrouwen': 4.75, 'intentie': 3} | {'bewaart voor later': 4} | ['kwaliteit', 'vertrouwen', 'alternatief', 'vertrouwen'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 3 | 0.82 | {'begrip': 6, 'relevantie': 4, 'aantrekkelijkheid': 4, 'vertrouwen': 3.33, 'intentie': 3} | {'bewaart voor later': 1, 'leest verder': 2} | ['gemak', 'vertrouwen', 'gemak'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 3 | 0.0 | {'begrip': 6, 'relevantie': 3.33, 'aantrekkelijkheid': 4.67, 'vertrouwen': 4.67, 'intentie': 3} | {'leest verder': 1, 'bewaart voor later': 2} | ['prijs', 'prijs', 'prijs'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 3 | 0.0 | {'begrip': 6.33, 'relevantie': 4, 'aantrekkelijkheid': 5.67, 'vertrouwen': 5, 'intentie': 3} | {'bewaart voor later': 3} | ['kwaliteit', 'alternatief', 'prijs'] |

Citaten:
- P30-a: Per klus betalen, dat is tenminste eerlijk. Of ik het nodig heb, eerst zien.
- P30-b: Per klus, geen abonnement. Zo hoort het. Nu nog zien wat anderen zeggen.
- P30-c: Duidelijk, dat wel. Maar voor een lamp bel ik niemand.
- P30-d: Vijf voor honderdvijfentwintig, alleen als het nodig is. Die bewaar ik voor als Henk niet kan.
- P35-a: Duidelijk hoor, €29 per keer, maar het voelt een beetje als een kaal loket.
- P35-b: Geen abonnement en gratis als ze te laat zijn. Dat is tenminste netjes.
- P35-c: Een kaart van €125 voor twee jaar, samen met de buurvrouw. Dat kan ik overzien.
- P40-a: Geen abonnement, en de buurvrouw mag meedoen op die kaart. Dat is tenminste netjes.
- P40-b: Geen abonnement, betalen per factuur, en ik bel zelf als ik iemand nodig heb. Zo wil ik het.
- P40-c: Bellen, klusser komt, pinnen. Dat snap ik. Ik laat het mijn dochter even zien.
- P42-a: Vijf klussen voor €125, met de buurvrouw samen, dat is €62,50. Dat zie ik wel zitten.
- P42-b: €29 voor één lampje is veel, maar dat hij gratis is als hij niet komt, dat telt.
- P42-c: Geen abonnement, dat is het eerste goeie. Maar de tv doet mijn kleinzoon.
- P45-a: Niks vast, alleen als het nodig is. Dat moet mijn zoon maar bekijken.
- P45-b: Negenentwintig euro voor een half uurtje? Daar schrik ik van, zeker deze maand.
- P45-c: Een kaart samen met de buurvrouw, dat is mooi bedacht. Die zou ik haar geven.
- P45-d: Zelf bellen en aan de deur pinnen, dat is nu net wat ik niet wil.
- P47-a: Dit is tenminste gewoon betalen als er iets is. Ik bewaar het, zonder meer.
- P47-b: Eerst één klusje bij de buurvrouw proberen, dan pas die kaart. Dat vind ik een fijn idee.
- P47-c: Geen abonnement, gewoon betalen per klus. Dat begrijp ik, en dat durf ik wel.
- P31-a: Geen abonnement, dat lees ik graag. Maar komt hij ook zaterdag?
- P31-b: Duidelijk, maar dit heb ik eigenlijk al.
- P31-c: Geen app, geen abonnement, en ze vertellen wat ze bewaren. Dat is fatsoenlijk.
- P13-a: Handig als er iets stuk is. Nu is er niks stuk.
- P13-b: Geen abonnement, geen gedoe. Als Henk niet kan, bel ik deze.
- P13-c: Rekenkundig de slimste, maar dan hoor ik niks over hoe het bij mijn moeder ging.
- P16-a: Geen vaste last, een harde belofte, en ik snap de rekensom. Die bewaar ik.
- P16-b: Dit heb ik al, alleen zonder garantie. Geen reden om te wisselen.
- P16-c: Eerlijk model, harde belofte. Alleen €29 voor een lamp voelt deze maand te duur.
- P06-a: Gewoon €29 per klus en gratis als ze te laat zijn. Dat snap ik tussen twee lessen door.
- P06-b: Gratis als ze niet komen: dat is het eerste wat ik wil lezen na vorig jaar.
- P06-c: Geen abonnement en alleen betalen als het nodig is. Die bewaar ik even.
- P39-a: Bellen, klus, rekening, zo ken ik het. Maar ik wil weten of die jongen z'n vak kent.
- P39-b: Geen abonnement, niks vast. Dat is het eerste dat ik hier goed vind.
- P39-c: Een klussenkaart voor Riek, dat is nog eens een verjaardagscadeau. Voor als ik weg ben.
- P39-d: Geen abonnement. Dat is vandaag het enige woord dat ik wil lezen.
- K10-a: Alleen betalen als er echt wat kapot is, dat kan ik deze maand nog hebben.
- K10-b: Meteen een afspraak, zeggen ze allemaal. Vorige week hing ik drie kwartier in de wacht.
- K10-c: Een gratis klus als hij niet komt? Ik wil gewoon dat hij komt.
- K06-a: Negenentwintig euro, geen abonnement. Dat snap ik tenminste zonder bril.
- K06-b: Een kaart die ik bij m'n moeder en de buurvrouw kan gebruiken, daar kan ik wat mee.
- K06-c: Negenentwintig per klus en verder niks. Dat is tenminste eerlijk.
- K12-a: Per klus betalen en ze bewaren bijna niets. De eerste die ik niet meteen wegleg.
- K12-b: Naam, adres, telefoonnummer, en alleen zolang ik klant ben. Zo hoort het. Die bewaar ik.
- K12-c: Betalen als ik iets heb, niets als ik niets heb, en ze zeggen wat ze bewaren.

Verbeterideeën:
- P30-a: Noem een paar voorbeeldklussen met wat ze kosten inclusief materiaal.
- P30-b: Zet een plafond op de meerprijs, bijvoorbeeld nooit meer dan €24 extra.
- P30-c: Zet de klussenkaart voor ouders en buren in de kop, dat is het sterke punt.
- P30-d: Zet het vestigingsadres en de klachtenregeling er ook in deze versie bij.
- P35-a: Vertel ook hier wie de klusser is en dat je hem steeds weer ziet.
- P35-b: Laat met een voorbeeld zien wat je voor €29 allemaal gedaan krijgt.
- P35-c: Spreek af dat een klus nooit meer kost dan een vooraf genoemd bedrag.
- P40-a: Zeg erbij wat materiaal voor een gewone klus ongeveer kost, zodat je niet voor verrassingen staat.
- P40-b: Zet erbij dat je de klussenkaart ook per telefoon kunt bestellen en per factuur betalen.
- P40-c: Laat de vaste klussers met naam en foto zien, dan weet je wie er aanbelt.
- P42-a: Zet erbij dat de klusser altijd eerst de prijs noemt voordat hij langer doorwerkt.
- P42-b: Geef een lagere prijs voor een eerste kennismakingsklus.
- P42-c: Laat meer zien van klussen die familie meestal niet doet, zoals boren en ophangen.
- P45-a: Noem een klant uit een dorp in de buurt met volledige naam in plaats van alleen een voorletter.
- P45-b: Laat de betaling altijd per factuur naar de kinderen gaan in plaats van pinnen aan de deur.
- P45-c: Zeg er duidelijk bij dat één klussenkaart met meerdere adressen in de straat gedeeld mag worden.
- P45-d: Laat bij de klussenkaart een familielid de afspraken maken en de factuur ontvangen.
- P47-a: Vermeld dat de klusser de tijd op de factuur zet, met begin- en eindtijd.
- P47-b: Laat de klussenkaart ook in twee termijnen betalen.
- P47-c: Zet de 'niet op tijd, dan gratis'-belofte ook in de kop.
- P31-a: Noem de avonden en zaterdag ook in deze versie, net als in de andere.
- P31-b: Vergelijk de prijs openlijk met een gemiddeld uurtarief plus voorrijkosten.
- P31-c: Vermeld wat er na twee jaar met een halfvolle klussenkaart gebeurt, en noem de avond- en zaterdagtijden.
- P13-a: Een knop 'zet ons in je contacten' zodat het nummer er staat als je het nodig hebt.
- P13-b: Een eerste klus voor een proefprijs, zodat je het eens probeert naast je eigen klusjesman.
- P13-c: Laat je bij de klussenkaart een contactpersoon opgeven die gebeld wordt en een berichtje krijgt.
- P16-a: Zet erbij of avond- en zaterdagafspraken ook onder de €29 vallen.
- P16-b: Zet 'binnen twee werkdagen of gratis' groter in de kop; dat is het enige verschil met mijn eigen klusser.
- P16-c: Maak een kwartiertarief voor klusjes die korter dan 15 minuten duren.
- P06-a: Zet ook hier het vestigingsadres en een paar recente klantervaringen neer.
- P06-b: Noem de bezoektijden bij de klusser, niet alleen de openingstijden van de telefoon.
- P06-c: Noem de technische hulp (wifi, tv, smart home) al in de kop.
- P39-a: Vermeld bij elke klusser zijn vakdiploma en jaren ervaring.
- P39-b: Zet het bedrijfsadres ook op deze versie, naast het KvK-nummer.
- P39-c: Verkoop de klussenkaart ook als cadeaubon, met een kaartje erbij.
- P39-d: Zet de belofte 'niet binnen twee werkdagen, dan gratis' bij de prijs in de kop.
- K10-a: Zet erbij: 'Uw ouder hoeft nooit te betalen aan de deur, de factuur gaat naar u.'
- K10-b: Laat meer klanten aan het woord dan één citaat zonder achternaam.
- K10-c: Zet erbij dat de factuur altijd naar de familie kan en er aan de deur niet betaald wordt.
- K06-a: Zeg erbij wat je voor tv en wifi precies kan laten doen in die 30 minuten.
- K06-b: Een kleinere kaart van drie klussen, of in twee keer betalen.
- K06-c: Een kaartje met het nummer voor op de koelkast.
- K12-a: Voeg toe: niet opgelost, dan betaalt u niets.
- K12-b: Noem contant betalen aan de deur als mogelijkheid naast pin en factuur.
- K12-c: Zet erbij dat online boeken zonder account kan en noem contant als betaalmogelijkheid.

Triggers:
- P30-a: Als het voor de wifi of iets hoogs is waar ik met mijn knieën niet meer op wil.
- P30-b: Goede reviews van mensen uit de buurt en een maximumprijs per klus.
- P30-c: Als de buurman die alleen woont er een kaart voor zou nemen.
- P30-d: Als Henk een keer niet kan en ik snel iemand nodig heb die ik kan vertrouwen.
- P35-a: Als er meer stond over wie er komt, zoals bij die andere versie.
- P35-b: Als mijn dochter zegt dat het de moeite waard is.
- P35-c: Een vaste maximumprijs per klus, zodat er geen verrassing op de factuur komt.
- P40-a: Als de dames van het kaarten zeggen dat ze er goed mee uit zijn.
- P40-b: Een eerste klus die gewoon goed gaat, voor de afgesproken prijs.
- P40-c: Als mijn dochter zegt dat het goed is.
- P42-a: Als de buurvrouw meedoet met de klussenkaart en haar eerste ervaring goed is.
- P42-b: Als de eerste klus goedkoper is, zodat ik kan zien of hij echt komt.
- P42-c: Als het voor dingen is die mijn kleinzoon niet kan, zoals ophangen of een klemmende deur.
- P45-a: Als iemand uit het dorp of de kerk zegt dat die klusser bij hen goed werk deed.
- P45-b: Als een klusje rond de tien euro zou kosten.
- P45-c: Als we met een paar mensen uit de straat samen één kaart konden nemen.
- P45-d: Als mijn zoon de afspraak en de betaling voor mij kon doen.
- P47-a: Horen van mijn kennis wat het in de praktijk echt kost.
- P47-b: De klussenkaart pas volgende maand kopen en de eerste klus los proberen.
- P47-c: Eén klus die gewoon goed gaat.
- P31-a: Als bovenaan stond dat hij ook 's avonds en op zaterdag kan.
- P31-b: Een duidelijk voordeel boven een losse klusjesman, bijvoorbeeld een vaste prijs die hij niet heeft.
- P31-c: Een zin dat ongebruikte klussen op de kaart terugbetaald of verlengd worden.
- P13-a: Dat ik het terugvind op het moment dat er echt iets stuk is.
- P13-b: Als iemand uit de moedergroep of de buurtapp zegt dat hun klusser goed is.
- P13-c: Dat ik ook bij de kaart na afloop een berichtje krijg als de klus bij mijn moeder was.
- P16-a: Een rekenvoorbeeld van wat een jaar met een paar klussen kost, naast de klussenkaart.
- P16-b: Een duidelijk voordeel ten opzichte van een losse klusjesman, zoals avonden of snelheid.
- P16-c: Een lager instaptarief voor echt kleine dingen, zoals één lamp.
- P06-a: Van mijn collega horen hoe het bij haar moeder echt ging.
- P06-b: Zwart op wit dat ze ook 's avonds en op zaterdag komen.
- P06-c: Een technisch probleem waar onze buurtklusser niets van weet.
- P39-a: Als er per klusser staat wat voor vakman hij is en hoe lang hij het vak doet.
- P39-b: Een vast adres en iemand aan de telefoon die ik kan bellen voordat ik iets afspreek.
- P39-c: Als ik zeker weet dat ze iemand kan bellen terwijl wij weg zijn.
- P39-d: Als iemand uit de familie of het dorp er goede ervaringen mee heeft.
- K10-a: Dat alles standaard op Marjans factuur komt en Nel aan de deur nooit iets hoeft af te rekenen.
- K10-b: Echte ervaringen van andere dochters met een ouder in een zorgwoning.
- K10-c: Dat de klusser vanzelf langskomt als er iets gemeld is, zonder dat Marjan elke keer hoeft te bellen.
- K06-a: Als de buurman het heeft en tevreden is.
- K06-b: Een kaart die je in de familie en de straat kunt delen.
- K06-c: Als een buurman zegt dat ze op tijd kwamen.
- K12-a: Een belofte dat ik niets betaal als het probleem niet opgelost is.
- K12-b: Als mijn huidige klusser stopt of weken niet kan komen.
- K12-c: Contant kunnen betalen en de zekerheid dat er nergens een account nodig is.

## Object `B` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| begrip | 5.6 | 5.53 |
| relevantie | 2.2 | 2.4 |
| aantrekkelijkheid | 3.45 | 3.52 |
| vertrouwen | 4.51 | 4.36 |
| intentie | 1.56 | 1.68 |

Intentie gewogen: {'negatief (1-3)': 89.1, 'neutraal (4)': 7.6, 'positief (5-7)': 3.3}
Gedrag gewogen %: {'negeert': 42.0, 'klikt weg': 30.6, 'vraagt iemand anders': 11.1, 'deelt met iemand': 9.0, 'leest verder': 4.1, 'bewaart voor later': 3.3}
Bezwaren gewogen %: {'relevantie': 79.3, 'prijs': 7.7, 'toegankelijkheid': 6.5, 'vertrouwen': 5.0, 'alternatief': 1.5}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'begrip': 5.22, 'relevantie': 2.89, 'aantrekkelijkheid': 3.56, 'vertrouwen': 3.67, 'intentie': 2.0}, 'hoofdgroep': {'begrip': 5.61, 'relevantie': 2.26, 'aantrekkelijkheid': 3.51, 'vertrouwen': 4.55, 'intentie': 1.6}}
Sterkst: [('P13', 'Anouk Hendriks', 4), ('K10', 'Nel Hoogendoorn', 3.67), ('P45', 'Corrie Nijland', 3)]  |  Zwakst: [('K12', 'Jasper Hoek', 1), ('P06', 'Sanne de Groot', 1), ('P16', 'Jeroen Smit', 1)]

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 1.5 | 0.87 | {'begrip': 6, 'relevantie': 3, 'aantrekkelijkheid': 3.75, 'vertrouwen': 4.5, 'intentie': 1.5} | {'klikt weg': 2, 'vraagt iemand anders': 1, 'leest verder': 1} | ['relevantie', 'relevantie', 'vertrouwen', 'prijs'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 1.33, 'aantrekkelijkheid': 3, 'vertrouwen': 4.33, 'intentie': 1} | {'klikt weg': 2, 'negeert': 1} | ['relevantie', 'relevantie', 'relevantie'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 1.33 | 0.47 | {'begrip': 5.33, 'relevantie': 1.67, 'aantrekkelijkheid': 2.67, 'vertrouwen': 4.33, 'intentie': 1.33} | {'klikt weg': 1, 'negeert': 2} | ['relevantie', 'relevantie', 'relevantie'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 2.33, 'aantrekkelijkheid': 2.33, 'vertrouwen': 4.33, 'intentie': 1} | {'negeert': 1, 'klikt weg': 2} | ['relevantie', 'relevantie', 'relevantie'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 3 | 1.0 | {'begrip': 5.25, 'relevantie': 4.25, 'aantrekkelijkheid': 4.25, 'vertrouwen': 4, 'intentie': 3} | {'negeert': 2, 'vraagt iemand anders': 2} | ['relevantie', 'relevantie', 'alternatief', 'vertrouwen'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 1 | 0.0 | {'begrip': 6, 'relevantie': 1.33, 'aantrekkelijkheid': 3, 'vertrouwen': 5, 'intentie': 1} | {'negeert': 1, 'deelt met iemand': 1, 'klikt weg': 1} | ['relevantie', 'relevantie', 'relevantie'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 1 | 0.0 | {'begrip': 5, 'relevantie': 1, 'aantrekkelijkheid': 3.67, 'vertrouwen': 4.67, 'intentie': 1} | {'klikt weg': 1, 'deelt met iemand': 1, 'negeert': 1} | ['relevantie', 'relevantie', 'relevantie'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 4 | 0.82 | {'begrip': 6.33, 'relevantie': 6, 'aantrekkelijkheid': 5.67, 'vertrouwen': 4.67, 'intentie': 4} | {'bewaart voor later': 1, 'vraagt iemand anders': 1, 'deelt met iemand': 1} | ['toegankelijkheid', 'prijs', 'toegankelijkheid'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 1 | 0.0 | {'begrip': 6.33, 'relevantie': 1, 'aantrekkelijkheid': 3.33, 'vertrouwen': 5, 'intentie': 1} | {'negeert': 2, 'klikt weg': 1} | ['relevantie', 'relevantie', 'relevantie'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 1 | 0.0 | {'begrip': 6, 'relevantie': 1, 'aantrekkelijkheid': 3.67, 'vertrouwen': 4.67, 'intentie': 1} | {'negeert': 3} | ['relevantie', 'relevantie', 'relevantie'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 1.75 | 1.3 | {'begrip': 5.5, 'relevantie': 2, 'aantrekkelijkheid': 3.25, 'vertrouwen': 4.5, 'intentie': 1.75} | {'klikt weg': 2, 'vraagt iemand anders': 1, 'negeert': 1} | ['relevantie', 'relevantie', 'prijs', 'relevantie'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 3.67 | 0.94 | {'begrip': 6, 'relevantie': 5.67, 'aantrekkelijkheid': 5.33, 'vertrouwen': 4, 'intentie': 3.67} | {'bewaart voor later': 1, 'leest verder': 2} | ['prijs', 'toegankelijkheid', 'toegankelijkheid'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 1.33 | 0.47 | {'begrip': 4.33, 'relevantie': 2, 'aantrekkelijkheid': 2.67, 'vertrouwen': 4, 'intentie': 1.33} | {'negeert': 2, 'vraagt iemand anders': 1} | ['relevantie', 'vertrouwen', 'relevantie'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 1 | 0.0 | {'begrip': 5.33, 'relevantie': 1, 'aantrekkelijkheid': 2.67, 'vertrouwen': 3, 'intentie': 1} | {'negeert': 3} | ['relevantie', 'relevantie', 'relevantie'] |

Citaten:
- P30-a: Bij mijn moeder doe ik het zelf, daar heb ik geen klusser voor nodig.
- P30-b: Mijn moeder heeft mij. Daar hoeft geen abonnement bij.
- P30-c: Voor moeder misschien. Eerst met mijn zus overleggen, en met haar zelf.
- P30-d: Netjes geregeld, maar mijn moeder heeft mij, en er kan nu niks bij.
- P35-a: Lief bedacht voor iemands moeder, maar zover ben ik nog lang niet.
- P35-b: Voor uw ouders? Ik ben toch geen oud vrouwtje, dit gaat niet over mij.
- P35-c: Mooi voor een dochter in Groningen, maar ik ben het niet en ik regel het voor niemand.
- P40-a: Een fotootje naar mijn dochter na de klus? Ik ben geen kind, hoor.
- P40-b: Netjes bedoeld, maar dan belt de klusser mijn dochter en niet mij. Ik ben er zelf nog.
- P40-c: Lief bedacht voor kinderen ver weg, maar mijn dochter woont om de hoek.
- P42-a: Mijn dochter betalen voor mijn lampje? Dat hoeft niet, dat regelen we zelf.
- P42-b: Een foto naar mijn dochter van mijn eigen gang? Ik ben toch geen kind.
- P42-c: Mijn ouders zijn er niet meer, en mijn dochter heeft genoeg lasten.
- P45-a: Dit is voor de kinderen geschreven. Mijn dochter komt toch elke dag.
- P45-b: Netjes dat hij eerst belt. Maar mijn dochter woont hier gewoon, hoor.
- P45-c: Hier staat alles eerlijk in, ook het opzeggen. Dat bespreek ik met de kinderen.
- P45-d: De kinderen regelen het en hij laat zijn pasje zien. Dan durf ik het wel.
- P47-a: Voor mijn buurvrouw misschien, maar mij hoeft mijn dochter niet te laten controleren.
- P47-b: Dit stuur ik door naar de dochter van mijn buurvrouw. Voor mij hoeft het niet.
- P47-c: Voor uw ouders? Ik ben zelf de ouder, en ik red me prima.
- P31-a: Niet voor mij. En die kop mist een werkwoord, mevrouw.
- P31-b: Niet voor mij, maar mijn collega met haar moeder moet dit zien.
- P31-c: Die moeder staat tussen haakjes. Ik mis dat zij zelf ook iets te zeggen heeft.
- P13-a: Voor mijn moeder? Misschien. Maar dan belt die man mij, niet haar.
- P13-b: Dat fotootje achteraf wil ik. Alleen niet voor €12,95 deze maand.
- P13-c: Voor mijn moeder: ja. Maar bel dan mij voor de afspraak, niet haar.
- P16-a: Goed doordacht, alleen niet voor mij. Opzeggen zonder opzegtermijn zou overal moeten staan.
- P16-b: Niet voor mij. Duidelijke kop, verkeerde doelgroep.
- P16-c: Niet voor mij, wel voor mijn collega. En zo hoort opzeggen overal te werken.
- P06-a: Goed bedacht, maar mijn vader pakt zelf de boormachine nog.
- P06-b: Mooi voor wie ver weg woont, wij fietsen zelf even naar mijn ouders.
- P06-c: Voor mijn ouders? Die staan zelf nog op de ladder.
- P39-a: Voor mijn ouders is het te laat en voor mezelf is het nog te vroeg.
- P39-b: Voor ouders. Die van mij zijn er niet meer. Volgende.
- P39-c: Dinie zei meteen: dit is voor Riek. Die belt ons nu voor elke lamp.
- P39-d: Voor mijn kinderen om voor mij te regelen? Eerst mijn gereedschap afpakken dan.
- K10-a: Mooi bedacht, maar volgende maand pas. Leg maar bij de rest, mam.
- K10-b: Opzeggen zonder gedoe, en ik hoor hoe het ging. Dan hoef ik er niet heen.
- K10-c: Een pasje is mooi, maar hij blijft een vreemde voor mama.
- K06-a: Bij mijn moeder klus ik zelf. Zolang de knieën het houden.
- K06-b: Mijn moeder doet niet open voor een vreemde, pasje of geen pasje.
- K06-c: Voor ouders? Mijn moeder heeft mij. Volgende.
- K12-a: Voor uw ouders? Niet aan de orde bij mij. Volgende.
- K12-b: Een foto uit andermans huis via WhatsApp. Wie bewaart die? Niet mijn situatie trouwens.
- K12-c: Foto's uit het huis van je moeder via WhatsApp. Heeft iemand het haar gevraagd?

Verbeterideeën:
- P30-a: Bied een losse klus aan voor als de familie op vakantie is.
- P30-b: Zeg in de kop dat het ook voor een losse periode kan, zoals tijdens vakantie.
- P30-c: Bied een eerste kennismakingsbezoek aan met familie erbij.
- P30-d: Bied versie B ook als losse klus of klussenkaart aan.
- P35-a: Maak duidelijk dat je het ook gewoon voor jezelf kunt nemen.
- P35-b: Maak er geen aparte pagina van, maar een zinnetje op de gewone pagina.
- P35-c: Zet erbij wat één klus je hier per keer eigenlijk kost.
- P40-a: Laat een oudere zelf aan het woord in plaats van de dochter uit Groningen.
- P40-b: Maak dezelfde opzet ook 'voor uzelf', met het berichtje naar de klant zelf.
- P40-c: Zet 'voor uzelf of voor uw ouders' in de kop.
- P42-a: Laat de ouder zelf kiezen of het kind na afloop een bericht krijgt.
- P42-b: Schrijf het ook voor de oudere zelf, niet alleen over hem of haar.
- P42-c: Maak ook een versie voor ouderen die zelf regelen en betalen.
- P45-a: Maak er een kort briefje bij voor de ouder zelf, in grote letters, met wie er komt en wat het kost.
- P45-b: Zet er ook een voorbeeld bij van een ouder in een dorp met kinderen dichtbij.
- P45-c: Vertel wat de klusser doet als de ouder de telefoon niet opneemt of niet thuis is.
- P45-d: Laat de klusser het eerste bezoek samen met een familielid komen kennismaken.
- P47-a: Laat de oudere zelf ook als klant aanspreken, niet alleen het kind.
- P47-b: Maak duidelijk dat de oudere ook zelf lid kan worden zonder kind ertussen.
- P47-c: Spreek ook de oudere zelf aan in de kop, niet alleen het kind.
- P31-a: Maak van de kop een volledige zin met een werkwoord erin.
- P31-b: Leg ook uit wat er gebeurt als de ouder de klusser niet binnenlaat of het niet wil.
- P31-c: Spreek de ouder ook zelf aan en haal die haakjes weg: 'U of uw ouder meldt een klusje'.
- P13-a: Een vinkje 'bel alleen de contactpersoon, niet mijn ouder'.
- P13-b: Laat twee kinderen samen betalen en allebei de terugkoppeling ontvangen.
- P13-c: Een vinkje 'afspraken alleen via de mantelzorger' bij het aanmelden.
- P16-a: Maak het ook afsluitbaar voor je eigen huis, zodat de opzegregeling breder geldt.
- P16-b: Laat bovenaan zien dat er ook een versie voor je eigen huis is.
- P16-c: Neem die opzegregeling zonder opzegtermijn over in alle versies.
- P06-a: Laat zien dat een ouder ook zelf lid kan worden, zonder kind ertussen.
- P06-b: Laat het berichtje met foto na afloop ook terugkomen in de gewone versies.
- P06-c: Richt een tweede kop ook op de ouder zelf, zodat meer mensen zich aangesproken voelen.
- P39-a: Zeg erbij dat oudere mensen ook zelf lid kunnen worden, zonder de kinderen ertussen.
- P39-b: Zeg in de kop ook voor wie het niet bedoeld is, dan hoef ik niet verder te lezen.
- P39-c: Noem het niet alleen 'voor uw ouders' maar ook voor een broer, zus of buurvrouw.
- P39-d: Geen, voor mij hoeft deze versie niet anders.
- K10-a: Laat de afspraak via het nummer van de dochter lopen in plaats van de ouder zelf te bellen.
- K10-b: Laat de koper kiezen wie gebeld wordt voor de afspraak: ouder of kind.
- K10-c: Stuur de dochter vooraf een foto en naam van de klusser, zodat zij haar moeder kan voorbereiden.
- K06-a: Richt het ook op mensen die zelf niet meer kunnen bukken of tillen, niet alleen op kinderen die ver weg wonen.
- K06-b: Laat het eerste bezoek samen met het familielid doen, zodat moeder hem kent.
- K06-c: Zeg in de kop gewoon wat de klusser doet in plaats van voor wie.
- K12-a: Maak de foto na afloop een keuze in plaats van standaard.
- K12-b: Zeg erbij hoe lang de foto's bewaard worden en maak melden zonder WhatsApp even zichtbaar.
- K12-c: Vraag de ouder zelf toestemming voor de foto en bied een meldroute zonder WhatsApp.

Triggers:
- P30-a: Als ik er een keer niet ben, bijvoorbeeld als we met de caravan weg zijn.
- P30-b: Niets; dit is voor mensen die ver van hun ouders wonen.
- P30-c: Als de klusser de eerste keer komt terwijl ik of mijn zus erbij ben.
- P30-d: Een losse klus voor mijn moeder als wij met de caravan weg zijn.
- P35-a: Niets op dit moment, misschien later als mijn zoon het voor mij wil regelen.
- P35-b: Niets, dit is voor een ander soort mensen.
- P35-c: Niets, tenzij mijn eigen kinderen het ooit voor mij willen regelen.
- P40-a: Als het tegen mij zelf gericht was in plaats van tegen mijn kinderen.
- P40-b: Als er stond dat je ook zelf lid kunt worden en zelf betalen, met dezelfde voorwaarden.
- P40-c: Als mijn dochter voorstelt dat we het samen regelen.
- P42-a: Als ik het zelf kan betalen en mijn dochter alleen meekijkt als ik dat vraag.
- P42-b: Als ik zelf de klant ben en mijn dochter alleen een berichtje krijgt als ik dat wil.
- P42-c: Niets, dit is niet voor iemand zoals ik.
- P45-a: Als mijn zoon zelf zegt dat het hem en zijn zus werk scheelt.
- P45-b: Als er ook een voorbeeld stond van een ouder met kinderen in de buurt die het druk hebben.
- P45-c: Als de klusser iemand uit de omgeving is die de mensen van de kerk of het dorp ook kennen.
- P45-d: Als de vrouw van de kerk zegt dat het dezelfde klusser is en hij goed werk doet.
- P47-a: Niets; dit is voor een ander soort situatie dan de mijne.
- P47-b: Als ik zelf een moeder op afstand had, zou dit het zijn.
- P47-c: Niets, dit is niet voor mij bedoeld.
- P31-a: Niets; dit is voor mensen met een ouder op leeftijd.
- P31-b: Niets voor mijzelf; wel voor collega's met een ouder op leeftijd.
- P31-c: Niets voor mij; voor anderen zou het helpen als de ouder zelf ook aangesproken werd.
- P13-a: Als de afspraak via mij loopt en de klusser mij belt als hij voor de deur staat.
- P13-b: Als mijn broer de helft betaalt en ook dat berichtje krijgt.
- P13-c: Als ik kan kiezen dat alleen ik gebeld word en mijn broer meebetaalt.
- P16-a: Als ik het voor een ouder op afstand moest regelen, zou dit de versie zijn.
- P16-b: Niets; dit is voor een andere doelgroep.
- P16-c: Niets voor mezelf; wel voor een collega met een ouder op afstand.
- P06-a: Pas als mijn ouders ouder worden en minder zelf kunnen.
- P06-b: Niet van toepassing tot mijn ouders hulp nodig hebben.
- P06-c: Niet van toepassing, misschien over tien jaar.
- P39-a: Pas als ik zelf minder kan en mijn kinderen het aanraden.
- P39-b: Niets, dit is niet voor mij.
- P39-c: Als Riek zelf ja zegt en we het eerst een maand kunnen proberen.
- P39-d: Niets, dit is niet voor mij.
- K10-a: Een eerste maand zonder kosten, zodat Marjan het kan proberen als de rekening betaald is.
- K10-b: Kunnen kiezen dat de afspraak via de dochter loopt en de klusser Nel alleen vlak van tevoren even belt.
- K10-c: Dat de afspraak via Marjan loopt en Marjan ook weet wie Rik is voor hij komt.
- K06-a: Pas als mijn knieën het echt niet meer doen.
- K06-b: Als de klusser de eerste keer samen met mij bij mijn moeder langskomt.
- K06-c: Niks, zolang ik het zelf kan.
- K12-a: Niets; deze versie is niet voor mij bedoeld.
- K12-b: Niets; ik val buiten de doelgroep.
- K12-c: Niets; ik hoor niet bij de doelgroep.

## Object `C` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| begrip | 4.85 | 4.75 |
| relevantie | 3.52 | 3.44 |
| aantrekkelijkheid | 4.16 | 4.02 |
| vertrouwen | 4.17 | 4.03 |
| intentie | 2.47 | 2.39 |

Intentie gewogen: {'neutraal (4)': 16.2, 'negatief (1-3)': 81.1, 'positief (5-7)': 2.7}
Gedrag gewogen %: {'bewaart voor later': 29.4, 'leest verder': 29.1, 'negeert': 23.4, 'klikt weg': 15.3, 'vraagt iemand anders': 2.9}
Bezwaren gewogen %: {'prijs': 36.8, 'begrip': 24.9, 'vertrouwen': 11.0, 'taal': 6.3, 'digitaal': 6.2, 'gemak': 5.1, 'opzegbaarheid': 4.3, 'relevantie': 4.3, 'privacy': 1.3}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'begrip': 4.55, 'relevantie': 2.89, 'aantrekkelijkheid': 3.45, 'vertrouwen': 3.33, 'intentie': 1.89}, 'hoofdgroep': {'begrip': 4.8, 'relevantie': 3.59, 'aantrekkelijkheid': 4.18, 'vertrouwen': 4.22, 'intentie': 2.52}}
Sterkst: [('P16', 'Jeroen Smit', 4), ('P35', 'Hennie Bosman', 3), ('P31', 'Annemarie Kok', 3)]  |  Zwakst: [('K10', 'Nel Hoogendoorn', 1.67), ('P39', 'Henk Groothuis', 1.75), ('P45', 'Corrie Nijland', 1.75)]

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 2.25 | 1.09 | {'begrip': 5, 'relevantie': 3, 'aantrekkelijkheid': 4, 'vertrouwen': 4, 'intentie': 2.25} | {'bewaart voor later': 1, 'klikt weg': 1, 'negeert': 1, 'leest verder': 1} | ['prijs', 'prijs', 'begrip', 'vertrouwen'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 3 | 0.82 | {'begrip': 4.33, 'relevantie': 4, 'aantrekkelijkheid': 4.33, 'vertrouwen': 4, 'intentie': 3} | {'leest verder': 1, 'negeert': 1, 'bewaart voor later': 1} | ['digitaal', 'begrip', 'prijs'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 2.33 | 0.47 | {'begrip': 4, 'relevantie': 4.33, 'aantrekkelijkheid': 3.33, 'vertrouwen': 5, 'intentie': 2.33} | {'negeert': 1, 'leest verder': 1, 'bewaart voor later': 1} | ['begrip', 'prijs', 'begrip'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 2 | 0.0 | {'begrip': 4.33, 'relevantie': 3, 'aantrekkelijkheid': 3.67, 'vertrouwen': 4, 'intentie': 2} | {'leest verder': 2, 'klikt weg': 1} | ['prijs', 'begrip', 'prijs'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 1.75 | 0.83 | {'begrip': 3.5, 'relevantie': 3.25, 'aantrekkelijkheid': 3, 'vertrouwen': 3.25, 'intentie': 1.75} | {'klikt weg': 1, 'vraagt iemand anders': 1, 'leest verder': 1, 'negeert': 1} | ['begrip', 'digitaal', 'digitaal', 'begrip'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 2.67 | 0.47 | {'begrip': 6, 'relevantie': 3.67, 'aantrekkelijkheid': 5, 'vertrouwen': 4, 'intentie': 2.67} | {'bewaart voor later': 2, 'negeert': 1} | ['vertrouwen', 'prijs', 'opzegbaarheid'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 3 | 1.41 | {'begrip': 4.67, 'relevantie': 4, 'aantrekkelijkheid': 4.33, 'vertrouwen': 4.67, 'intentie': 3} | {'bewaart voor later': 1, 'klikt weg': 1, 'leest verder': 1} | ['taal', 'begrip', 'taal'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 2.33 | 0.47 | {'begrip': 5, 'relevantie': 3.67, 'aantrekkelijkheid': 4.67, 'vertrouwen': 4, 'intentie': 2.33} | {'negeert': 1, 'leest verder': 2} | ['begrip', 'vertrouwen', 'relevantie'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 4 | 0.82 | {'begrip': 6.33, 'relevantie': 4.33, 'aantrekkelijkheid': 5, 'vertrouwen': 5, 'intentie': 4} | {'bewaart voor later': 3} | ['prijs', 'gemak', 'prijs'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 2.67 | 0.94 | {'begrip': 4.67, 'relevantie': 4, 'aantrekkelijkheid': 5.67, 'vertrouwen': 5, 'intentie': 2.67} | {'klikt weg': 1, 'bewaart voor later': 1, 'leest verder': 1} | ['begrip', 'prijs', 'prijs'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 1.75 | 0.43 | {'begrip': 5, 'relevantie': 2.25, 'aantrekkelijkheid': 3, 'vertrouwen': 3.5, 'intentie': 1.75} | {'klikt weg': 1, 'leest verder': 2, 'negeert': 1} | ['prijs', 'prijs', 'gemak', 'vertrouwen'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 1.67 | 0.47 | {'begrip': 5, 'relevantie': 2.67, 'aantrekkelijkheid': 3, 'vertrouwen': 3.33, 'intentie': 1.67} | {'negeert': 3} | ['digitaal', 'relevantie', 'relevantie'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 2 | 1.41 | {'begrip': 3.33, 'relevantie': 2.67, 'aantrekkelijkheid': 3.67, 'vertrouwen': 3.67, 'intentie': 2} | {'vraagt iemand anders': 1, 'negeert': 1, 'klikt weg': 1} | ['taal', 'begrip', 'prijs'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 2 | 0.0 | {'begrip': 5.33, 'relevantie': 3.33, 'aantrekkelijkheid': 3.67, 'vertrouwen': 3, 'intentie': 2} | {'negeert': 2, 'leest verder': 1} | ['prijs', 'privacy', 'privacy'] |

Citaten:
- P30-a: Zeven vijfennegentig en hij blijft staan. Dat is nog eens bedacht.
- P30-b: Zeven vijfennegentig per maand is nog steeds vijfennegentig euro per jaar.
- P30-c: Klusbuffer? Daar moet ik over nadenken, en dat doe ik vanavond niet.
- P30-d: Zeven vijfennegentig nu. En volgend jaar? Dat staat er niet.
- P35-a: Goedkoop en opsparen is slim, maar Klusbuffer, wat is dat nou weer voor woord?
- P35-b: Klusbuffer? Weer zo'n verzonnen woord. Goedkoop lokken en dan kom je er niet vanaf.
- P35-c: Eerlijk geprijsd met dat opsparen, maar ik schrap nu vaste lasten, ik voeg er geen toe.
- P40-a: Klusbuffer? Zeg nou gewoon wat het is. Ik heb geen tijd voor raadsels.
- P40-b: Goedkoopst op papier, maar ik streep juist maandbedragen weg, niet erbij.
- P40-c: Opsparen, buffer, drie maanden na opzeggen... Ik wil gewoon weten wie er komt en wat het kost.
- P42-a: €95,40 per jaar voor misschien twee lampen, dan kan ik beter per keer betalen.
- P42-b: Buffer, opsparen, extra kwartier... mijn hoofd loopt om. Zeg gewoon wat het kost.
- P42-c: €95,40 per jaar is minder, maar het staat er wel weer bij op mijn briefje.
- P45-a: Klusbuffer? Wat moet ik daarmee. Dan begin ik er niet aan.
- P45-b: Wat je niet gebruikt blijft staan, zo hoort het. Maar ik bel wel, hoor.
- P45-c: Netjes geregeld met dat sparen, maar dat online gedoe kan ik niet.
- P45-d: Sparen en online kiezen, ik word er niet rustiger van. Wie komt er dan?
- P47-a: Van alles de nuchterste. Morgen eerst kijken wie die Mark Jansen is.
- P47-b: Slim bedacht, dat opsparen. Maar deze maand komt er niets vasts bij.
- P47-c: Goedkoop, dat wel. Maar abonnement blijft abonnement, daar begin ik niet meer aan.
- P31-a: Wat ik niet gebruik blijft staan. Dat noem ik eerlijk, ondanks dat rare woord.
- P31-b: Klusbuffer? Ik wil het meteen snappen, niet eerst puzzelen.
- P31-c: Nette voorwaarden, maar 'Klusbuffer'? Dat woord zou ik in rood omcirkelen.
- P13-a: Klusbuffer? Daar heb ik om deze tijd geen kop voor.
- P13-b: Klussen sparen is leuk bedacht. Maar wie heeft het al?
- P13-c: Goedkoper dan B, maar dan mis ik juist het stukje voor mijn moeder.
- P16-a: Goed model, verkeerde maand. Vanaf vier klussen per jaar klopt de rekensom wel.
- P16-b: Leuk bedrag, maar één klus per maand is voor ons huis net te weinig.
- P16-c: Een spaarpot voor klusjes met opzeggen in één klik. Dat is eindelijk eerlijk bedacht.
- P06-a: Leuk idee, dat opsparen, maar ik moet er te veel bij rekenen voor een snelle blik.
- P06-b: Opsparen, avondtijden en met één klik opzeggen: hier gaan we een nachtje over slapen.
- P06-c: Klusbuffer, leuk woord. Maar ook acht euro per maand is deze maand te veel.
- P39-a: Zeven vijfennegentig voor een klus die blijft staan. Dan betaal ik liever als ik hem nodig heb.
- P39-b: Zeven vijfennegentig, en dan nog vierentwintig hier en twaalf daar. Zo gaat dat altijd.
- P39-c: Klussen komen altijd tegelijk, dat klopt. Maar het echte geld zit in dat extra kwartier.
- P39-d: Klein bedrag per maand, zo begon dat servicepakket van de wasmachine ook.
- K10-a: Goedkoop, maar dan zit ik weer achter de laptop voor mama.
- K10-b: Met één klik opzeggen. Dat geloof ik pas als ik het gezien heb.
- K10-c: Misschien iets voor mijn eigen huis. Voor mama zie ik het niet.
- K06-a: Voor acht euro een vaste man voor de tv. Als m'n dochter zegt dat 't klopt.
- K06-b: Klusbuffer? Mijn vrouw moest het drie keer lezen. Dan is 't niet voor mij.
- K06-c: Acht euro is ook een vaste last. En wat is een klusbuffer?
- K12-a: Zeven vijfennegentig is minder, maar een abonnement blijft een abonnement.
- K12-b: 'Wat nodig is voor de afspraak.' Wie bepaalt wat nodig is? Dat wil ik gewoon lezen.
- K12-c: Goedkoop en eerlijk opgespaard, maar 'wat nodig is' zegt niets. Wie bepaalt dat?

Verbeterideeën:
- P30-a: Laat het opsparen oplopen tot zes, net als bij versie B.
- P30-b: Reken op de pagina voor wie het goedkoper is dan per klus betalen.
- P30-c: Laat het woord Klusbuffer weg en zeg gewoon wat het doet.
- P30-d: Zet erbij: prijs twee jaar vast, verhoging alleen met je eigen akkoord.
- P35-a: Noem het gewoon 'spaarklusjes' en zet het telefoonnummer bovenaan.
- P35-b: Zeg in de kop meteen dat je maandelijks kunt opzeggen.
- P35-c: Stuur eens per jaar een overzicht van hoeveel klussen je gebruikt en wat je bespaard hebt.
- P40-a: Noem het 'klusjes sparen' in plaats van Klusbuffer.
- P40-b: Zet een rekenvoorbeeld naast de losse prijs: vier klussen per jaar kost zoveel.
- P40-c: Leg het uit met een voorbeeldje: in maart niks nodig, in juni drie klussen tegelijk.
- P42-a: Zet bellen bovenaan en laat het online deel weg voor wie dat niet wil.
- P42-b: Zeg het in één zin: €7,95 per maand, één klus, bellen mag altijd.
- P42-c: Laat mensen het abonnement stilzetten in plaats van opzeggen.
- P45-a: Laat het woord 'Klusbuffer' weg en zeg gewoon 'klusjes opsparen'.
- P45-b: Zet het telefoonnummer vóór het online tijdslot en schrap 'één klik in uw account'.
- P45-c: Schrijf net zo precies als bij de klussenkaart op welke gegevens jullie bewaren.
- P45-d: Zet erbij dat de klusser vooraf belt en zich voorstelt met naam en pasje, zoals bij de versie voor ouders.
- P47-a: Zet een link naar de KvK-inschrijving en een paar echte reviews op de pagina.
- P47-b: Laat mensen het abonnement een paar maanden pauzeren zonder hun opgespaarde klussen te verliezen.
- P47-c: Laat de eerste klus zonder abonnement proberen voordat je lid wordt.
- P31-a: Noem het gewoon 'klussen opsparen' in plaats van 'Klusbuffer'.
- P31-b: Vervang 'Klusbuffer' door een gewone omschrijving en geef één rekenvoorbeeld.
- P31-c: Noem het 'Klussen opsparen' en leg in één zin uit waarom het maximum vier is.
- P13-a: Laat het woord Klusbuffer weg en schrijf gewoon 'spaar je klusjes op'.
- P13-b: Laat met een voorbeeldgezin zien hoe een jaar met de buffer eruitziet.
- P13-c: Bied de terugkoppeling van B als losse optie bij de Klusbuffer aan.
- P16-a: Laat met een rekenvoorbeeld zien vanaf hoeveel klussen per jaar de Klusbuffer goedkoper is dan per klus.
- P16-b: Bied een gezinsvariant met twee klussen per maand in hetzelfde buffermodel.
- P16-c: Zet in één regel wat er gebeurt als je buffer vol is, zodat niemand zich verrast voelt.
- P06-a: Zet erbij: bij drie klussen per jaar betaalt u zoveel, los zou dat zoveel kosten.
- P06-b: Zet een rekenvoorbeeld naast de prijs: vanaf hoeveel klussen per jaar is dit goedkoper dan per klus.
- P06-c: Leg in één zin onder de kop uit wat een Klusbuffer is.
- P39-a: Zet de extra kosten van €24 en €12 per kwartier net zo groot als de €7,95.
- P39-b: Geef een rekenvoorbeeld van een heel jaar, inclusief een extra klus.
- P39-c: Laat de klusser vooraf bellen in plaats van online een tijdslot te laten kiezen.
- P39-d: Stuur elk jaar een overzicht van wat je betaald en gebruikt hebt.
- K10-a: Maak bellen de eerste manier, niet het online tijdslot.
- K10-b: Voeg een stuk toe voor kinderen die het voor hun ouder regelen.
- K10-c: Laat zien wie er gebeld wordt en wie er binnenkomt, niet alleen de prijs.
- K06-a: Noem het gewoon 'klussen sparen' en zeg in één zin dat bellen genoeg is.
- K06-b: Noem het 'klussen sparen' en leg het in één korte zin uit.
- K06-c: Zeg in de kop gewoon: klussen sparen, bellen mag.
- K12-a: Bied de buffer ook aan als vooraf gekochte kaart zonder maandincasso.
- K12-b: Vervang 'wat nodig is' door een concrete lijst van gegevens en bewaartermijn.
- K12-c: Neem de privacyzin van versie A over en maak het account uitdrukkelijk optioneel.

Triggers:
- P30-a: Een proefmaand waarin ik zie dat hij binnen twee werkdagen op de stoep staat.
- P30-b: Als het goedkoper uitvalt dan losse klussen bij mijn gebruik.
- P30-c: Een simpele zin: één klus per maand, niet gebruikt, dan blijft hij staan.
- P30-d: Een vaste prijsgarantie van minimaal twee jaar.
- P35-a: Als mijn kennis zou zeggen dat je gewoon kunt bellen en het verder vanzelf gaat.
- P35-b: Als er in de kop staat dat je elke maand gewoon kunt stoppen.
- P35-c: Als het na de energienota weer wat ruimer wordt.
- P40-a: Als er gewoon staat: elke maand een klusje erbij, bel ons maar.
- P40-b: Als mijn zoon het narekent en zegt dat ik hier echt mee bespaar.
- P40-c: Iemand die het me in één zin uitlegt.
- P42-a: Als het zonder account en met bellen net zo makkelijk gaat als online.
- P42-b: Eén bedrag en één zin over wat ik ervoor krijg.
- P42-c: Als ik het kan pauzeren in maanden dat ik niks nodig heb.
- P45-a: Als er gewoon staat: één klusje per maand, u kunt bellen, en klaar.
- P45-b: Als bellen net zo gewoon genoemd werd als online een tijd kiezen.
- P45-c: Als er stond dat mijn kinderen alles per telefoon voor me kunnen regelen.
- P45-d: Als er stond dat de klusser vooraf belt en zich met naam en pasje voorstelt.
- P47-a: Mijn kennis die zegt dat het goed bevalt en dat opzeggen echt zo makkelijk gaat.
- P47-b: Een pauzeknop voor maanden waarin het even krap is.
- P47-c: Een proefmaand zonder betaalgegevens vooraf.
- P31-a: Als ik thuis zie dat opzeggen echt simpel is en er een telefoonnummer staat.
- P31-b: Een rekenvoorbeeld van één jaar, zodat ik in tien seconden zie wat het me kost.
- P31-c: Een gewone naam en uitleg waarom het maximum op vier ligt.
- P13-a: Eén zin die zegt: je betaalt weinig per maand en je klusjes blijven staan.
- P13-b: Reviews van gezinnen die vertellen hoe ze hun opgespaarde klussen gebruikten.
- P13-c: Als het berichtje en het vooraf bellen van de contactpersoon er voor een euro extra bij kunnen.
- P16-a: Als de buffer ook als los tegoed te koop was, zonder maandbedrag.
- P16-b: Als je de buffer kunt aanvullen zonder meteen €24 per klus te betalen.
- P16-c: Als ik volgende maand wat meer ruimte heb, neem ik hem gewoon.
- P06-a: Een simpel rekenvoorbeeld naast de prijs.
- P06-b: Een lijstje kleine klusjes zodra de badkamer af is.
- P06-c: Een maand met meer ruimte en een paar klusjes op de lijst.
- P39-a: Als het zonder maandbedrag kon, alleen betalen bij gebruik.
- P39-b: Als duidelijk is wat ik in een gewoon jaar echt kwijt ben.
- P39-c: Als de klusser zelf belt om een tijd af te spreken, zoals bij de versie voor ouders.
- P39-d: Als ik zeker weet dat ik er in een jaar echt iets aan heb.
- K10-a: Dat je gewoon één keer belt en de rest wordt geregeld.
- K10-b: Een regel over hoe het gaat als iemand het voor een ouder regelt.
- K10-c: Een stukje over hoe het werkt als een kind het voor een ouder regelt.
- K06-a: Als mijn dochter zegt dat het klopt en Harm er tevreden over blijft.
- K06-b: Als het in gewone woorden staat en er geen maandbedrag bij komt.
- K06-c: Als het niks vast per maand kost.
- K12-a: Een losse klus zonder dat er iets maandelijks afgeschreven wordt.
- K12-b: Precies benoemen welke gegevens nodig zijn en dat het ook zonder account kan.
- K12-c: Een concrete lijst met welke gegevens ze bewaren en hoe lang, zoals bij A.

## Voorkeur
Gewogen %: {'A': 58.8, 'C': 17.4, 'B': 13.0, 'v1': 10.8}
Ongewogen aantal: {'A': 26, 'C': 7, 'B': 7, 'v1': 5}
Per persona: {'K06': {'C': 1, 'A': 2}, 'K10': {'A': 1, 'B': 1, 'v1': 1}, 'K12': {'A': 3}, 'P06': {'A': 2, 'C': 1}, 'P13': {'B': 2, 'A': 1}, 'P16': {'A': 1, 'v1': 1, 'C': 1}, 'P30': {'C': 1, 'A': 2, 'B': 1}, 'P31': {'C': 1, 'v1': 1, 'A': 1}, 'P35': {'v1': 1, 'A': 2}, 'P39': {'A': 3, 'B': 1}, 'P40': {'A': 3}, 'P42': {'A': 2, 'v1': 1}, 'P45': {'A': 1, 'C': 1, 'B': 2}, 'P47': {'C': 1, 'A': 2}}
Redenen:
- K06-a: C omdat Ik denk dat we 't vier, vijf keer per jaar nodig hebben voor de tv en de wifi, dan is €95 per jaar het goedkoopst en ik kan gewoon bellen.
- K06-b: A omdat Er komt deze maand geen vaste last bij en die klussenkaart kan ik delen met mijn moeder en de buurvrouw.
- K06-c: A omdat We zijn vaste lasten aan het schrappen, en bij A betaal ik alleen als er echt wat kapot is.
- K10-a: A omdat Deze maand ligt de energienota er al; per klus betalen is het enige waar Marjan geen vaste last bij krijgt.
- K10-b: B omdat Opzeggen zonder opzegtermijn, een klusser die zich met naam en pasje voorstelt en een berichtje voor Marjan na afloop: zo regelt zij het al.
- K10-c: v1 omdat Alleen hier belt de klusser vooraf het nummer dat Marjan opgeeft, zodat mama niet ineens een vreemde man voor de deur heeft.
- K12-a: A omdat Geen vaste last erbij en ze zeggen dat ze bijna niets bewaren; past bij het schrappen van mijn abonnementen.
- K12-b: A omdat Werkt zoals mijn huidige klusser, zonder abonnement, en zegt precies welke gegevens ze bewaren.
- K12-c: A omdat Geen abonnement, bellen kan zonder account, en als enige versie concreet over welke gegevens ze bewaren en hoe lang.
- P06-a: A omdat Geen abonnement, een prijs die ik meteen snap en een belofte die vertrouwen geeft; past bij ons omdat we het meeste zelf doen.
- P06-b: C omdat De tijdsloten 's avonds en op zaterdag passen bij de ploegendiensten van mijn vriend, en opsparen plus opzeggen met één klik geven zekerheid na onze vorige teleurstelling.
- P06-c: A omdat Geen nieuwe maandlast in een krappe maand; ik betaal alleen als er echt iets kapot is.
- P13-a: B omdat Het enige waar ik bij bleef hangen, omdat het over mijn moeder gaat en ik achteraf hoor hoe het ging.
- P13-b: A omdat Deze krappe maand geen vast maandbedrag, goedkoper dan Henk, en ik kan het ernaast gebruiken als hij niet kan.
- P13-c: B omdat Voor mijn moeder met beginnende dementie tellen het berichtje achteraf en niks afrekenen aan de deur, en dat regelt alleen B goed.
- P16-a: A omdat Geen nieuwe vaste last terwijl we bezuinigen, en ik betaal alleen als er echt iets kapot is.
- P16-b: v1 omdat Twee klusjes per maand en maandelijks opzegbaar: dat levert ons gezin echt vrije zaterdagen op.
- P16-c: C omdat In één keer duidelijk, laag bedrag, en ongebruikte klussen blijven staan: dat is een abonnement dat ik verantwoord vind.
- P30-a: C omdat Laagste vaste bedrag, een klus die blijft staan als ik hem niet nodig heb, en met één klik weg: nieuw bedacht en toch zuinig.
- P30-b: A omdat Geen abonnement, ik betaal alleen als ik iets heb, en dat kan ik gewoon naast de prijs van een klusjesman leggen.
- P30-c: B omdat Voor mezelf hoeft het niet, maar voor mijn moeder zou het Ria en mij gedoe en mijn knieën een trap schelen.
- P30-d: A omdat Geen doorlopende incasso in een krappe maand, ik betaal alleen als Henk er niet is, en de belofte bij te laat komen is helder.
- P31-a: C omdat Het is de enige kop die ik in de trein in één keer las en geloofde: weinig geld, en wat ik niet gebruik blijft staan.
- P31-b: v1 omdat Het is de eerlijkste en meest volledige: bellen mag, maandelijks opzegbaar, klussers in dienst met VOG en een echt adres.
- P31-c: A omdat Geen abonnement, geen app nodig, betalen met pin of factuur en een kaart die je met ouders of buren kunt delen: iedereen kan meedoen.
- P35-a: v1 omdat Gewoon kunnen bellen, maandelijks opzegbaar en elke keer hetzelfde gezicht, dat klinkt gezellig en past bij wat mijn kennis me vertelde.
- P35-b: A omdat Geen abonnement, dus ik kan niet nog een keer ergens aan vast komen te zitten waar ik voor niks betaal.
- P35-c: A omdat Ik ben mijn vaste lasten aan het schrappen, dus liever geen nieuwe afschrijving en alleen betalen als er echt iets stuk is.
- P39-a: A omdat Geen abonnement: gewoon bellen en per klus betalen, zoals ik het nu met Gerrit de installateur uit het dorp ook doe.
- P39-b: A omdat Deze maand kan er geen vast bedrag bij; per klus betalen zonder contract voelt het veiligst.
- P39-c: B omdat Voor mijn zus Riek: dan komt er iemand als wij met de camper weg zijn, en ik hoor na afloop hoe het ging.
- P39-d: A omdat Als het al moet, dan zonder vaste last: per klus betalen past bij het schrappen van abonnementen.
- P40-a: A omdat Geen abonnement, gewoon bellen, en die klussenkaart kan ik met de buurvrouw delen.
- P40-b: A omdat Geen nieuwe vaste last, ik bel zelf als ik iemand nodig heb, betaal per factuur en krijg een belofte als hij niet komt.
- P40-c: A omdat Het is in één keer duidelijk: bellen, de klusser komt, pinnen, en geen abonnement om over na te denken.
- P42-a: A omdat Ik betaal alleen als er echt iets kapot is, en die klussenkaart kan ik samen met de buurvrouw gebruiken.
- P42-b: v1 omdat Ik kan zelf bellen, weet wie er komt en hoef niet alles via mijn dochter te doen; van het vakantiegeld kan ik het een paar maanden proberen.
- P42-c: A omdat Er komt geen nieuwe vaste last op mijn lijstje; ik betaal alleen als er echt iets kapot is.
- P45-a: A omdat Geen vast bedrag elke maand en ik snap het meteen, dus als het dan moet, deze.
- P45-b: C omdat Het minst per maand, en er gaat niks verloren als ik een tijd niks heb.
- P45-c: B omdat Alles staat eerlijk op papier, mijn kinderen regelen het en ik kan klussen opsparen voor de maanden dat er iets is.
- P45-d: B omdat De kinderen regelen en betalen, de klusser belt eerst en laat zijn pasje zien, en ik hoef niets aan de deur.
- P47-a: C omdat Nuchter bekeken betaal ik bij C het minst voor wat ik echt gebruik, en ik kan met één klik weg.
- P47-b: A omdat Deze maand geen vaste lasten erbij, en met de klussenkaart kan ik ook de buurvrouw helpen.
- P47-c: A omdat Geen abonnement meer voor mij na de vorige keer; €29 als het nodig is, verder niks.
