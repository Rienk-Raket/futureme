# Review persona-bibliotheek klantenpanel (60 persona's, versie 1.0, peildatum 2026-09)

Onafhankelijke review op basis van `references/personas.json`, `references/personas-schema.md`, `references/bronnen.md` en de uitvoer van `scripts/validate_personas.py` (geen fouten, geen waarschuwingen; grootste afwijkingen: geloof "geen" -5,0, stedelijk +3,1, katholiek +3,4, "anders" in werk -3,0). Naast het script heb ik eigen kruistabellen gemaakt (huishouden, inkomen, woonsituatie, gender x leeftijd, provincie, opleiding x leeftijd, herkomst x leeftijd, schalen per opleidingsrichting, digitale vaardigheid per leeftijdsgroep).

Algemeen oordeel: de bibliotheek is degelijk gebouwd. De marginale verdelingen kloppen, de persona's zijn rijk beschreven, de kansgroep-gedachte (klein gewicht, wel zichtbaar) is goed. De problemen zitten in (a) een paar grote groepen die ontbreken of alleen als bijfiguur voorkomen, (b) systematische kruispatronen die het script niet meet (opleiding x houding, leeftijd x digitaal, herkomst x inkomen, gender x rolverdeling), en (c) een handvol persona's die een cliché stapelen, waaronder een die neerkomt op een bekend stripfiguur.

---

## 1. Dekking

### 1.1 Grote groepen die ontbreken of alleen als bijfiguur bestaan

**D1. Alleenwonende volwassenen onder de 55 zonder kinderen (circa 8-9% van de volwassenen, ruim 1,2 miljoen mensen).**
Persona's: alleen P21 (43, gescheiden, cynische gamer, 1,4%), K02 (0,5%) en K11 (0,8%) wonen alleen en zijn jonger dan 55; samen 2,7%. De grootste alleenwonende groep in Nederland, de twintiger/dertiger in een stad in een huurappartement met een gewone baan, ontbreekt. P21 komt het dichtst in de buurt maar is via scheiding, ironie en "anti-gedoe" een uitgesproken type; hij kan niet de doorsnee alleenwonende dertiger spelen.
Voorstel: maak ruimte door P45 en K10 samen te voegen (beide: hoogbejaarde weduwe, thuiszorg, kinderen beslissen; K10 dekt de "beslisser is niet de gebruiker"-vraag al beter) en vul het vrijgekomen nummer met "alleenwonende vrouw of man van 31, mbo-4 of hbo, loondienst (bijvoorbeeld zorgadministratie of logistiek planner), huur particulier in Zwolle of Tilburg, modaal, alleen alle vaste lasten dragen, veel abonnementen delen met vrienden". Gewicht 2,0 (uit P45 2,8 -> 1,8 en P39 2,8 -> 2,4).

**D2. Niet-werkenden zonder uitkering ("anders", 3% in de richtcijfers, panel 0,0%).**
Persona's: geen. Huisvrouwen/huismannen, vroeggepensioneerden onder de AOW-leeftijd en mensen die zonder uitkering tussen banen zitten komen alleen voor als partner van een man (P36 "zijn vrouw is thuis", P37 "zijn vrouw zorgt voor het huishouden", P33's man "met vroegpensioen"). CBS telt circa 0,8-1 miljoen 25-65-jarigen buiten de beroepsbevolking zonder uitkering of studie, een meerderheid vrouw, oververtegenwoordigd onder 50-65 en onder eerste-generatie vrouwen.
Voorstel: geef P19 (Esther, 16 uur) een variant of verander P33 zo dat zij zelf zonder betaald werk is (mantelzorg en oppas fulltime, inkomen van partner). Beter: een nieuwe persona "vrouw van 58 in Apeldoorn, gestopt met werken na burn-out, partner werkt, doet de financiën van het huishouden, vrijwilliger bij de kringloop", of, om ook D6 te raken, "vrouw van 52, eerste generatie Marokkaans, nooit betaald gewerkt, regelt sinds haar man ziek is alle geldzaken zelf met de bank-app".

**D3. Hbo-studenten (circa 500.000, 3,4% van de volwassenen) en mbo-bol-studenten van 18+.**
Persona's: P01 (mbo-4 BBL-achtig met stage), P02 (wo), P05 (BBL, telt als loondienst). De grootste studentengroep (hbo) ontbreekt; wo (2,4% werkelijk) krijgt 1,8. Werk-klasse "student" komt uit op 3,8 tegen 6.
Voorstel: maak P02 hbo-student (bijvoorbeeld hbo-verpleegkunde of social work in Nijmegen of Zwolle; de Duitse moeder en de duurzame instelling kunnen blijven) en verhoog naar 2,2. Of maak P04 (24, net afgestudeerd) een laatstejaars hbo-student met stage; dat houdt de 18-24-verdeling in balans.

**D4. Licht verstandelijke beperking (LVB) en zwakbegaafdheid (SCP: circa 1,1-1,4 miljoen mensen, waarvan een groot deel volwassen).**
Persona's: geen. K06 (laaggeletterd) en K01 (schulden, leest niet) komen het dichtst in de buurt, maar LVB is een andere drempel: niet alleen tekst, ook overzicht, consequenties overzien, telefoontjes van verkopers, bewindvoering, en de grootste groep in de schuldhulpverlening. Voor een panel dat "onvervulde behoefte of risico" wil blootleggen is dit de sterkste ontbrekende kansgroep.
Voorstel: vervang K05 (zie S4) of K08 (zie D11) door "man van 34 in Almere met LVB, werkt via een sociaal werkbedrijf in de groenvoorziening, budgetbeheer via de gemeente, wordt vaak overgehaald aan de deur en de telefoon, begeleider helpt bij brieven". Gewicht 0,8.

