# Ronde 2: Waarde, prijs en bezwaren

Records: 45, varianten: 45. Realisme: **ok**

- OK spreiding_binnen_persona: 0.29 (drempel 0.5). persona's zonder spreiding in intentie (std < 0.5): ['K12', 'P06', 'P13', 'P47']
- OK positiviteit: {'v1': 0.079} (drempel 0.65). gewogen aandeel intentie >= 5 per object; faalt als alle objecten erboven zitten
- OK negativiteit_waarschuwing: {'v1': 0.079} (drempel 0.05). alleen een waarschuwing: bij alle objecten minder dan 5% positief. Controleer of het materiaal een objectieve fout bevat die iedereen raakt (dan is het echt) en benoem het in samenvatting en rapport; geen herhaling nodig.
- OK begrip_te_hoog: {} (drempel 6.3). gewogen gemiddeld begrip per object; bijna niemand snapt alles
- OK gelijkvormigheid_tussen_personas: 0.0 (drempel 0.05). aandeel paren van verschillende persona's met woordoverlap >= 0.35; meest betrokken: []
- OK een_bezwaar_domineert: {'v1': 0.363} (drempel 0.7). gewogen aandeel van de grootste bezwaar-categorie per object
- OK volledigheid: {'ontbrekend': 0, 'dubbel': 0, 'fouten': 0} (drempel 0). ontbrekend: []; dubbel: []; fouten: []

## Object `v1` (n=45)

| score | gewogen | ongewogen |
|---|---|---|
| relevantie | 3.68 | 3.63 |
| vertrouwen | 4.21 | 4.12 |
| waarde_voor_geld | 3.42 | 3.29 |
| intentie | 2.58 | 2.52 |

Intentie gewogen: {'negatief (1-3)': 81.9, 'positief (5-7)': 7.9, 'neutraal (4)': 10.3}
Gedrag gewogen %: {'bewaart voor later': 27.8, 'deelt met iemand': 19.7, 'klikt weg': 18.4, 'vraagt iemand anders': 17.6, 'negeert': 13.2, 'zoekt een alternatief': 3.4}
Bezwaren gewogen %: {'prijs': 36.3, 'vertrouwen': 24.2, 'relevantie': 16.5, 'alternatief': 13.2, 'opzegbaarheid': 4.6, 'kwaliteit': 2.4, 'gemak': 2.2, 'privacy': 0.7}
Kansgroep vs hoofdgroep (ongewogen gem.): {'kansgroep': {'relevantie': 3.0, 'vertrouwen': 3.67, 'waarde_voor_geld': 2.78, 'intentie': 2.0}, 'hoofdgroep': {'relevantie': 3.8, 'vertrouwen': 4.24, 'waarde_voor_geld': 3.43, 'intentie': 2.66}}
Sterkst: [('P40', 'Ria van den Heuvel', 3.33), ('P13', 'Anouk Hendriks', 3.33), ('P16', 'Jeroen Smit', 3.33)]  |  Zwakst: [('K12', 'Jasper Hoek', 1.67), ('P39', 'Henk Groothuis', 1.75), ('K06', 'Johan Wubbels', 2)]
Van Westendorp: {'n': 45, 'PMC_ondergrens': 7.07, 'OPP_optimaal': 7.07, 'IPP_onverschillig': 12.06, 'PME_bovengrens': 12.06, 'mediaan_antwoorden': {'te_goedkoop': 5, 'goedkoop': 9, 'duur': 15, 'te_duur': 22.5}, 'uitleg': 'PMC = te goedkoop snijdt duur; OPP = te goedkoop snijdt te duur; IPP = goedkoop snijdt duur; PME = goedkoop snijdt te duur. Acceptabel bereik ligt tussen PMC en PME. Gewogen naar bevolkingsgewicht.'}

