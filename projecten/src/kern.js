"use strict";
// === KERN: pure functies (geen DOM, geen opslag), getest in projecten/tests/kern.test.mjs ===

/* PT-KERN-BEGIN */
const PT_FASES = [
  { id: "idee", letter: "A", naam: "Idee", vraag: "Wat wil je maken, en waarom?" },
  { id: "verkennen", letter: "B", naam: "Verkennen", vraag: "Wat weet je nog niet?" },
  { id: "plannen", letter: "C", naam: "Plannen", vraag: "Wat zijn de mijlpalen?" },
  { id: "bouwen", letter: "D", naam: "Bouwen", vraag: "Wat is de volgende handeling?" },
  { id: "afronden", letter: "E", naam: "Afronden", vraag: "Wat is nog nodig voor 'klaar'?" },
  { id: "opleveren", letter: "F", naam: "Opleveren", vraag: "Bij wie of waar komt het terecht?" },
  { id: "evalueren", letter: "G", naam: "Evalueren", vraag: "Wat neem je mee naar het volgende project?" }
];
const PT_STATUS = {
  idee: { naam: "Ideeënbak", kort: "Idee" },
  actief: { naam: "Actief", kort: "Actief" },
  wacht: { naam: "Wacht op iets", kort: "Wacht" },
  pauze: { naam: "Gepauzeerd", kort: "Pauze" },
  klaar: { naam: "Afgerond", kort: "Klaar" },
  archief: { naam: "Gearchiveerd", kort: "Archief" }
};
const PT_ENERGIE = { laag: "Weinig energie", midden: "Gemiddeld", hoog: "Veel energie" };
const PT_LOGSOORTEN = {
  werk: { naam: "Werkblok", ico: "▶" }, notitie: { naam: "Notitie", ico: "✎" }, blokkade: { naam: "Blokkade", ico: "⛔" },
  winst: { naam: "Winst", ico: "★" }, energie: { naam: "Energie", ico: "⚡" }, fase: { naam: "Fase", ico: "⇢" }
};
const PT_KLEUREN = ["#36e2ff", "#8b7bff", "#ff5fd2", "#4dffa6", "#ffb84d", "#ff6b6b", "#5d9cff", "#e6ff5c"];
const PT_DAG = 86400000;

const ptFaseIndex = id => Math.max(0, PT_FASES.findIndex(f => f.id === id));
const ptIsOpen = p => p && ["idee", "actief", "wacht", "pauze"].includes(p.status);

/** Voortgang 0–100: de fase telt mee (A=0, G≈90) en binnen de fase het deel van de stappen dat af is. */
function ptVoortgang(p, stappen) {
  if (!p) return 0;
  if (p.status === "klaar" || p.status === "archief" && p.afgerondOp) return 100;
  const i = ptFaseIndex(p.fase), stuk = 100 / PT_FASES.length;
  const eigen = (stappen || []).filter(s => s.projectId === p.id);
  const af = eigen.length ? eigen.filter(s => s.af).length / eigen.length : 0;
  return Math.min(99, Math.round(i * stuk + af * stuk));
}

/** Dagen sinds de laatste log (of sinds het project gemaakt is). */
function ptDagenStil(p, logs, nu) {
  const eigen = (logs || []).filter(l => l.projectId === p.id).map(l => Date.parse(l.ts)).filter(Boolean);
  const laatst = eigen.length ? Math.max(...eigen) : Date.parse(p.gemaakt) || nu;
  return Math.max(0, Math.floor((nu - laatst) / PT_DAG));
}

