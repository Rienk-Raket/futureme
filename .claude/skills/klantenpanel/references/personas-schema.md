# Schema van de persona-bibliotheek

Bestand: `references/personas.json`. Eén JSON-object met metadata en een lijst `personas` van 60 objecten. Alle scripts (`select_personas.py`, `generate_variants.py`, `build_prompt.py`) lezen dit schema; wijzig veldnamen dus niet zonder de scripts aan te passen. `scripts/validate_personas.py` controleert het schema, de som van de gewichten en de verdeling per dimensie.

## Velden per persona

| Veld | Type | Betekenis |
|---|---|---|
| `id` | string | `P01`..`P48` hoofdgroepen, `K01`..`K12` kansgroepen |
| `naam` | string | Fictieve naam. Geen echte of bekende personen, geen merknamen. |
| `kansgroep` | bool | `true` voor een kleine, vaak over het hoofd geziene groep |
| `kansgroep_reden` | string of null | Waarom deze groep een niche, vroege adoptie, onvervulde behoefte of risico kan blootleggen |
| `gewicht_pct` | number | Geschat aandeel in de volwassen bevolking (%). Som over alle 60 = 100. |
| `kernzin` | string | Eén zin die de persona typeert; wordt gebruikt in de selectietabel |
| `demografie` | object | Zie hieronder |
| `profiel` | object | Zie hieronder |
| `gedrag` | object | Zie hieronder |
| `tags` | lijst | Trefwoorden voor selectie (bijv. `gezin`, `krap`, `laag-digitaal`, `randstad`) |

### `demografie`
`leeftijd`, `leeftijdsgroep` (18-24, 25-34, 35-44, 45-54, 55-64, 65-74, 75+), `gender`, `huishouden`, `levensfase`, `opleiding`, `opleidingsrichting` (praktisch | theoretisch), `werk` (loondienst, zzp, ondernemer met personeel, werkloos, arbeidsongeschikt, gepensioneerd, student, mantelzorg, combinaties), `beroep`, `inkomen` (laag, beneden modaal, modaal, modaal-plus, bovenmodaal, hoog), `financiele_ruimte` (krap, beperkt, gemiddeld, ruim), `woonsituatie`, `regio` (Randstad, Noord, Oost, Zuid), `provincie`, `stedelijkheid` (CBS-klassen), `plaats_type`, `herkomst`, `taal_thuis`, `nederlands_niveau`, `geloof`, `gezondheid`, `beperking`.

### `profiel`
`dagelijkse_situatie` (3-5 zinnen), `belangrijk` (3 punten), `ergernissen` (3 punten), `waarden` (3 woorden), `beslisstijl` (hoe deze persoon kiest, met wie, hoe snel), `budget` (vrij besteedbaar per maand en wat voorgaat), `stem` (hoe de persona praat: toon, typische zinnen). De `stem` is bewust opgenomen zodat varianten herkenbaar en verschillend klinken.

### `gedrag`
`digitale_vaardigheid` (geen | laag | gemiddeld | hoog, met toelichting), `geletterdheid` (laag | beperkt | voldoende | goed), `mediagebruik` (lijst), `aankoopstijl`, `innovatie_adoptie` (innovator | early adopter | early majority | late majority | achterblijver), en zes schalen van 1 tot 5: `prijsgevoeligheid`, `duurzaamheid`, `vertrouwen_bedrijven`, `vertrouwen_instanties`, `scepsis`, `sociale_bewijskracht` (hoe sterk reviews en aanbevelingen van anderen wegen).

## Ontwerpregels

- Gevoelige kenmerken (herkomst, geloof, gezondheid, beperking, inkomen) zijn context voor behoeften en drempels, nooit de verklaring van gedrag. Gedrag komt uit `beslisstijl`, `budget`, `waarden` en de schalen.
- Mensen binnen een groep verschillen. Daarom heeft elke persona minstens één eigenschap die tegen het cliché van de groep ingaat (de vitale 76-jarige die online bankiert, de developer die vooral op privacy let, de boer die zakelijk vooroploopt maar privé afwacht).
- De gewichten zijn geschat op basis van CBS-verdelingen per dimensie (`bronnen.md`). Een persona is een combinatie van kenmerken; de marginale verdelingen (leeftijd, gender, opleiding, regio, herkomst, werk, geloof, digitale vaardigheid, adoptie) zijn gekalibreerd, de kruisingen zijn een plausibele schatting.
- Kansgroepen krijgen kleine gewichten (samen 9%) zodat ze de gewogen uitkomst niet domineren, maar in de ongewogen rapportage per persona altijd zichtbaar blijven.
