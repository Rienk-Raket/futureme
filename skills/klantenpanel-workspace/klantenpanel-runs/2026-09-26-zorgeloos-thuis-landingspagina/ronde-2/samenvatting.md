# Ronde 2: waarde, prijs en bezwaren — samenvatting

**Werkwijze.** De eerste poging van ronde 2 is gearchiveerd in `ronde-2/reacties-poging-1/` (met `opzet-poging-1.json`). Daarin haakten vrijwel alle persona's af omdat ze niet in Apeldoorn wonen, en een paar wantrouwden de invul-bedrijfsgegevens. Dat is een fout in de testopzet, geen oordeel over het aanbod. De context is aangepast (aanbod beschikbaar in de eigen woonplaats; bedrijfsgegevens zijn kloppend) en het sjabloon van de skill zegt dat nu standaard. Alle cijfers hieronder komen uit de tweede poging.

**Kern.** Versie v1 (eerlijke prijs, maandelijks opzegbaar, bellen, "voor uw ouders", wie wij zijn) herstelt het vertrouwen, maar niet de koopbereidheid. Het grootste bezwaar verschuift van vertrouwen naar prijs en nut: een vast maandbedrag voor klusjes die vervallen, terwijl de meeste panelleden maar een paar klusjes per jaar hebben. Realisme-controle: alle controles OK, geen herhaling nodig.

**Cijfers (ronde-2/aggregatie.json, object `v1`, gewogen; tussen haakjes ronde 1, object `origineel`).**

| maat | ronde 2 v1 | ronde 1 origineel |
|---|---|---|
| intentie | 2,58 | 1,91 |
| vertrouwen | 4,21 | 2,78 |
| relevantie | 3,68 | 3,11 |
| waarde voor geld | 3,42 | niet gevraagd |
| positief (intentie 5-7) | 7,9% | 0% |
| negatief (intentie 1-3) | 81,9% | 95,6% |

Bezwaren gewogen: prijs 36%, vertrouwen 24%, relevantie 17%, alternatief 13%. Gedrag: bewaart voor later 28%, deelt met iemand 20%, klikt weg 18%, vraagt iemand anders 18%. Sterkst: P40 Ria, P13 Anouk, P16 Jeroen (intentie 3,33). Zwakst: K12 Jasper (1,67), P39 Henk (1,75), K06 Johan (2,0). Kansgroepen ongewogen intentie 2,0 tegenover hoofdgroepen 2,66.

**Prijs (Van Westendorp, gewogen, eenheid euro per maand voor twee klusjes).** Acceptabel bereik volgens de snijpunten: circa €7 tot €12 per maand. Mediaan van de antwoorden: te goedkoop €5, goedkoop €9, duur €15, te duur €22,50. De huidige €14,95 ligt dus op de grens van "duur". Let op: synthetische panelleden hebben geen echte portemonnee; dit is een richting, geen prijsadvies.

**Wat terugkomt, met bewijs.**
1. *Betalen voor klusjes die vervallen.* "Je betaalt voor lucht" (P42-c); P35-c, P40-b, P06-b, P16-a, K12-c ("de bonuskaart in een ander jasje"), P39-a, P45-b. Idee dat terugkomt: ongebruikte klusjes laten doorschuiven (K10-a, P13-b, P30-a, P39-a, P40-a, P42-c, P45-b/c) of een kleiner pakket (P40-b: één klusje voor circa €8).
2. *Losse klus zonder abonnement.* 27 van de 45 varianten noemen in `alternatief` of `verbeteridee` betalen per klus (losse klus, per keer, een kaart of zonder maandbedrag; telling met de zoekregel `losse (klus|variant)|per keer|per klus|kaart van|zonder (abonnement|lidmaatschap|maandbedrag)`, inclusief enkele die beschrijven hoe ze nu al per keer betalen). Waar een prijs voor een losse klus bij dit bedrijf genoemd wordt, ligt die tussen €15 en €40, meestal €20-30 (P35-c ~€20, K06-b ~€25, P42-a €25, P13-c €25-30, P39-c €30, K12-c €30-35, P06-b ~€35, P16-a €35-40).
3. *De eerste maand voor €1 schaadt het vertrouwen* (P30-b, P35-b, P39-b, P06-a, K06-c, K12-c). Beter: garantie ("komt hij niet binnen twee werkdagen, dan is die klus gratis", P35-b, P42-b, P47-c).
4. *Open vragen in de tekst:* wat gebeurt er na 30 minuten (P16-c, P31-c, P45-c), hoe zeg ik op (P30-d, P31-b, K06-c), hoe betaal ik en wat bewaren jullie (K12-b), wat kost materiaal (P45-c, P30-b). Taalfout: "de klusser belt vooraf even aan op het nummer" (P31-c).
5. *Beslisser is niet de gebruiker blijft de sterkste kans.* P13-c ("voor mam is dit goedkoper dan wat ik nu doe"), P31-b ("in dienst, VOG, verzekerd: dat is de zin die telt als je het voor je moeder regelt"), P39-c, P30-c, P06-a, K10-b, P16-b. Ideeën: "Regel het voor uw ouders" direct onder de kop (P16-b, P31-a, P30-c), gezinsvariant waarbij de dochter lid is en een klus bij een ouder mag laten doen (K10-c).
6. *Doe-het-zelvers (P39, P30, K06, P06, P31 via partner) zijn voor zichzelf geen klant,* maar wel voor hun ouders of voor tv en wifi (K06-a).

**Wat kansgroepen zagen.** K12 Jasper: betaalwijze en privacyverklaring ontbreken; een losse klus tegen vaste prijs zou hij wel overwegen. K10 Nel/Marjan: garantie bij niet-komen en bereikbaarheid buiten kantooruren; Nel zelf wil geen extra vreemden kort na de thuiszorg (K10-c). K06 Johan: wil een mens aan de telefoon en een losse klus voor zijn moeder.

**Aanpassingen voor ronde 3.** Drie richtingen die in model en doelgroep verschillen, alle drie zonder de €1-maand, met opzegregels, de 30-minutenregel uitgelegd, betaalwijze, garantie bij niet-komen en de taalfout hersteld:
- **A "Per klus"**: geen abonnement; €29 per klus tot 30 minuten, of een kaart van vijf klussen voor €125.
- **B "Voor uw ouders"**: lidmaatschap voor volwassen kinderen van ouderen; €12,95 per maand, één klus per maand, ongebruikte klussen sparen tot zes; kind meldt en betaalt, bericht met foto na afloop.
- **C "Klusbuffer"**: goedkoper eigen-huis-lidmaatschap; €7,95 per maand, één klus per maand, sparen tot vier, online een tijdslot kiezen of bellen; extra klus €24.
In ronde 3 vergelijkt het panel origineel, v1, A, B en C.
