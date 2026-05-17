import { useState, useEffect } from "react";

/* ============================================================
   LIYUE WORLD-QUEST TRACKER
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope. Time-limited
   event quests excluded (not currently re-runnable).
   Sources: Game8, Fandom Wiki, GameWith, IGN (cross-checked).
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🏮" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"⛩" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🐉" },
];

const CHAIN_TAG = {
  story:       { label:"Story Quest",       color:"#06b6d4" },
  hangout:     { label:"Hangout Event",     color:"#ec4899" },
  chasm:       { label:"The Chasm",         color:"#a78bfa" },
  chenyu:      { label:"Chenyu Vale",       color:"#10b981" },
  standalone:  { label:"Standalone",        color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  {
    id:1, tier:1, chain:"standalone",
    name:"A Little Game",
    time:"5-10 min",
    region:"Liyue Harbor — Wanmin Restaurant area",
    activate:"Talk to the child NPC near Wanmin Restaurant in Liyue Harbor.",
    prereqs:"Liyue Harbor accessible",
    notes:"Pure dialogue / hide-and-seek mini-quest with a child NPC in the harbor. Fastest Liyue primogem quest on the list.",
    rewards:"30 Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/A_Little_Game",
  },
  {
    id:2, tier:1, chain:"standalone",
    name:"And This Treasure Goes To...",
    time:"10-15 min",
    region:"Lingju Pass (north of Liyue Harbor)",
    activate:"Approach an empty Treasure Hoarder camp at Lingju Pass — quest auto-starts.",
    prereqs:"Lingju Pass accessible",
    notes:"Decide which of two squabbling Treasure Hoarders deserves the treasure. Light combat then a quick dialogue choice.",
    rewards:"40 Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/And_This_Treasure_Goes_To...",
  },
  {
    id:3, tier:1, chain:"standalone",
    name:"Luhua Landscape",
    time:"10-15 min",
    region:"Luhua Pool",
    activate:"Speak with the painter Vermeer at Luhua Pool.",
    prereqs:"Luhua Pool accessible",
    notes:"Vermeer gives you two paintings — retrieve his tools from the scene depicted in each painting. Light puzzle / fetch quest.",
    rewards:"50 Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/Luhua_Landscape",
  },
  {
    id:4, tier:1, chain:"chenyu",
    name:"Our Chenyu Vale Trek",
    time:"10-15 min",
    region:"Chenyu Vale (multiple sites)",
    activate:"Triggers progressively as you visit landmarks around Chenyu Vale (Lower + Upper).",
    prereqs:"Chenyu Vale region unlocked (4.4+)",
    notes:"Exploration check-list framed as a trek. Stops by all the marquee Chenyu vistas; finishes the 'Chenyu Vale Sights' achievement.",
    rewards:"30 Primogems · Adv EXP · Mora · Chenyu Vale Sights achievement",
    game8:"https://game8.co/games/Genshin-Impact/archives/407274",
  },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:5, tier:2, chain:"standalone",
    name:"Primo Geovishap",
    time:"15-25 min",
    region:"Tianqiu Valley (mountain ridge between Stone Forest and Wuwang Hill)",
    activate:"Reach the Primo Geovishap arena on Tianqiu Valley's ridge. Engage the boss to trigger the world-quest registration.",
    prereqs:"Liyue accessible · party ready for a boss fight (AR ≥ 35 recommended)",
    notes:"World-Boss-style arena that also counts as a world quest first time. Drops Juvenile Jade (Xiao / Yelan ascension material) on every clear; the world-quest primogems only land the first time.",
    rewards:"30 Primogems (first clear) · Adv EXP · Mora · Juvenile Jade · weapon/character ascension drops",
    fandom:"https://genshin-impact.fandom.com/wiki/Primo_Geovishap",
  },
  {
    id:6, tier:2, chain:"standalone",
    name:"The Tree Who Stands Alone",
    time:"15-25 min",
    region:"Qingce Village (northern Liyue)",
    activate:"Talk to Granny Ruoxin near the lone tree on the hill above Qingce Village.",
    prereqs:"Qingce Village accessible",
    notes:"Help an elderly villager recover memories tied to an old tree. Light combat + dialogue.",
    rewards:"50 Primogems · Adv EXP · Mora",
    fandom:"https://genshin-impact.fandom.com/wiki/The_Tree_Who_Stands_Alone",
  },
  {
    id:7, tier:2, chain:"standalone",
    name:"Nine Pillars of Peace",
    time:"20-30 min",
    region:"Cuijue Slope (south of Liyue Harbor)",
    activate:"Visit Cuijue Slope after fully leveling up the Liyue Statue of the Seven (the statue gates the pillars puzzle).",
    prereqs:"Liyue Statue of the Seven fully leveled · party ready for a 3-stage domain",
    notes:"Place geocullus stones in the nine pillars to open the sealed domain. Boss layout: 1× Ruin Guard, several Geovishap Hatchlings, finishing with a Ruin Hunter.",
    rewards:"50 Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/305610",
  },
  {
    id:8, tier:2, chain:"chasm",
    name:"Chasm Spelunkers",
    time:"20-30 min",
    region:"The Chasm — surface camp + mines entrance",
    activate:"Talk to Muning at the Chasm Surface Adventurer Camp. Part of The Chasm Delvers series.",
    prereqs:"The Chasm region accessible · The Chasm Charters started",
    notes:"Help the Chasm survey team start mapping the underground. Required gate quest into the Chasm Delvers chain (which then unlocks Surreptitious Seven-Star Seal Sundering, First Miasmic Contact, and the rest).",
    rewards:"30 Primogems · 200 AR EXP · 20,000 Mora · 2 Hero's Wit · 1 Lumenstone Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/372643",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:9, tier:3, chain:"standalone",
    name:"The Chi of Guyun",
    time:"30-45 min",
    region:"Guyun Stone Forest (south Liyue coast)",
    activate:"Reach Guyun Stone Forest. Investigate the four scattered stone tablets.",
    prereqs:"Guyun Stone Forest accessible",
    notes:"Multi-stop puzzle reading four scattered stelae, each guarded. The final stop spawns a small set of waves. Decent payoff for the time.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/The_Chi_of_Guyun",
  },
  {
    id:10, tier:3, chain:"standalone",
    name:"Treasure Lost, Treasure Found",
    time:"30-45 min",
    region:"Lingju Pass / Dunyu Ruins",
    activate:"Talk to the Treasure Hoarder Soraya at Lingju Pass after Mondstadt Chapter completion.",
    prereqs:"Prologue Chapter completed · Lingju Pass accessible",
    notes:"Early Liyue intro quest. Three-act mini-chain: investigate Hoarder ledgers, fetch artefacts across the area, then a brief showdown.",
    rewards:"80 Primogems (highest single Liyue world-quest payout) · Adv EXP · Mora · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Treasure_Lost,_Treasure_Found",
  },
  {
    id:11, tier:3, chain:"story",
    name:"Zhongli I — Sal Flore",
    time:"40-50 min",
    region:"Liyue Harbor → Mt. Tianheng",
    activate:"Story Quest menu. Spend 1 Story Key. Take Katheryne's Adventurers' Guild commission.",
    prereqs:"AR 32 + Liyue Archon Quest Act III completed + 1 Story Key",
    notes:"Historia Antiqua Chapter — Act I. Walk Liyue's funerary customs with Zhongli; mostly dialogue with a few light combat beats.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Zhongli ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/311299",
  },
  {
    id:12, tier:3, chain:"story",
    name:"Zhongli II — No Mere Stone",
    time:"45-60 min",
    region:"Liyue Harbor → Jueyun Karst → Dunyu Ruins",
    activate:"Story Quest menu. Spend 1 Story Key. Take the new Katheryne commission after Act I.",
    prereqs:"AR 40 + Historia Antiqua Act I (Sal Flore) + AQ Ch I Act IV 'We Will Be Reunited' + 1 Story Key",
    notes:"Historia Antiqua Chapter — Act II. Investigate missing miners; the trail leads to one of Zhongli's old contracts. Released in 1.5.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    game8:"https://game8.co/games/Genshin-Impact/archives/328779",
  },
  {
    id:13, tier:3, chain:"story",
    name:"Hu Tao — Yet the Butterfly Flutters Away",
    time:"45-60 min",
    region:"Liyue Harbor — Wangsheng Funeral Parlor → Wuwang Hill",
    activate:"Story Quest menu. Spend 1 Story Key. Hu Tao is waiting near Wangsheng Funeral Parlor.",
    prereqs:"AR 40 + 'Yakshas: The Guardian Adepti' (Xiao Story Quest Act I) + 1 Story Key",
    notes:"Papilio Charontis Chapter — Act I. The Wangsheng Funeral Parlor on a working day. Quiet horror tones, escort through Wuwang Hill, lots of memorable dialogue.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Hu Tao ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/321338",
  },
  {
    id:14, tier:3, chain:"story",
    name:"Xiao — Butterfly's Dream",
    time:"45-60 min",
    region:"Wangshu Inn → Dihua Marsh",
    activate:"Story Quest menu. Spend 1 Story Key. Find Xiao at Wangshu Inn's top floor.",
    prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key",
    notes:"Alatus Chapter — Act I. Yaksha lore, Xiao's old battles, and the Karma that follows him. Heavier combat than most Story Quests.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Xiao ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Alatus_Chapter",
  },
  {
    id:15, tier:3, chain:"story",
    name:"Childe — Father and Son",
    time:"45-60 min",
    region:"Liyue Harbor → Mt. Aozang",
    activate:"Story Quest menu. Spend 1 Story Key. Childe is waiting near Northland Bank in Liyue Harbor.",
    prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key",
    notes:"Monoceros Caeli Chapter — Act I. Childe's little brother Teucer visits Liyue. Comedic on the surface, with the inevitable Fatui edge underneath.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Monoceros_Caeli_Chapter",
  },
  {
    id:16, tier:3, chain:"story",
    name:"Ningguang — Sal Terrae",
    time:"45-60 min",
    region:"Liyue Harbor — Jade Chamber",
    activate:"Story Quest menu. Spend 1 Story Key. Pick up the quest at Northland Bank.",
    prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key",
    notes:"Lapis Dei Chapter — Act I. Politics, gossip, and a quiet display of why Ningguang runs Liyue's commerce. Mostly investigation + dialogue.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ningguang ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Lapis_Dei_Chapter",
  },
  {
    id:17, tier:3, chain:"story",
    name:"Keqing — Driving Thunder",
    time:"45-60 min",
    region:"Liyue Harbor → Yujing Terrace",
    activate:"Story Quest menu. Spend 1 Story Key. Keqing summons you to Yujing Terrace.",
    prereqs:"AR 40 + AQ Ch I Act III + 1 Story Key",
    notes:"Trail of Drake and Serpent — Act I. Keqing investigates a smuggling case; her Mondstadt-meets-Liyue worldview gets the spotlight. Reward 4★, but the writing is top-shelf.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Keqing ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Trail_of_Drake_and_Serpent",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:18, tier:4, chain:"story",
    name:"Ganyu — Sea of Clouds, Sea of People",
    time:"60-90 min",
    region:"Liyue Harbor → Jueyun Karst",
    activate:"Story Quest menu. Spend 1 Story Key. Ganyu is at Yujing Terrace.",
    prereqs:"AR 40 + AQ Ch I Act III + 1 Story Key",
    notes:"Sinae Unicornis Chapter — Act I. Ganyu introduces you to the older adepti of Jueyun Karst. Long, dialogue-heavy, sets up most of the Adepti lore that pays off in Xianyun's release.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ganyu ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Sinae_Unicornis_Chapter",
  },
  {
    id:19, tier:4, chain:"story",
    name:"Yelan — Calculated Gambit",
    time:"60-90 min",
    region:"Liyue Harbor → Yilong Wharf → Chasm surface",
    activate:"Story Quest menu. Spend 1 Story Key. Yelan finds you at Yilong Wharf.",
    prereqs:"AR 40 + Ganyu's 'Sea of Clouds, Sea of People' + AQ Interlude 'Perilous Trail' (2.7) + 1 Story Key",
    notes:"Umbrabilis Orchis Chapter — Act I. A heist with the Ministry of Civil Affairs' best ghost. Heavily gated by other content — clear the prereq chain first.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Yelan ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/377476",
  },
  {
    id:20, tier:4, chain:"hangout",
    name:"Chongyun — Signs of Evil (Act I)",
    time:"60-90 min (all 6 endings)",
    region:"Liyue Harbor — Wangsheng / Bubu Pharmacy area",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Chongyun near Bubu Pharmacy.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys",
    notes:"First Liyue Hangout released (v1.4). Six endings; multiple playthroughs needed for full primogem haul. Yin/yang gimmick runs through every branch.",
    rewards:"~90 Primogems total (60 from endings + 30 from achievements) · Special Dish · Adv EXP · Hero's Wit · Chongyun ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/323219",
  },
  {
    id:21, tier:4, chain:"hangout",
    name:"Yun Jin — A Song That Knows Grace (Act I)",
    time:"60-90 min (all endings)",
    region:"Liyue Harbor — Heyu Tea House",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Yun Jin at Heyu Tea House.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys",
    notes:"Added in v2.3. Liyue opera framing; you help Yun Jin work on the next show. Multiple endings, replays via the menu.",
    rewards:"~90 Primogems total (endings + achievements) · Special Dish · Adv EXP · Hero's Wit",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Yun_Jin",
  },
];

// Fill in fallback link generators for each quest
QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Quick wins: A Little Game (5 min, 30 primo) and And This Treasure Goes To... (10 min, 40 primo) are the best primogem-per-minute opens." },
  { step:2, text:"Treasure Lost, Treasure Found is the standout solo world quest — 80 primogems, the largest single-quest payout in Liyue." },
  { step:3, text:"Cuijue Slope side quest stack: do The Tree Who Stands Alone + Nine Pillars of Peace in one Qingce/Cuijue trip." },
  { step:4, text:"Story Quest order (gated): Xiao first → Hu Tao (needs Xiao) → Zhongli I → Zhongli II (needs Zhongli I + AQ Ch I Act IV). Ganyu → Yelan (Yelan needs Ganyu + the 2.7 Interlude AQ 'Perilous Trail')." },
  { step:5, text:"The Chasm chain starts with Chasm Charters → Chasm Spelunkers. Surreptitious Seven-Star Seal Sundering, First Miasmic Contact, and the rest unlock from there — set aside an evening for the full underground delve." },
  { step:6, text:"Hangouts cost 2 Story Keys per playthrough; save them for after the Story Quests so you only spend keys on permanent unlocks first." },
  { step:7, text:"Primo Geovishap counts as a world quest the first time you defeat it — the primogems only land on first clear, after that it's a normal world boss." },
];

const STORAGE_KEY = "liyue-quest-tracker-v1";

export default function LiyueQuests() {
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a0a02 0%,#2d1a06 40%,#3d2410 100%)", fontFamily:"Georgia,serif", color:"#fff4d6", paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:"rgba(15,8,2,0.97)", borderBottom:"1px solid rgba(212,168,87,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(212,168,87,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(253,224,71,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(217,119,6,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#d97706,#7c2d12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(212,168,87,0.5)" }}>🏮</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#fff4d6 0%,#fbbf24 50%,#b45309 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Liyue World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(251,191,36,0.55)", textTransform:"uppercase", marginBottom:24 }}>
          World Quests · Story Quests · Hangouts — primogem-bearing
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,244,214,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#7c2d12,#d97706,#fbbf24)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(212,168,87,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(212,168,87,0.22)", borderRadius:6, padding:"8px 14px", color:"#fff4d6", fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#fbbf24" : "rgba(255,244,214,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(255,244,214,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(255,244,214,0.4)", fontSize:12, cursor:"pointer" }}>
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
                <span style={{ fontSize:12, color:"rgba(255,244,214,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,244,214,0.3)", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(255,244,214,0.35)", marginLeft:"auto" }}>{tier.time}</span>
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
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(40,22,8,0.92),rgba(28,16,6,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(212,168,87,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(255,244,214,0.4)":"#fff4d6", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(251,191,36,0.15)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(255,244,214,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
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
                          <span style={{ fontSize:10, color:"rgba(251,191,36,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(255,244,214,0.55)"
                                 : "rgba(255,244,214,0.75)",
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
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(251,191,36,0.06),rgba(180,83,9,0.02))", border:"1px solid rgba(251,191,36,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🏮✨</div>
            <div style={{ color:"#fbbf24", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL LIYUE QUESTS COMPLETE</div>
            <div style={{ color:"rgba(255,244,214,0.4)", fontSize:12, marginTop:8 }}>Rex Lapis carves your contract in stone, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