/** Gezondheid van een open project: op koers, afkoelend, stil, deadline dichtbij of verlopen. */
function ptGezondheid(p, logs, nu) {
  if (!ptIsOpen(p)) return { id: "rust", naam: PT_STATUS[p.status] ? PT_STATUS[p.status].naam : "Rust" };
  if (p.deadline) {
    const dagen = Math.floor((Date.parse(p.deadline + "T23:59:59") - nu) / PT_DAG);
    if (dagen < 0) return { id: "verlopen", naam: "Deadline voorbij", dagen };
    if (dagen <= 3 && p.status === "actief") return { id: "deadline", naam: dagen === 0 ? "Deadline vandaag" : `Deadline over ${dagen} ${dagen === 1 ? "dag" : "dagen"}`, dagen };
  }
  if (p.status !== "actief") return { id: "rust", naam: PT_STATUS[p.status].naam };
  const stil = ptDagenStil(p, logs, nu);
  if (stil >= 14) return { id: "stil", naam: `${stil} dagen stil`, dagen: stil };
  if (stil >= 7) return { id: "afkoelend", naam: "Koelt af", dagen: stil };
  return { id: "koers", naam: "Op koers", dagen: stil };
}

/** De volgende stap: eerst een gepinde, dan de eerste open stap op volgorde. */
function ptVolgendeStap(p, stappen) {
  const open = (stappen || []).filter(s => s.projectId === p.id && !s.af).sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (a.volgorde || 0) - (b.volgorde || 0));
  return open[0] || null;
}

const ptNorm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
/** Filteren. f: { status: [..] | "open" | "alles", fase, cluster, tag, energie, zoek }. */
function ptFilter(projecten, f) {
  const o = f || {};
  return (projecten || []).filter(p => {
    if (o.status === "open" ? !ptIsOpen(p) : Array.isArray(o.status) && o.status.length && !o.status.includes(p.status)) return false;
    if (o.fase && p.fase !== o.fase) return false;
    if (o.cluster && (p.cluster || "") !== o.cluster) return false;
    if (o.tag && !(p.tags || []).includes(o.tag)) return false;
    if (o.energie && p.energie !== o.energie) return false;
    if (o.zoek) {
      const w = ptNorm(o.zoek).trim();
      if (w && !ptNorm([p.titel, p.waarom, p.klaar, p.cluster, (p.tags || []).join(" ")].join(" ")).includes(w)) return false;
    }
    return true;
  });
}

/** Sorteren: prioriteit, deadline, voortgang, bijgewerkt of titel. */
function ptSorteer(projecten, op, stappen) {
  const l = (projecten || []).slice(), d = p => p.deadline || "9999-12-31";
  const cmp = {
    prioriteit: (a, b) => (b.prioriteit || 0) - (a.prioriteit || 0) || d(a).localeCompare(d(b)),
    deadline: (a, b) => d(a).localeCompare(d(b)),
    voortgang: (a, b) => ptVoortgang(b, stappen) - ptVoortgang(a, stappen),
    bijgewerkt: (a, b) => String(b.bijgewerkt || "").localeCompare(String(a.bijgewerkt || "")),
    titel: (a, b) => String(a.titel).localeCompare(String(b.titel), "nl")
  }[op] || ((a, b) => 0);
  return l.sort(cmp);
}

/** Clusteren in groepen, op een vaste volgorde. op: fase | status | cluster | energie | deadline. */
function ptCluster(projecten, op, nu) {
  const groepen = new Map();
  const zet = (sleutel, naam, p) => { if (!groepen.has(sleutel)) groepen.set(sleutel, { sleutel, naam, projecten: [] }); groepen.get(sleutel).projecten.push(p); };
  const volgorde = {
    fase: PT_FASES.map(f => f.id), status: Object.keys(PT_STATUS), energie: ["hoog", "midden", "laag", ""],
    deadline: ["verlopen", "week", "maand", "later", "geen"]
  }[op];
  for (const p of projecten || []) {
    if (op === "fase") { const f = PT_FASES[ptFaseIndex(p.fase)]; zet(f.id, `${f.letter} · ${f.naam}`, p); }
    else if (op === "status") zet(p.status, PT_STATUS[p.status] ? PT_STATUS[p.status].naam : p.status, p);
    else if (op === "energie") zet(p.energie || "", PT_ENERGIE[p.energie] || "Energie onbekend", p);
    else if (op === "deadline") {
      if (!p.deadline) zet("geen", "Geen deadline", p);
      else { const dg = Math.floor((Date.parse(p.deadline + "T23:59:59") - nu) / PT_DAG);
        if (dg < 0) zet("verlopen", "Deadline voorbij", p); else if (dg <= 7) zet("week", "Binnen een week", p); else if (dg <= 31) zet("maand", "Binnen een maand", p); else zet("later", "Later", p); }
    } else zet(p.cluster || "", p.cluster || "Zonder cluster", p);
  }
  const l = [...groepen.values()];
  if (volgorde) l.sort((a, b) => volgorde.indexOf(a.sleutel) - volgorde.indexOf(b.sleutel));
  else l.sort((a, b) => (a.sleutel === "") - (b.sleutel === "") || a.naam.localeCompare(b.naam, "nl"));
  return l;
}