| persona | gew% | K | n | intentie gem | std | scores | gedrag | bezwaren |
|---|---|---|---|---|---|---|---|---|
| P30 Gerard Willems | 2.5 |  | 4 | 2 | 0.71 | {'relevantie': 3, 'vertrouwen': 4, 'waarde_voor_geld': 3, 'intentie': 2} | {'bewaart voor later': 2, 'klikt weg': 1, 'deelt met iemand': 1} | ['prijs', 'vertrouwen', 'relevantie', 'opzegbaarheid'] |
| P35 Hennie Bosman | 1.9 |  | 3 | 3 | 1.41 | {'relevantie': 4.33, 'vertrouwen': 4.33, 'waarde_voor_geld': 3.33, 'intentie': 3} | {'vraagt iemand anders': 1, 'klikt weg': 1, 'negeert': 1} | ['prijs', 'vertrouwen', 'prijs'] |
| P40 Ria van den Heuvel | 2.7 |  | 3 | 3.33 | 1.7 | {'relevantie': 4, 'vertrouwen': 4.33, 'waarde_voor_geld': 3, 'intentie': 3.33} | {'negeert': 1, 'bewaart voor later': 1, 'deelt met iemand': 1} | ['alternatief', 'prijs', 'relevantie'] |
| P42 Bep Wesselink | 2.2 |  | 3 | 2 | 0.82 | {'relevantie': 3.67, 'vertrouwen': 4.33, 'waarde_voor_geld': 2.33, 'intentie': 2} | {'negeert': 1, 'vraagt iemand anders': 1, 'klikt weg': 1} | ['prijs', 'vertrouwen', 'relevantie'] |
| P45 Corrie Nijland | 1.8 |  | 4 | 2.5 | 1.12 | {'relevantie': 3.75, 'vertrouwen': 3, 'waarde_voor_geld': 2.75, 'intentie': 2.5} | {'negeert': 1, 'vraagt iemand anders': 2, 'deelt met iemand': 1} | ['prijs', 'alternatief', 'prijs', 'vertrouwen'] |
| P47 Els Bruinsma | 3.8 |  | 3 | 2.67 | 0.47 | {'relevantie': 3.67, 'vertrouwen': 4.33, 'waarde_voor_geld': 4.33, 'intentie': 2.67} | {'bewaart voor later': 1, 'deelt met iemand': 1, 'klikt weg': 1} | ['vertrouwen', 'prijs', 'vertrouwen'] |
| P31 Annemarie Kok | 2.2 |  | 3 | 3 | 0.82 | {'relevantie': 4, 'vertrouwen': 4.67, 'waarde_voor_geld': 4.33, 'intentie': 3} | {'bewaart voor later': 2, 'deelt met iemand': 1} | ['relevantie', 'opzegbaarheid', 'prijs'] |
| P13 Anouk Hendriks | 2.0 |  | 3 | 3.33 | 0.47 | {'relevantie': 5.33, 'vertrouwen': 4.33, 'waarde_voor_geld': 4.33, 'intentie': 3.33} | {'bewaart voor later': 1, 'deelt met iemand': 1, 'vraagt iemand anders': 1} | ['gemak', 'alternatief', 'prijs'] |
| P16 Jeroen Smit | 2.4 |  | 3 | 3.33 | 1.25 | {'relevantie': 4, 'vertrouwen': 5, 'waarde_voor_geld': 3.67, 'intentie': 3.33} | {'zoekt een alternatief': 1, 'deelt met iemand': 1, 'bewaart voor later': 1} | ['prijs', 'alternatief', 'vertrouwen'] |
| P06 Sanne de Groot | 2.7 |  | 3 | 2.33 | 0.47 | {'relevantie': 3.33, 'vertrouwen': 4.33, 'waarde_voor_geld': 3.67, 'intentie': 2.33} | {'bewaart voor later': 1, 'vraagt iemand anders': 1, 'klikt weg': 1} | ['relevantie', 'alternatief', 'prijs'] |
| P39 Henk Groothuis | 2.8 |  | 4 | 1.75 | 0.83 | {'relevantie': 2.75, 'vertrouwen': 4, 'waarde_voor_geld': 3, 'intentie': 1.75} | {'vraagt iemand anders': 1, 'klikt weg': 1, 'bewaart voor later': 1, 'negeert': 1} | ['relevantie', 'vertrouwen', 'kwaliteit', 'prijs'] |
| K10 Nel Hoogendoorn | 0.9 | K | 3 | 2.33 | 1.25 | {'relevantie': 3.33, 'vertrouwen': 3.33, 'waarde_voor_geld': 3, 'intentie': 2.33} | {'vraagt iemand anders': 1, 'bewaart voor later': 1, 'negeert': 1} | ['prijs', 'vertrouwen', 'relevantie'] |
| K06 Johan Wubbels | 1.2 | K | 3 | 2 | 0.82 | {'relevantie': 3, 'vertrouwen': 3.67, 'waarde_voor_geld': 3, 'intentie': 2} | {'vraagt iemand anders': 1, 'deelt met iemand': 1, 'klikt weg': 1} | ['vertrouwen', 'prijs', 'prijs'] |
| K12 Jasper Hoek | 0.6 | K | 3 | 1.67 | 0.47 | {'relevantie': 2.67, 'vertrouwen': 4, 'waarde_voor_geld': 2.33, 'intentie': 1.67} | {'klikt weg': 1, 'negeert': 1, 'zoekt een alternatief': 1} | ['prijs', 'privacy', 'alternatief'] |

