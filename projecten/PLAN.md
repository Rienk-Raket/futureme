# FutureMe Projecten — plan

Besluit Kas, 10 oktober 2026. FutureMe wordt een **accountabilitypartner en projectentracker**: van idee tot afgerond (A tot Z), afgestemd op je neurodivergente profiel.

**Vaste regels:**
- **Offline en privé:** geen account, netwerk of analytics. Alles staat op je iPhone, met export en import.
- **Taal:** Nederlands, zonder schuld of 'moet'.
- **Uitleg:** elke aanpassing en elk advies heeft "Waarom?" met een bewijsniveau (Direct, Indirect of Praktisch).
- **Toegankelijk:** tikvlakken van minstens 44px. Minder beweging en het lichte thema werken overal.
- **Werkwijze:** een commit per stap, een review per fase, en pas naar main na akkoord.

De nieuwe app staat in `projecten/` en heeft een eigen bouwscript en eigen tests. De oude FutureMe-app blijft staan tot Kas besluit hem te vervangen.

## Het model

| Ding | Wat |
|---|---|
| **Project** | titel, waarom, definitie van klaar, fase (A–G), status, cluster, tags, energie, prioriteit, deadline, kleur |
| **Fases A–G** | A Idee · B Verkennen · C Plannen · D Bouwen · E Afronden · F Opleveren · G Evalueren |
| **Status** | Idee (ideeënbak) · Actief · Wacht op · Gepauzeerd · Afgerond · Gearchiveerd |
| **Stap** | een kleine handeling met een werkwoord, optioneel duur, mijlpaal en fase |
| **Mijlpaal** | een tussendoel met een datum |
| **Log** | werkblok (minuten), notitie, blokkade, winst, energie; altijd aan een project |
| **Belofte** | accountability: "volgende stap, wanneer"; bij een check-in eerlijk "gedaan, half of niet", zonder schuld |
| **Evaluatie** | per mijlpaal en bij afronden: wat werkte, wat schuurde, wat neem je mee |

## Fases van de bouw

1. **Fundament.**
   - Projecten vastleggen via een wizard van 4 stappen, met een werkwoordcheck voor de eerste stap.
   - Fases A–G met een fasebalk.
   - Stappen, mijlpalen en een snelle log.
   - Filteren, clusteren (fase, status, cluster, energie, deadline), zoeken en archiveren.
   - De **Commandocentrum**-HUD: orbit van actieve projecten op gezondheid, focusproject, volgende stap, tellers.
   - Export en import, offline (service worker), donker als standaard met een licht thema.
   - Een WIP-limiet: standaard hooguit 3 actieve projecten, met een voorstel om te parkeren.
2. **Accountability.**
   - Beloftes met check-ins.
   - Een focusblok met timer, dat zelf logt.
   - De "draad": actief op hoeveel van de laatste 14 dagen, zonder streak-schuld.
   - Weekreview, evaluaties bij mijlpaal en afronden, en een signaal als een project afkoelt.
3. **Profiel en vastloop-hulp** (uit Brain-Mate Nate).
   - De kennismaking (96 vragen, 7 patronen) stuurt de app. Bijvoorbeeld:
     - Jongleur: lagere WIP-limiet.
     - Vonk: nieuwe ideeën eerst in de ideeënbak.
     - Vuurtoren: vaste indeling.
     - Batterij: blokken op energie.
   - Ik loop vast, de werkwoordcheck, kiezen tussen projecten (Keuzemachine-light) en dagniveau.
4. **Overengineered.**
   - Burndown en ritme-heatmap, afhankelijkheden tussen stappen, sjablonen per soort project.
   - Een commandopalet, statistieken per cluster en het afrondingsritueel.
