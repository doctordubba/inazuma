import { useState, useEffect } from "react";

/* ============================================================
   MONDSTADT WORLD-QUEST TRACKER
   All quests reward primogems. Archon Quests intentionally
   excluded per scope. Event-only / time-limited quests excluded.
   Sources: Game8, Fandom Wiki, GameWith, IGN (cross-checked).
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🍃" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"💨" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🦅" },
];

const CHAIN_TAG = {
  story:       { label:"Story Quest",        color:"#06b6d4" },
  hangout:     { label:"Hangout Event",      color:"#ec4899" },
  dragonspine: { label:"Dragonspine",        color:"#a5b4fc" },
  standalone:  { label:"Standalone",         color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  {
    id:1, tier:1, chain:"standalone",
    name:"Bough Keeper: Dainsleif",
    time:"10-15 min",
    region:"City of Mondstadt — Adventurers' Guild → Cape Oath",
    activate:"Talk to Katheryne at Mondstadt's Adventurers' Guild. She forwards you to Dainsleif waiting outside the city.",
    prereqs:"Complete Prologue Chapter I — Act III: Song of the Dragon and Freedom",
    notes:"Mostly dialogue, a brief escort and a Q&A with Dainsleif (answer the lore questions honestly for the full primogem reward). Serves as prologue to AQ Chapter I Act IV — We Will Be Reunited.",
    rewards:"60 Primogems · 800 AR EXP · 38,100 Mora · Hero's Wit · Mystic Enhancement Ore · Talent books (Resistance / Freedom / Ballad)",
    game8:"https://game8.co/games/Genshin-Impact/archives/317323",
  },
  {
    id:2, tier:1, chain:"story",
    name:"Amber — Wind, Courage, and Wings",
    time:"10-15 min",
    region:"Windrise / Outskirts of Mondstadt",
    activate:"Use the Story Quest menu. Spend 1 Story Key (earned from Daily Commissions). Talk to Amber near the Windrise tree.",
    prereqs:"Adventure Rank 26 + Prologue: Act III completed + 1 Story Key",
    notes:"Lepus Chapter — Act I. The intro Story Quest of the game; basic Glider tutorial framing with Amber. Quick.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Character ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Lepus_Chapter",
  },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:3, tier:2, chain:"dragonspine",
    name:"In the Mountains",
    time:"20-25 min",
    region:"Dragonspine — Adventurer Camp",
    activate:"Teleport to the Dragonspine entrance Statue of Seven, head to the Adventurer Camp, talk to Iris.",
    prereqs:"Dragonspine region accessible (AR 20+ and 'The Outlander Who Caught the Wind' completed)",
    notes:"The Dragonspine intro quest. Iris asks you to investigate three Stone Tablets across the mountain — needs a Scarlet Quartz-empowered hit to break the hard ice over each. Required to unlock Peak of Vindagnyr Domain.",
    rewards:"60 Primogems · 30,000 Mora · 3 Hero's Wit · 3 Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/314752",
  },
  {
    id:4, tier:2, chain:"dragonspine",
    name:"Lost in the Snow",
    time:"20-25 min",
    region:"Dragonspine — Wyrmrest Valley",
    activate:"Talk to Joel at the Adventurer Camp in Wyrmrest Valley.",
    prereqs:"Dragonspine accessible (typically alongside 'In the Mountains')",
    notes:"Help Joel locate his missing father, who never came back from a Dragonspine expedition. Four-part chain. The follow-up 'Snow-Covered Path' has a quietly devastating ending — keep emotional defences up.",
    rewards:"40 Primogems · 30,000 Mora · 300 AR EXP · 2 Hero's Wit · 4 Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/314756",
  },
  {
    id:5, tier:2, chain:"dragonspine",
    name:"Ah, Fresh Meat!",
    time:"20-25 min",
    region:"Dragonspine — east of Statue of Seven",
    activate:"Talk to Henry Schwartz at the eastern Dragonspine camp.",
    prereqs:"Dragonspine accessible",
    notes:"Hunt down the Great Snowboar King for unsoured meat. Tip: use Pyro to thaw Chilled Meat into regular Meat (or carry food that does the same).",
    rewards:"40 Primogems · 300 AR EXP · 4 Hero's Wit · 6 Mystic Enhancement Ore · Goulash recipe · 5 Delicious Goulash",
    game8:"https://game8.co/games/Genshin-Impact/archives/314757",
  },
  {
    id:6, tier:2, chain:"dragonspine",
    name:"The Festering Fang",
    time:"25-30 min",
    region:"Dragonspine — Wyrmrest Valley",
    activate:"Pick up a Strange Tooth from any of the four spawn locations in Wyrmrest Valley. The quest auto-starts on pickup.",
    prereqs:"Dragonspine accessible · Mining (Starsilver Ore)",
    notes:"Collect 4 Strange Teeth (one per Wyrmrest spawn) + 50 Starsilver Ore + a Northlander Polearm Prototype. The reward weapon Dragonspine Spear is one of the better F2P polearms.",
    rewards:"40-50 Primogems · 450 AR EXP · Dragonspine Spear (crafted polearm) · 'Dragonspear' achievement",
    game8:"https://game8.co/games/Genshin-Impact/archives/314753",
  },
  {
    id:7, tier:2, chain:"story",
    name:"Lisa — Troublesome Work",
    time:"25-30 min",
    region:"City of Mondstadt — Knights of Favonius HQ",
    activate:"Story Quest menu. Spend 1 Story Key. Lisa is in the Knights HQ library.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key",
    notes:"Tempus Fugit Chapter — Act I. Lisa wants the books that overdue Mondstadt readers haven't returned. Lots of dialogue, mild combat, brief detective work across the city.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Lisa-flavoured ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/297596",
  },
  {
    id:8, tier:2, chain:"story",
    name:"Klee — True Treasure",
    time:"25-30 min",
    region:"City of Mondstadt → Whispering Woods",
    activate:"Story Quest menu. Spend 1 Story Key. Find Klee in the Knights of Favonius HQ.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key",
    notes:"Trifolium Chapter — Act I. Klee is on probation again; help her with a 'treasure hunt' in the Whispering Woods. Mostly comedic, light combat against slimes and hilichurls.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    game8:"https://game8.co/games/Genshin-Impact/archives/305718",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:9, tier:3, chain:"standalone",
    name:"Time and the Wind",
    time:"30-45 min",
    region:"Stormbearer Point — Nameless Island (east of mainland)",
    activate:"Glide or freeze-walk to the nameless island east of Stormbearer Point. Interact with the ancient sundial ruins.",
    prereqs:"None mechanically, but you need to reach the island (Cryo + Hydro freeze across the water, or full stamina + glide from Starsnatch Cliff with Amber/Venti).",
    notes:"Multi-step puzzle. After examining the sundial, find the Ragged Notebook under breakable stones at the south campsite, then use Elemental Sight between 02:00-05:00 in-game to spot wind clusters. The trail leads you to the Thousand Winds Temple on the mainland for the Thick Notebook + the boss fight against an Eye of the Storm.",
    rewards:"60 Primogems · 500 AR EXP · 4 Hero's Wit · 6 Mystic Enhancement Ore · 60,000 Mora · 'Nothing to Lose But Time' achievement",
    fandom:"https://genshin-impact.fandom.com/wiki/Time_and_the_Wind",
  },
  {
    id:10, tier:3, chain:"story",
    name:"Kaeya — Secret Pirate Treasure",
    time:"30-45 min",
    region:"Cape Oath / Falcon Coast",
    activate:"Story Quest menu. Spend 1 Story Key. Kaeya summons you to the eastern coast.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key",
    notes:"Pavo Ocellus Chapter — Act I. Kaeya, treasure, the inevitable Treasure Hoarder ambushes, and a few brotherly hints. Sets up a lot of Kaeya's later lore.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Pavo_Ocellus_Chapter",
  },
  {
    id:11, tier:3, chain:"story",
    name:"Razor — The Meaning of Lupical",
    time:"40-50 min",
    region:"Wolvendom (southwest of Mondstadt)",
    activate:"Story Quest menu. Spend 1 Story Key. Razor is waiting in Wolvendom.",
    prereqs:"AR 21 + Prologue: Act III + Amber's Lepus Chapter Act I + 1 Story Key",
    notes:"Lupus Minor Chapter — Act I. The Meaning of Lupical → Fate's Chosen Lupical. Bring Pyro and Electro for the slime / hilichurl scuffles. Razor's lore + the Wolfhook he is searching for.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Razor ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/311384",
  },
  {
    id:12, tier:3, chain:"story",
    name:"Jean — Master's Day Off",
    time:"40-50 min",
    region:"City of Mondstadt → Springvale",
    activate:"Story Quest menu. Spend 1 Story Key. Find Jean in the Knights of Favonius HQ.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key",
    notes:"Leo Minor Chapter — Act I. Force-march Jean into actually taking a day off; she keeps finding reasons not to. Multi-NPC dialogue with light combat in Springvale's outskirts.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Leo_Minor_Chapter",
  },
  {
    id:13, tier:3, chain:"story",
    name:"Diluc — Darknight Hero's Alibi",
    time:"40-50 min",
    region:"City of Mondstadt — Angel's Share → Dawn Winery",
    activate:"Story Quest menu. Spend 1 Story Key. Talk to Charles at Angel's Share to start.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key. Prerequisite for Mona's quest.",
    notes:"Noctua Chapter — Act I. Investigate a Fatui-linked mystery alongside Diluc; multiple stops between Angel's Share, the Cathedral, and Dawn Winery.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Diluc ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/304984",
  },
  {
    id:14, tier:3, chain:"story",
    name:"Mona — Beyond This World's Stars",
    time:"40-50 min",
    region:"Cape Oath / Outskirts",
    activate:"Story Quest menu. Spend 1 Story Key. Mona is investigating astrologically suspicious activity at the marker.",
    prereqs:"AR 26 + Prologue: Act III + Diluc's Story Quest (Darknight Hero's Alibi) + 1 Story Key",
    notes:"Astrolabos Chapter — Act I. Track an astrology puzzle, fight an Abyss Mage at the climax, and earn Mona's grudging cooperation.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Mona ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/305641",
  },
  {
    id:15, tier:3, chain:"story",
    name:"Albedo — Shadows of the Ancients",
    time:"40-60 min",
    region:"Dragonspine — adventurer camp NE of the mountain",
    activate:"Story Quest menu. Spend 1 Story Key. Albedo is at the Dragonspine sketch site.",
    prereqs:"AR 28 + Dragonspine accessible + 1 Story Key. Followed up in the Festering Desire event quest line (originally a 1.2 event, now permanent).",
    notes:"Princeps Cretaceus Chapter — Act I. Investigate Geo-aligned ancient ruins with Albedo. The follow-up Festering Desire chain unlocks the craftable sword of the same name (when its drops are farmed in Dragonspine).",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Albedo ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Princeps_Cretaceus_Chapter",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:16, tier:4, chain:"story",
    name:"Venti — Should You Be Trapped in a Windless Land",
    time:"60-90 min",
    region:"City of Mondstadt → Stormbearer Mountains → Cathedral",
    activate:"Story Quest menu. Spend 1 Story Key. Find Venti perched outside the Cathedral.",
    prereqs:"AR 26 + Prologue: Act III + 1 Story Key",
    notes:"Carmen Dei Chapter — Act I. Venti's biggest story beat as a playable character: a journey through Mondstadt's history with two boss-tier confrontations. Long, dialogue-heavy, plays like a mini Archon Quest. Do this AFTER the others in this tier.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Venti ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Carmen_Dei_Chapter",
  },
  {
    id:17, tier:4, chain:"hangout",
    name:"Barbara — Wellspring of Healing",
    time:"60-90 min (all 5 endings)",
    region:"City of Mondstadt — Cathedral",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Talk to Barbara at the Cathedral.",
    prereqs:"AR 26 + Prologue: Act III + Story Keys (2 per attempt)",
    notes:"Five endings. Replays via the menu let you keep prior choices, so you can branch from previous saves. Bring Hydro food / time for repeat attempts.",
    rewards:"60 Primogems (all 5 endings) + 30 Primogems (3 achievements: 1× 20-primo + 2× 5-primo) = ≈ 90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Barbara ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Barbara",
  },
  {
    id:18, tier:4, chain:"hangout",
    name:"Noelle — Chivalric Training (Act I)",
    time:"60-90 min (all endings)",
    region:"City of Mondstadt — Knights of Favonius HQ",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Noelle near the Knights HQ.",
    prereqs:"AR 26 + Prologue: Act III + Story Keys",
    notes:"Noelle wants to make Acting Grand Master. Multiple endings; replay to collect them all. Easier than Barbara's branching tree — most endings flow from clear dialogue forks.",
    rewards:"≈ 90 Primogems (endings + achievements) · Special Dish · Adv EXP · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Noelle/Act_I",
  },
  {
    id:19, tier:4, chain:"hangout",
    name:"Noelle — Knightly Exam Prep (Act II)",
    time:"60-90 min (all endings)",
    region:"City of Mondstadt",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Available after Noelle Act I.",
    prereqs:"Noelle Hangout Act I completed + Story Keys",
    notes:"Second Hangout chapter. Noelle preparing for her Knight examination; multiple endings, replays via menu.",
    rewards:"≈ 90 Primogems (endings + achievements) · Special Dish · Adv EXP · Hero's Wit",
    game8:"https://game8.co/games/Genshin-Impact/archives/328782",
  },
  {
    id:20, tier:4, chain:"hangout",
    name:"Bennett — Fantastic Voyage",
    time:"60-90 min (all endings)",
    region:"City of Mondstadt → Adventurers' Guild",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Bennett at the Adventurers' Guild.",
    prereqs:"AR 26 + Prologue: Act III + Story Keys",
    notes:"Adventure Team Benny's Adventure Team gets bigger. Multiple endings; the comedy threads are some of the game's best.",
    rewards:"≈ 90 Primogems (endings + achievements) · Special Dish · Adv EXP · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Bennett",
  },
  {
    id:21, tier:4, chain:"hangout",
    name:"Kaeya — Shenanigans and Sweet Wine",
    time:"60-90 min (all endings)",
    region:"City of Mondstadt — Angel's Share",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Talk to Kaeya at Angel's Share.",
    prereqs:"AR 26 + Prologue: Act III + Story Keys",
    notes:"Released v3.8 — the first 4★ Hangout added to the original launch roster. Five endings. Kaeya being Kaeya, which means the comedy has teeth.",
    rewards:"60 Primogems (5 endings) + 30 Primogems (achievements: 20 + 5 + 5) = 90 Primogems total · Special Dish · Adv EXP · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Kaeya",
  },
];

// Fill in fallback link generators for each quest
QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Quick wins first: Bough Keeper: Dainsleif is pure dialogue + 60 primogems, and Amber's Story Quest is the lightest character intro." },
  { step:2, text:"Dragonspine block (do them in one trip): In the Mountains → Lost in the Snow → Ah, Fresh Meat! → The Festering Fang. Same region, shared waypoints, shared mob types." },
  { step:3, text:"Lost in the Snow's follow-up 'Snow-Covered Path' (auto-continues) has a story payoff — finish the whole chain in one sitting." },
  { step:4, text:"Time and the Wind is the standout standalone — 60 primogems + an achievement. Bring Amber or Venti for the glide to the nameless island, or freeze the water at the Stormbearer cliffs." },
  { step:5, text:"Story Quest order: Lisa/Klee (lightest) → Kaeya → Razor (needs Amber done first) → Jean/Diluc → Mona (needs Diluc done first) → Albedo → Venti (heaviest)." },
  { step:6, text:"Hangouts cost 2 Story Keys per playthrough and need multiple replays for every ending. Save them for when you have a stockpile of keys from dailies." },
  { step:7, text:"Don't burn Story Keys on a Hangout if you haven't done the gated Story Quests yet — the Story Quests are one-shot for 60 primogems each and unlock the Hangout permanently for that character." },
];

const STORAGE_KEY = "mondstadt-quest-tracker-v1";

export default function MondstadtQuests() {
  const [completed, setCompleted]   = useState({});
  const [expanded, setExpanded]     = useState(null);
  const [filterTier, setFilterTier] = useState(null);
  const [search, setSearch]         = useState("");
  const [showOrder, setShowOrder]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (next) => {
    setCompleted(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const toggle    = (id) => persist({ ...completed, [id]: !completed[id] });
  const toggleExp = (id) => setExpanded(p => p === id ? null : id);

  const totalQuests = QUESTS.length;
  const totalDone   = Object.values(completed).filter(Boolean).length;
  const pct         = Math.round((totalDone / totalQuests) * 100);

  const filtered = QUESTS.filter(q => {
    if (filterTier && q.tier !== filterTier) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!q.name.toLowerCase().includes(s) && !q.region.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const byTier = TIERS.map(t => ({
    ...t,
    quests: filtered.filter(q => q.tier === t.id),
  })).filter(t => t.quests.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#020617 0%,#0c2a1d 40%,#0e3a28 100%)", fontFamily:"Georgia,serif", color:"#dbeafe", paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:"rgba(2,6,23,0.97)", borderBottom:"1px solid rgba(116,194,168,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(116,194,168,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(125,252,180,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(56,200,148,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#065f46)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(116,194,168,0.5)" }}>🍃</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#e0fff4 0%,#86efac 50%,#10b981 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Mondstadt World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(167,243,208,0.5)", textTransform:"uppercase", marginBottom:24 }}>
          World Quests · Story Quests · Hangouts — primogem-bearing
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(219,254,234,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#065f46,#10b981,#86efac)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(116,194,168,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(116,194,168,0.22)", borderRadius:6, padding:"8px 14px", color:"#dbeafe", fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#86efac" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(134,239,172,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#86efac" : "rgba(219,254,234,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(219,254,234,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(219,254,234,0.4)", fontSize:12, cursor:"pointer" }}>
            📋 Order
          </button>
        </div>
      </div>

      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {ORDER_NOTE.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:"rgba(219,254,234,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(219,254,234,0.3)", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(219,254,234,0.35)", marginLeft:"auto" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, fontWeight:600 }}>
                {tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done
              </div>
            </div>

            {tier.quests.map(quest => {
              const isDone  = !!completed[quest.id];
              const isOpen  = expanded === quest.id;
              const chain   = CHAIN_TAG[quest.chain] || CHAIN_TAG.standalone;

              return (
                <div key={quest.id}
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(8,28,18,0.92),rgba(5,18,12,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(116,194,168,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(219,254,234,0.4)":"#e0fff4", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(134,239,172,0.15)", color:"#86efac", border:"1px solid rgba(134,239,172,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(219,254,234,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>

                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tier.border}` }}>
                      {[
                        ["Region",   `📍 ${quest.region}`],
                        ["Activate", quest.activate],
                        ["Prereqs",  quest.prereqs],
                        ["Tips",     quest.notes],
                        ["Rewards",  quest.rewards],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:"rgba(134,239,172,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(219,254,234,0.55)"
                                 : "rgba(219,254,234,0.75)",
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}

                      {/* Guide links — 4 sites */}
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                        {quest.game8 && (
                          <a href={quest.game8} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                            Game8 ↗
                          </a>
                        )}
                        <a href={quest.fandom} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", color:"#fbbf24", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          Fandom Wiki ↗
                        </a>
                        <a href={quest.gamewith} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(244,114,182,0.06)", border:"1px solid rgba(244,114,182,0.25)", color:"#f9a8d4", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          GameWith ↗
                        </a>
                        <a href={quest.ign} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(132,204,22,0.06)", border:"1px solid rgba(132,204,22,0.25)", color:"#a3e635", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          IGN ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {totalDone === totalQuests && (
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(134,239,172,0.06),rgba(16,185,129,0.02))", border:"1px solid rgba(134,239,172,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🍃✨</div>
            <div style={{ color:"#86efac", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL MONDSTADT QUESTS COMPLETE</div>
            <div style={{ color:"rgba(219,254,234,0.4)", fontSize:12, marginTop:8 }}>The Anemo Archon whistles a tune for you, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