Citaten:
- P30-a: Netjes dat het per jaar erbij staat, maar 179 euro voor iets wat ik zelf doe.
- P30-b: Eerste maand een euro, dat is het lokkertje; daarna loopt het door en vervallen je klusjes.
- P30-c: Voor mij niks, dat doe ik zelf; misschien voor je moeder, die belt ons voor elke afstandsbediening.
- P30-d: Eindelijk een bedrijf met een naam en een KvK-nummer, maar hoe zeg ik op en blijft die prijs staan?
- P35-a: Elke keer hetzelfde gezicht, dat vind ik nou fijn. Even aan mijn dochter vragen wat zij ervan vindt.
- P35-b: Weer een abonnement, en die 1 euro ken ik. Ik bel mijn buurman wel.
- P35-c: Klusjes die je niet gebruikt vervallen, staat er eerlijk. Precies daarom neem ik het niet.
- P40-a: Weer zo'n abonnementje. Ik heb Harrie van het koor, die komt voor een flesje wijn.
- P40-b: Netjes geregeld hoor, maar 179 euro per jaar voor klusjes die ik niet opmaak, dat is zonde.
- P40-c: Dat is tenminste duidelijk, gewoon bellen en hetzelfde gezicht. Ik stuur het even naar Nel.
- P42-a: 179 euro per jaar voor wat de buurman doet voor een bord nasi, nee.
- P42-b: Hetzelfde gezicht, dat wil ik. Maar die andere zei ook dat hij snel kwam.
- P42-c: Wie heeft nou elke maand twee kapotte dingen? Je betaalt voor lucht.
- P45-a: Elke maand betalen als er niks kapot is? Nee, daar heb ik de buurvrouw voor.
- P45-b: Dat vaste gezicht is mooi, maar €14,95 elke maand voor niks? De diaconie doet dat gratis.
- P45-c: Dat hetzelfde gezicht komt, dat is mooi. Maar wat kost zo'n lamp dan op de rekening?
- P45-d: Dinie is tevreden en hij heeft zo'n verklaring. Maar mijn zoon moet het bekijken.
- P47-a: Voor mijn buurvrouw van 84 zou dit iets zijn, voor ons niet; maar ik bel eerst even.
- P47-b: Op papier een goede deal, maar deze maand komt er niets bij; ik stuur het door naar Wil.
- P47-c: Vast gezicht, dat beloofden ze bij mijn schoonzus ook; er kwam elke keer iemand anders.
- P31-a: Nette kop, eerlijke prijs, maar mijn man hangt die lamp zelf op. Later nog eens lezen.
- P31-b: In dienst, VOG, verzekerd: dat is de zin die telt als je het voor je moeder regelt.
- P31-c: Men belt aan bij een deur, niet op een nummer. Verder eerlijker dan de meeste klusplatforms.
- P13-a: Als het me tijd scheelt, ja, maar dan wil ik nu klikken, niet morgen bellen.
- P13-b: Leuk idee voor mam, maar ik heb Ad al en dit is niet de maand om erbij te nemen.
- P13-c: Voor mam is dit goedkoper dan wat ik nu doe, maar ik beslis dit niet alleen.
- P16-a: Nette organisatie, maar €179 per jaar voor klusjes die ik zelf doe en die vervallen: die som klopt niet.
- P16-b: In één zin helder wat het kost en wat ik krijg; dit stuur ik door naar mijn vrouw.
- P16-c: De prijs is helder, maar wat gebeurt er bij minuut 31? Dat staat er niet.
- P06-a: In dienst, VOG, verzekerd: dat stelt me gerust. Die eerste maand voor een euro juist niet.
- P06-b: Netjes verhaal, maar bij ons vervallen die klusjes elke maand. Dan betaal je voor niets.
- P06-c: Vaste klusser klinkt gezellig, maar met de energienota erbij komt er echt geen abonnement.
- P39-a: Netjes opgeschreven, vakman erachter, maar twee klusjes die vervallen, daar ben ik zelf nog te handig voor.
- P39-b: Een euro de eerste maand, dat ken ik, dan zit je eraan vast.
- P39-c: Voor ons niet, maar voor haar moeder van 91 wel, als het tenminste een echte vakman is.
- P39-d: Weer een abonnement erbij, terwijl ik ze net allemaal aan het schrappen ben.
- K10-a: Dat moet Marjan weten. Marjan: veertien euro per maand terwijl er niks kapot is, deze maand niet.
- K10-b: Marjan: Hetzelfde gezicht, dat wil ik. Maar wie neemt op als het zondag misgaat?
- K10-c: Nel: Nog een vreemde erin als de thuiszorg net weg is, daar word ik onrustig van.
- K06-a: Lampen hang ik zelf op, maar die tv en die wifi, daar mag wel iemand voor komen.
- K06-b: Wat ik zelf doe, betaal ik niet voor. Voor mijn moeder misschien, maar niet per maand.
- K06-c: Weer wat dat elke maand afgaat. Nee, ik ben net bezig alles eraf te halen.
- K12-a: Nog een abonnement erbij, terwijl ik ze juist aan het schrappen ben? Nee.
- K12-b: Netjes verteld wie ze zijn, maar niet hoe ik betaal of wat ze van mij bewaren.
- K12-c: Betalen voor klusjes die vervallen is de bonuskaart in een ander jasje. Geef mij een losse klus.