**D5. Psychische klachten (CBS: circa 12-15% van de volwassenen met langdurige psychische klachten; TNO: 20% van de werkenden met burn-outklachten).**
Persona's: P34 ("somber"), P17 ("periodes van stress"), K09 en K11 zijdelings. Geen persona voor wie angst, depressie of burn-out de dagelijkse situatie bepaalt (wachtlijst ggz, moeite met bellen, uitstellen van administratie, schaamte).
Voorstel: geef P34 (werkloos, 60) expliciet een depressieve episode met behandeling, of maak van D2 de burn-outvariant. Geen extra persona nodig als een van beide wordt aangepast.

**D6. Lhbti-personen (CBS: circa 6-7% van de volwassenen, ruim 900.000).**
Persona's: alleen K02 (non-binair). Geen enkele persona is homo, lesbisch of bi. Dat hoeft geen eigen persona te zijn, maar het ontbreekt nu volledig, terwijl het voor toon, beeldgebruik en "gezinsaannames" in een aanbod wel uitmaakt.
Voorstel: maak het bij twee of drie bestaande persona's gewoon onderdeel van de context, zonder er een thema van te maken: P09 ("zijn man is advocaat" in plaats van "zijn partner"), P38 (vriendin in plaats van vriendinnen) of P41. Geen wijziging van gedrag of gewichten.

**D7. Kennismigranten uit India en Oost-Europese arbeidsmigranten uit Roemenië/Bulgarije; Oekraïense ontheemden.**
Persona's: K07 (Ierse expat) en P11 (Poolse zzp'er) zijn goed, maar Ierland is atypisch: India is sinds 2022 het grootste herkomstland van kennismigranten (circa 100.000 mensen, snel groeiend); Roemenen en Bulgaren (circa 150.000) werken vaker in slachterijen, kassen en distributie via uitzendbureaus en wonen in huisvesting van de werkgever; Oekraïners (circa 120.000 volwassenen sinds 2022) zijn een nieuwe grote groep met eigen regelingen.
Voorstel: maak K07 een Indiase software-engineer in Amstelveen of Eindhoven (zelfde profiel: Engels, hoog inkomen, creditcard, alles online) en noem in de kansgroep_reden dat zij ook de grootste expatgroep vertegenwoordigt. P11 mag Pools blijven; voeg in zijn dagelijkse_situatie een zin toe over collega's uit Roemenië die via het uitzendbureau wonen, zodat variantgeneratie daar iets mee kan.

**D8. Zzp'ers (werkelijk circa 8% van de volwassenen, 1,2 miljoen) tegenover ondernemers met personeel (circa 2,5%).**
Persona's: zzp 7,1% (P11, P17, P26, P28, K02, K11 deels), ondernemer met personeel 4,4% (P18, P25, P32, K05, K08). De som klopt, de verhouding niet: werkgevers zijn bijna twee keer te zwaar, zzp'ers te licht. Vrouwelijke zzp'ers (circa 40% van alle zzp'ers, vooral in zorg, beauty, kinderopvang en administratie) ontbreken, behalve P17 (creatief).
Voorstel: P08 (kapster) omzetten naar "drie dagen loondienst plus zzp aan huis met een eigen Instagram" (ze wil al een eigen salon) en P24 of P13 als zzp'er in de thuiszorg (beide beroepen zijn de kern van de zorg-zzp-groei). Gewichten: P32 1,1 -> 0,8; P18 1,3 -> 1,0; P17 1,7 -> 2,0; P11 1,2 -> 1,5.

**D9. Flevoland en Noord-Brabant onder, Overijssel en Zeeland over.**
Provincie-verdeling van het panel tegenover inwonertallen: Overijssel 11,3% (werkelijk 6,6), Zeeland 4,6 (2,2), Drenthe 3,8 (2,8), Noord-Brabant 11,1 (14,6), Gelderland 10,0 (11,9), Flevoland 1,5 (2,5). Flevoland heeft één persona (P10, armoede in Almere Buiten), terwijl het archetype van de provincie het jonge gezin met koopwoning in Almere of Lelystad is. Zeeland heeft twee zware persona's (P23 2,4 en P46 2,2).
Voorstel: verplaats P04 (Zwolle) naar Nijmegen of Arnhem en P06 (Ede) naar Almere; verlaag P46 naar 1,6 en geef de 0,6 aan P13 (Brabant). Overijssel gaat dan naar circa 9,6 en Brabant naar circa 11,7; niet perfect, wel dichterbij.

**D10. Regio-spreiding van de kansgroepen.**
Tien van de twaalf kansgroepen wonen (zeer) sterk stedelijk; alleen K06 (Winschoten) en K12 (Wageningen, matig) niet. Daardoor komt de vraag "werkt thuisbezorging, ov-loos regelen of een ophaalpunt ook buiten de stad?" bij geen enkele kansgroep aan bod, terwijl juist daar de onvervulde behoefte zit (K09 thuisgebonden in een dorp zonder bezorging is een sterker signaal dan in Breda).
Voorstel: verplaats K09 naar een dorp in West-Brabant of de Achterhoek en K11 naar een middelgrote plaats (Assen, Roosendaal).

