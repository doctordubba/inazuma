import { useState, useEffect } from "react";

/* ============================================================
   INAZUMA WORLD-QUEST TRACKER
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope. Event-only /
   time-limited quests excluded.
   Sources: Game8, Fandom Wiki, GameWith, IGN (cross-checked).
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"⚡" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"⛩" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🌸" },
];

const CHAIN_TAG = {
  story:      { label:"Story Quest",       color:"#06b6d4" },
  hangout:    { label:"Hangout Event",     color:"#ec4899" },
  sakura:     { label:"Sacred Sakura",     color:"#f472b6" },
  mists:      { label:"Through the Mists", color:"#a78bfa" },
  orobashi:   { label:"Orobashi's Legacy", color:"#10b981" },
  enkanomiya: { label:"Enkanomiya",        color:"#0ea5e9" },
  standalone: { label:"Standalone",        color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  {
    id:1, tier:1, chain:"sakura",
    name:"A Strange Story in Konda",
    time:"10-15 min",
    region:"Narukami Island — Konda Village",
    activate:"Talk to the village chief in Konda Village (south of the Grand Narukami Shrine).",
    prereqs:"AQ Chapter II Act I 'The Immovable God and the Eternal Euthymia' completed",
    notes:"Gate quest into the Sacred Sakura Cleansing Ritual chain. Pure investigation; ends with a small Hydro/Electro puzzle.",
    rewards:"40 Primogems · Adv EXP · Mora · gateway to the Sacred Sakura chain",
    game8:"https://game8.co/games/Genshin-Impact/archives/337735",
  },
  {
    id:2, tier:1, chain:"standalone",
    name:"Saga of Mr. Forgetful",
    time:"10-15 min",
    region:"Inazuma City",
    activate:"Find the forgetful NPC Yota wandering in Inazuma City; he asks for help re-finding what he's lost.",
    prereqs:"Inazuma City accessible",
    notes:"Short, comedic series of quick item retrievals. Multiple sub-quests but each is fast.",
    rewards:"Primogems · Adv EXP · Mora (per sub-quest)",
    fandom:"https://genshin-impact.fandom.com/wiki/Saga_of_Mr._Forgetful",
  },
  {
    id:3, tier:1, chain:"standalone",
    name:"Ritou Escape Plan (World Quest)",
    time:"10-15 min",
    region:"Ritou (entry port to Inazuma)",
    activate:"Auto-triggers after completing the Ritou Escape Plan Archon Quest. Liben (the Liyue merchant) starts the world-quest version.",
    prereqs:"AQ Chapter II Act I 'Ritou Escape Plan' completed",
    notes:"Liben follow-up. He needs odds and ends from around Ritou; quick fetch chain.",
    rewards:"Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/Ritou_Escape_Plan_(Quest_Series)",
  },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:4, tier:2, chain:"standalone",
    name:"Gourmet Supremos, Assemble!",
    time:"15-20 min",
    region:"Inazuma City — Komore Teahouse area",
    activate:"Talk to Xudong (Wanmin Restaurant chef visiting from Liyue).",
    prereqs:"Inazuma City accessible",
    notes:"Xudong needs exotic Inazuma ingredients including a 'zapped' Sakura Bloom. Quick cooking quest with primogems.",
    rewards:"Primogems · Adv EXP · Mora · 'Heart of Liyue, Soul of Inazuma' achievement",
    fandom:"https://genshin-impact.fandom.com/wiki/Gourmet_Supremos,_Assemble!",
  },
  {
    id:5, tier:2, chain:"standalone",
    name:"The Farmer's Treasure",
    time:"15-25 min",
    region:"Narukami Island — Konda Village area",
    activate:"Talk to Sanzou the farmer near Konda Village; he asks help guarding his crops.",
    prereqs:"Narukami Island accessible",
    notes:"Defend the farm, then investigate a 'treasure' on the back hill. Simple combat + puzzle.",
    rewards:"Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/The_Farmer's_Treasure",
  },
  {
    id:6, tier:2, chain:"standalone",
    name:"Cleansing Defilement",
    time:"20-30 min",
    region:"Yashiori Island — Tatarasuna",
    activate:"Approach the Tatarigami contamination zones in Tatarasuna. Each cluster has a Mikoshi to cleanse.",
    prereqs:"Yashiori Island accessible (after AQ Ch II Act II 'Stillness, the Sublimation of Shadow')",
    notes:"Solve four Mikoshi puzzles (purification mechanic). Reduces ambient Electro corrosion in the area afterwards.",
    rewards:"Primogems · Adv EXP · Mora · removes Electro corrosion damage in cleansed zones",
    fandom:"https://genshin-impact.fandom.com/wiki/Cleansing_Defilement",
  },
  {
    id:7, tier:2, chain:"orobashi",
    name:"Orobashi's Legacy: Prologue",
    time:"20-30 min",
    region:"Yashiori Island — Fort Fujitou",
    activate:"Talk to Kaji at Fort Fujitou on Yashiori Island.",
    prereqs:"AQ Chapter II Act I 'Ritou Escape Plan' completed",
    notes:"Opens the Orobashi's Legacy chain (Prologue → Part I → II → III → Epilogue). Pull the broken arrow free with a Cryo character. Each subsequent part gives more primogems.",
    rewards:"20 Primogems (Prologue) · 10,000 Mora · unlocks Part I (40 primo · 30,000 Mora · 4 Hero's Wit)",
    game8:"https://game8.co/games/Genshin-Impact/archives/338688",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:8, tier:3, chain:"sakura",
    name:"Sacred Sakura Cleansing Ritual",
    time:"45-60 min (full chain across multiple sittings)",
    region:"Narukami Island — Grand Narukami Shrine",
    activate:"Talk to Inagi Hotomi at the Grand Narukami Shrine after A Strange Story in Konda is done.",
    prereqs:"A Strange Story in Konda completed · AQ Ch II Act I",
    notes:"Cleanse all the Electro corruption nodes scattered across Narukami Island by placing Electrograna at the Sakura's roots. Multi-step chain (Cleansing the Defilement, Word on the Wisps, etc.). The total primogem haul across the chain is huge.",
    rewards:"~180 Primogems total · 160,000 Mora · 14 Mystic Enhancement Ore · 16 Hero's Wit · 1 Mask of Memories · 1 Memento Lens",
    fandom:"https://genshin-impact.fandom.com/wiki/Sacred_Sakura_Cleansing_Ritual",
  },
  {
    id:9, tier:3, chain:"standalone",
    name:"The Moon-Bathed Deep",
    time:"45-60 min",
    region:"Watatsumi Island — Bourou Village + Suigetsu Pool",
    activate:"Talk to Hyouta at Suigetsu Pool on Watatsumi Island. He needs help retrieving items from the pool's depths.",
    prereqs:"Watatsumi Island accessible (after AQ Ch II Act II)",
    notes:"Underwater (well, pool-bottom) exploration chain. Sets up the Watatsumi-side Orobashi lore. Multi-act with a few combat encounters.",
    rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore",
    fandom:"https://genshin-impact.fandom.com/wiki/The_Moon-Bathed_Deep",
  },
  {
    id:10, tier:3, chain:"story",
    name:"Kazuha — A Strange and Friendless Road",
    time:"45-60 min",
    region:"Inazuma City → Yashiori Island",
    activate:"Story Quest menu. Spend 1 Story Key. Find Kazuha at the harbor.",
    prereqs:"AR 40 + AQ Ch II Act III 'Omnipresence Over Mortals' + Raiden's Story Act I (Reflections of Mortality) + 1 Story Key",
    notes:"Acer Palmatum Chapter — Act I. Kazuha returns to settle business with his former master. Heavily story-driven, with one significant combat sequence.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Kazuha ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/332836",
  },
  {
    id:11, tier:3, chain:"story",
    name:"Yoimiya — Star-Pickers' Passage",
    time:"45-60 min",
    region:"Inazuma City — Hanamizaka",
    activate:"Story Quest menu. Spend 1 Story Key. Find Yoimiya at Naganohara Fireworks (Hanamizaka).",
    prereqs:"AR 40 + AQ Ch II Act I + 1 Story Key",
    notes:"Carassius Auratus Chapter — Act I. Help Yoimiya make a child's wish come true. The combat is light; the writing is unusually tender for a 5★ Story Quest.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Yoimiya ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Carassius_Auratus_Chapter",
  },
  {
    id:12, tier:3, chain:"story",
    name:"Ayato — The Firmiana Leaf Falls",
    time:"45-60 min",
    region:"Inazuma City — Kamisato Estate",
    activate:"Story Quest menu. Spend 1 Story Key. Find Thoma at Kamisato Estate; he forwards you to Ayato.",
    prereqs:"AR 40 + AQ Ch II Act III + 1 Story Key",
    notes:"Cypressus Custos Chapter — Act I. Ayato pulls you into a domestic-politics maneuver involving the Yashiro Commission. Mostly dialogue + one significant set-piece fight.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ayato ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Cypressus_Custos_Chapter",
  },
  {
    id:13, tier:3, chain:"story",
    name:"Kokomi — Warriors' Dreams Like Spring Grass Renewing",
    time:"45-60 min",
    region:"Watatsumi Island — Sangonomiya Shrine",
    activate:"Story Quest menu. Spend 1 Story Key. Find Kokomi at Sangonomiya Shrine.",
    prereqs:"AR 40 + AQ Ch II Act II (Stillness, the Sublimation of Shadow) + 1 Story Key",
    notes:"Dracaena Somnolenta Chapter — Act I. Kokomi takes you on a tour of Watatsumi (Watatsumi Sightseeing → Her Secret → New Beginning). Reveals a lot of Watatsumi's post-war state.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Kokomi ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/340683",
  },
  {
    id:14, tier:3, chain:"story",
    name:"Itto — Rise Up, Golden Soul",
    time:"45-60 min",
    region:"Inazuma City → Konda Village",
    activate:"Story Quest menu. Spend 1 Story Key. Find Itto at the Hanamizaka entrance.",
    prereqs:"AR 40 + Kokomi's Story Quest (Warriors' Dreams Like Spring Grass Renewing) + 1 Story Key",
    notes:"Taurus Iracundus Chapter — Act I. Itto's signature beetle tournament; loud, funny, and surprisingly heartfelt under the chaos.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Itto ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/349460",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:15, tier:4, chain:"mists",
    name:"Through the Mists",
    time:"2-3 hours (full chain, Tsurumi Island)",
    region:"Tsurumi Island (perpetually fogged)",
    activate:"Talk to Katheryne in Inazuma City for the 'A Particularly Particular Author' commission; that leads onto Tsurumi.",
    prereqs:"AR 30 + AQ Ch II Act III 'Omnipresence Over Mortals' + 'A Particularly Particular Author' world quest accepted",
    notes:"The Tsurumi Island opening chain. Includes Octave of the Maushiro (where you receive the Peculiar Pinion gadget that unlocks treasure cages across the island). Fog only lifts as quest steps progress — don't try Tsurumi exploration without starting this.",
    rewards:"~180 Primogems total · 160,000 Mora · 16 Mystic Enhancement Ore · 20 Hero's Wit · Peculiar Pinion gadget · Maushiro gadget",
    fandom:"https://genshin-impact.fandom.com/wiki/Through_the_Mists",
  },
  {
    id:16, tier:4, chain:"enkanomiya",
    name:"Three Realms Gateway Offering: Aftermath",
    time:"60-90 min (full chain after event integration)",
    region:"Enkanomiya — across all districts",
    activate:"Talk to Aru / Tsuyuko at the Enkanomiya entrance after the event's permanent integration in v2.5+.",
    prereqs:"AR 30 + AQ Ch II Act II + 'Erebos' Secret' world quest (Enkanomiya gate) completed",
    notes:"Originally a 2.5 Flagship Event, now a permanent Enkanomiya world quest chain. Multi-part: Three Realms Gateway Offering: Part 1 / 2 / 3 / Aftermath. The achievement quest 'Erebos' Secret' is the unlock prerequisite.",
    rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/360609",
  },
  {
    id:17, tier:4, chain:"story",
    name:"Raiden I — Reflections of Mortality",
    time:"60-90 min",
    region:"Inazuma City → Tenshukaku",
    activate:"Story Quest menu. Spend 1 Story Key. Talk to Kujou Sara at the Tenshukaku entrance.",
    prereqs:"AR 40 + AQ Ch II Act III 'Omnipresence Over Mortals' + 1 Story Key",
    notes:"Imperatrix Umbrosa Chapter — Act I. The Shogun returns to the dueling ground. Long Story Quest with major lore reveals about Ei and the Plane of Euthymia.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Raiden Shogun ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/340682",
  },
  {
    id:18, tier:4, chain:"story",
    name:"Raiden II — Transient Dreams",
    time:"60-90 min",
    region:"Inazuma City → Plane of Euthymia",
    activate:"Story Quest menu. Spend 1 Story Key. Pick up from the Tenshukaku after the v2.5 unlock.",
    prereqs:"AR 40 + Reflections of Mortality (Act I) + AQ Ch II Act III + 1 Story Key (released v2.5)",
    notes:"Imperatrix Umbrosa Chapter — Act II. Ei wrestles with Makoto's shadow and her sense of duty. Long, almost entirely cutscene.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    game8:"https://game8.co/games/Genshin-Impact/archives/356368",
  },
  {
    id:19, tier:4, chain:"story",
    name:"Ayaka — The Whispers of the Crane and the White Rabbit",
    time:"60-90 min",
    region:"Inazuma City — Kamisato Estate",
    activate:"Story Quest menu. Spend 1 Story Key. Find Thoma at Kamisato Estate to be forwarded to Ayaka.",
    prereqs:"AR 40 + AQ Ch II Act III + 1 Story Key",
    notes:"Grus Nivis Chapter — Act I. A multi-quest arc (The Whispers of the Crane and the White Rabbit → A Private Commission → Woven Wishes → Food From Afar → Lasting Promise → With You). Slow, intimate, lots of dialogue.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ayaka ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Grus_Nivis_Chapter",
  },
  {
    id:20, tier:4, chain:"story",
    name:"Yae Miko — Tales of Two Foxes",
    time:"60-90 min",
    region:"Narukami Island — Grand Narukami Shrine",
    activate:"Story Quest menu. Spend 1 Story Key. Yae Miko summons you to the Shrine.",
    prereqs:"AR 40 + Reflections of Mortality + Acer Palmatum Act I (Kazuha) + Transient Dreams + 1 Story Key (heavily gated)",
    notes:"Divina Vulpes Chapter — Act I. Yae Miko sets you to tracking down some half-truths in Inazuma. Heavily story-driven, often considered one of the best-written 5★ Story Quests in the game.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Yae Miko ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Divina_Vulpes_Chapter",
  },
  {
    id:21, tier:4, chain:"hangout",
    name:"Sayu — Yoohoo Art: Seichou no Jutsu",
    time:"60-90 min (all endings)",
    region:"Inazuma City — Shiyuumatsu-Ban roof",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Sayu on the Shiyuumatsu-Ban rooftop in Inazuma City.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys",
    notes:"Released v2.2 (first Inazuma Hangout). Five endings; multiple playthroughs needed for full primogem haul.",
    rewards:"~90 Primogems total (60 endings + 30 achievements) · Special Dish · Adv EXP · Hero's Wit · Sayu ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Sayu",
  },
  {
    id:22, tier:4, chain:"hangout",
    name:"Thoma — A Housekeeper's Daily Chores",
    time:"60-90 min (all endings)",
    region:"Inazuma City — Kamisato Estate",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Thoma at Kamisato Estate.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys",
    notes:"Released v2.2 alongside Sayu. Multi-ending; comedy + slice-of-life Kamisato Estate vignettes.",
    rewards:"~90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Thoma ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Thoma",
  },
  {
    id:23, tier:4, chain:"hangout",
    name:"Gorou — The Canine General's Special Operations",
    time:"60-90 min (all endings)",
    region:"Watatsumi Island — Sangonomiya Shrine area",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Gorou near Sangonomiya Shrine.",
    prereqs:"AR 26 + Prologue Ch III + AQ Ch II Act II (Stillness, the Sublimation of Shadow) + Story Keys",
    notes:"Released v2.3. Multi-ending; Watatsumi reconstruction logistics framed as a Gorou sortie.",
    rewards:"~90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Gorou ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Gorou",
  },
  {
    id:24, tier:4, chain:"hangout",
    name:"Shikanoin Heizou — Trap 'Em by Storm",
    time:"60-90 min (all endings)",
    region:"Inazuma City — Tenryou Commission HQ",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Heizou near the Tenryou Commission building.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys (Heizou released v2.8)",
    notes:"Released v2.8. Six endings; detective mystery framing — Heizou investigates a string of petty crimes that turn out connected.",
    rewards:"~90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Heizou ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/381345",
  },
];

// Fill in fallback link generators for each quest
QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Quick wins first: A Strange Story in Konda (gates Sacred Sakura, 10 min), Saga of Mr. Forgetful, Gourmet Supremos. All under 15 min each." },
  { step:2, text:"Sacred Sakura Cleansing Ritual is one of the biggest single primogem hauls in the game (~180). Bundle it with the rest of Narukami Island exploration." },
  { step:3, text:"Yashiori Island block: do Cleansing Defilement first (it makes the island safer to walk), then start Orobashi's Legacy: Prologue and chain through its Parts." },
  { step:4, text:"Through the Mists (Tsurumi Island) is gated by 'A Particularly Particular Author'. Don't go to Tsurumi for exploration without starting this chain — the fog is unsolvable otherwise." },
  { step:5, text:"Story Quest order is heavily gated: Raiden I → Kazuha (needs Raiden I + AQ Ch II Act III) → Raiden II → Yae Miko (needs Raiden II + Kazuha). Itto needs Kokomi's Story Quest done first." },
  { step:6, text:"Enkanomiya's 'Erebos' Secret' is the entry world quest; finish it to unlock the Three Realms Gateway Offering chain (originally a 2.5 event, now permanent)." },
  { step:7, text:"Hangouts cost 2 Story Keys per playthrough × multiple endings each. Save them for after the Story Quests — each Story Quest is a one-shot 60-primo unlock." },
];

const STORAGE_KEY = "inazuma-quest-tracker-v1";

export default function InazumaQuests() {
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0418 0%,#1c0d3a 40%,#2a155a 100%)", fontFamily:"Georgia,serif", color:"#ede9fe", paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:"rgba(5,2,15,0.97)", borderBottom:"1px solid rgba(176,127,209,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(176,127,209,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(196,181,253,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#8b5cf6,#3b0764)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(176,127,209,0.5)" }}>⛩</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#f5f3ff 0%,#c4b5fd 50%,#7c3aed 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Inazuma World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(196,181,253,0.55)", textTransform:"uppercase", marginBottom:24 }}>
          World Quests · Story Quests · Hangouts — primogem-bearing
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(237,233,254,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#5b21b6,#8b5cf6,#c4b5fd)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(176,127,209,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(176,127,209,0.22)", borderRadius:6, padding:"8px 14px", color:"#ede9fe", fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#c4b5fd" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(196,181,253,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#c4b5fd" : "rgba(237,233,254,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(237,233,254,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(237,233,254,0.4)", fontSize:12, cursor:"pointer" }}>
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
                <span style={{ fontSize:12, color:"rgba(237,233,254,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(237,233,254,0.3)", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(237,233,254,0.35)", marginLeft:"auto" }}>{tier.time}</span>
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
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(20,10,40,0.92),rgba(14,6,28,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(176,127,209,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(237,233,254,0.4)":"#f5f3ff", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(196,181,253,0.15)", color:"#c4b5fd", border:"1px solid rgba(196,181,253,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(237,233,254,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
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
                          <span style={{ fontSize:10, color:"rgba(196,181,253,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(237,233,254,0.55)"
                                 : "rgba(237,233,254,0.75)",
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
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(196,181,253,0.06),rgba(124,58,237,0.02))", border:"1px solid rgba(196,181,253,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>⛩✨</div>
            <div style={{ color:"#c4b5fd", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL INAZUMA QUESTS COMPLETE</div>
            <div style={{ color:"rgba(237,233,254,0.4)", fontSize:12, marginTop:8 }}>Eternity sees you, Traveler. The Shogun acknowledges your devotion.</div>
          </div>
        )}
      </div>
    </div>
  );
}