Verbeterideeën:
- P30-a: Laat ongebruikte klusjes een paar maanden meelopen of bied een 'tien klusjes per jaar'-variant voor mensen die weinig nodig hebben.
- P30-b: Schrap de 1-euro-lokmaand en zet in plaats daarvan een vaste materiaalprijslijst en een voorbeeldfactuur op de pagina.
- P30-c: Zet bovenaan in één regel 'ook te regelen voor uw ouders' met een foto en naam van de klusser in de buurt.
- P30-d: Voeg een blokje 'Zo zegt u op' toe (telefoon, mail, per direct, geen opzegtermijn) plus een prijsgarantie voor de eerste twee jaar.
- P35-a: Zet er een foto en de voornaam van de klusser bij die in mijn buurt komt, dan weet ik al wie er aanbelt.
- P35-b: Zeg gewoon wat er gebeurt als de klusser niet komt, bijvoorbeeld 'komt hij niet, dan is die maand gratis'.
- P35-c: Bied naast het lidmaatschap een losse klus aan van 30 minuten voor rond de 20 euro, zonder voorrijkosten.
- P40-a: Laat ongebruikte klusjes een paar maanden meetellen, of bied een losse klus aan zonder maandabonnement.
- P40-b: Bied naast het abonnement een kleiner pakket aan, bijvoorbeeld één klusje per maand voor rond de 8 euro.
- P40-c: Zet een echt telefoonnummer en een foto van de klusser bovenaan, en bied een buren- of vriendinnenaanbieding aan.
- P42-a: Bied een losse klus aan voor mensen die geen abonnement willen, bijvoorbeeld 25 euro per keer, dan is er iets te kiezen.
- P42-b: Laat een echte klusser met naam en foto zien en beloof zwart op wit wat er gebeurt als hij niet binnen twee werkdagen komt, bijvoorbeeld die maand gratis.
- P42-c: Zet naast het lidmaatschap een losse klus van 20 tot 25 euro, of laat ongebruikte klusjes een paar maanden meegaan.
- P45-a: Een losse klus zonder abonnement, contant of via de kinderen te betalen, voor wie maar één keer per jaar iets heeft.
- P45-b: Laat ongebruikte klusjes een paar maanden meetellen, of bied een kaart van tien klusjes aan zonder maandbedrag.
- P45-c: Zet erbij wat materiaal ongeveer kost en wat er gebeurt als een klusje langer dan 30 minuten duurt, en laat een klusje één maand meenemen.
- P45-d: Laat de klusser zich de eerste keer voorstellen met een pasje en een vaste afspraaktijd via de dochter, en zeg duidelijk dat bellen genoeg is, zonder website of app.
- P47-a: Zet erbij hoe klussers worden geselecteerd en begeleid (bijvoorbeeld: gesprek, proefperiode, ervaring met ouderen) en dat een niet-gebruikt klusje één maand mag doorschuiven.
- P47-b: Voeg een rekenvoorbeeld toe: wat kost een lamp ophangen bij een losse klusjesman versus bij ons, en noem een voorbeeldprijs voor een grotere klus.
- P47-c: Zet bovenaan, naast de prijs, een harde belofte in één regel: 'Zelfde klusser, anders die maand gratis', en wat er gebeurt als een klusje langer duurt dan 30 minuten.
- P31-a: Zet 'ook te regelen voor uw ouders' al in de kop of direct eronder, want dat is de reden die mijn kennis noemde en die ik in 30 seconden niet zie.
- P31-b: Voeg bij 'Prijs, gewoon helder' een regel toe over hoe je opzegt en dat je voor het einde van de proefmaand een bericht krijgt.
- P31-c: Schrijf uit wat er gebeurt bij een klus van 45 minuten (gewoon afmaken, of twee klusjes tellen?) en laat een ongebruikt klusje één maand doorschuiven.
- P13-a: Zet bovenaan een grote aanmeldknop met 'in 2 minuten geregeld' en leg in één zin uit waarom de eerste maand 1 euro is.
- P13-b: Laat klusjes drie maanden geldig blijven in plaats van laten vervallen, en zet vijf korte reviews met voornaam en wijk onder het aanbod.
- P13-c: Voeg een kopje toe voor mantelzorgers met drie ervaringen van kinderen die het voor hun ouder regelen en een optie om de factuur te splitsen.
- P16-a: Voeg naast het lidmaatschap een losse-klusoptie toe met een vaste prijs (bijvoorbeeld €39 per klus van 30 minuten), zodat mensen zonder abonnement kunnen instappen.
- P16-b: Zet direct onder de kop een knop 'Regel het voor uw ouders' met drie stappen, zodat de scrollende lezer meteen ziet dat dat kan.
- P16-c: Voeg één zin toe onder 'Wat u krijgt': wat er gebeurt als een klusje langer duurt dan 30 minuten, en toon een voorbeeldfactuur.
- P06-a: Laat de eerste-maand-voor-een-euro weg en zeg in plaats daarvan wat er gebeurt als een klusje niet lukt of iets beschadigd raakt.
- P06-b: Bied naast het abonnement een los klusje aan voor ouders, bijvoorbeeld 35 euro per keer, zodat je niet betaalt in maanden dat er niets is.
- P06-c: Zet direct onder de kop wie de oprichter is en dat de klussers in dienst zijn met VOG, want dat lees je niet als je scrollt.
- P39-a: Laat ongebruikte klusjes een kwartaal doorschuiven en zet erbij wie de telefoon opneemt als je belt.
- P39-b: Schrap de eerste-maand-voor-een-euro en zet in plaats daarvan: opzeggen kan telefonisch, per direct, zonder gedoe.
- P39-c: Zet een lijstje neer met wat wél en wat níet onder een klusje valt, met de vakachtergrond van de klussers erbij.
- P39-d: Bied een losse klus aan zonder lidmaatschap, zodat je niet weer een vaste last erbij hebt.
- K10-a: Laat ongebruikte klusjes een paar maanden meenemen en zet dat groot bij de prijs, niet in het laatste regeltje.
- K10-b: Zet erbij wat er gebeurt als u buiten de uren belt (voicemail, terugbel binnen een uur?) en noem hoeveel gezinnen in de buurt al lid zijn.
- K10-c: Bied een gezinsvariant: één lidmaatschap voor de dochter, waarbij een klusje ook bij een ouder in de buurt mag worden gedaan.
- K06-a: Laat een klusser met naam en foto zien en zet er een telefoonnummer bij waar je gewoon een mens krijgt, dan hoef je niks te lezen.
- K06-b: Bied een losse klus aan voor mensen die maar af en toe iemand nodig hebben, bijvoorbeeld 25 euro per keer, gewoon telefonisch te regelen.
- K06-c: Zet erbij hoe je opzegt, gewoon 'bel en het is klaar', en laat die eerste maand voor een euro weg, dat maakt het juist onbetrouwbaar.
- K12-a: Bied naast het lidmaatschap een losse klus aan met een vaste prijs, zodat mensen die weinig nodig hebben geen maandbedrag hoeven te betalen.
- K12-b: Zet onder 'Prijs, gewoon helder' een regel over betalen (factuur, overschrijving of incasso) en een link naar een korte privacyverklaring die zegt welke gegevens bewaard worden en hoe lang.
- K12-c: Voeg een losse klus zonder lidmaatschap toe (vaste prijs, per e-mail of telefoon te boeken) en schrijf uit hoe opzeggen en betalen werkt en welke gegevens worden bewaard.