**D11. Digitale vaardigheid bij 65-plussers is systematisch te laag ingeschat.**
65-74 (13,3%): P39 laag, P42 laag, P43 laag, P44 laag = 8,2% "laag" (62% van de groep); alleen P41 hoog en P40 basis. CBS ICT-gebruik 2023-2025: van de 65-75-jarigen gebruikt ruim 95% internet, circa 85% internetbankieren, en heeft rond twee derde minimaal basisvaardigheden. 75+ (10,3%): P45 geen, P46 geen tot laag, P48 geen, K10 geen = 7,7% "geen/laag" (75% van de groep) tegenover P47 gemiddeld. CBS: ruim driekwart van de 75-plussers gebruikt internet, ruim de helft bankiert online. Het panel maakt van 65-plussers een grotendeels offline groep die "via de kinderen" leeft; dat is 2010, niet 2026. Het totaal "laag of geen" (20,6) klopt alleen omdat 55-64 dan weer te goed scoort.
Voorstel: P39 -> "gemiddeld (bank-app, WhatsApp, Marktplaats; wantrouwt QR en nieuwe apps)"; P43 -> "gemiddeld (bankiert en boekt reizen online, belt voor alles wat maatwerk is)"; P46 -> "laag (tablet voor krant en e-mail met zoon, verder niets)". Verlaag P45 naar 1,8 en verhoog P47 naar 3,4 (zie G3). Dat verandert het totaal "laag of geen" naar circa 16, binnen de marge.

### 1.2 Kleinere gaten (geen prioriteit, wel noemen)
- Doven en zwaar slechthorenden onder de 65 (circa 30.000 doof, 200.000 ernstig slechthorend): alleen leeftijdsgebonden gehoorverlies bij P40, P46, P47. Kandidaat voor een variant van K04.
- Gezinnen met een zorgintensief kind (circa 100.000-150.000 ouders): niet aanwezig; sluit aan bij mantelzorg (panel 6,6% expliciet tegenover 13% CBS; P22, P38 en P36 noemen het als bijzin, dat is acceptabel).
- Jonge, evangelisch-praktiserende stedelingen (migrantenkerken, Hillsong-achtige gemeenten) ontbreken; P10 (pinkster) en P44 (EBG) zijn de enige niet-traditionele christenen.
- Politie, defensie, beveiliging (circa 120.000): geen persona. Niet nodig voor een consumentenpanel.
- Boomerang-kinderen van 25-30 die door de woningmarkt bij ouders wonen (circa 400.000): P03 (23) komt het dichtst.

### 1.3 Zijn de 12 kansgroepen goed gekozen?
Goed gekozen (klein, blootleggend, niet al door een hoofdgroep gedekt): K01 (schulden, mits ontdaan van de clichés, zie S1), K03 (statushouder, positief en concreet), K04 (blind, meet toegankelijkheid genadeloos), K06 (laaggeletterd, sterk beschreven), K07 (expat), K09 (energiebeperking, dwingt tot "geen extra stap"), K10 (beslisser is niet de gebruiker; de beste kansgroep van de set), K11 (opzegbaarheid), K12 (privacy, voorspelt regelgeving).

Twijfelachtig:
- **K08 (innovator, 0,5)** overlapt bijna volledig met P26 (innovator, 1,6, ook vermogend, ook Amsterdam-regio, ook start-up-investeerder, ook man van 40-55). Twee keer dezelfde stem levert geen extra feedback op. Voorstel: maak van K08 een innovator zonder geld: "vrouw van 26, mbo-4 ICT, werkt bij een servicedesk in Groningen, test elke nieuwe app en elk apparaat met een krap budget, schrijft reviews die haar hele kennissenkring leest". Dat scheidt "innovator" van "rijk".
- **K05 (Chinese restauranthouder)** is het meest clichématige beroep voor de groep en de tweede generatie (hoogopgeleid, tweetalig) is inmiddels groter dan de eerste. De onderliggende vraag ("werkt een aanbod buiten de Nederlandse kanalen, met andere betaalgewoonten?") is goed. Voorstel: vervang door D4 (LVB) en laat de "eigen kanalen"-vraag door K03 (Arabischtalige netwerken) en P11 (Poolse Facebookgroepen) dragen; die dekken hetzelfde mechanisme al. Of: houd de Chinese ondernemer maar maak hem een importeur/webshophouder in Rotterdam die zelf de Nederlandse administratie doet.
- **K02 (non-binair én autisme én kunstacademie én freelance illustrator)** stapelt vier kenmerken tot het herkenbare "queer artist online"-cliché. Zie S3.
- **K06** is met 1,2 zwaarder dan drie hoofdgroep-persona's (P25 0,9, P32 1,1, P11 1,2). Dat is verdedigbaar (laaggeletterdheid raakt 12-17%), maar dan is "kansgroep" niet het juiste etiket; het is eigenlijk een hoofdgroep. Geen wijziging nodig, wel een zin in de schema-toelichting.

Betere kandidaten dan een van de huidige: LVB (D4) boven K05; innovator zonder geld boven K08; en, als er ruimte is, de ouder van een kind met een beperking of de dorpsbewoner zonder auto en met slecht ov (P33 en P45 raken dat zijdelings).

---

## 2. Gewichten

### 2.1 Dimensies met afwijkingen (script en eigen kruistabellen)
Het script meldt geen enkele afwijking boven 5 procentpunt; de hoogste is geloof "geen" -5,0 (precies op de grens). Mijn eigen kruistabellen leveren wel afwijkingen op die het script niet ziet:

**G1. Huishouden.** Na correctie (P23 is een paar met thuiswonende zoon, P39/P44/P47 zijn paren zonder thuiswonende kinderen): paar zonder thuiswonende kinderen 37,4 (richt 33, +4,4), paar met kinderen 30,2 (28, +2,2), alleenwonend 19,2 (22, -2,8), thuiswonend kind 8,2 (8), eenouder 5,0 (5). Binnen de marge, maar alleenwonend is aan de lage kant en zit bijna volledig bij 55-plussers (zie D1). Te rechtvaardigen: nee, alleenwonenden onder 55 zijn een grote consumentengroep.

