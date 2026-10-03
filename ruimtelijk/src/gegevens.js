"use strict";
// === SECTIE 84: JE GEGEVENS – EXPORTEREN EN IMPORTEREN ===
/* ==========================================================================
   84. Je gegevens
   Overgenomen uit Brain-Mate Nate (stap 12): bovenaan Meer staat een blok
   "Je gegevens" met twee grote knoppen.
   - Alles exporteren: één JSON-bestand met alle opslagplekken, inclusief
     foto's en bijlagen (de bestaande exportJSON, nu met bijlagen).
   - Importeren: een blad met twee keuzes. Samenvoegen voegt toe wat ontbreekt
     en houdt wat er al is; Alles vervangen wist eerst alles.
   Het blok laat ook zien wanneer je voor het laatst exporteerde.
   Het echte werk (kiezen van het bestand, importJSON) blijft in de basis;
   bouw.py maakt het samenvoegen daar slimmer (zie stap 12 daar).
   De uitgebreide Back-up-pagina blijft gewoon bestaan.
   ========================================================================== */

/* ---------- 84.1 Het blok ---------- */
function gvBlokHTML() {
  const l = inst("laatsteBackup", null), d = l ? new Date(l) : null;
  const laatst = d && !isNaN(d) ? `${esc(datumLabel(vandaagVanDatum(d)).toLowerCase())} om ${pad(d.getHours())}:${pad(d.getMinutes())}` : "nog nooit";
  return `<section class="card card-pad gv-blok" aria-label="Je gegevens">
    <span class="labeltekst">Je gegevens</span>
    <p class="klein">Alles staat alleen op dit toestel. Laatste export: ${laatst}.</p>
    <div class="gv-knoppen">
      <button class="knop primair" data-act="backup-json" data-bijlagen="1">${ico("download")} Exporteren</button>
      <button class="knop rand" data-act="gv-import">${ico("upload")} Importeren</button>
    </div>
    <p class="klein">Eén bestand met al je gegevens, inclusief foto's en bijlagen. Bewaar het in Bestanden of iCloud.</p>
    <button class="gv-link" data-act="ga" data-view="backup">Meer opties: kalender, tekst en wissen ${ico("pijlr", "width:13px;height:13px;vertical-align:-1px")}</button>
  </section>`;
}
const vandaagVanDatum = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* ---------- 84.2 Het importblad ---------- */
function gvImportBlad() {
  bladOpen("Gegevens importeren", `<p style="margin:0 0 10px">Kies een exportbestand van deze app (of een oude back-up).</p>
    <div class="card">
      <button class="rijknop" data-act="backup-import" data-modus="samenvoegen">${ico("upload", "width:20px;height:20px;color:var(--accent)")}
        <span class="nm">Samenvoegen<span class="klein" style="display:block">Voegt toe wat ontbreekt en houdt wat er al is</span></span></button>
      <button class="rijknop" data-act="backup-import" data-modus="vervangen">${ico("upload", "width:20px;height:20px;color:var(--red)")}
        <span class="nm">Alles vervangen<span class="klein" style="display:block">Wist wat er nu staat en zet het bestand terug</span></span></button>
    </div>
    <p class="klein">Twijfel je? Kies Samenvoegen: wat er al staat, blijft staan.</p>`);
}
document.addEventListener("click", e => {
  const k = e.target.closest && e.target.closest('[data-act="gv-import"]');
  if (k) gvImportBlad();
}, true);
// Na de keuze in het blad sluit het blad meteen (in de vangfase, vóór de bestandskiezer opent via de
// bestaande actie); een bevestiging voor 'Alles vervangen' komt daarna in een nieuw blad.
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest('#blad [data-act="backup-import"]');
  if (b) bladSluit();
}, true);

/* ---------- 84.3 Bovenaan Meer ---------- */
{
  const _meer = vwMeer;
  vwMeer = function () { return gvBlokHTML() + _meer.apply(this, arguments); };
}