Triggers:
- P30-a: Als ongebruikte klusjes zouden opsparen, of als ik straks lichamelijk echt niet meer op de trap kan.
- P30-b: Als een paar mensen uit het dorp die ik ken het al een jaar hebben en zeggen dat de rekening nooit hoger was dan 14,95.
- P30-c: Als mijn vrouw het voor haar moeder wil en iemand die we kennen zegt dat die klusser een fatsoenlijke vent is.
- P30-d: Als er zwart op wit staat 'opzeggen kan telefonisch, prijs staat minstens twee jaar vast' en de energienota van deze maand is verwerkt.
- P35-a: Dat mijn dochter of een collega zegt 'doe dat nou gewoon, mam' en dat ik alles per telefoon kan regelen.
- P35-b: Als iemand die ik ken zegt dat ze echt op tijd komen en gewoon netjes bellen als het niet lukt.
- P35-c: Een losse klus voor een vast laag bedrag zonder lidmaatschap, zodat ik alleen betaal als ik echt iets nodig heb.
- P40-a: Als Harrie van het koor het niet meer kan en de buurvrouw zegt dat zij deze mensen ook over de vloer heeft.
- P40-b: Een goedkoper abonnement met één klusje per maand of per twee maanden, zodat ze niet betaalt voor klusjes die vervallen.
- P40-c: Als Nel van de kaartclub of de buurvrouw ook lid wordt en dezelfde klusser krijgt, doet ze mee.
- P42-a: Als de buurman verhuist of ziek wordt en er een losse klus van rond de 20 euro zou bestaan zonder maandbedrag.
- P42-b: Iemand uit de soos of de flat die zegt dat ze de klusser kent en dat hij netjes en op tijd was, plus een gratis proefklus in plaats van 1 euro.
- P42-c: Een strippenkaart of losse klus voor rond de 20 euro per keer, zonder maandbedrag, die ze in het schrift als eenmalig kan opschrijven.
- P45-a: Als de thuiszorg of mijn dochter zou zeggen dat ze het zelf voor hun ouders gebruiken en dat het klopt.
- P45-b: Als de kerk of de thuiszorg zou zeggen dat het een betrouwbare jongen is en je alleen betaalt als hij echt komt.
- P45-c: Als mijn dochter het regelt en betaalt, en het bedrijf zegt dat een lamp of plug tegen winkelprijs op de rekening komt.
- P45-d: Als de thuiszorg of Dinie zegt dat het steeds dezelfde nette jongen is en mijn zoon het uit het potje betaalt.
- P47-a: Een telefoontje waarin iemand rustig uitlegt hoe zij hun klussers kiezen en begeleiden, en dat ik het voor mijn buurvrouw kan regelen zonder dat zij iets digitaals hoeft.
- P47-b: Als niet-gebruikte klusjes een paar maanden opgespaard mogen worden, of als er een variant is waarbij je alleen betaalt als er echt iemand komt.
- P47-c: Een concrete garantie: komt niet dezelfde klusser of komt hij niet binnen twee werkdagen, dan is die maand gratis.
- P31-a: Als de kop in één zin duidelijk maakte dat dit ook iets is om voor je ouders te regelen, zou ik blijven hangen.
- P31-b: Eén zin die zegt: opzeggen kan telefonisch of per e-mail en u krijgt een bevestiging, en ik zou het proberen voor mijn moeder.
- P31-c: Als een niet-gebruikt klusje één maand mee mocht naar de volgende, en er stond wat er gebeurt als een klus over de 30 minuten heen gaat, zou ik het eerlijk vinden.
- P13-a: Een knop 'regel het voor mijn moeder' die me in een minuut door de aanmelding trekt, zonder bellen.
- P13-b: Meer klantverhalen zoals dat van G. van der Meer, liefst van mensen uit mijn eigen buurt, en klusjes die je een paar maanden mag opsparen.
- P13-c: Een paar ervaringen van andere mantelzorgers plus de mogelijkheid het lidmaatschap samen met mijn broer te delen of klusjes mee te nemen.
- P16-a: Een losse klus tegen een vaste prijs zonder abonnement, of een abonnement waarbij ongebruikte klusjes een paar maanden meegaan.
- P16-b: Bevestiging dat het aanmelden voor mijn ouders in vijf minuten geregeld is en dat de klusser ook 's avonds echt komt.
- P16-c: Een duidelijke regel over overschrijding (bijvoorbeeld: loopt uit, dan telt het als twee klusjes, nooit een uurtarief) en een maandoverzicht zonder verrassingen.
- P06-a: Als ik het voor mijn schoonouders kan regelen en de collega na een paar maanden nog steeds tevreden is.
- P06-b: Een variant zonder vaste maandkosten waarbij ik het alleen voor mijn moeder inschakel als het nodig is.
- P06-c: Als ik het in één zin bovenaan lees als iets wat je ook per keer kunt afnemen, zonder maandbedrag.
- P39-a: Als ik een keer zou kunnen bellen en de klusser zelf aan de lijn krijg, en de ongebruikte klusjes een paar maanden blijven staan, dan wordt het anders.
- P39-b: Als er gewoon stond dat je opzegt met één telefoontje en dat de eerste maand niet automatisch doorloopt, zou ik het thuis nog eens bekijken.
- P39-c: Als ik de klusser eerst zelf een keer kan zien werken bij mijn schoonmoeder, zonder abonnement, dan sluit ik het voor haar af.
- P39-d: Als ik per klus kon betalen, zonder vaste maandelijkse afschrijving, zou ik het bewaren voor als de handen het niet meer doen.
- K10-a: Als de niet-gebruikte klusjes zouden opsparen of het abonnement pas gaat lopen bij de eerste echte klus.
- K10-b: Een telefoontje met een echt mens en een paar andere families bij hetzelfde zorgcentrum die het al gebruiken.
- K10-c: Als de klusser dezelfde persoon was die toch al in het zorgcentrum werkt, of als Marjan het voor haar eigen huis zou nemen en hem dan één keer meenam.
- K06-a: Als Henkie zegt dat het bij zijn moeder echt werkt en ik weet wie er komt, dan geloof ik het.
- K06-b: Als ik voor mijn moeder los per keer kan bellen, een vaste prijs, dezelfde man, zonder maandbedrag.
- K06-c: Iemand die ik ken die het heeft en zegt dat je met één telefoontje weer van ze af bent.
- K12-a: Een losse klus tegen een vaste prijs, zonder abonnement, voor het ene ding dat hij echt niet zelf kan.
- K12-b: Een korte, leesbare privacyverklaring en de zin dat je per factuur kunt betalen zonder incasso, app of account.
- K12-c: Een losse klus van een half uur voor een vaste prijs rond de 35 euro, te bestellen per telefoon of e-mail en te betalen per factuur.