**G2. Werk.** Student 3,8 (richt 6, -2,2) en "anders" 0,0 (3, -3,0): samen 5 punt te weinig voor mensen zonder loondienst, uitkering of pensioen. Zelfstandig 11,5 (9, +2,5) maar met de verkeerde verhouding zzp/werkgever (D8). Het richtcijfer "werkloos/uitkering 6" is zelf waarschijnlijk te laag: WW (circa 170.000), bijstand (circa 400.000), WIA/WAO/Wajong (ruim 1 miljoen, deels werkend) tellen bij elkaar op tot 9-11% van de volwassenen; panel 7,4 is dus eerder goed dan te hoog.

**G3. Leeftijd x vitaliteit bij 75+.** Van de 10,3% 75-plussers is 7,7 (P45, P46, P48, K10) kwetsbaar, niet-digitaal en afhankelijk van kinderen; 2,6 (P47) vitaal. In werkelijkheid woont ruim 90% van de 75-plussers zelfstandig en krijgt circa 30% thuiszorg of Wmo-hulp; de meerderheid van de 75-85-jarigen is redelijk vitaal. P45 is met 2,8 de zwaarste persona van de hele bibliotheek: een slechtziende weduwe met hartfalen, rollator en thuiszorg in een dorp in Salland vertegenwoordigt daarmee ruim een kwart van alle 75-plussers. Niet te rechtvaardigen. Voorstel: P45 2,8 -> 1,8; P48 1,8 -> 1,3; P46 2,2 -> 1,6; P47 2,6 -> 3,4; rest (0,5) naar D1.

**G4. Geloof.** "Geen" 51,0 (56); katholiek 20,4 (17); islam 8,7 (7). De uitleg in bronnen.md (cultureel-katholieken tellen als lid) is deels terecht, maar P43 (Gooi, "katholiek (cultureel)") en P32 zouden bij CBS eerder "geen" zeggen. Islam: CBS 15+ zit op circa 6%, dus het panel zit 2,5-3 punt te hoog, en alle zes moslim-persona's zijn "praktiserend" (zie S6). Voorstel: P43 -> "geen (katholiek opgevoed)"; P37 1,3 -> 1,0 en P20 1,7 -> 1,4; de vrijgekomen 0,6 naar P06 of P12 ("geen").

**G5. Stedelijkheid.** Zeer sterk stedelijk 32,7% tegenover circa 25-27% werkelijk; sterk stedelijk 22,4 (circa 27). Het script ziet dat niet omdat het beide klassen samenvoegt. Oorzaak: negen kansgroepen in zeer sterk stedelijke wijken plus veel Rotterdam/Den Haag/Amsterdam. Te rechtvaardigen: deels (kansgroepen zijn vaak stedelijk), maar zie D10.

**G6. Provincie.** Overijssel +4,7, Zeeland +2,4, Brabant -3,5 (zie D9). Regio-totalen kloppen, de provincies daaronder niet.

**G7. Herkomst x inkomen.** Van de veertien persona's met een herkomst buiten Europa hebben er zes (P10, P28, P37, P42, P44, K01) inkomen "laag" of ruimte "krap"; gewogen circa 45% van die groep. CBS: het armoederisico is bij een niet-Europese herkomst circa drie keer zo hoog als gemiddeld, maar ligt op 15-20%, niet op 45%. P07, P15, P38 en K03 zijn de goede tegenwichten, maar te licht. Voorstel: P44 een fatsoenlijk GVB-pensioen geven ("beperkt" -> "gemiddeld", en de foutieve AOW-korting schrappen, zie S12); P20's huishouden naar modaal-plus (haar man in ploegendienst verdient goed); P38 1,8 -> 2,1.

**G8. Opleiding x houding.** Gewogen gemiddelden praktisch tegenover theoretisch: duurzaamheid 1,9 tegenover 3,5; prijsgevoeligheid 4,2 tegenover 2,5; sociale bewijskracht 3,8 tegenover 2,6; vertrouwen instanties 2,8 tegenover 3,6. Geen enkele praktisch opgeleide persona heeft duurzaamheid 4 of 5; geen enkele theoretisch opgeleide heeft prijsgevoeligheid 5 behalve K02. Een verschil is realistisch (CBS meet dat vertrouwen en klimaatzorg samenhangen met opleiding), maar de spreiding binnen de groepen is weg. Motivaction vindt bewust-duurzame segmenten in alle opleidingsniveaus. Voorstel: P12 duurzaamheid 2 -> 4 (hij installeert warmtepompen en gelooft in de techniek, niet in de praatjes), P05 3 -> 4, P25 3 -> 4 (rentmeesterschap staat al in zijn waarden), P39 2 -> 3; P09 prijsgevoeligheid 1 -> 2 en P17 3 -> 4 (wisselend inkomen); P16 sociale bewijskracht 2 -> 3.

