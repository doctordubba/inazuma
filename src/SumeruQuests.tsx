import { useState, useEffect } from "react";

/* ============================================================
   SUMERU WORLD-QUEST TRACKER
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope. Sumeru has 100+
   world quests in total per BitTopup — only well-verified chains
   are listed here. Sources: Game8, Fandom Wiki, GameWith.
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🌿" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"📜" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🌳" },
];

const CHAIN_TAG = {
  story:      { label:"Story Quest",         color:"#06b6d4" },
  hangout:    { label:"Hangout Event",       color:"#ec4899" },
  aranyaka:   { label:"Aranyaka",            color:"#84cc16" },
  golden:     { label:"Golden Slumber line", color:"#fbbf24" },
  desert:     { label:"Desert (Bilqis)",     color:"#f59e0b" },
  khvarena:   { label:"Khvarena",            color:"#a78bfa" },
  standalone: { label:"Standalone",          color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  {
    id:1, tier:1, chain:"standalone",
    name:"The Coming of the Sabzeruz Festival",
    time:"10-15 min",
    region:"Sumeru City — main square",
    activate:"Auto-triggers shortly after arriving in Sumeru City for the first time. Talk to Nahida-related NPCs in the square.",
    prereqs:"AQ Chapter III Act I 'Through Mists of Smoke and Forests Dark' accepted",
    notes:"Short intro chain into Sumeru's first major puzzle: the time-looped festival. Mostly dialogue and a brief Akasha terminal interaction. Gateway to several deeper Sumeru quests.",
    rewards:"Primogems · Adv EXP · Mora · Akasha Terminal introduction",
    fandom:"https://genshin-impact.fandom.com/wiki/The_Coming_of_the_Sabzeruz_Festival",
  },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:2, tier:2, chain:"aranyaka",
    name:"Aranyaka I — Woodland Encounter",
    time:"20-30 min",
    region:"Avidya Forest — Gandharva Ville",
    activate:"Talk to Rana near Gandharva Ville. She'll lead you to meet an Aranara.",
    prereqs:"AQ Chapter III Act II accessible · Gandharva Ville unlocked",
    notes:"Opening chapter of the Aranyaka super-chain. Rhythm puzzle introduction, meets Arama, and unlocks the rest of Vanarana. The whole Aranyaka mega-chain totals ~640 primogems across four parts — start here.",
    rewards:"Primogems (~150 for Part I alone) · Adv EXP · Mora · Hero's Wit · Garland accessory · gateway to Parts II / III / IV",
    game8:"https://game8.co/games/Genshin-Impact/archives/386471",
  },
  {
    id:3, tier:2, chain:"khvarena",
    name:"Khvarena of Good and Evil — entry chain",
    time:"20-30 min",
    region:"Sumeru Desert — Tunigi Hollow",
    activate:"Investigate the Tunigi Hollow area after Sumeru's 3.6 patch desert expansion is unlocked.",
    prereqs:"Sumeru Desert expansion (3.6+) accessible",
    notes:"Opens the Khvarena chain (Light Realm Pilgrimage → Asipattravana Bisects the Plain → A Forerunner Sent from Light). Multi-part chain; this entry is the short hook before things get long.",
    rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Sorush companion gadget (chain reward)",
    fandom:"https://genshin-impact.fandom.com/wiki/Khvarena_of_Good_and_Evil",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:4, tier:3, chain:"story",
    name:"Tighnari — Through the Mists of Smoke and Forests",
    time:"30-45 min",
    region:"Avidya Forest — near Pardis Dhyai",
    activate:"Story Quest menu. Spend 1 Story Key. Find Tighnari at Pardis Dhyai.",
    prereqs:"AR 32 + AQ Ch III Act II 'The Morn a Thousand Roses Brings' + 1 Story Key",
    notes:"Vultur Volans Chapter — Act I. Tighnari investigates a withering tree. Light combat, lots of forest navigation. Released in 3.0.",
    rewards:"60 Primogems · ~2,025 Adv EXP · ~128,225 Mora · 5 Guide to Admonition · 27 Mystic Enhancement Ore · 12 Hero's Wit · Tighnari ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Vultur_Volans_Chapter",
  },
  {
    id:5, tier:3, chain:"story",
    name:"Nilou — To the Wise",
    time:"45-60 min",
    region:"Sumeru City — Grand Bazaar",
    activate:"Story Quest menu. Spend 1 Story Key. Find Nilou at Zubayr Theater (Grand Bazaar).",
    prereqs:"AR 40 + AQ Ch III Act IV + 1 Story Key",
    notes:"Lotos Somno Chapter — Act I. Help Nilou debate the Akademiya scholars over the cultural value of dance. Heavy on choice-based dialogue (debate answers matter). Released in 3.1.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Nilou ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/390093",
  },
  {
    id:6, tier:3, chain:"story",
    name:"Nahida — Lingering Warmth",
    time:"45-60 min",
    region:"Sumeru City → Sumeru Akademiya → Devantaka Mountain",
    activate:"Story Quest menu. Spend 1 Story Key. Nahida finds you at Sumeru City.",
    prereqs:"AR 40 + AQ Ch III Act V 'Akasha Pulses, the Kalpa Flame Rises' + 1 Story Key",
    notes:"Sapientia Oromasdis Chapter — Act I. Nahida pulls you through dreams of Sumeru's late Sage. Heavy lore, several dream-segment puzzles. Released in 3.2.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Nahida ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/394341",
  },
  {
    id:7, tier:3, chain:"story",
    name:"Alhaitham — Illusions of the Mob",
    time:"45-60 min",
    region:"Sumeru City — Akademiya",
    activate:"Story Quest menu. Spend 1 Story Key. Find Alhaitham in the Akademiya plaza.",
    prereqs:"AR 40 + AQ Ch III Act V + 1 Story Key",
    notes:"Vultur Volans Chapter — Act II (Alhaitham's standalone Act under the shared chapter banner). Released in 3.4. Investigation + a few combat encounters; trademark Alhaitham deadpan throughout.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Alhaitham ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/401826",
  },
  {
    id:8, tier:3, chain:"story",
    name:"Cyno — Lupus Aureus Chapter Act I",
    time:"45-60 min",
    region:"Sumeru City → Aaru Village",
    activate:"Story Quest menu. Spend 1 Story Key. Find Cyno at Sumeru City; he forwards you to the desert.",
    prereqs:"AR 40 + AQ Ch III Act IV + 1 Story Key",
    notes:"Lupus Aureus Chapter — Act I. Cyno investigates a string of desert disappearances. Standard 5★ Story Quest pace; combat-friendly. Released in 3.1.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Cyno ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Lupus_Aureus_Chapter",
  },
  {
    id:9, tier:3, chain:"story",
    name:"Dehya — A Parade of Providence",
    time:"45-60 min",
    region:"Sumeru Desert — Aaru Village → Caravan Ribat",
    activate:"Story Quest menu. Spend 1 Story Key. Find Dehya near Aaru Village.",
    prereqs:"AR 40 + AQ Ch III Act V + 1 Story Key",
    notes:"Iudex Iniquitatis Chapter — Act I. Dehya tracks down an Eremite plot. Combat-heavy by Story Quest standards. Released in 3.5.",
    rewards:"60 Primogems · ~1,750 Adv EXP · ~115,325 Mora · 5 Guide to Praxis · 24 Mystic Enhancement Ore · 13 Hero's Wit · Dehya ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Iudex_Iniquitatis_Chapter",
  },
  {
    id:10, tier:3, chain:"story",
    name:"Wanderer (Scaramouche) — Inversion of Genesis",
    time:"45-60 min",
    region:"Sumeru — across multiple regions (Akademiya, Devantaka, Desert)",
    activate:"Story Quest menu. Spend 1 Story Key. Find Nahida at Sumeru City; she summons the Wanderer.",
    prereqs:"AR 40 + Nahida Story Quest (Lingering Warmth) + AQ Ch III Interlude 'Inversion of Genesis' + 1 Story Key",
    notes:"Homo Castaneum Chapter — Act I (released 3.3). Heavy story-driven; Wanderer's first independent quest as a playable character. Gated by Nahida's Story Quest + the 'Inversion of Genesis' Interlude AQ.",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Wanderer ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Homo_Castaneum_Chapter",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:11, tier:4, chain:"aranyaka",
    name:"Aranyaka — Full Chain (Parts I-IV)",
    time:"6-10 hours (full series)",
    region:"Avidya Forest — Gandharva Ville, Vanarana, dream realms",
    activate:"After completing Aranyaka I (Woodland Encounter), continue with Part II (Dream Nursery), Part III (Nursery of Lost Dreams), Part IV (In the End, the Forest Will Remember).",
    prereqs:"Aranyaka I done · AR 30+ · Vanarana access",
    notes:"The biggest single world-quest series in the game. 9 quest chains spread across 40-45 world quests. Stories of You and the Aranara collectible drops along the way. Pace yourself — this is multi-session content.",
    rewards:"~640 Primogems total · 5,050 Adv EXP · 510,000 Mora · 39 Mystic Enhancement Ore · 39 Hero's Wit · multiple Aranara collectibles · Vasoma Fruit · Garland",
    game8:"https://game8.co/games/Genshin-Impact/archives/386471",
  },
  {
    id:12, tier:4, chain:"golden",
    name:"Golden Slumber",
    time:"3-4 hours (full chain)",
    region:"Sumeru Desert — Great Red Sand → King Deshret's Mausoleum",
    activate:"Talk to Bonifaz in Aaru Village, then meet his crew at the Great Red Sand mausoleum entrance.",
    prereqs:"Sumeru Desert accessible (3.1+) · AR 35+ recommended",
    notes:"The Khaenri'ah-era ruin chain that pulls you through Sumeru Desert's deeper lore. Many puzzles, several boss fights, big payoff. Direct prerequisite for the Dirge of Bilqis chain.",
    rewards:"~190 Primogems · 170,000 Mora · 16 Hero's Wit · 16 Mystic Enhancement Ore · Sorush-line lore unlocks",
    game8:"https://game8.co/games/Genshin-Impact/archives/391599",
  },
  {
    id:13, tier:4, chain:"golden",
    name:"Old Notes and New Friends",
    time:"2-3 hours (full chain)",
    region:"Sumeru Desert — Great Red Sand, Duat Hall",
    activate:"Auto-continues after Golden Slumber. Bonifaz's crew has more questions.",
    prereqs:"Golden Slumber chain completed",
    notes:"Direct sequel chain to Golden Slumber. Investigates deeper into the Mausoleum's Duat Hall — Dual Evidence puzzle is a known sticking point (use the linked Game8 guide).",
    rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/391598",
  },
  {
    id:14, tier:4, chain:"desert",
    name:"The Dirge of Bilqis",
    time:"3-4 hours (full chain)",
    region:"Sumeru Desert — Temple of Silence + Wisdom + Tears",
    activate:"After Golden Slumber + Old Notes and New Friends, the Dirge auto-starts at the desert temples.",
    prereqs:"Golden Slumber + Old Notes and New Friends + 3.4 patch unlocked",
    notes:"Six mini-quests: Wisdom Has Built Her House → The Temple Where Sand Flows Like Tears → Dune-Entombed Fecundity I/II/III → The Eternal Dream, Ever Lush. Around 50 primogems each.",
    rewards:"~250 Primogems total · 225,000 Mora · 17 Hero's Wit · 20 Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/401994",
  },
  {
    id:15, tier:4, chain:"khvarena",
    name:"Khvarena of Good and Evil — Full Chain",
    time:"3-4 hours (full series)",
    region:"Sumeru Desert (Girdle of the Sands, 3.6 expansion)",
    activate:"After Tunigi Hollow entry, follow Sorush through the chain (Light Realm Pilgrimage → Asipattravana → A Forerunner Sent from Light → Vanishing in the Sand-Sea → and more).",
    prereqs:"Khvarena entry chain done + 3.6+ Sumeru Desert expansion",
    notes:"Marks the Sand-Sea's pivot from puzzles to lore. Multiple sub-chains; the Sorush companion is unlocked here and used throughout.",
    rewards:"Primogems (chain-total significant) · Adv EXP · Mora · Hero's Wit · Sorush as permanent gadget · 3.6 Wonders of the World achievements",
    fandom:"https://genshin-impact.fandom.com/wiki/Khvarena_of_Good_and_Evil",
  },
  {
    id:16, tier:4, chain:"hangout",
    name:"Faruzan — A Recipe for Innovation",
    time:"60-90 min (all endings)",
    region:"Sumeru City → Pardis Dhyai",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Faruzan at the Akademiya.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys (Faruzan released v3.3)",
    notes:"Multi-ending; Faruzan's archaeological-research framing with Tighnari and Cyno cameos. Replays via menu.",
    rewards:"~90 Primogems total (60 endings + 30 achievements) · Special Dish · Adv EXP · Hero's Wit · Faruzan ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Faruzan",
  },
  {
    id:17, tier:4, chain:"hangout",
    name:"Layla — Dream of the Lone Star",
    time:"60-90 min (all 6 endings)",
    region:"Sumeru City — Akademiya / dorm area",
    activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Layla at the Akademiya.",
    prereqs:"AR 26 + Prologue Ch III + Story Keys (Layla released v3.2)",
    notes:"Six endings. The two Laylas — sleep-deprived scholar and confident dream-Layla — drive the comedy. Confirmed 90 primo total via the linked sources.",
    rewards:"~90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Layla ascension materials",
    fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Layla",
  },
];

// Fill in fallback link generators for each quest
QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Sumeru world quests are mostly LONG CHAINS — there are few quick standalone wins compared to other regions. Block out time for the big ones." },
  { step:2, text:"Aranyaka is the single largest world-quest series in the game (~640 primogems). Start with Aranyaka I (Woodland Encounter) and pace yourself across sessions." },
  { step:3, text:"Desert chain order: Golden Slumber → Old Notes and New Friends → The Dirge of Bilqis. Each gates the next; you cannot do them out of order." },
  { step:4, text:"The Khvarena chain (3.6+ desert expansion) is its own self-contained block in the Girdle of the Sands. Sorush gadget unlocks here for permanent use." },
  { step:5, text:"Story Quest gating: Tighnari first (3.0 intro). Then Nahida (3.2) is gated by AQ Ch III Act V. Wanderer needs Nahida + the 'Inversion of Genesis' Interlude AQ." },
  { step:6, text:"Hangouts cost 2 Story Keys each per playthrough × ~4 replays for all endings. Save them for after you've cleared the gated Story Quests above." },
  { step:7, text:"Sumeru has ~112 permanent world quests per BitTopup — this tracker covers only the heavily-verified major chains. The smaller side-quests around Vimara Village, Aaru Village, and the rest of the desert are real but not yet enumerated here." },
];

const STORAGE_KEY = "sumeru-quest-tracker-v1";

export default function SumeruQuests() {
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#040f08 0%,#0a2916 40%,#11432a 100%)", fontFamily:"Georgia,serif", color:"#dcfce7", paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:"rgba(3,12,7,0.97)", borderBottom:"1px solid rgba(127,176,105,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(127,176,105,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(132,204,22,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(22,163,74,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#65a30d,#14532d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(127,176,105,0.5)" }}>🌳</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#ecfccb 0%,#bef264 50%,#3f6212 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Sumeru World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(190,242,100,0.55)", textTransform:"uppercase", marginBottom:24 }}>
          World Quests · Story Quests · Hangouts — primogem-bearing
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(220,252,231,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#14532d,#65a30d,#bef264)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(127,176,105,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(127,176,105,0.22)", borderRadius:6, padding:"8px 14px", color:"#dcfce7", fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#bef264" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(190,242,100,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#bef264" : "rgba(220,252,231,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(220,252,231,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(220,252,231,0.4)", fontSize:12, cursor:"pointer" }}>
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
                <span style={{ fontSize:12, color:"rgba(220,252,231,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(220,252,231,0.3)", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(220,252,231,0.35)", marginLeft:"auto" }}>{tier.time}</span>
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
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(12,28,18,0.92),rgba(6,20,12,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(127,176,105,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(220,252,231,0.4)":"#ecfccb", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(190,242,100,0.15)", color:"#bef264", border:"1px solid rgba(190,242,100,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(220,252,231,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
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
                          <span style={{ fontSize:10, color:"rgba(190,242,100,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(220,252,231,0.55)"
                                 : "rgba(220,252,231,0.75)",
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}

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
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(190,242,100,0.06),rgba(63,98,18,0.02))", border:"1px solid rgba(190,242,100,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🌳✨</div>
            <div style={{ color:"#bef264", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL SUMERU QUESTS COMPLETE</div>
            <div style={{ color:"rgba(220,252,231,0.4)", fontSize:12, marginTop:8 }}>The Akasha whispers your name through the canopy, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