/** De draad: op hoeveel van de laatste n dagen heb je iets gelogd (geen streak, geen schuld). */
function ptDraad(logs, nu, n, projectId) {
  const dagen = n || 14, set = new Set();
  for (const l of logs || []) {
    if (projectId && l.projectId !== projectId) continue;
    const t = Date.parse(l.ts); if (!t || nu - t > dagen * PT_DAG || t > nu) continue;
    const d = new Date(t); set.add(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate());
  }
  return { actief: set.size, van: dagen };
}

/** Minuten gewerkt (werkblokken) vanaf een moment, optioneel per project. */
function ptMinuten(logs, vanaf, projectId) {
  return (logs || []).filter(l => l.soort === "werk" && Date.parse(l.ts) >= vanaf && (!projectId || l.projectId === projectId)).reduce((s, l) => s + (+l.minuten || 0), 0);
}

/** WIP: mag er nog een project actief? Geeft het aantal actief en de limiet terug. */
function ptWip(projecten, limiet, behalveId) {
  const actief = (projecten || []).filter(p => p.status === "actief" && p.id !== behalveId).length;
  return { actief, limiet, vrij: actief < limiet };
}

/** Werkwoordcheck light: is een eerste stap concreet genoeg (begint met een handeling)? */
const PT_VAAG = ["regelen", "fixen", "uitzoeken", "oppakken", "afhandelen", "organiseren", "iets", "dingen", "zaken", "nadenken", "bezig", "werken"];
const PT_GEBIEDEND = ["bel", "mail", "app", "koop", "schrijf", "maak", "stuur", "betaal", "plan", "lees", "zoek", "pak", "leg", "zet", "breng", "haal", "check", "vul", "print", "open", "teken", "scan", "bestel", "vraag", "test", "bouw", "kies", "noteer", "lijst", "schets", "kopieer", "installeer", "maak", "zoek", "bekijk", "sorteer", "verwijder", "ruim"];
function ptStapVaag(tekst) {
  const w = ptNorm(tekst).replace(/[^a-z0-9 ]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!w.length) return true;
  if (w.some(x => PT_VAAG.includes(x))) return true;
  if (PT_GEBIEDEND.includes(w[0])) return false;
  return !w.some(x => x.length >= 5 && /(en|eren|elen)$/.test(x));
}

/** Een project in één zin voor het commandocentrum. */
function ptStatusZin(p, g, stap) {
  if (!p) return "Geen project in focus.";
  if (g.id === "verlopen") return `${p.titel}: de deadline is voorbij. Een nieuwe datum is ook een plan.`;
  if (g.id === "stil") return `${p.titel} ligt ${g.dagen} dagen stil. Eén kleine stap brengt hem weer in beweging.`;
  if (g.id === "afkoelend") return `${p.titel} koelt af. Vijf minuten vandaag houdt de draad vast.`;
  return stap ? `Volgende stap: ${stap.tekst}.` : `${p.titel} heeft nog geen volgende stap.`;
}
/* PT-KERN-EINDE */