### 2.2 Individuele gewichten
- P45 (2,8), P39 (2,8), P40 (2,7): de drie zwaarste persona's zijn allemaal 68-79, praktisch opgeleid, dorp, laag digitaal. Samen 8,3% voor één type. Zie G3 en D11.
- P30 (2,7): magazijnchef 58, Betuwe. Verdedigbaar als archetype van de praktisch opgeleide man van 55-64 (13,6% in acht persona's).
- P22 (2,4): hbo-teamleider gemeente Groningen, vertrouwen instanties 5. Voor een persona die zo uitgesproken pro-overheid is, is 2,4 aan de zware kant; 2,0 en de 0,4 naar P24.
- P25 (0,9): melkveehouder is 0,3-0,4% van de volwassenen. 0,9 is te zwaar voor het beroep, maar hij is de enige persona in het buitengebied; goed als proxy als de kernzin "buitengebied" in plaats van "boer" benadrukt. Laat staan.
- Kansgroepen: 9,0 totaal is goed. K06 1,2 en K01 1,0 zijn terecht het zwaarst; K02 en K08 0,5 terecht het lichtst.

### 2.3 Bronnen in bronnen.md: wat ik betwijfel
- **Mediagebruik (s):** "WhatsApp circa 95%" is te hoog; Newcom 2025 telt circa 13,5 miljoen gebruikers, dat is 75-80% van de bevolking en circa 90% van de internetgebruikers. "LinkedIn circa 45%" is waarschijnlijk 30-35% (5-6 miljoen accounts, minder actieve gebruikers). "Instagram 55%" is eerder 45-50%.
- **Vertrouwen medemens 67% (2023):** CBS meldde voor 2022-2023 een daling naar circa 61-64%; 67% is het niveau van 2021. Nazoeken.
- **Digitale vaardigheid "circa 50% meer dan basisvaardigheden":** Eurostat/CBS 2023 geven voor 16-75 eerder 55-65% "above basic"; het cijfer 50 lijkt te laag, wat het richtcijfer "hoog 40" verklaart. Het effect is beperkt omdat 75-plussers buiten de CBS-meting vallen.
- **Laaggeletterdheid "12% van 16-65":** dit is het PIAAC-2012-cijfer. PIAAC 2023 (gepubliceerd december 2024) laat voor Nederland een stijging van het aandeel lage lezers zien; het richtcijfer is dus eerder een ondergrens. De 2,5 miljoen (lezen, schrijven en/of rekenen, 16+) is een andere, bredere definitie; noem dat expliciet.
- **Werk "werkloos of uitkering 6":** zie G2; waarschijnlijk 9-11%.
- **Herkomst-indeling:** klopt. In de CBS-herkomstindeling (2022) valt Turkije onder "buiten Europa"; bronnen.md volgt dat terecht.
- **Geloof 44% (2024):** plausibel (CBS 2022: 43%). Islam 7 is aan de hoge kant; CBS 15+ meet 5,5-6,5%.
- **Woningvoorraad 57/29/14:** klopt met CBS 2024; let op dat het panel per persoon meet (koop 59,3), wat hoger uitvalt dan per huishouden omdat gezinnen vaker kopen. Consistent.
- **Bevolking 18,0 miljoen, 14,5 miljoen 18+, 65+ 20,9%:** klopt (1-1-2025). Merk op dat 65-plussers 25-26% van de volwassenen zijn; de richtcijfers 14+11 = 25 zijn correct afgeleid.
- **Mantelzorg 13% (2023):** plausibel voor de CBS-definitie; SCP gebruikt een bredere (circa een derde van de volwassenen). Vermeld welke.
- **Rogers-verdeling:** terecht als vuistregel gemarkeerd. Praktische opmerking: in het panel zijn alle 65-plussers late majority of achterblijver, behalve P41 en P47. Dat is een leeftijdsstereotype; CBS-adoptie van bijvoorbeeld e-bikes en tablets ligt juist hoog bij 65-75.

---

## 3. Stereotypering en respect

### 3.1 Concrete gevallen

**S1. K01 Jayden Martina (P1).** Curaçaose moeder, Rotterdam-Zuid, geen startkwalificatie, schulden, deurwaarder, "straattaal-achtig", maakt muziek, dyslexie, wil "iets eigens" beginnen. Elk element afzonderlijk bestaat, maar de stapeling is het bekende beeld van "de Antilliaanse jongen met schulden". De groep die de kansgroep_reden beschrijft (jongeren zonder startkwalificatie met flexwerk en schulden) is in meerderheid zonder migratieachtergrond. Herkomst wordt hier feitelijk als verklaring van gedrag gebruikt.
Voorstel: schrap de Curaçaose achtergrond en Papiaments (of verplaats die naar een persona met een gewone baan, bijvoorbeeld P04 of P13), schrap "straattaal-achtig" en "maakt muziek". Laat hem een uitzendkracht uit Dordrecht of Almelo zijn, of maak er een jonge vrouw van (schulden bij jonge vrouwen via BNPL en kleding zijn zeker zo groot). Behoud: flex-app, BNPL-schuld, "is het echt gratis of nep gratis?" (die zin is sterk).

**S2. P48 Harry Zwart (P1).** Haags, oud-havenwerker, portiek in Moerwijk, scootmobiel naar de snackbar en de sigarettenwinkel, "Wat mot je nou?", mopperend met humor, budget "grotendeels sigaretten en snackbar". Dit is één op één de stripfiguur Haagse Harry (Marnix Rueb), inclusief naam, taal en houding. Dat botst met de regel "geen echte, herkenbare personen" (een bekend fictief personage valt daar in de praktijk ook onder) en de toon is neerbuigend ("Gewoon tv, gewoon eten, gewoon roken").
Voorstel: hernoem naar bijvoorbeeld "Leen Verbaan", verplaats naar Rotterdam-Zuid of Vlaardingen, geef hem één ding dat tegen het cliché ingaat (hij is jarenlang vakbondskaderlid geweest en leest nog steeds elke brief van het pensioenfonds; of hij doet zelf zijn bankzaken via de telefoon met de bank), en herschrijf budget en belangrijk zonder de sigaretten als hoofdthema. Verlaag naar 1,3 (zie G3).

**S3. K02 Sam Veldhuis.** Non-binair, autisme, kunstacademie, freelance illustrator, werkt 's nachts, Tumblr/Mastodon, Discord. Vier kenmerken die samen precies het "queer neurodivergente kunstenaar online"-beeld vormen. Twee gevoelige kenmerken op één persona maakt bovendien onduidelijk welk kenmerk in de feedback spreekt.
Voorstel: splits. Houd K02 non-binair maar met een gewoon beroep en netwerk ("mbo-4 laborant bij een zuivelfabriek in Leeuwarden, woont met partner, gamet, vraagt een voornaamwoordveld maar verder een doorsnee klant"). Verplaats autisme en prikkelgevoeligheid naar een andere persona (bijvoorbeeld P21, die nu al "geen gedoe, alleen schriftelijk, kleine kring" is; dat maakt hem menselijker in plaats van cynischer).

**S4. K05 Wei Chen.** Chinees-Indisch restaurant, dochter doet de Nederlandse administratie, contant, WeChat, zes dagen van elf tot elf, "wil dat de kinderen niet het restaurant overnemen". Elk detail klopt statistisch voor de eerste generatie, maar het is het enige beeld dat Nederland van Chinese Nederlanders heeft. Zie de voorstellen bij 1.3.

**S5. P37 Ali Yıldız.** Theehuis, moskee, "zijn vrouw zorgt voor het huishouden", kinderen regelen DigiD, contant, elke zomer een maand naar het dorp, waarden "geloof, familie, eer". "Eer" als waarde bij de enige eerste-generatie Turkse man is een beladen woordkeus (associatie met eergerelateerd geweld) en voegt niets toe. De persona heeft geen enkel element dat tegen het cliché ingaat, wat de schema-regel wel eist.
Voorstel: "eer" -> "waardigheid" of "gastvrijheid"; voeg toe dat hij in het bestuur van de huurdersvereniging zit en de servicekosten van het hele blok controleert, of dat hij als enige in de familie de vaste lasten op papier bijhoudt. Verlaag naar 1,0 (G4).

**S6. Alle zes moslims zijn "praktiserend"; vier hebben "geloof" als waarde.** P03, P07, P20, P28, P37, K03 zijn allemaal praktiserend; bij katholieken en protestanten bestaan wel gradaties (cultureel, opgevoed, praktiserend). Onder Nederlanders met een Turkse of Marokkaanse achtergrond noemt circa 85-90% zich moslim, maar minder dan de helft bezoekt wekelijks een moskee. P03 ("vast in de ramadan, verder ontspannen") is de goede uitzondering.
Voorstel: P20 -> "moslima, cultureel, viert de feesten, gaat zelden naar de moskee" (hoofddoek schrappen als veld; het zegt niets over gedrag) en haar waarden "familie, geloof, gastvrijheid" -> "familie, eerlijkheid, gastvrijheid". P28 mag praktiserend blijven, maar schrap "Sociaal leven speelt zich af in de moskee en het koffiehuis" of vul aan met "en de voetbalclub van zijn zoon". "Turkse tv" bij P20 (tweede generatie, 36) is gedateerd; vervang door "Netflix en Turkse series".

**S7. P28 Rachid Bouali, stem "Broer, wat kost het?".** "Broer" als aanhef bij de Marokkaans-Nederlandse taxichauffeur is straattaal-cliché voor een man van 48. Voorstel: "Vriend, wat kost het?" of gewoon "Wat kost het, en wat kost het echt?".

**S8. P44 Ruud Wijngaarde, stem "met Surinaams ritme"; P42 Bep Salakory, stem "Aduh, dat is duur".** Beide beschrijven de stem via een exotisch etnisch kenmerk in plaats van via gedrag. Voorstel: P44 "bedachtzaam, spreekt in voorbeelden uit de buurt"; P42 "zacht, hartelijk, telt hardop mee in euro's". Als een Indische uitdrukking gewenst is, zet die dan in de dagelijkse situatie, niet als handelsmerk van de stem.

**S9. P42 Bep Salakory: naam en achtergrond kloppen niet.** Salakory is een Molukse achternaam; de persona is "Indisch" (ouders geboren in Indonesië, katholiek, Indische soos). Molukkers en Indische Nederlanders zijn verschillende gemeenschappen (Molukkers overwegend protestants, 1951 in wijken gehuisvest). Voorstel: houd haar Indisch en geef haar een Nederlandse achternaam zoals gebruikelijk in Indische families ("Bep Wesselink"), of maak haar Moluks en pas geloof en soos aan. P21 Sahetapy (Moluks-Indisch, protestants opgevoed) klopt wel.

**S10. Gezondheid en gewicht zitten alleen bij praktisch opgeleiden.** Overgewicht: P14, P27, P35, P48; roken: P23, P48. Allemaal praktisch opgeleid. Theoretisch opgeleiden "sporten veel" (P16), "sport drie keer per week" (P38), "zwemt drie keer per week" (P47). CBS: circa 50% van de volwassenen heeft overgewicht, ook 40% van de hoogopgeleiden. Het patroon koppelt gezondheidsgedrag aan klasse. Voorstel: geef P16 of P22 "overgewicht, probeert af te vallen" en P30 of P12 "sport (hardlopen, voetbal)"; haal bij P27 "overgewicht" weg, het speelt geen rol in haar gedrag.

**S11. Rolverdeling m/v bij praktisch opgeleide gezinnen.** "Zijn vrouw doet de administratie" (P11, P18, P25, P32), "zijn vrouw regelt de agenda en het huishouden" (P39), "zijn vrouw runt het gezin" (P14), "zijn vrouw doet het huishouden met een hulp" (P43), "zijn vrouw is thuis" (P36), "zijn vrouw zorgt voor het huishouden" (P37). Bij P14 beslist hij "over auto, gereedschap en verzekeringen". Het is statistisch niet onwaar, maar het is bij negen mannen hetzelfde script en bij geen enkele omgekeerd. Voorstel: bij minstens drie omdraaien of neutraliseren: P18 doet zelf de boekhouding in een app; P39 regelt de bankzaken en de boodschappen; P14 bestelt vanuit de cabine online de boodschappen voor thuis en zijn vrouw beslist over de auto.

**S12. P44: "AOW met korting wegens jaren buitenland" klopt niet.** Hij kwam in 1975 op zijn zestiende; AOW-opbouw begint 50 jaar voor de AOW-leeftijd (dus rond zijn 17e). Hij heeft dus (vrijwel) volledige AOW. De korting versterkt onbedoeld het beeld "Surinamer = arm". Schrappen; zie ook G7.

**S13. P46 Jan Dekker: "Betaalt met acceptgiro's zolang het kan."** De acceptgiro is op 1 juni 2023 afgeschaft. In 2026 bestaat die niet meer. Vervang door "laat zijn zoon overboeken" of "gebruikt de overschrijvingskaart van de bank / betaalt aan de balie van de bank in Goes". Kleine feitelijke fout, maar zo'n zin ondermijnt in een variant meteen de geloofwaardigheid.

**S14. P14 Mark Veenstra: geen tegen-cliché.** Vrachtwagenchauffeur, Drenthe, "boos over dieselprijzen, regels en stikstof", Telegraaf, Facebook, vertrouwen instanties 1, duurzaamheid 1, scepsis 5, "Engelse termen en hippe praatjes". Dit is het "boze witte man"-sjabloon zonder de door het schema geëiste eigenschap die ertegen ingaat. Voorstel: hij rijdt sinds twee jaar in een elektrische truck voor zijn werkgever en is er lyrisch over (de techniek wel, het beleid niet), of hij is de penningmeester van de dorpsvoetbal die elke euro op een spreadsheet zet. Een van beide volstaat.

**S15. "Via de kinderen"-trope.** P33, P35, P37, P39, P40, P42, P44, P45, P46, P48, K05, K06, K10: dertien persona's (ruim 20% gewicht) beslissen of regelen zaken via kind, partner of dochter. Het is een echt mechanisme (en K10 maakt het expliciet tot thema), maar in deze frequentie wordt het de standaard voor "oud" en "migrant". Zie D11 en G3; na die aanpassingen blijven P33, P37, P45, K05, K06, K10 over, en dat is genoeg.

### 3.2 Namen en herkenbare personen
- Geen merknamen als persona-naam. Merknamen in de teksten (Rabobank, Aldi, Action, Netflix, DSM, GVB, WeChat) zijn context; prima.
- P48 "Harry Zwart" + Haags + "Wat mot je nou?" = Haagse Harry (zie S2).
- P10 "Pengel": de naam is in Suriname vrijwel synoniem met oud-premier Johan Adolf Pengel (Pengelstadion). Niet fout, wel onhandig; "Jessica Kensmil" of "Jessica Vreden" is neutraler.
- P01 "Daan Hoekstra" en P25 "Sjoerd Hoekstra": twee keer dezelfde achternaam (Fries) waarvan één in Brabant. Verwarrend in rapportages; hernoem P01 naar "Daan Vermeulen".
- K08 "Bas Hollander" voor de Amsterdamse tech-investeerder is een tikje op de neus, maar niet spottend.
- Overige namen zijn passend bij leeftijd, regio en achtergrond (Bep, Nel, Corrie, Ria, Joke voor 65-plus; Daan, Noor, Fenna, Jayden voor jong). Geen spottende namen.

### 3.3 Persona's die te veel op elkaar lijken
- **P14 en P23** (chauffeur Drenthe, operator Zeeland): beide praktisch, late majority, scepsis 5, vertrouwen instanties 1-2, duurzaamheid 1, Telegraaf en Facebook, ergernis "hippe woorden en Engels", "wie verzint dit?". In een panel geven ze dezelfde reactie. Differentieer P23: hij is vakbondslid en vertrouwt zijn pensioenfonds en de cao (vertrouwen instanties 3), hij koopt wel gadgets voor zijn boot (fishfinder), en hij vergelijkt Belgische en Nederlandse aanbieders.
- **P08 en P27** (kapster Kerkrade, supermarkt Sittard): beide Limburg, koopjes over de grens, prijsgevoeligheid 5, sociale bewijskracht 5, "gezelligheid". Los het op via D8: P08 wordt de startende zzp'er met eigen Instagram-klanten, ambitie en angst voor de Belastingdienst; dat maakt haar wezenlijk anders.
- **P26 en K08** (innovators, vermogend, Amsterdam-regio): zie 1.3.
- **P29 en K09** (vrouw, WIA, chronisch ziek, online lotgenotengroepen, "niet als zielig/patiënt benaderd worden", ergernis "gezond en actief als norm"): zelfde stem in twee lichamen. Maak P29 een man (WIA is bijna 50/50 m/v): "oud-lasser van 55 met hartfalen in Dordrecht, doet de klusjes voor de buurt zolang het kan, zit niet in groepen maar praat met de fysio". Of houd Wendy en schrap de lotgenotengroepen: zij is gewoon een klant die toevallig reuma heeft en vooral van tuinieren houdt.
- **P31 en P41** (docent/oud-docent, NRC, NPO Radio 1, duurzaamheid 5, prijsgevoeligheid 2, sociale bewijskracht 2, ergernis "simplificaties/taalfouten"): beide de "bewuste hoogopgeleide Randstedeling". P22 sluit daar bijna bij aan. Differentieer P31: Trouw en Radio 4 in plaats van NRC, ze vliegt elk jaar naar haar zoon in Australië en heeft daar vrede mee (duurzaamheid 4, niet 5), en ze is juist de eerste in haar koor die een nieuwe app uitprobeert (early majority).
- **P39, P40, P45, P46** (dorp, 68-82, kerk, "bel ik liever", kinderen adviseren): verschillen in geloof en gezondheid maar niet in gedrag. Na D11 en G3 blijft er genoeg verschil over.
- **P19 en P36** (bevindelijk gereformeerd, Reformatorisch Dagblad, geen social, zondagsrust, "reclame met halfnaakte mensen"): verschillen in gender en levensfase, maar samen 3,1% voor een stroming van circa 1,5-2% van de volwassenen. Maak P19 vrijgemaakt/evangelisch (Nederlands Dagblad, wel Instagram, wel tv): dat dekt de bredere orthodox-protestantse groep (circa 5%) en haalt de dubbeling weg.

### 3.4 Wat goed is
Ter balans: P07 (developer, moslim, privacy als hoofdmotief), P38 (HR-adviseur, inclusiviteit als eigen keuze, niet als lot), K03 (statushouder als vroege adopter), K04 (blind, zakelijk en geestig), K06 (laaggeletterdheid met trots en strategie), K10 (twee stemmen in één persona), P47 (76 en digitaal) en P25 (boer, zakelijk voorop, privé afwachtend) doen precies wat de ontwerpregel vraagt: het gevoelige kenmerk is context, het gedrag komt uit beslisstijl en budget. Die aanpak moet de norm worden voor S1-S6.

---

## Prioriteit 1 (moet)
1. **S2** P48 hernoemen en de-karikaturiseren (Haagse Harry); gewicht 1,3.
2. **S1** K01 ontdoen van de Curaçaose/straattaal-stapeling; groep is in meerderheid zonder migratieachtergrond.
3. **D11 + G3** Digitale vaardigheid en vitaliteit van 65-plussers realistisch maken: P39, P43, P46 omhoog; P45 2,8 -> 1,8, P48 -> 1,3, P46 -> 1,6, P47 -> 3,4.
4. **D1** Alleenwonende 25-54 zonder kinderen toevoegen (samenvoegen P45/K10 maakt ruimte), gewicht 2,0.
5. **S5, S6, S7, S8** Herkomst en geloof als context, niet als gedragssjabloon: "eer" bij P37 vervangen, één moslim-persona niet-praktiserend (P20), "Broer" bij P28 weg, "Surinaams ritme"/"Aduh" als stemkenmerk weg.
6. **S9, S12, S13** Feitelijke fouten: Salakory (Moluks) bij een Indische persona, AOW-korting P44, acceptgiro P46.

## Prioriteit 2 (zou moeten)
7. **D2 + D5** Persona voor niet-werkend zonder uitkering (huisvrouw/huisman, vroeg gestopt) en/of psychische klachten; sluit het gat "anders 0,0 tegenover 3".
8. **D8 + 3.3** P08 als startende zzp'er (vrouwelijke zzp ontbreekt; lost dubbeling P08/P27 op); gewichten zzp omhoog, werkgevers omlaag.
9. **D4 + 1.3** K05 vervangen door een LVB-persona; K08 vervangen door een innovator zonder geld (dubbeling met P26).
10. **S3** K02 splitsen: non-binair zonder de kunstenaar/autisme-stapeling; autisme naar P21.
11. **G7** Inkomen bij persona's met niet-Europese herkomst minder eenzijdig krap: P44, P20, P38.
12. **G8 + S10 + S11 + S14** Spreiding binnen opleidingsgroepen: duurzaamheid bij P12/P05/P25 omhoog, overgewicht en sport niet langs klassenlijnen, rolverdeling bij drie mannen omdraaien, P14 een tegen-cliché geven.
13. **3.3** Dubbelingen P14/P23, P29/K09, P31/P41, P19/P36 uit elkaar trekken.
14. **D3** Hbo-student (P02 of P04 aanpassen), student-gewicht richting 5-6.
15. **2.3** bronnen.md: WhatsApp/LinkedIn/Instagram-cijfers, vertrouwen medemens, laaggeletterdheid (PIAAC 2023), "werkloos/uitkering 6" corrigeren of als (s) met bandbreedte markeren.

## Prioriteit 3 (mag)
16. **D9 + D10** Provincies (Overijssel/Zeeland omlaag, Brabant/Flevoland omhoog) en twee kansgroepen buiten de grote stad (K09, K11).
17. **D6** Seksuele oriëntatie als gewone context bij twee of drie persona's (P09, P38 of P41).
18. **D7** K07 van Iers naar Indiaas; zin over Roemeense collega's bij P11.
19. **G4** P43 als "geen (katholiek opgevoed)"; islam-gewicht naar circa 7.
20. **3.2** Namen: P01 -> Daan Vermeulen (dubbel Hoekstra), P10 -> andere achternaam dan Pengel.
21. **1.2** Kleinere gaten (doof onder 65, zorgintensief gezin, jonge evangelische stedeling, boomerang-kinderen) noteren in personas-schema.md als bewust niet gedekt, zodat variantgeneratie er niet per ongeluk een cliché van maakt.
22. Script: laat `validate_personas.py` ook huishouden, provincie, zeer sterk versus sterk stedelijk, zzp versus werkgever, en digitale vaardigheid per leeftijdsgroep rapporteren; daar zaten de afwijkingen die het nu niet ziet. Corrigeer de gezondheidsclassificatie (matcht nu "slaapt slechter" als "slecht").
